import os, torch
import torch.nn as nn
import torch.optim as optim
from sklearn.preprocessing import MultiLabelBinarizer
from huggingface_hub import HfApi
from collections import defaultdict
import numpy as np
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()




# -------------------------------
# 1. Load data from MongoDB
# -------------------------------
client = MongoClient(os.getenv("MONGO_URI"))
db = client.get_database(os.getenv("DB_NAME"))
if db is None:
    raise Exception('Database not found!')
Users = db["Users"]
users = list(Users.find({}, {"_id": 0, "age": 1, "preferred_themes": 1}))
print(f"Loaded {len(users)} user records.")


# ------ SANITIZE INPUTS --------
def safe_age(value):
    """Ensure age is a valid integer"""
    try:
        if isinstance(value, list) and len(value) > 0:
            value = value[0]
        return int(value)
    except Exception:
        return 0

def safe_themes(value):
    """Ensure themes is a non-empty list"""
    if isinstance(value, list) and len(value) > 0:
        return value
    elif isinstance(value, str):
        return [value]
    return ["general"]

ages = [safe_age(u.get("age", 0)) for u in users]
themes = [safe_themes(u.get("preferred_themes", [])) for u in users]

# -------------------------------
# 2. Age group mapping
# -------------------------------
def categorize_age(age):
    if age <= 30:
        return "young"
    elif age <= 45:
        return "adult"
    else:
        return "senior"

age_groups = [categorize_age(age) for age in ages]

# -----------------------------------------------------------------
# 3. Encode preferred themes
# -----------------------------------------------------------------
mlb = MultiLabelBinarizer()
themes_encoded = mlb.fit_transform(themes)
theme_classes = mlb.classes_

# -----------------------------------------------------------------
# 4. Build age-theme frequency table
# -----------------------------------------------------------------
group_theme_freq = defaultdict(lambda: np.zeros(len(theme_classes)))

for grp, tlist in zip(age_groups, themes_encoded):
    if isinstance(grp, list):  
        grp = grp[0] if grp else "unknown"
    group_theme_freq[str(grp)] += tlist

# Normalize
for grp in group_theme_freq:
    total = np.sum(group_theme_freq[grp])
    if total > 0:
        group_theme_freq[grp] /= total

# -----------------------------------------------------------------
# 5. Define model architecture
# -----------------------------------------------------------------
class TravelRecommender(nn.Module):
    def __init__(self, input_size, output_size):
        super(TravelRecommender, self).__init__()
        self.fc1 = nn.Linear(input_size, 16)
        self.fc2 = nn.Linear(16, output_size)
        self.relu = nn.ReLU()

    def forward(self, x):
        x = self.relu(self.fc1(x))
        x = torch.sigmoid(self.fc2(x)) 
        return x

# -----------------------------------------------------------------
# 7. Initialize model, loss & optimizer
# -----------------------------------------------------------------
input_dim = len(theme_classes)
output_dim = len(theme_classes)
model = TravelRecommender(input_dim, output_dim)


# -----------------------------------------------------------------
# 8. Train model
# -----------------------------------------------------------------
criterion = nn.BCELoss()
optimizer = optim.Adam(model.parameters(), lr=0.01)

X = torch.tensor(themes_encoded, dtype=torch.float32)
y = torch.tensor(themes_encoded, dtype=torch.float32)

print("\n🔹 Training started...\n")
for epoch in range(300):
    optimizer.zero_grad()
    outputs = model(X)
    loss = criterion(outputs, y)
    loss.backward()
    optimizer.step()
    if (epoch + 1) % 10 == 0:
        print(f"Epoch [{epoch+1}/300], Loss: {loss.item():.4f}")

print("\n✅ Training completed successfully!")

# -----------------------------------------------------------------
# 9. Save model checkpoint
# -----------------------------------------------------------------
torch.save({
    "model_state": model.state_dict(),
    "theme_classes": theme_classes.tolist(),
    "group_theme_freq": {k: v.tolist() for k, v in group_theme_freq.items()}
}, "travel_model.pth")

print("💾 Model trained & saved successfully as travel_model.pth")

api = HfApi(token=os.getenv("HF_TOKEN"))
try:    
    api.upload_file(
        path_or_fileobj="travel_model.pth",
        path_in_repo="travel_model.pth",
        repo_id="Snehodipto14/DestinifyTours",
        repo_type="model",
    )
    print("✅ Model successfully uploaded & overwritten to ☁️.")
except Exception as e:
    print("❌ Failed to upload/overwrite model!\n", str(e))
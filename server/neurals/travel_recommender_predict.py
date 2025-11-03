import torch, os
import torch.nn as nn
import numpy as np
from huggingface_hub import hf_hub_download


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

# -----------------------------
# Load model + extract sizes
# -----------------------------
try:
    model_path = hf_hub_download(
        repo_id="Snehodipto14/DestinifyTours",
        filename="travel_model.pth",
        repo_type="model"
    )
    print("✅ Model loaded from ☁️")    
except Exception:
    print("❌ Failed to load model from ☁️, switching to local fallback.")
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, "travel_model.pth")

checkpoint = torch.load(model_path, map_location=torch.device("cpu"))
theme_classes = checkpoint["theme_classes"]
group_theme_freq = checkpoint["group_theme_freq"]
input_dim = len(theme_classes)
output_dim = len(theme_classes)

model = TravelRecommender(input_dim, output_dim)
model.load_state_dict(checkpoint["model_state"])
model.eval()


# -----------------------------
# Helpers
# -----------------------------
def categorize_age(age):
    if age <= 30:
        return "young"
    elif age <= 45:
        return "adult"
    else: 
        return "senior"

def predict_category(age, preferred_themes):
    try:
        # Encode input theme vector
        input_vector = np.zeros(len(theme_classes))
        for t in preferred_themes:
            if t in theme_classes:
                input_vector[theme_classes.index(t)] = 1.0
                
        input_arr = np.array(input_vector)
        input_tensor = torch.tensor(input_arr, dtype=torch.float32)
        with torch.no_grad():
            prediction = model(input_tensor).numpy()[0]
        group = categorize_age(age)
        group_vector = np.array(group_theme_freq.get(group, np.zeros(len(theme_classes))))
        combined = (prediction + group_vector) / 2.0
        top_indices = np.argsort(combined)[::-1][:3]
        top_themes = [theme_classes[i] for i in top_indices]
        
        return {
            "age_group": group,
            "predicted_themes": top_themes,
            "raw_scores": {theme_classes[i]: round(float(combined[i]), 3) for i in top_indices}
        }
    except Exception as e:
        print("Prediction error:", str(e))
        return {"error": str(e)}


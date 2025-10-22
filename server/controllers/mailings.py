import os
from flask import render_template_string
from flask_mail import Mail, Message
from dotenv import load_dotenv
from datetime import datetime, UTC

load_dotenv()

mail = Mail()
BASE_DIR = os.path.dirname(__file__)
TEMPLATE_PATH = os.path.join(BASE_DIR, "otpMailTemplate.html")
with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
    OTP_HTML_TEMPLATE = f.read()



# initialize flask-mail with app config
def init_mail(app):
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true'
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
    mail.init_app(app)
    return mail

# send mail
def send_mail(reciever: str, subject: str, otp: str):
    ctx = {
        "otp_code": otp,
        "year": datetime.now(UTC).year
    }
    html_body = render_template_string(OTP_HTML_TEMPLATE, **ctx)
    try:
        msg = Message(subject=subject, recipients=[reciever], html=html_body)
        mail.send(msg)
        print(f"✔️ Email sent successfully to {reciever}")
        return True
    except Exception as e:
        print(f"❌ Failed to send email:\n{e}")
        return False

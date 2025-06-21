import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

def send_verification_email(recipient_email, token):
    sender_email = os.environ.get("MAIL_USERNAME")
    sender_password = os.environ.get("MAIL_PASSWORD")
    smtp_server = os.environ.get("MAIL_SERVER", "smtp.gmail.com")
    smtp_port = int(os.environ.get("MAIL_PORT", 587))

    subject = "Verify your email for Slot-Booker"
    verification_link = f"{os.environ.get('FRONTEND_URL')}/verify-email?token={token}"

    html = f"""
    <html>
        <body>
            <p>Hi there,<br>
            Please click the link below to verify your email address:<br>
            <a href="{verification_link}">Verify Email</a>
            </p>
        </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = recipient_email
    part = MIMEText(html, "html")
    msg.attach(part)

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, recipient_email, msg.as_string())
        server.quit()
        print(f"Verification email sent to {recipient_email}")
    except Exception as e:
        print(f"Error sending email: {e}")

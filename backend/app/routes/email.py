from flask import Blueprint, current_app, jsonify, request

from ..services.email_service import EmailService

email_blueprint = Blueprint("email", __name__)


@email_blueprint.post("/email/preview")
def preview_email():
    payload = request.get_json(silent=True) or {}
    order_id = payload.get("orderId", "preview-order")
    customer_email = payload.get("customerEmail", "customer@example.com")

    email_service = EmailService(
        current_app.config["EMAIL_PROVIDER_API_KEY"],
        current_app.config["BUSINESS_INBOX_EMAIL"],
        current_app.config["ENV"],
    )

    customer_result = email_service.send_customer_confirmation_email(
        customer_email=customer_email,
        customer_name="Preview Customer",
        order_id=order_id,
    )
    business_result = email_service.send_business_order_notification(
        customer_name="Preview Customer",
        customer_email=customer_email,
        order_id=order_id,
        total_cents=12900,
    )

    return jsonify(
        {
            "status": "ok",
            "message": "Email service abstraction executed. See backend logs in mock mode.",
            "customer": customer_result,
            "business": business_result,
        }
    )

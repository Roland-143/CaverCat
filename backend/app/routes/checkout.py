from flask import Blueprint, current_app, jsonify, request

from ..services.email_service import EmailService
from ..services.supabase_service import SupabaseService
from ..utils.validation import ValidationError, validate_checkout_payload

checkout_blueprint = Blueprint("checkout", __name__)


@checkout_blueprint.post("/checkout")
def create_checkout():
    try:
        payload = validate_checkout_payload(request.get_json(silent=True) or {})
    except ValidationError as error:
        return jsonify({"error": str(error)}), 400

    try:
        supabase_service = SupabaseService(
            current_app.config["SUPABASE_URL"],
            current_app.config["SUPABASE_SERVICE_ROLE_KEY"],
        )
        result = supabase_service.create_order_bundle(payload)

        email_service = EmailService(
            current_app.config["EMAIL_PROVIDER_API_KEY"],
            current_app.config["BUSINESS_INBOX_EMAIL"],
            current_app.config["ENV"],
        )
        email_service.send_customer_confirmation_email(
            payload["customerEmail"], payload["customerName"], result["order_id"]
        )
        email_service.send_business_order_notification(
            payload["customerName"],
            payload["customerEmail"],
            result["order_id"],
            result["total_cents"],
        )

        message = (
            "Order request recorded."
            if result["status"] != "mocked"
            else "Order request accepted in mock mode. Configure backend Supabase keys."
        )
        return (
            jsonify(
                {
                    "orderId": result["order_id"],
                    "ticketId": result["ticket_id"],
                    "status": result["status"],
                    "message": message,
                }
            ),
            201,
        )
    except Exception as error:
        current_app.logger.exception("Checkout failed")
        return jsonify({"error": f"Checkout failed: {error}"}), 500

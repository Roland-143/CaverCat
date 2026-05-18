import logging
from typing import Any


logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self, api_key: str, business_inbox: str, environment: str):
        self.api_key = api_key
        self.business_inbox = business_inbox
        self.environment = environment

    def _send_or_log(self, subject: str, recipient: str, text_body: str) -> dict[str, Any]:
        if not self.api_key:
            # TODO: Plug in SendGrid, Resend, or SMTP provider using EMAIL_PROVIDER_API_KEY.
            logger.info(
                "EMAIL_MOCK mode=%s recipient=%s subject=%s body=%s",
                self.environment,
                recipient,
                subject,
                text_body,
            )
            return {"status": "mocked", "recipient": recipient}

        # TODO: Replace this block with real provider integration.
        logger.info(
            "EMAIL_PROVIDER_PLACEHOLDER recipient=%s subject=%s",
            recipient,
            subject,
        )
        return {"status": "queued", "recipient": recipient}

    def send_customer_confirmation_email(
        self, customer_email: str, customer_name: str, order_id: str
    ) -> dict[str, Any]:
        subject = f"Caver Cat Order Received ({order_id})"
        body = (
            f"Hi {customer_name},\n\n"
            "We received your Caver Cat order request. "
            "Our team will follow up as payment options are finalized.\n\n"
            f"Order ID: {order_id}\n\n"
            "Handmade gear. Recycled materials. Built for the next descent.\n"
        )
        return self._send_or_log(subject, customer_email, body)

    def send_business_order_notification(
        self, customer_name: str, customer_email: str, order_id: str, total_cents: int
    ) -> dict[str, Any]:
        subject = f"New Caver Cat Order Ticket: {order_id}"
        body = (
            f"New order submitted.\n"
            f"Order ID: {order_id}\n"
            f"Customer: {customer_name} <{customer_email}>\n"
            f"Estimated total: ${total_cents / 100:.2f}\n"
        )
        return self._send_or_log(subject, self.business_inbox, body)

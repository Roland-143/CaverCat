from uuid import uuid4
from typing import Any

from supabase import Client, create_client


class SupabaseService:
    def __init__(self, supabase_url: str, service_role_key: str):
        self.supabase_url = supabase_url
        self.service_role_key = service_role_key
        self._client: Client | None = None

        if supabase_url and service_role_key:
            self._client = create_client(supabase_url, service_role_key)

    @property
    def configured(self) -> bool:
        return self._client is not None

    @property
    def client(self) -> Client:
        if not self._client:
            raise RuntimeError("Supabase service is not configured.")
        return self._client

    def create_order_bundle(self, payload: dict[str, Any]) -> dict[str, Any]:
        subtotal_cents = sum(
            item["unitPriceCents"] * item["quantity"] for item in payload["items"]
        )
        total_cents = round(subtotal_cents * 1.08)

        if not self.configured:
            mock_order_id = str(uuid4())
            mock_ticket_id = str(uuid4())
            return {
                "order_id": mock_order_id,
                "ticket_id": mock_ticket_id,
                "subtotal_cents": subtotal_cents,
                "total_cents": total_cents,
                "status": "mocked",
            }

        order_insert = (
            self.client.table("orders")
            .insert(
                {
                    "user_id": payload["userId"],
                    "customer_email": payload["customerEmail"],
                    "customer_name": payload["customerName"],
                    "status": "submitted",
                    "subtotal_cents": subtotal_cents,
                    "total_cents": total_cents,
                }
            )
            .execute()
        )

        if not order_insert.data:
            raise RuntimeError("Unable to create order record.")
        order = order_insert.data[0]
        order_id = order["id"]

        order_items = [
            {
                "order_id": order_id,
                "product_id": item["productId"],
                "product_name_snapshot": item["productName"],
                "quantity": item["quantity"],
                "unit_price_cents": item["unitPriceCents"],
            }
            for item in payload["items"]
        ]
        self.client.table("order_items").insert(order_items).execute()

        ticket_insert = (
            self.client.table("purchase_tickets")
            .insert(
                {
                    "order_id": order_id,
                    "customer_email": payload["customerEmail"],
                    "message": (
                        "Order submitted from checkout skeleton. "
                        f"Shipping: {payload['shippingAddress']} | "
                        f"Phone: {payload['contactPhone']} | "
                        f"Notes: {payload['notes']}"
                    ),
                    "status": "open",
                }
            )
            .execute()
        )

        if not ticket_insert.data:
            raise RuntimeError("Unable to create purchase ticket record.")
        ticket_id = ticket_insert.data[0]["id"]

        return {
            "order_id": order_id,
            "ticket_id": ticket_id,
            "subtotal_cents": subtotal_cents,
            "total_cents": total_cents,
            "status": "submitted",
        }

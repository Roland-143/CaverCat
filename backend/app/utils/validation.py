import re
from typing import Any


EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


class ValidationError(Exception):
    pass


def _required_string(value: Any, field_name: str, max_length: int = 300) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ValidationError(f"{field_name} is required.")
    cleaned = value.strip()
    if len(cleaned) > max_length:
        raise ValidationError(f"{field_name} exceeds max length ({max_length}).")
    return cleaned


def validate_checkout_payload(payload: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise ValidationError("Request body must be a JSON object.")

    customer_name = _required_string(payload.get("customerName"), "customerName", 120)
    customer_email = _required_string(payload.get("customerEmail"), "customerEmail", 180)
    if not EMAIL_PATTERN.match(customer_email):
        raise ValidationError("customerEmail must be a valid email address.")

    shipping_address = _required_string(payload.get("shippingAddress"), "shippingAddress", 700)
    contact_phone = _required_string(payload.get("contactPhone"), "contactPhone", 60)
    notes = payload.get("notes", "")
    if notes and (not isinstance(notes, str) or len(notes) > 1000):
        raise ValidationError("notes must be a string up to 1000 characters.")

    user_id = payload.get("userId")
    if user_id is not None and not isinstance(user_id, str):
        raise ValidationError("userId must be null or a string.")

    items = payload.get("items")
    if not isinstance(items, list) or not items:
        raise ValidationError("items must be a non-empty array.")

    cleaned_items = []
    for index, item in enumerate(items):
        if not isinstance(item, dict):
            raise ValidationError(f"items[{index}] must be an object.")
        product_id = _required_string(item.get("productId"), f"items[{index}].productId", 80)
        product_name = _required_string(
            item.get("productName"), f"items[{index}].productName", 200
        )
        unit_price = item.get("unitPriceCents")
        quantity = item.get("quantity")
        if not isinstance(unit_price, int) or unit_price < 0:
            raise ValidationError(f"items[{index}].unitPriceCents must be a non-negative integer.")
        if not isinstance(quantity, int) or quantity <= 0 or quantity > 99:
            raise ValidationError(f"items[{index}].quantity must be an integer between 1 and 99.")
        cleaned_items.append(
            {
                "productId": product_id,
                "productName": product_name,
                "unitPriceCents": unit_price,
                "quantity": quantity,
            }
        )

    return {
        "userId": user_id,
        "customerName": customer_name,
        "customerEmail": customer_email,
        "shippingAddress": shipping_address,
        "contactPhone": contact_phone,
        "notes": notes.strip() if isinstance(notes, str) else "",
        "items": cleaned_items,
    }


def validate_product_payload(payload: dict[str, Any]) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise ValidationError("Product payload must be an object.")

    name = _required_string(payload.get("name"), "name", 200)
    slug = _required_string(payload.get("slug"), "slug", 240)
    description = _required_string(payload.get("description"), "description", 2000)
    category = _required_string(payload.get("category"), "category", 120)
    image_url = payload.get("image_url")
    if image_url is not None and (not isinstance(image_url, str) or len(image_url) > 1000):
        raise ValidationError("image_url must be null or a string under 1000 chars.")

    price_cents = payload.get("price_cents")
    stock_quantity = payload.get("stock_quantity")
    recycled_pct = payload.get("recycled_material_percentage", 90)

    if not isinstance(price_cents, int) or price_cents < 0:
        raise ValidationError("price_cents must be a non-negative integer.")
    if not isinstance(stock_quantity, int) or stock_quantity < 0:
        raise ValidationError("stock_quantity must be a non-negative integer.")
    if not isinstance(recycled_pct, int) or recycled_pct < 0 or recycled_pct > 100:
        raise ValidationError("recycled_material_percentage must be between 0 and 100.")

    is_active = payload.get("is_active", True)
    is_handmade = payload.get("is_handmade", True)
    if not isinstance(is_active, bool) or not isinstance(is_handmade, bool):
        raise ValidationError("is_active and is_handmade must be boolean.")

    tags = payload.get("sustainability_tags", [])
    if not isinstance(tags, list):
        raise ValidationError("sustainability_tags must be an array of strings.")
    clean_tags = []
    for index, tag in enumerate(tags):
        if not isinstance(tag, str) or not tag.strip():
            raise ValidationError(f"sustainability_tags[{index}] must be a non-empty string.")
        clean_tags.append(tag.strip()[:80])

    return {
        "name": name,
        "slug": slug,
        "description": description,
        "price_cents": price_cents,
        "category": category,
        "image_url": image_url.strip() if isinstance(image_url, str) else None,
        "stock_quantity": stock_quantity,
        "is_active": is_active,
        "is_handmade": is_handmade,
        "recycled_material_percentage": recycled_pct,
        "sustainability_tags": clean_tags,
    }

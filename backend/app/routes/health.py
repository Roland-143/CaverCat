from datetime import datetime, UTC

from flask import Blueprint, jsonify

health_blueprint = Blueprint("health", __name__)


@health_blueprint.get("/health")
def health_check():
    return jsonify(
        {
            "status": "ok",
            "service": "caver-cat-backend",
            "timestamp_utc": datetime.now(UTC).isoformat(),
        }
    )

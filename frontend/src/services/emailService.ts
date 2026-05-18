interface EmailPreviewPayload {
  orderId: string;
  customerEmail: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const emailService = {
  async triggerEmailPreview(payload: EmailPreviewPayload) {
    const response = await fetch(`${API_BASE_URL}/api/email/preview`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(details || "Unable to preview email handling.");
    }

    return response.json() as Promise<{ status: string; message: string }>;
  }
};

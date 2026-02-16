const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export interface SendEmailPayload {
  email: string;
  subject: string;
  body: string;
  eventName: string;
}

export interface SendSmsPayload {
  phoneNumber: string;
  eventName: string;
  eventDate: string;
  rsvpLink: string;
}

export interface SendWhatsAppPayload extends SendSmsPayload {
  eventLocation: string;
}

export const apiService = {
  // Health check
  async checkHealth() {
    try {
      const response = await fetch(`${API_URL}/api/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },

  // Upload image
  async uploadImage(file: File): Promise<{ imageUrl: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    return response.json();
  },

  // Send email invitation
  async sendEmailInvitation(payload: SendEmailPayload): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_URL}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send email');
    }

    return response.json();
  },

  // Send SMS invitation
  async sendSmsInvitation(payload: SendSmsPayload): Promise<{ success: boolean; messageId: string }> {
    const response = await fetch(`${API_URL}/api/send-sms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send SMS');
    }

    return response.json();
  },

  // Send WhatsApp invitation
  async sendWhatsAppInvitation(payload: SendWhatsAppPayload): Promise<{ success: boolean; messageId: string }> {
    const response = await fetch(`${API_URL}/api/send-whatsapp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send WhatsApp message');
    }

    return response.json();
  },

  // Delete image
  async deleteImage(filename: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_URL}/api/uploads/${filename}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }

    return response.json();
  },
};

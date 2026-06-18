import api from './api';

export const paymentService = {
  async initializeSubscription(plan, email) {
    return api.post('/payments/initialize', { plan, email });
  },

  async initializeCreditPurchase(email) {
    return api.post('/payments/initialize', { plan: 'credit_500', email });
  },

  async verifyPayment(reference) {
    return api.get(`/payments/verify?reference=${reference}`);
  },

  async getPaymentHistory() {
    return api.get('/payments/history');
  },

  async cancelSubscription() {
    return api.post('/payments/cancel-subscription');
  },

  async getSubscription() {
    return api.get('/payments/subscription');
  },

  initializePaystack({ email, amount, reference, onSuccess, onClose }) {
    if (typeof window === 'undefined') return;

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      console.error('Paystack public key not configured');
      return;
    }

    if (!window.PaystackPop) {
      console.error('Paystack script not loaded');
      return;
    }

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email,
      amount,
      currency: 'GHS',
      ref: reference,
      callback: (response) => {
        if (response.status === 'success') {
          onSuccess && onSuccess(response.reference);
        }
      },
      onClose: () => {
        onClose && onClose();
      },
    });

    handler.openIframe();
  },
};

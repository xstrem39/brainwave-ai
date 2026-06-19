import { callAppsScript, getToken } from '../utils/appsScript';

export const paymentService = {
  async initializeSubscription(plan, email) {
    return callAppsScript('payment_initialize', getToken(), { plan, email });
  },

  async initializeCreditPurchase(email) {
    return callAppsScript('payment_initialize', getToken(), { plan: 'credit_500', email });
  },

  async verifyPayment(reference) {
    return callAppsScript('payment_verify', getToken(), { reference });
  },

  async getPaymentHistory() {
    return callAppsScript('payment_getHistory', getToken());
  },

  async cancelSubscription() {
    return callAppsScript('payment_cancelSubscription', getToken());
  },

  async getSubscription() {
    return callAppsScript('payment_getSubscription', getToken());
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

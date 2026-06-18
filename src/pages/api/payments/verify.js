import { requireAuth } from '../../../utils/security';

const backendCall = async (action, token, data) => {
  const url = process.env.GOOGLE_SCRIPT_URL;
  if (!url) throw new Error('Backend not configured');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, token, ...data }),
  });
  return res.json();
};

export default requireAuth(async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const reference = req.query.reference || req.body?.reference;
  if (!reference) return res.status(400).json({ success: false, error: 'Reference required' });

  try {
    // Verify with Paystack first
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data.status !== 'success') {
      return res.status(400).json({ success: false, error: 'Payment not successful', status: paystackData.data?.status });
    }

    const { getTokenFromRequest } = await import('../../../utils/security');
    const token = getTokenFromRequest(req);

    // Activate on backend
    const result = await backendCall('payment_verify', token, { reference });
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error('Verify error:', err);
    return res.status(500).json({ success: false, error: 'Verification failed' });
  }
});

import { requireAuth } from '../../../utils/security';
import { backendCall } from '../../../utils/backend';

export default requireAuth(async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const reference = req.query.reference || req.body?.reference;
  if (!reference) return res.status(400).json({ success: false, error: 'Reference required' });

  try {
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    });
    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data.status !== 'success') {
      return res.status(400).json({ success: false, error: 'Payment not successful', status: paystackData.data?.status });
    }

    const { getTokenFromRequest } = await import('../../../utils/security');
    const token = getTokenFromRequest(req);

    const result = await backendCall('payment_verify', token, { reference });
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error('Verify error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Verification failed' });
  }
});

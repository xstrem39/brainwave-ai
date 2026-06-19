import { requireAuth, getTokenFromRequest } from '../../../utils/security';
import { backendCall } from '../../../utils/backend';

export default requireAuth(async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  const token = getTokenFromRequest(req);
  try {
    const result = await backendCall('payment_cancelSubscription', token);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || 'Cancellation failed' });
  }
});

import { backendCall } from '../../../utils/backend';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false, error: 'Verification token required' });
  try {
    const result = await backendCall('auth_verifyEmail', null, { token });
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || 'Verification failed' });
  }
}

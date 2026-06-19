import { backendCall } from '../../../utils/backend';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ success: false, error: 'Token and new password required' });
  if (newPassword.length < 8) return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
  try {
    const result = await backendCall('auth_resetPassword', null, { token, newPassword });
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || 'Reset failed' });
  }
}

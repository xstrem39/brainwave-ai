export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  res.setHeader('Set-Cookie', 'brainwave_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict');
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
}

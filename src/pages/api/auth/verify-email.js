const backendCall = async (action, data) => {
  const url = process.env.GOOGLE_SCRIPT_URL;
  if (!url) throw new Error('Backend not configured');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...data }),
  });
  return res.json();
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false, error: 'Verification token required' });
  try {
    const result = await backendCall('auth_verifyEmail', { token });
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Verification failed' });
  }
}

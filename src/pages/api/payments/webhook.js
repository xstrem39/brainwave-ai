import crypto from 'crypto';

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await getRawBody(req);
  const signature = req.headers['x-paystack-signature'];

  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || '')
    .update(rawBody)
    .digest('hex');

  if (hash !== signature) {
    console.warn('Invalid webhook signature');
    return res.status(400).json({ error: 'Invalid signature' });
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  console.log('Paystack webhook:', event.event);

  // Forward to Google Apps Script backend
  try {
    const url = process.env.GOOGLE_SCRIPT_URL;
    if (url) {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'payment_webhook', ...event }),
      });
    }
  } catch (err) {
    console.error('Webhook forward error:', err);
  }

  return res.status(200).json({ received: true });
}

import { requireAuth, rateLimit } from '../../../utils/security';
import { SUBSCRIPTION_PLANS, CREDIT_PACKS } from '../../../utils/constants';

export default requireAuth(async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  const limit = rateLimit(`payment:${req.user.userId}`, 10, 3600000);
  if (!limit.allowed) return res.status(429).json({ success: false, error: 'Too many payment requests' });

  const { plan, email } = req.body;
  const userId = req.user.userId;

  if (!plan || !email) return res.status(400).json({ success: false, error: 'Plan and email are required' });

  const planConfig = SUBSCRIPTION_PLANS[plan] || CREDIT_PACKS.find(p => p.id === plan);
  if (!planConfig) return res.status(400).json({ success: false, error: 'Invalid plan' });

  const amount = planConfig.paystackAmount;
  const reference = `BW_${userId}_${plan}_${Date.now()}`;

  try {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        currency: 'GHS',
        reference,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscription/verify?ref=${reference}`,
        metadata: {
          userId,
          plan,
          planType: plan.startsWith('credit') ? 'credits' : 'subscription',
          custom_fields: [
            { display_name: 'Platform', variable_name: 'platform', value: 'BrainWave AI' },
            { display_name: 'Plan', variable_name: 'plan', value: plan },
          ],
        },
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return res.status(400).json({ success: false, error: data.message || 'Payment initialization failed' });
    }

    return res.status(200).json({
      success: true,
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
      accessCode: data.data.access_code,
      amount,
    });
  } catch (err) {
    console.error('Paystack init error:', err);
    return res.status(500).json({ success: false, error: 'Payment service unavailable. Please try again.' });
  }
});

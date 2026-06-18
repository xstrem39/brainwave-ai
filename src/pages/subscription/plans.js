import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../hooks/useSubscription';
import { SUBSCRIPTION_PLANS, CREDIT_PACKS } from '../../utils/constants';
import { FaCheck, FaCoins, FaCrown, FaRocket, FaStar, FaSpinner, FaLock } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function PlansPage() {
  const { user, isAuthenticated, subscription } = useAuth();
  const { subscribe, buyCredits, loading } = useSubscription();
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  useEffect(() => {
    if (window.PaystackPop) { setPaystackLoaded(true); return; }
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setPaystackLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handleSubscribe = async (plan) => {
    if (!isAuthenticated) { toast.error('Please login first'); return; }
    if (!paystackLoaded) { toast.error('Payment gateway loading...'); return; }
    await subscribe(plan);
  };

  const handleBuyCredits = async () => {
    if (!isAuthenticated) { toast.error('Please login first'); return; }
    if (!paystackLoaded) { toast.error('Payment gateway loading...'); return; }
    await buyCredits();
  };

  const plans = [
    {
      id: 'monthly', ...SUBSCRIPTION_PLANS.monthly,
      icon: FaRocket, color: 'border-primary-500/30', highlight: false,
      cta: 'Subscribe Monthly',
    },
    {
      id: 'yearly', ...SUBSCRIPTION_PLANS.yearly,
      icon: FaCrown, color: 'border-amber-500', highlight: true,
      badge: `Best Value — Save GHS ${SUBSCRIPTION_PLANS.yearly.savings}`,
      cta: 'Subscribe Yearly',
    },
  ];

  return (
    <>
      <Head><title>Pricing Plans — BrainWave AI</title></Head>
      <div className="min-h-screen bg-dark-900">
        <Navbar />
        <div className="pt-24 pb-20 px-4">
          {/* Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-slate-400">
              All plans include a 7-day free trial. Pay securely with Paystack — card, mobile money, or bank transfer.
            </p>
          </div>

          {/* Plans */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 mb-12">
            {plans.map(plan => {
              const Icon = plan.icon;
              const isCurrentPlan = subscription?.plan === plan.id && subscription?.status === 'active';

              return (
                <div key={plan.id}
                  className={`relative card border-2 ${plan.highlight ? plan.color + ' shadow-glow' : plan.color} transition-all hover:scale-[1.01]`}>
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 badge bg-amber-500 text-black font-bold px-4 py-1 rounded-full whitespace-nowrap shadow-lg">
                      <FaStar size={12} className="inline mr-1" />{plan.badge}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${plan.highlight ? 'bg-amber-500/20' : 'bg-primary-500/20'} flex items-center justify-center`}>
                      <Icon className={plan.highlight ? 'text-amber-400' : 'text-primary-400'} size={22} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      <p className="text-slate-400 text-sm">{plan.id === 'monthly' ? 'Billed monthly' : 'Billed annually'}</p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-5xl font-black text-white">GHS {plan.price.toLocaleString()}</span>
                    <span className="text-slate-400">/{plan.id === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>

                  {plan.id === 'yearly' && (
                    <p className="text-emerald-400 text-sm font-medium mb-4">
                      ✓ Includes 500 bonus credits (worth GHS 50 free!)
                    </p>
                  )}

                  <ul className="space-y-3 mb-6">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                        <FaCheck className="text-emerald-400 flex-shrink-0" size={13} /> {f}
                      </li>
                    ))}
                  </ul>

                  {isCurrentPlan ? (
                    <button disabled className="w-full py-3.5 rounded-xl border-2 border-emerald-500 text-emerald-400 font-semibold text-center">
                      ✓ Current Plan
                    </button>
                  ) : (
                    <button onClick={() => handleSubscribe(plan.id)} disabled={loading || !paystackLoaded}
                      className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${plan.highlight ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600' : 'btn-primary'} disabled:opacity-50`}>
                      {loading ? <FaSpinner className="animate-spin" /> : <FaLock size={14} />}
                      {plan.cta}
                    </button>
                  )}

                  <p className="text-xs text-slate-500 text-center mt-3">
                    Secure payment via Paystack 🔒
                  </p>
                </div>
              );
            })}
          </div>

          {/* Free Trial Note */}
          <div className="max-w-2xl mx-auto text-center mb-12 card border-emerald-500/20">
            <div className="text-3xl mb-2">🎁</div>
            <h3 className="text-lg font-bold text-white mb-2">Start with 7-Day Free Trial</h3>
            <p className="text-slate-400 text-sm mb-4">
              New accounts automatically get 100 free credits and 7-day access to all basic features. No credit card required to get started.
            </p>
            {!isAuthenticated && (
              <Link href="/register" className="btn-primary">Create Free Account</Link>
            )}
          </div>

          {/* Credit Packs */}
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-6">Need Extra Credits?</h2>
            {CREDIT_PACKS.map(pack => (
              <div key={pack.id} className="card border-amber-500/20 text-center">
                <FaCoins className="text-amber-400 mx-auto mb-3" size={32} />
                <h3 className="text-xl font-bold text-white">{pack.name}</h3>
                <p className="text-4xl font-black text-white mt-2">GHS {pack.price}</p>
                <p className="text-slate-400 text-sm mt-1">One-time purchase</p>
                <ul className="text-sm text-slate-300 space-y-1 my-4">
                  <li>✓ {pack.credits} credits added instantly</li>
                  <li>✓ Never expire</li>
                  <li>✓ Use for images, flyers & premium tools</li>
                </ul>
                <button onClick={handleBuyCredits} disabled={loading || !isAuthenticated}
                  className="btn-primary w-full justify-center">
                  {loading ? <FaSpinner className="animate-spin" /> : <FaCoins size={14} />}
                  Buy {pack.credits} Credits — GHS {pack.price}
                </button>
                {!isAuthenticated && (
                  <p className="text-xs text-slate-500 mt-2"><Link href="/login" className="text-primary-400">Login</Link> to purchase credits</p>
                )}
              </div>
            ))}
          </div>

          {/* Features comparison */}
          <div className="max-w-3xl mx-auto mt-16">
            <h2 className="text-2xl font-bold text-white text-center mb-8">What's Included in Each Plan</h2>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Feature</th>
                      <th className="text-center py-3 px-4 text-slate-400 font-medium">Free Trial</th>
                      <th className="text-center py-3 px-4 text-primary-300 font-semibold">Monthly</th>
                      <th className="text-center py-3 px-4 text-amber-300 font-semibold">Yearly</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      ['Credits', '100 (7 days)', '500/month', '7,000/year'],
                      ['AI Chat', 'Limited', 'Unlimited', 'Unlimited'],
                      ['Academic Assistant', '✓', '✓', '✓'],
                      ['Assignment Help', '✓', '✓', '✓'],
                      ['Study Tools', '✓', '✓', '✓'],
                      ['Image Generation', '✓ (limited)', '✓', '✓'],
                      ['Flyer Creator', '✓ (limited)', '✓', '✓'],
                      ['Research Assistant', 'Basic', 'Full', 'Full'],
                      ['Exam Preparation', 'Basic', 'Full', 'Full'],
                      ['Advanced Analytics', '✗', '✗', '✓'],
                      ['Priority Support', '✗', '✓', '✓ (Dedicated)'],
                    ].map(([feature, free, monthly, yearly]) => (
                      <tr key={feature} className="hover:bg-white/2">
                        <td className="py-3 px-4 text-slate-300">{feature}</td>
                        <td className="py-3 px-4 text-center text-slate-500">{free}</td>
                        <td className="py-3 px-4 text-center text-slate-300">{monthly}</td>
                        <td className="py-3 px-4 text-center text-amber-300">{yearly}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

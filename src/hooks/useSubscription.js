import { useState } from 'react';
import { paymentService } from '../services/payment.service';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

export function useSubscription() {
  const { user, subscription, refreshCredits, loadUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const subscribe = async (plan) => {
    if (!user) { router.push('/login'); return; }
    setLoading(true);
    try {
      const result = await paymentService.initializeSubscription(plan, user.email);
      if (result.success) {
        paymentService.initializePaystack({
          email: user.email,
          amount: result.amount,
          reference: result.reference,
          onSuccess: async (ref) => {
            const verify = await paymentService.verifyPayment(ref);
            if (verify.success) {
              toast.success('Subscription activated successfully!');
              await loadUser();
              router.push('/dashboard');
            }
          },
          onClose: () => toast.error('Payment cancelled'),
        });
      } else {
        toast.error(result.error || 'Failed to initialize payment');
      }
    } catch (err) {
      toast.error(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const buyCredits = async () => {
    if (!user) { router.push('/login'); return; }
    setLoading(true);
    try {
      const result = await paymentService.initializeCreditPurchase(user.email);
      if (result.success) {
        paymentService.initializePaystack({
          email: user.email,
          amount: result.amount,
          reference: result.reference,
          onSuccess: async (ref) => {
            const verify = await paymentService.verifyPayment(ref);
            if (verify.success) {
              toast.success('500 credits added to your account!');
              await refreshCredits();
            }
          },
          onClose: () => {},
        });
      } else {
        toast.error(result.error || 'Failed to initialize payment');
      }
    } catch (err) {
      toast.error(err.message || 'Credit purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const cancel = async () => {
    setLoading(true);
    try {
      const result = await paymentService.cancelSubscription();
      if (result.success) {
        toast.success('Subscription cancelled');
        await loadUser();
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isActive = () => {
    if (!subscription) return false;
    return subscription.status === 'active' && new Date(subscription.endDate) > new Date();
  };

  return { subscribe, buyCredits, cancel, loading, isActive, subscription };
}

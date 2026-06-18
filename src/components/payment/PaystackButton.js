import { useEffect, useState } from 'react';
import { useSubscription } from '../../hooks/useSubscription';
import { FaLock, FaSpinner } from 'react-icons/fa';

export default function PaystackButton({ plan, children, className, disabled }) {
  const { subscribe, loading } = useSubscription();
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  useEffect(() => {
    if (window.PaystackPop) { setPaystackLoaded(true); return; }
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setPaystackLoaded(true);
    document.body.appendChild(script);
  }, []);

  const handleClick = async () => {
    if (!paystackLoaded) return;
    await subscribe(plan);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || disabled || !paystackLoaded}
      className={className || 'btn-primary w-full justify-center'}
    >
      {loading ? (
        <><FaSpinner className="animate-spin" size={16} /> Processing...</>
      ) : (
        <><FaLock size={14} /> {children || 'Subscribe Now'}</>
      )}
    </button>
  );
}

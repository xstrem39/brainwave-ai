import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import { Toaster } from 'react-hot-toast';
import { TOAST_CONFIG } from '../utils/constants';
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0F0F1A" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <NotificationProvider>
          {getLayout(<Component {...pageProps} />)}
          <Toaster
            position="top-right"
            toastOptions={TOAST_CONFIG}
          />
        </NotificationProvider>
      </AuthProvider>
    </>
  );
}

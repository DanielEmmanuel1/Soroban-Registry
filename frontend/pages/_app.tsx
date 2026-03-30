import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/providers/ThemeProvider';
import ToastProvider from '@/providers/ToastProvider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </ThemeProvider>
  );
}

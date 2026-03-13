'use client';

import '@/i18n/config';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Provider } from "react-redux";
import { store } from "../utils/store";

interface ClientLayoutProps {
  children: ReactNode;
}

function I18nHandler({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language || 'en';
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [i18n.language]);

  return <>{children}</>;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <Provider store={store}>
      <I18nHandler>
        {children}
      </I18nHandler>
    </Provider>
  );
}
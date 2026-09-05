'use client';

import { usePathname } from 'next/navigation';
import WhatsAppFloatingButton from './WhatsAppFloatingButton';
import KpnChatbot from './KpnChatbot';

export default function PublicWidgets() {
  const pathname = usePathname();

  // Do not render public chatbot or WhatsApp button inside Admin panel
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <WhatsAppFloatingButton />
      <KpnChatbot />
    </>
  );
}

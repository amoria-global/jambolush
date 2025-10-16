'use client';
import { Metadata } from 'next'
import BecomeHostModal from '@/app/pages/auth/become-host';
import { useRouter } from 'next/navigation';

export default function BecomeHostPage() {
  const router = useRouter();

  const handleClose = () => {
    router.push('/');
  };

  return <BecomeHostModal isOpen={true} onClose={handleClose} />;
}

import { Metadata } from 'next'
import BecomeHost from '@/app/pages/auth/become-host';

export const metadata: Metadata = {
  title: 'Become a Host - JamboLush',
  description: 'Join JamboLush to experience the remote life time earnings'
}

export default function ShareModalRoute() {
  return <BecomeHost />;
}
import { Metadata } from 'next'
import ShareModalPage from '../../pages/share';

export const metadata: Metadata = {
  title: 'Share Property - JamboLush',
  description: 'Share this amazing property with friends and family'
}

export default function ShareModalRoute() {
  return <ShareModalPage />;
}
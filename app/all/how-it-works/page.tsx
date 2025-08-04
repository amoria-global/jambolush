import { Metadata } from 'next'
import HowItWorksPage from '../../pages/how-it-works';
export const metadata: Metadata = {
  title: 'How it Works - JamboLush',
  description: 'How it Works'
}
export default function HowItWorksRoute() {
    return <HowItWorksPage />;
}
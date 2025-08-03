import { Metadata } from 'next'
import SignupPage from '../../pages/signup';
export const metadata: Metadata = {
  title: 'Signup - JamboLush',
  description: 'Signup to your JamboLush account'
}
export default function SignupRoute() {
  return <SignupPage />;
}
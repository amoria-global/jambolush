import { Metadata } from 'next'
import LoginPage from '../../pages/login';

export const metadata: Metadata = {
  title: 'Signin - JamboLush',
  description: 'Signin to your JamboLush account'
}

export default function LoginRoute() {
  return <LoginPage />;
}
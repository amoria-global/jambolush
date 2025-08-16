import { Metadata } from 'next'
import Login from '../../pages/auth/login';

export const metadata: Metadata = {
  title: 'Signin - JamboLush',
  description: 'Signin to your JamboLush account'
}

export default function LoginPage() {
  return <Login />;
}
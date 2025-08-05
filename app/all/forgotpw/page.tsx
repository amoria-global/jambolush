import { Metadata } from 'next'
import ForgotPasswordPage from '../../pages/auth/forgotpw';
export const metadata: Metadata = {
  title: 'Forgot Password - JamboLush',
  description: 'Forgot Password'
}
export default function ForgotPasswordRoute() {
  return <ForgotPasswordPage />;
}
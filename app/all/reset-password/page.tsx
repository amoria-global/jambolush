
import ResetPasswordPage from '@/app/pages/auth/reset-password';
import { Metadata } from 'next';
import React from 'react';
 export const metadata: Metadata = {
  title: 'Reset Password - Jambolush',
  description: 'Reset your password on Jambolush and regain access to your account.',
};

const ResetPassword = () => {
  return <ResetPasswordPage />;
};

export default ResetPassword;

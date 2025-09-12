import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { sendEmailConfirmation } from '../../api/authService';
import Button from '../../components/ui/Button';
import AuthLayout from '../../layouts/AuthLayout';

const PleaseConfirm = () => {
  const location = useLocation();
  const email = location.state?.email;
  const [isSending, setIsSending] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const handleResend = async () => {
    if (!email) {
      setMessage('Could not find email address.');
      return;
    }
    setIsSending(true);
    try {
      await sendEmailConfirmation(email);
      setMessage('A new confirmation email has been sent.');
    } catch (error) {
      setMessage('Failed to resend email. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Please Confirm Your Email</h2>
        <p className="mt-4">
          A confirmation email has been sent to <strong>{email || 'your email address'}</strong>.
          Please check your inbox and click the confirmation link to activate your account.
        </p>
        <div className="mt-6">
          <Button onClick={handleResend} disabled={isSending || !email}>
            {isSending ? 'Sending...' : 'Resend Confirmation Email'}
          </Button>
        </div>
        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
        <div className="mt-6">
          <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
            Back to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default PleaseConfirm;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { sendEmailConfirmation } from '../../api/authService';
import Button from '../../components/ui/Button';
import LiquidEther from '../../components/LiquidEther/LiquidEther'; // Import LiquidEther

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"> {/* Added relative and overflow-hidden */}
      <div className="absolute inset-0 z-0"> {/* LiquidEther as background */}
        <LiquidEther colors={[ '#5227FF', '#FF9FFC', '#B19EEF' ]} />
      </div>
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center z-10"> {/* Added z-10 */}
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
    </div>
  );
};

export default PleaseConfirm;
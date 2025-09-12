import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { confirmEmail } from '../../api/authService';
import AuthLayout from '../../layouts/AuthLayout';

const ConfirmEmail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get('email');
    const code = params.get('code');

    if (email && code) {
      confirmEmail(email, code)
        .then(response => {
          if (response.statusCode === 0) {
            setMessage('Your email has been confirmed successfully! You can now log in.');
          } else {
            setMessage(response.message || 'An error occurred during email confirmation.');
          }
        })
        .catch(err => {
          setMessage(err.message || 'Failed to confirm email. The link may be invalid or expired.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setMessage('Invalid confirmation link.');
      setIsLoading(false);
    }
  }, [location]);

  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Email Confirmation</h2>
        <div className="mt-4">
          {isLoading ? (
            <p>Confirming your email...</p>
          ) : (
            <p>{message}</p>
          )}
        </div>
        {!isLoading && (
          <div className="mt-6">
            <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default ConfirmEmail;
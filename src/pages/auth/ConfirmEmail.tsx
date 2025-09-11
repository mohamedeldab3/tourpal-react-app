import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { confirmEmail } from '../../api/authService';

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
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
    </div>
  );
};

export default ConfirmEmail;

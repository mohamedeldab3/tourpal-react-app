import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/authService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await forgotPassword(email);
      if (response.statusCode === 0) {
        setMessage('If an account with that email exists, a password reset link has been sent.');
      } else {
        setError(response.message || 'An unexpected error occurred.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Forgot Password</h2>
        <p className="mt-2 text-center text-gray-600">
          Enter your email to receive a password reset link.
        </p>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            label="Email address"
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {message && <p className="text-green-500 text-center">{message}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </div>

          <div className="text-center mt-4">
            <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

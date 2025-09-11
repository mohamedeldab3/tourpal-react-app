import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../../api/authService';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';


const ResetPassword = () => {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get('token');
    const emailParam = params.get('email');
    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
    } else {
      setError('Invalid password reset link. Please try again.');
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await resetPassword({ email, token, newPassword });
      if (response.statusCode === 0) {
        setMessage('Your password has been reset successfully. You can now log in.');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(response.message || 'An unexpected error occurred.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 z-10">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Reset Password</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            label="New Password"
            id="new-password"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            label="Confirm New Password"
            id="confirm-password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {message && <p className="text-green-500 text-center">{message}</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div>
            <Button type="submit" className="w-full" disabled={isLoading || !token}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </div>

          {message && (
            <div className="text-center mt-4">
              <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
                Back to Login
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

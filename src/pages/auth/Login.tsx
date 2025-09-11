import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login as apiLogin, sendEmailConfirmation } from "../../api/authService";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";


const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();

  const handleResendConfirmation = async () => {
    setIsLoading(true);
    setResendMessage('');
    try {
      await sendEmailConfirmation(email);
      setResendMessage('A new confirmation email has been sent.');
    } catch (error) {
      setResendMessage('Failed to resend email. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

    const handleSubmit = async (e: React.FormEvent) => {
    console.log("1. handleSubmit called");
    e.preventDefault();
    console.log("2. e.preventDefault() executed");
    setIsLoading(true);
    setError(null);
    setEmailNotConfirmed(false);

    const dashboardPaths = {
      admin: "/dashboard/admin",
      provider: "/dashboard/provider",
      user: "/dashboard/user",
    };

    try {
      console.log("3. Attempting apiLogin...");
      const response = await apiLogin({
        email,
        password,
        rememberMe,
      });
      console.log("4. apiLogin successful:", response);

      auth.login(response.user, response.token);

      const userType = response.user.userType || "user";
      const dashboardPath = dashboardPaths[userType] || dashboardPaths.user;

      console.log("5. Navigating to:", dashboardPath);
      navigate(dashboardPath, { replace: true });
    } catch (err: any) {
      console.log("6. apiLogin failed:", err);
      const errorMessage = err.response?.data?.message || err.message || "Invalid email or password.";
      if (errorMessage.includes('Email is not confirmed')) {
        setError('Your email is not confirmed. Please check your inbox.');
        setEmailNotConfirmed(true);
      } else {
        setError(errorMessage);
        setPassword(''); // Clear password on failed login
      }
      console.error("Login Error:", err);
    } finally {
      console.log("7. handleSubmit finished");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"> {/* Added relative and overflow-hidden */}
      
      <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg flex z-10"> {/* Added z-10 */}
        <div
          className="hidden md:block w-1/2 bg-cover bg-center rounded-l-xl"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')",
          }}
        ></div>

        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Welcome Back!
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Sign up
            </Link>
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

            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-purple-600 hover:text-purple-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}

            {emailNotConfirmed && (
              <div className="text-center mt-4">
                <Button onClick={handleResendConfirmation} disabled={isLoading} className="text-sm">
                  {isLoading ? 'Sending...' : 'Resend Confirmation Email'}
                </Button>
                {resendMessage && <p className="text-sm text-gray-600 mt-2">{resendMessage}</p>}
              </div>
            )}

            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

  
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Corrected: Import useAuth hook
import { login as apiLogin } from "../../api/authService"; // Import the api function
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth(); // Corrected: Use the hook
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Define dashboard paths
    const dashboardPaths = {
      admin: "/dashboard/admin",
      provider: "/dashboard/provider",
      user: "/dashboard/user",
    };

    try {
      // 1. Call the API
      const response = await apiLogin({
        email,
        password,
        rememberMe,
      });

      console.log("Login Response in component:", response);

      // 2. Store token and user data
      auth.login(response.user, response.token);

      // Get the appropriate dashboard path
      const userType = response.user.userType || "user";
      const dashboardPath = dashboardPaths[userType] || dashboardPaths.user;

      console.log("User type:", userType);
      console.log("Redirecting to:", dashboardPath);

      navigate(dashboardPath, { replace: true });
    } catch (err: any) {
      console.error("Login Error:", err); // Debug log
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors?.length > 0) {
        setError(err.response.data.errors[0]); // Show first error message
      } else {
        setError(err.message || "Invalid email or password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg flex">
        {/* Image Section */}
        <div
          className="hidden md:block w-1/2 bg-cover bg-center rounded-l-xl"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1529539795054-3c162a4afc9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')",
          }}
        ></div>

        {/* Form Section */}
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
                <a
                  href="#"
                  className="font-medium text-purple-600 hover:text-purple-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}

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

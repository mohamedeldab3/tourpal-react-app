import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/authService";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    Password: "",
    UserType: 1, // 1 for user, 2 for provider
    Phone: "",
    CityId: "",
    CompanyName: "",
    Address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);
    try {
      await register({
        ...formData,
        UserType: formData.UserType,
        IsCompany: false,
        IsEmailConfirmed: false,
        EmailCodeNo: "",
      });
      alert("Registration successful! Your account is pending admin approval.");
      navigate("/login");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors(["Failed to register. Please try again."]);
      }
      console.error(err);
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
              "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')",
          }}
        ></div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Sign in
            </Link>
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              id="full-name"
              name="FullName"
              type="text"
              value={formData.FullName}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Phone Number"
              id="phone"
              name="Phone"
              type="tel"
              value={formData.Phone}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Email address"
              id="email-address"
              name="Email"
              type="email"
              value={formData.Email}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Password"
              id="password"
              name="Password"
              type="password"
              value={formData.Password}
              onChange={handleInputChange}
              required
            />

            <Input
              label="City ID"
              id="city-id"
              name="CityId"
              type="text"
              value={formData.CityId}
              onChange={handleInputChange}
              required
            />

            <div>
              <label
                htmlFor="user-type"
                className="block text-sm font-medium text-gray-700"
              >
                Account Type
              </label>
              <select
                id="user-type"
                name="UserType"
                value={formData.UserType}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
              >
                <option value={1}>Traveler</option>
                <option value={2}>Service Provider</option>
              </select>
            </div>

            {formData.UserType === 2 && (
              <>
                <Input
                  label="Company Name"
                  id="company-name"
                  name="CompanyName"
                  type="text"
                  value={formData.CompanyName}
                  onChange={handleInputChange}
                />

                <Input
                  label="Address"
                  id="address"
                  name="Address"
                  type="text"
                  value={formData.Address}
                  onChange={handleInputChange}
                />
              </>
            )}
            {errors.length > 0 && (
              <div className="bg-red-50 p-4 rounded-md">
                {errors.map((error, index) => (
                  <p key={index} className="text-red-500 text-sm">
                    {error}
                  </p>
                ))}
              </div>
            )}
            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { getCities, getUserTypes } from "../../api/listsService";
import { register } from "../../api/authService";
import { toast } from "sonner"; // Import toast
import LiquidEther from '../../components/LiquidEther/LiquidEther'; // Import LiquidEther

interface City {
  id: number;
  name: string;
}

interface UserType {
  id: number;
  name: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    Password: "",
    UserType: 1,
    Phone: "",
    CityId: "",
    CompanyName: "",
    Address: "",
  });
  const [cities, setCities] = useState<City[]>([]);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [clientUserTypeId, setClientUserTypeId] = useState<number | undefined>(undefined);
  const navigate = useNavigate();

  // Dynamically find UserType IDs
  const carOwnerTypeId = userTypes.find(type => type.name === 'Car Owner')?.id;
  const companyTypeIds = userTypes.filter(type => 
    type.name === 'Tourism Transport Company' || type.name === 'Tourism Company'
  ).map(type => type.id);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const citiesData = await getCities(1);
        const userTypesData = await getUserTypes();
        setCities(citiesData);
        setUserTypes(userTypesData);
        if (userTypesData.length > 0) {
          setFormData(prev => ({ ...prev, UserType: userTypesData[0].id }));
        }
        const clientType = userTypesData.find(type => type.name === 'Client');
        if (clientType) {
          setClientUserTypeId(clientType.id);
        }
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      }
    };
    fetchInitialData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "Password") {
      const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
      if (!passwordRegex.test(value)) {
        setPasswordError("Password must contain only English letters, numbers, and symbols.");
      } else {
        setPasswordError(null);
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "UserType" || name === "CityId" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordError) {
      return;
    }
    
    if (formData.UserType === clientUserTypeId) {
      try {
        await register(formData);
        toast.success("Registration successful! Please check your email to confirm your account."); // Use toast.success
        navigate('/login');
      } catch (error) {
        console.error("Client registration failed:", error);
        toast.error("Registration failed. Please try again."); // Use toast.error
      }
    } else {
      // Navigate to step 2 with the form data
      navigate('/register-step2', { state: { formData } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"> {/* Added relative and overflow-hidden */}
      <div className="absolute inset-0 z-0"> {/* LiquidEther as background */}
        <LiquidEther colors={[ '#5227FF', '#FF9FFC', '#B19EEF' ]} />
      </div>
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
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <select
                id="city"
                name="CityId"
                value={formData.CityId}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
              >
                <option value="" disabled>
                  Select a city
                </option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

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
                {userTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {companyTypeIds.includes(formData.UserType) && (
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
            
            <div>
              <Button type="submit" className="w-full" disabled={!!passwordError}>
                {formData.UserType === clientUserTypeId ? "Sign Up" : "Next: Upload Documents"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

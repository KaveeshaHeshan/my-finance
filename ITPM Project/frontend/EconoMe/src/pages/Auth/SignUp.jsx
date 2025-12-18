import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../../components/Inputs/input';
import ProfilePhotoSelector from '../../components/ProfilePhotoSelector';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadImage';
import { toast } from 'react-hot-toast';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleTextOnlyChange = (setter) => (e) => {
    const value = e.target.value;
    // Allow only letters and space
    if (/^[A-Za-z\s]*$/.test(value)) {
      setter(value);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate inputs
    if (!firstName || !lastName) {
      setError("Please enter your first and last name.");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      let profileImageUrl = "";

      if (profilePic) {
        try {
          const imgUploadRes = await uploadImage(profilePic);
          if (imgUploadRes?.imageUrl) {
            profileImageUrl = imgUploadRes.imageUrl;
          } else {
            throw new Error("Failed to upload profile image");
          }
        } catch (uploadError) {
          console.error("Profile image upload error:", uploadError);
          setError("Failed to upload profile image. Please try again.");
          setIsLoading(false);
          return;
        }
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        firstName,
        lastName,
        email,
        password,
        profileImageUrl,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        toast.success("Registration successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-center text-green-600">EconoMe</h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your account
          </p>
        </div>

        <form onSubmit={handleSignUp} className="mt-8 space-y-6">
          <div className="flex justify-center">
            <ProfilePhotoSelector
              image={profilePic}
              setImage={setProfilePic}
              className="hover:opacity-90 transition-opacity"
            />
          </div>

          <div className="space-y-4">
            <Input
              value={firstName}
              onChange={handleTextOnlyChange(setFirstName)}
              label="First Name"
              placeholder="John"
              type="text"
              required
            />
            <Input
              value={lastName}
              onChange={handleTextOnlyChange(setLastName)}
              label="Last Name"
              placeholder="Doe"
              type="text"
              required
            />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              placeholder="john.doe@example.com"
              type="email"
              required
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="••••••••"
              type="password"
              required
              helperText="Minimum 8 characters"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="text-sm text-center">
            <Link
              to="/login"
              className="font-medium text-green-600 hover:text-green-500"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

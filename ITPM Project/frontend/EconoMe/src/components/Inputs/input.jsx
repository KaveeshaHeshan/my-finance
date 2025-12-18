import React, { useState } from 'react';

const Input = ({ value, onChange, placeholder, label, type, required, helperText }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <div className="flex flex-col space-y-1">
      {/* Label */}
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Wrapper */}
      <div className="relative flex items-center border border-gray-300 rounded-md p-2 bg-white focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
        {/* Input Field */}
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-400"
          value={value}
          onChange={onChange}
          required={required}
        />

        {/* Password Toggle Button */}
        {type === 'password' && (
          <button
            type="button"
            className="absolute right-3 text-gray-500 hover:text-gray-700"
            onClick={toggleShowPassword}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
      </div>

      {/* Helper Text */}
      {helperText && (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
};

export default Input;

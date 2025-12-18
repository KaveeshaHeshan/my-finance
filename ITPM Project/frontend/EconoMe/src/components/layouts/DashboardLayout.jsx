import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LuLayoutDashboard, LuWallet, LuHandCoins, LuLogOut } from "react-icons/lu";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";
import CharAvatar from "../Cards/CharAvatar";

const DashboardLayout = ({ children, activeMenu }) => {
  const { clearUser, user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
      localStorage.clear();
      clearUser();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        {/* Logo and User Profile */}
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-green-600">EconoMe</h1>
          <p className="text-sm text-gray-500 mb-4">Smart Money Management</p>
          
          {/* User Profile Section */}
          <div className="flex items-center gap-3 py-3 border-t">
            <div className="flex-shrink-0">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-green-500"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.querySelector('.fallback-avatar').style.display = 'block';
                  }}
                />
              ) : (
                <div className="fallback-avatar">
                  <CharAvatar
                    fullName={`${user?.firstName} ${user?.lastName}`}
                    width="w-10"
                    height="h-10"
                    style="text-sm"
                  />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 p-3 rounded-lg mb-2 ${
              activeMenu === "Dashboard"
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:bg-green-50"
            }`}
          >
            <LuLayoutDashboard className="text-xl" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/income"
            className={`flex items-center gap-3 p-3 rounded-lg mb-2 ${
              activeMenu === "Income"
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:bg-green-50"
            }`}
          >
            <LuWallet className="text-xl" />
            <span>Income</span>
          </Link>

          <Link
            to="/expense"
            className={`flex items-center gap-3 p-3 rounded-lg mb-2 ${
              activeMenu === "Expense"
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:bg-green-50"
            }`}
          >
            <LuHandCoins className="text-xl" />
            <span>Expense</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 mt-auto"
          >
            <LuLogOut className="text-xl" />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

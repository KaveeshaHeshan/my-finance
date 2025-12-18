import React, { useContext } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import CharAvatar from "../Cards/CharAvatar";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

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
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r">
      <div className="flex flex-col items-center justify-center gap-2 py-6">
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-green-500"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.querySelector('.fallback-avatar').style.display = 'block';
            }}
          />
        ) : null}
        <div className="fallback-avatar" style={{ display: user?.profileImageUrl ? 'none' : 'block' }}>
          <CharAvatar
            fullName={`${user?.firstName} ${user?.lastName}`}
            width="w-20"
            height="h-20"
            style="text-xl"
          />
        </div>
        <h5 className="text-gray-950 font-medium leading-6">
          {user?.firstName || ""} {user?.lastName || ""}
        </h5>
      </div>

      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-[15px] ${
            activeMenu === item.label
              ? "text-white bg-green-600"
              : "text-gray-700 hover:bg-green-100"
          } py-3 px-6 rounded-lg mb-3 transition-colors`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-lg" />
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default SideMenu;

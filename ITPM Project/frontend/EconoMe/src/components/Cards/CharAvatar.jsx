import React from "react";
import { getInitials } from "../../utils/helper";

const CharAvatar = ({ fullName, width, height, style }) => {
  const initials = getInitials(fullName || "");
  
  return (
    <div 
      className={`${width || 'w-12'} ${height || 'h-12'} ${style || ''} 
        rounded-full bg-green-100 flex items-center justify-center 
        text-green-600 font-semibold border-2 border-green-500`}
    >
      {initials || "?"}
    </div>
  );
};

export default CharAvatar;

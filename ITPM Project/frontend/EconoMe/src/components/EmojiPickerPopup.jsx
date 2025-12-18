import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { LuImage, LuX } from "react-icons/lu";

const EmojiPickerPopup = ({ icon, onSelect }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (emojiData) => {
    onSelect(emojiData.emoji);
    setShowPicker(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl hover:bg-gray-200 transition-colors"
        >
          {icon || '😀'}
        </button>
        <span className="text-sm text-gray-600">Click to select an emoji</span>
      </div>

      {showPicker && (
        <div className="absolute z-50 mt-2">
          <div 
            className="fixed inset-0" 
            onClick={() => setShowPicker(false)}
          />
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width={300}
            height={400}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerPopup;

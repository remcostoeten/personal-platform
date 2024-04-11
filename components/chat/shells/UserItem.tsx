import React from "react";

interface UserItemProps {
  name: string;
  email: string;
  imageUrl: string;
  isActive?: boolean;
}

export const UserItem: React.FC<UserItemProps> = ({
  name,
  email,
  imageUrl,
  isActive,
}) => {
  return (
    <div
      className={`px-5 py-4 flex items-center cursor-pointer border-l-4 ${
        isActive
          ? "border-l-blue-500 bg-white"
          : "border-l-transparent hover:bg-slate-100"
      }`}
    >
      <img
        src={imageUrl}
        className="h-12 w-12 border-2 border-white rounded-full"
        alt={name}
      />
      <div className="ml-4">
        <p className="text-md font-semibold text-slate-600 m-0 p-0">{name}</p>
        <p className="text-xs text-slate-400 -mt-0.5 font-semibold">{email}</p>
      </div>
    </div>
  );
};

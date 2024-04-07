import React from "react";

type SpinnerProps = {
  size?: "small" | "medium" | "large";
  color?: string;
};

const Spinner: React.FC<SpinnerProps> = ({ size, color }) => {
  let sizeClasses = "";
  switch (size) {
    case "small":
      sizeClasses = "h-16 w-16";
      break;
    case "medium":
      sizeClasses = "h-32 w-32";
      break;
    case "large":
      sizeClasses = "h-64 w-64";
      break;
  }

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full ${sizeClasses} border-t-2 border-b-2 border-${color}`}
      ></div>
    </div>
  );
};

export default Spinner;

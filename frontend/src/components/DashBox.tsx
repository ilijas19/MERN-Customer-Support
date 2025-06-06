import { Link } from "react-router-dom";
import type React from "react";
import type { Roles } from "../types";

type BoxProps = {
  label: string;
  to: string;
  icon: React.ReactNode;
  currentUserRole: Roles | undefined;
  allowedRoles: string[];
};

const DashBox = ({
  label,
  to,
  icon,
  currentUserRole,
  allowedRoles,
}: BoxProps) => {
  return (
    currentUserRole &&
    allowedRoles.includes(currentUserRole) && (
      <Link
        to={to}
        className="flex flex-col items-center justify-center gap-4 p-7 rounded-xl border border-gray-700 bg-gray-800 hover:bg-gray-700  hover:shadow-lg transition-all duration-300 transform hover:scale-105 w-55 not-sm:w-70 "
      >
        <div className="text-sky-600 text-4xl">{icon}</div>
        <span className="text-white font-semibold text-lg tracking-wide">
          {label}
        </span>
      </Link>
    )
  );
};

export default DashBox;

import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, SquarePen, User, LogOut, UserCircle2 } from "lucide-react";

const Navbar: React.FC = () => {
  const token = localStorage.getItem("expToken");
  const user = localStorage.getItem("expUser")
    ? JSON.parse(localStorage.getItem("expUser")!)
    : null;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("expToken");
    localStorage.removeItem("expUser");
    setDropdownOpen(false);
    window.location.href = "/login";
  };

  return (
    <nav className="w-full bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#1e3a8a] px-8 py-4 flex items-center justify-between shadow-lg">
      <Link to="/" className="text-3xl font-extrabold tracking-wide text-white">
        Expense<span className="gradient-text">Ease</span>
      </Link>

      <div className="flex items-center gap-4">
        {!token ? (
          <Link
            to="/login"
            className="text-white px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition duration-200"
          >
            Login
          </Link>
        ) : (
          <>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-100 text-blue-800 font-semibold hover:bg-blue-200 transition"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>

            <Link
              to="/transactions"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1e293b] text-white font-medium hover:bg-[#0f172a] transition"
            >
              <SquarePen size={18} />
              Add Transaction
            </Link>

            <div className="relative" ref={dropdownRef}>
              <div
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-600 text-white font-bold text-lg shadow-md hover:scale-105 transition cursor-pointer"
                title={user?.name}
                onClick={() => setDropdownOpen((open) => !open)}
                tabIndex={0}
              >
                <User size={22} />
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-[#181f2a] rounded-xl shadow-xl border border-gray-800 z-50 py-2">
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-200 hover:bg-[#232b3a] focus:bg-[#232b3a] rounded-t-xl transition"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/profile");
                    }}
                  >
                    <UserCircle2 size={18} /> View Profile
                  </button>
                  <button
                    className="w-full flex items-center gap-2 px-4 py-2 text-gray-200 hover:bg-[#232b3a] focus:bg-[#232b3a] rounded-b-xl border-t border-gray-800 transition"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

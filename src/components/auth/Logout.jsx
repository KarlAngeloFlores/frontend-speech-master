import { ChevronDown } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import authService from "../../services/auth.service"
import { useNavigate } from "react-router-dom"

export const Logout = ({user}) => {

    const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getInitials = (firstName, lastName) => {
    const first = firstName ? firstName.charAt(0) : "";
    const last = lastName ? lastName.charAt(0) : "";
    return `${first}${last}`.toUpperCase();
  };

  const handleLogout = async () => {
    //remove access token on local storage
    localStorage.removeItem("accessToken");
    navigate("/");
    try {

        await authService.logout();

    } catch (error) {
        console.log(error)
    }

  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
        <div
          className="relative flex gap-2 items-center cursor-pointer"
          ref={dropdownRef}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {/* <span className="sm:block hidden">{user.first_name || 'U'} {user.last_name || 'U'}</span>
          <div className="rounded-full bg-green-500 w-8 h-8 font-medium flex items-center justify-center text-white">
            {getInitials(user.first_name || 'U', user.last_name || 'U')}
          </div> */}
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${
              dropdownOpen ? "rotate-180" : "rotate-0"
            }`}
          />

          {dropdownOpen && (
            <div className="absolute right-0 top-12 w-40 bg-white shadow-lg rounded-md py-2 border z-50 select-none">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
  )
}

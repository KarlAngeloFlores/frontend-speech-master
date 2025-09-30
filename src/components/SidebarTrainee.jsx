import React from "react";
import { 
  Home, 
  FileText, 
  BookOpen, 
  BarChart2, 
  BookMarked, 
  Menu, 
  X 
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  {
    name: "Quizzes",
    icon: <Home className="w-5 h-5 mr-3" />,
    path: "/trainee/quizzes",
  },
  {
    name: "Quizzes Score",
    icon: <BarChart2 className="w-5 h-5 mr-3" />,
    path: "/trainee/quizzes-score",
  },
  {
    name: "Speech Practice",
    icon: <BookOpen className="w-5 h-5 mr-3" />,
    path: "/trainee/speech-practice",
  },
  {
    name: "Dictionary",
    icon: <BookMarked className="w-5 h-5 mr-3" />,
    path: "/trainee/dictionary",
  },
  {
    name: "Modules",
    icon: <FileText className="w-5 h-5 mr-3" />,
    path: "/trainee/modules",
  },
];

const SidebarTrainee = ({ mobileOpen, setMobileOpen }) => {
  return (
    <>
      {/* Mobile overlay & backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />
      {/* Sidebar */}
      <aside
        className={`
          fixed z-50 top-0 left-0 h-screen w-64 bg-gradient-to-b from-blue-600 to-indigo-600 text-white flex flex-col shadow-lg
          transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:sticky md:shadow-lg md:flex
        `}
        aria-label="Sidebar"
      >
        {/* Logo/Header */}
        <div className="flex items-center gap-2 px-6 py-6 mb-6 relative">
          <span className="font-bold text-2xl py-1 px-3 bg-white text-blue-700 rounded-lg">
            S
          </span>
          <span className="font-bold text-2xl text-white bg-clip-text">
            SpeechMaster
          </span>
          {/* Close btn mobile */}
          <button
            className="absolute top-4 right-4 text-white md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-6 py-3 rounded-lg transition-colors duration-200 font-medium ${
                      isActive
                        ? "bg-white text-blue-700 shadow"
                        : "hover:bg-blue-700/40 hover:text-white"
                    }`
                  }
                  end
                  onClick={() => setMobileOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default SidebarTrainee;

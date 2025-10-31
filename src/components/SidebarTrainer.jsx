import React, { useState } from "react";
import { Home, FileText, BookOpen, BarChart2, Users, Menu, X, MessageCircle  } from "lucide-react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";



const SidebarTrainer = ({ mobileOpen, setMobileOpen }) => {

  //connected to socket later, or current notifications count
  const [unreadMessages, setUnreadMessages] = useState(0);

  const navItems = [
  {
    //icon for report
    name: "Progress Reports",
    icon: <BarChart2 className="w-5 h-5 mr-3" />,
    path: "/trainer/progress-reports",
  },
  {
    name: "Quizzes",
    icon: <FileText className="w-5 h-5 mr-3" />,
    path: "/trainer/quizzes",
  },
  {
    name: "Modules",
    icon: <BookOpen className="w-5 h-5 mr-3" />,
    path: "/trainer/modules",
  },
  // {
  //   name: "Analytics",
  //   icon: <BarChart2 className="w-5 h-5 mr-3" />,
  //   path: "/trainer/analytics",
  // },
  {
    name: "Trainees",
    icon: <Users className="w-5 h-5 mr-3" />,
    path: "/trainer/trainees",
  },
  {
    name: "Messages",
    icon: <MessageCircle className="w-5 h-5 mr-3" />,
    path: "/trainer/messages",
    unread_message: unreadMessages
  }
];

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
          fixed z-50 top-0 left-0 h-screen w-64 bg-green-600 text-white flex flex-col shadow-md
          transform transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:sticky md:shadow-md md:flex
        `}
        aria-label="Sidebar"
      >
        {/* Close btn mobile */}
        <div>

        {/* Logo/Header */}
        <div className="flex items-center gap-2 px-6 py-6 mb-6">
          <Logo className="w-10 h-10" />
          <span className="font-bold text-2xl text-white bg-clip-text">
            SpeechMaster
          </span>

        <button
          className="absolute top-4 right-4 text-white md:hidden cursor-pointer"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="w-7 h-7" />
        </button>
        </div>
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
                        ? "bg-white text-green-700 shadow"
                        : "hover:bg-green-700/40 hover:text-white"
                    }`
                  }
                  end
                  onClick={() => setMobileOpen(false)}
                >
                  {item.icon}
                  {item.name}
                  {item.unread_message > 0 && (
                    <span className="ml-auto bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                      {item.unread_message}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default SidebarTrainer;
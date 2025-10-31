import React, { useState } from "react";
import SidebarTrainee from "../../components/SidebarTrainee";
import { Menu } from "lucide-react";
import Script from "../../components/trainee/Script";
import { Logout } from "../../components/auth/Logout";


const TraineeSpeechPracticePage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SidebarTrainee mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/**main-content */}
      <main className="flex-1 min-h-screen flex flex-col overflow-y-auto">

        {/**header */}
        <header className="sm:px-8 sm:py-6 px-4 py-3 bg-white shadow flex items-center justify-between gap-4">
          <div className="flex gap-2">
          <button
            className="md:hidden bg-white text-green-700 rounded-lg p-2 cursor-pointer hover:bg-gray-200 transition"
            onClick={() => setMobileOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="w-7 h-7" />
          </button>
          <section>
            <h1 className="text-2xl font-bold text-green-700">Speech Practice</h1>
            <p>
              Turn every line into a powerful voice and read it with confidence!
            </p>
          </section>
          </div>
          <Logout />
        </header>

        {/**content */}
        <div className="sm:p-8 p-4 flex-1 w-full">
          <Script />
        </div>
        
      </main>
    </div>
  );
};

export default TraineeSpeechPracticePage;

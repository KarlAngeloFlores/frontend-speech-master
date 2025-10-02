import React, { useState } from "react";
import SidebarTrainee from "../../components/SidebarTrainee";
import DictionaryTab from "../../components/trainee/DictionaryTab";
import { Menu } from "lucide-react";
import { Logout } from "../../components/auth/Logout";
const TraineeDictionaryPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SidebarTrainee mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="flex-1 min-h-screen flex flex-col overflow-y-auto">
        <header className="px-8 py-6 bg-white shadow flex items-center justify-between gap-4">
          <div className="flex gap-2">
          <button
            className="md:hidden bg-white text-blue-700 rounded-lg p-2 cursor-pointer hover:bg-gray-200 transition"
            onClick={() => setMobileOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="w-7 h-7" />
          </button>
          <section>
            <h1 className="text-2xl font-bold text-blue-700">Dictionary</h1>
            <p>Search for word definitions and listen to its pronunciation in different speed</p>
          </section>
          </div>
          <Logout/>
        </header>

        <div className="sm:p-8 p-4 flex-1 w-full">
          <DictionaryTab />
        </div>
      </main>
    </div>
  );
};

export default TraineeDictionaryPage;

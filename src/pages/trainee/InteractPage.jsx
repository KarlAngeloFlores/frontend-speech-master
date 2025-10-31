import React from 'react'
import SidebarTrainee from '../../components/SidebarTrainee'
import { useState } from 'react';
import { Logout } from '../../components/auth/Logout';
import { Menu } from 'lucide-react';
import TalkContent from '../../components/trainee/interact/TalkContent';


const InteractPage = () => {

    const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className='min-h-screen flex bg-gray-100'>
        <SidebarTrainee  mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <main className='flex-1 min-h-screen flex flex-col overflow-y-auto'>
            {/**header */}
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
            <h1 className="text-2xl font-bold text-green-700">Talk to AI</h1>
            <p>
                Practice your speaking skills with AI!
            </p>
          </section>
          </div>
          <Logout />
        </header>

        <div className="sm:p-8 p-4 flex-1 w-full">
            <TalkContent />
        </div>
        </main>
    </div>
  )
}

export default InteractPage
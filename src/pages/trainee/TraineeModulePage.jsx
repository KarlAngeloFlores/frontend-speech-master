import React, { useState } from "react";
import SidebarTrainee from "../../components/SidebarTrainee";

const TraineeModulePage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SidebarTrainee mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="flex-1 min-h-screen flex flex-col overflow-y-auto">
        {/**header */}
        <header className="flex items-center justify-between">
        
        </header>

        {/**content */}
        <div>

        </div>
      </main>
    </div>
  );
};

export default TraineeModulePage;

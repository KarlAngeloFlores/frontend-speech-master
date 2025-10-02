import { useState, useEffect } from "react";
import { Menu, ChevronRight, BookOpen, Calendar } from "lucide-react";
import SidebarTrainee from "../../components/SidebarTrainee";
import { Logout } from "../../components/auth/Logout";
import ModuleDetailsTab from "../../components/trainee/module/ModuleDetailsTab";
import LoadingScreen from "../../components/LoadingScreen";
import ErrorPage from "../ErrorPage";
import moduleService from "../../services/module.service";
import ModuleCard from "../../components/trainee/module/ModuleCard";

const TraineeModulePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [openShowModule, setOpenShowModule] = useState(false);

  /**
   * @FETCH_MAIN_DATA_FROM_BACKEND_API
   */
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await moduleService.getModules();
      setModules(response.data);
    
    } catch (error) {
      console.error("Error fetching modules:", error);
      setError(error.message || "Something went wrong. Try again later");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /**
   * @HANDLE_OPEN_MODULE
   */
  const handleOpenModule = (module) => {
    setSelectedModule(module);
    setOpenShowModule(true);
  };

  /**
   * @HANDLE_CLOSE_MODULE
   */
  const handleCloseModule = () => {
    setSelectedModule(null);
    setOpenShowModule(false);
  };


  if (loading) return <LoadingScreen message="Loading modules..." />;
  if (error) return <ErrorPage />;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SidebarTrainee mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="flex-1 min-h-screen flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="px-8 py-6 bg-white shadow flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden bg-white text-blue-700 rounded-lg p-2 cursor-pointer hover:bg-gray-200 transition"
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="w-7 h-7" />
            </button>
            <section>
              <h1 className="text-2xl font-bold text-blue-700">Modules</h1>
              <p className="text-gray-600">View posted modules here</p>
            </section>
          </div>
          <Logout />
        </header>

        {/* Content */}
        <div className="sm:p-8 p-4 flex-1 modal-animation">
          <div className="bg-white w-full h-full rounded-lg shadow-md overflow-hidden flex flex-col">
            {/* Breadcrumb Header */}
            <div className="px-8 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2 text-sm">
                <button
                  className={`font-semibold transition ${
                    selectedModule
                      ? "text-blue-600 hover:text-blue-700 cursor-pointer"
                      : "text-gray-900 cursor-default"
                  }`}
                  onClick={selectedModule ? handleCloseModule : undefined}
                >
                  Modules
                </button>
                {selectedModule && (
                  <>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 font-medium">
                      {selectedModule.title}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8">
              {openShowModule && selectedModule ? (
                <ModuleDetailsTab module={selectedModule} />
              ) : (
                <div className="space-y-4 overflow-hidden">
                  {modules.length === 0 ? (
                    <div className="text-center py-12 ">
                      <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2 ">
                        No modules available
                      </h3>
                      <p className="text-gray-500">
                        Check back later for new training modules
                      </p>
                    </div>
                  ) : (
                    modules.map((module) => (
                      <ModuleCard module={module} handleOpenModule={handleOpenModule}/>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TraineeModulePage;
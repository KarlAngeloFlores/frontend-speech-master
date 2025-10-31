import { useState, useEffect } from "react";
import { Menu, ChevronRight, BookOpen, Calendar, Search, X } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * @FETCH_MAIN_DATA_FROM_BACKEND_API
   */
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await moduleService.getAvailableModules();
      setModules(response.data);
    
    } catch (error) {
      console.error("Error fetching modules:", error);
      setError(error.message || "Something went wrong. Try again later");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  // Initial fetch
  fetchData();

  // Poll every 1 minute
  const interval = setInterval(() => {
    fetchData();
  }, 60000);

  // Cleanup interval on unmount
  return () => clearInterval(interval);
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

  /**
   * @FILTER_MODULES_BY_SEARCH
   */
  const filteredModules = modules.filter((module) =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (module.category && module.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  if (loading) return <LoadingScreen message="Loading modules..." />;
  if (error) return <ErrorPage />;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SidebarTrainee mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="flex-1 min-h-screen flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="sm:px-8 sm:py-6 px-4 py-3 bg-white shadow flex items-center justify-between gap-4">
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

            {/* Search Bar - Show only when not viewing module details */}
            {!openShowModule && (
              <div className="px-8 py-4 bg-white border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search modules by title or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto sm:p-8 p-4">
              {openShowModule && selectedModule ? (
                <ModuleDetailsTab module={selectedModule} />
              ) : (
                <div className="space-y-4 overflow-hidden">
                  {filteredModules.length === 0 ? (
                    <div className="text-center py-12 ">
                      <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2 ">
                        {searchTerm ? "No modules found" : "No modules available"}
                      </h3>
                      <p className="text-gray-500">
                        {searchTerm
                          ? "Try adjusting your search terms"
                          : "Check back later for new training modules"}
                      </p>
                    </div>
                  ) : (
                    filteredModules.map((module) => (
                      <ModuleCard key={`module-${module.id}`} module={module} handleOpenModule={handleOpenModule}/>
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
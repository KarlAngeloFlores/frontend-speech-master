import { useState, useEffect } from "react";
import { Menu, Plus, ChevronRight, Search, X } from "lucide-react";
import SidebarTrainer from "../../components/SidebarTrainer";
import { Logout } from "../../components/auth/Logout";
import CreateModuleModal from "../../components/trainer/module/CreateModuleModal";
import UpdateModuleModal from "../../components/trainer/module/UpdateModuleModal";
import TrainerModuleDetailsTab from "../../components/trainer/module/TrainerModuleDetailsTab";
import TrainerModuleList from "../../components/trainer/module/TrainerModuleList";
import moduleService from "../../services/module.service";
import LoadingScreen from "../../components/LoadingScreen";
import ErrorPage from "../ErrorPage";
import "../../styles/animations.css"
import DeleteModuleModal from "../../components/trainer/module/DeleteModuleModal";
import { useNavigate } from "react-router-dom";
import ArchiveModuleModal from "../../components/trainer/module/ArchiveModuleModal";
import ViewModuleHistoryModal from "../../components/trainer/module/ViewModuleHistoryModal";
import RestoreModuleModal from "../../components/trainer/module/RestoreModuleModal";

const TrainerModulePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modules, setModules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  /**
   * @MODULE_NAVIGATION_STATE
   */
  const [selectedModule, setSelectedModule] = useState(null);
  const [openShowModule, setOpenShowModule] = useState(false);

  /**
   * @MODALS
   */
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  /**
   * @FETCH_MAIN_DATA_FROM_BACKEND_API
   */
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await moduleService.getModules();
      console.log(response);
      setModules(response.data);
    } catch (error) {
      console.log("Error fetching data", error);
      setError("Something went wrong. Try again later");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /**
   * @CREATE_MODULE_FUNCTION
   * @returns new module
   */
  const handleCreateModule = async (title, description) => {
    if (!title.trim()) {
      alert("Please enter a module title");
      return;
    }

    try {
      const response = await moduleService.createModule(title, description);
      const newModule = response.data;
      setModules((prev) => [...prev, newModule]);
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating module:", error);
      throw error;
    }
  };

  /**
   * @UPDATE_MODULE_FUNCTION
   * @returns updated module
   */
  const handleOpenUpdateModule = async (module) => {
    setSelectedModule(module);
    setShowUpdateModal(true);
  };

  const handleUpdateModule = async (title, description) => {
    try {
      const response = await moduleService.updateModule(
        selectedModule.id,
        title,
        description
      );
      const updatedModule = response.data;

      setModules((prevModules) =>
        prevModules.map((m) => (m.id === updatedModule.id ? updatedModule : m))
      );

      console.log("Updated module:", updatedModule);

      // Update selectedModule if it's the current one
      if (selectedModule && selectedModule.id === updatedModule.id) {
        setSelectedModule(updatedModule);
      }
    } catch (error) {
      console.error("Error updating module:", error);
      throw error;
    }
  };

  /**
   * @DELETE_MODULE_FUNCTION
   * @param {*} id
   * @returns id
   */

  const handleOpenDeleteModule = (module) => {
    setSelectedModule(module);
    setShowDeleteModal(true);
  }

  const handleDeleteModule = async (id) => {
    try {
      
      await moduleService.deleteModule(id);
      await fetchData();

    } catch (error) {
      console.error("Error deleting module:", error);
      throw error;
    }
  };

  /**
   * @VIEW_MODULE_HISTORY
   */
  const handleViewHistoryModule = (module) => {
    setSelectedModule(module);
    setShowHistoryModal(true);
  };

  /**
   * @ARCHIVE_MODULE
   */
  const handleArchiveModule = async (id) => {
    try {
      await moduleService.archiveModule(id);
      await fetchData();
    } catch (error) {
      console.error("Error archiving module:", error);
      throw error;
    }
  };

  const handleOpenArchiveModule = async (module) => {
    setSelectedModule(module);
    setShowArchiveModal(true);
  };

  /**
   * @RESTORE_MODULE
   */
  const handleOpenRestoreModule = async (module) => {
    setSelectedModule(module);
    setShowRestoreModal(true);
  };

  const handleRestoreModule = async (id) => {
    try {
      await moduleService.restoreModule(id);
      await fetchData();
    } catch (error) {
      console.error("Error restoring module:", error);
      throw error;
    }
  };

  /**
   * @OPEN_MODULE_DETAILS
   */
  const handleOpenModule = (module) => {
    setSelectedModule(module);
    setOpenShowModule(true);
  };

  /**
   * @CLOSE_MODULE_DETAILS
   */
  const handleCloseModule = () => {
    setSelectedModule(null);
    setOpenShowModule(false);
  };

  /**
   * @FORMAT_DATE
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
      <SidebarTrainer mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <main className="flex-1 min-h-screen flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="sm:px-8 sm:py-6 px-4 py-3 bg-white shadow flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden bg-white text-blue-700 rounded-lg p-2 cursor-pointer hover:bg-gray-200 transition"
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="w-7 h-7" />
            </button>
            <section>
              <h1 className="text-2xl font-bold text-blue-700">Modules</h1>
              <p className="text-gray-600">
                Manage your training modules here.
              </p>
            </section>
          </div>
          <Logout />
        </header>

        {/* Content */}
        <div className="sm:p-8 p-4 flex-1 modal-animation">
          <div className="bg-white w-full h-full rounded-lg shadow-md overflow-hidden flex flex-col">
            {/* Breadcrumb Header */}
            <div className="px-8 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <button
                  className={`font-semibold transition cursor-pointer ${
                    selectedModule
                      ? "text-blue-600 hover:text-blue-700"
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

              {/* Create Button in Header when not viewing module */}
              {!openShowModule && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Create Module
                </button>
              )}
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
            <div className="flex-1 overflow-y-auto p-8">
              {openShowModule && selectedModule ? (
                <TrainerModuleDetailsTab
                  module={selectedModule}
                  onUpdate={handleOpenUpdateModule}
                  onDelete={handleDeleteModule}
                />
              ) : (
                <div className="space-y-4">
                  {filteredModules.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="mb-4">
                        <Plus className="w-16 h-16 text-gray-300 mx-auto" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {searchTerm ? "No modules found" : "No modules yet"}
                      </h3>
                      <p className="text-gray-500 mb-6">
                        {searchTerm
                          ? "Try adjusting your search terms"
                          : "Create your first training module to get started"}
                      </p>
                      {!searchTerm && (
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow mx-auto"
                        >
                          <Plus className="w-5 h-5" />
                          Create Your First Module
                        </button>
                      )}
                    </div>
                  ) : (
                    <TrainerModuleList
                      modules={filteredModules}
                      onOpenModule={handleOpenModule}
                      onOpenUpdateModule={handleOpenUpdateModule}
                      onDeleteModule={handleOpenDeleteModule}
                      formatDate={formatDate}
                      onViewHistoryModule={handleViewHistoryModule}
                      onArchiveModule={handleOpenArchiveModule}
                      onRestoreModule={handleOpenRestoreModule}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Create Module Modal */}
      <CreateModuleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateModule}
      />

      {/* Update Module Modal */}
      <UpdateModuleModal
        isOpen={showUpdateModal}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedModule(null);
        }}
        onUpdate={handleUpdateModule}
        module={selectedModule}
      />

      {/**Delete Module Modal */}
      <DeleteModuleModal 
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedModule(null);
        }}
        onDelete={handleDeleteModule}
        module={selectedModule}
      />

      {/**Archive Module Modal */}
      <ArchiveModuleModal 
        isOpen={showArchiveModal}
        onClose={() => {
          setShowArchiveModal(false);
          setSelectedModule(null);
        }}
        onArchive={handleArchiveModule}
        module={selectedModule}
      />

      <ViewModuleHistoryModal 
        isOpen={showHistoryModal}
        onClose={() => {
          setShowHistoryModal(false);
          setSelectedModule(null);
        }}
        module={selectedModule}
      />

      <RestoreModuleModal 
  isOpen={showRestoreModal}
  onClose={() => setShowRestoreModal(false)}
  onRestore={(moduleId) => handleRestoreModule(moduleId)}
  module={selectedModule}
/>
    </div>
  );
};

export default TrainerModulePage;

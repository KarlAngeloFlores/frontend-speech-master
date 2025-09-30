import { useState, useEffect } from "react";
import { Menu, Plus } from "lucide-react";
import SidebarTrainer from "../../components/SidebarTrainer";
import { Logout } from "../../components/auth/Logout";
import CreateModuleModal from "../../components/trainer/module/CreateModuleModal";
import UpdateModuleModal from "../../components/trainer/module/UpdateModuleModal";
import ModuleDetailsModal from "../../components/trainer/module/ModuleDetailsModal";
import TrainerModuleList from "../../components/trainer/module/TrainerModuleList";
import moduleService from "../../services/module.service";
import LoadingScreen from "../../components/LoadingScreen";
import ErrorPage from "../ErrorPage";

const TrainerModulePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [modules, setModules] = useState([]); //for lists

  /**
   * @MODALS
   */

  const [selectedModule, setSelectedModule] = useState(null);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

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
      setError(error.message || "Something went wrong. Try again later");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all modules on mount
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * @CREATE_MODULE_FUNCTION
   * @returns new module
   */
  const handleCreateModule = async (title) => {
    if (!title.trim()) {
      alert("Please enter a module title");
      return;
    }

    try {
      const response = await moduleService.createModule(title);
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

  const handleUpdateModule = async (title) => {
    try {
      const response = await moduleService.updateModule(
        selectedModule.id,
        title
      );
      const updatedModule = response.data;

      // Update state immutably
      setModules((prevModules) =>
        prevModules.map((m) => (m.id === updatedModule.id ? updatedModule : m))
      );

      console.log("Updated module:", updatedModule);
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
  const handleDeleteModule = async (id) => {
    if (
      !confirm(
        "Are you sure you want to delete this module and all its contents?"
      )
    )
      return;

    try {
      await moduleService.deleteModule(id);
      await fetchData();
    } catch (error) {
      console.error("Error deleting module:", error);
      alert("Failed to delete module");
    }
  };

  const handleShowDetailsModal = (module) => {
    setSelectedModule(module);
    setShowDetailsModal(true);
  };

  if (loading) return <LoadingScreen message={"Loading modules...."} />;
  if (error) return <ErrorPage />;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SidebarTrainer mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
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
              <p className="text-gray-600">
                Manage your training modules here.
              </p>
            </section>
          </div>
          <Logout />
        </header>

        {/* Content */}
        <div className="p-8">
          {/* Create Module Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition shadow"
            >
              <Plus className="w-5 h-5" />
              Create New Module
            </button>
          </div>

          {/* Modules List */}
          <TrainerModuleList
            modules={modules}
            loading={loading}
            handleShowDetailsModal={handleShowDetailsModal}
            handleDeleteModule={handleDeleteModule}
            handleOpenUpdateModule={handleOpenUpdateModule}
          />
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
        onClose={() => setShowUpdateModal(false)}
        onUpdate={handleUpdateModule}
        module={selectedModule}
      />

      {/* Module Details Modal */}
      <ModuleDetailsModal
        data={selectedModule}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
      />
    </div>
  );
};

export default TrainerModulePage;

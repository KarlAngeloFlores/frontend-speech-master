import { useEffect, useState } from "react";
import SidebarTrainer from "../../components/SidebarTrainer";
import { Menu, UserX } from "lucide-react";
import LoadingScreen from "../../components/LoadingScreen";
import ErrorPage from "../ErrorPage";
import trainerService from "../../services/trainer.service";
import TraineeCard from "../../components/trainer/trainees/TraineeCard";
import ApproveTraineeModal from "../../components/trainer/trainees/ApproveTraineeModal";
import { Logout } from "../../components/auth/Logout";
import DeleteTraineeModal from "../../components/trainer/trainees/DeleteTraineeModal";
import ViewPerformanceModal from "../../components/trainer/trainees/ViewPerformanceModal";

const TrainerTraineesPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  //filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [sortTerm, setSortTerm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trainees, setTrainees] = useState([]);



  const filteredTrainees = trainees
    .filter(
      (trainee) =>
        trainee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.middle_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trainee.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((trainee) => {
      if (!filterTerm) return true;
      return trainee.status === filterTerm; 
    })
    .sort((a, b) => {
      if (sortTerm === "az") {
        return a.first_name.localeCompare(b.first_name);
      }
      if (sortTerm === "za") {
        return b.first_name.localeCompare(a.first_name);
      }
      if (sortTerm === "recent") {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return 0;
    });

  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openPerformanceModal, setOpenPerformanceModal] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState(false);

  /**
   * Modal and function that connects to api for approval of trainees
   */
  const handleOpenApprove = (trainee) => {
    setSelectedTrainee(trainee);
    setOpenApproveModal(true);
  };

  
  /**
   * @APPROVE_TRAINEES
   * @param {*} id 
   * connects to backend api
   */
  const handleApproveTrainee = async (id) => {
    try {
      const response = await trainerService.approveTrainee(id);

      // If backend returns the updated trainee
      const updatedTrainee = response.data;

      setTrainees((prev) =>
        prev.map((trainee) =>
          trainee.id === id ? { ...trainee, ...updatedTrainee } : trainee
        )
      );

      setOpenApproveModal(false);
    } catch (error) {
      console.error("Error approving trainee:", error);
    }
  };


  /**
   * @FUNCTIONS_AND_MODAL_FOR_DELETE_FUNCTIONALITY
   */

  const handleOpenDelete = (trainee) => {
    setSelectedTrainee(trainee);
    setOpenDeleteModal(true);
  }


  /**
   * @DELETE FUNCTIONALITY CONNECTS TO BACKEND API
   * @param {*} id 
   */
  const handleDeleteTrainee = async (id) => {
    try {

      const response = await trainerService.deleteTrainee(id);
      console.log(response);
      setTrainees(trainees.filter((trainee) => trainee.id != id));
      
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /** 
   * @FUNCTIONS_AND_MODAL_FOR_VIEW_PERFORMANCE_FUNCTIONALITY
  */
 const handleOpenPerformance = async (trainee) => {
  setSelectedTrainee(trainee);
  setOpenPerformanceModal(true);
 }
  
  /**
   * @Fetch trainees from backend api
   */
  const handleFetchTrainees = async () => {
    setLoading(true);
    try {
      const response = await trainerService.getTrainees();
      setTrainees(response.data);
      console.log(response.data);
    } catch (error) {
      setError(error.message || "An error occured while fetching trainees");
    } finally {
      setLoading(false);
    }
  };

  const getTitleWord = (filteredTrainees) => {
    const count = filteredTrainees.length;
    if (count === 1) {
      return "Trainee";
    } else if (count > 1) {
      return "Trainees";
    } else {
      return "Trainee";
    }
  };

  useEffect(() => {
    handleFetchTrainees();
  }, []);

  if (loading) return <LoadingScreen message={"Loading trainees"} />;
  if (error) return <ErrorPage />;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SidebarTrainer mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main className="flex-1 min-h-screen flex flex-col overflow-y-auto">
        {/* Header */}

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
              <h1 className="text-2xl font-bold text-blue-700">Trainees</h1>
              <p>Manage and track your trainees here.</p>
            </section>
          </div>
          <Logout />
        </header>

        {/**Filters */}
        <div className="sm:p-8 p-4 flex-1 w-full">
          <section className="mb-4">
            {/* Wrapper for search + dropdowns */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              {/* Search input */}
              <input
                type="text"
                placeholder="Search trainee..."
                className="border-2 border-gray-500 py-2 pl-4 pr-2 rounded-lg w-full active:ring-2 active:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Dropdowns wrapper */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                {/* Filter by status */}
                <select
                  name="category"
                  id="category"
                  className="w-full sm:w-auto border-2 border-gray-500 py-2 pl-4 pr-2 rounded-lg active:ring-2 active:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={filterTerm}
                  onChange={(e) => setFilterTerm(e.target.value)}
                >
                  <option value="">Trainee Status</option>
                  <option value="verified">Active</option>
                  <option value="pending">Pending</option>
                </select>

                {/* Sorting */}
                <select
                  name="sort"
                  id="sort"
                  className="w-full sm:w-auto border-2 border-gray-500 py-2 pl-4 pr-2 rounded-lg active:ring-2 active:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={sortTerm}
                  onChange={(e) => setSortTerm(e.target.value)}
                >
                  <option value="">Sort</option>
                  <option value="az">Name A-Z</option>
                  <option value="za">Name Z-A</option>
                  <option value="recent">Most Recent</option>
                </select>
              </div>
            </div>
          </section>

          {/**List section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-bold text-blue-700">
                {getTitleWord(filteredTrainees)}
              </h2>
              <div className="bg-blue-600 flex items-center justify-center h-8 w-8 rounded-full">
                <p className="text-white">{filteredTrainees?.length || 0}</p>
              </div>
            </div>
            <div className="space-y-4">
              {filteredTrainees.length === 0 ? (
                <div className=" flex items-center justify-center flex-col gap-2 bg-white py-12 rounded-lg shadow">
                  <UserX className="w-12 h-12 inline-block mr-2 text-blue-800" />
                  <h2 className="text-xl text-blue-600">No trainees found.</h2>
                </div>
              ) : (
                <div className="sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 grid gap-4">
                  {filteredTrainees.map((trainee, idx) => (
                    <TraineeCard
                      key={`trainee-${idx}`}
                      trainee={trainee}
                      onAccept={handleOpenApprove}
                      onDelete={handleOpenDelete}
                      onView={handleOpenPerformance}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <ApproveTraineeModal
        isOpen={openApproveModal}
        onClose={() => setOpenApproveModal(false)}
        onConfirm={handleApproveTrainee}
        trainee={selectedTrainee}
      />

      <DeleteTraineeModal 
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onDelete={handleDeleteTrainee}
        trainee={selectedTrainee}
      />

      <ViewPerformanceModal 
        isOpen={openPerformanceModal}
        onClose={() => setOpenPerformanceModal(false)}
        trainee={selectedTrainee}
      />
    </div>
  );
};

export default TrainerTraineesPage;

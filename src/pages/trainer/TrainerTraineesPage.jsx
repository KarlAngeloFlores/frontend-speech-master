import { useEffect, useState } from "react";
import SidebarTrainer from "../../components/SidebarTrainer";
import { Menu, UserX } from "lucide-react";
import LoadingScreen from "../../components/LoadingScreen";
import ErrorPage from "../ErrorPage";
import trainerService from "../../services/trainer.service";
import TraineeCard from "../../components/trainer/TraineeCard";
import ApproveTraineeModal from "../../components/trainer/ApproveTraineeModal";
import { Logout } from "../../components/auth/Logout";

const TrainerTraineesPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [trainees, setTrainees] = useState([]);

  const filteredTrainees = trainees.filter(
    (trainee) =>
      trainee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.middle_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [selectedTrainee, setSelectedTrainee] = useState(false);

  /**
   * Modal and function that connects to api for approval of trainees
   */
  const handleOpenApprove = (trainee) => {
    setSelectedTrainee(trainee);
    setOpenApproveModal(true);
  };

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
   * Fetch trainees from backend api
   */
  const handleFetchTrainees = async () => {
    setLoading(true);
    try {
      const response = await trainerService.getTrainees();
      setTrainees(response.data);
    } catch (error) {
      setError(error.message || "An error occured while fetching trainees");
    } finally {
      setLoading(false);
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
        <div className="px-8 py-6 flex-1 w-full">
          <section className="mb-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search trainee..."
                className="border-2 border-gray-500 py-2 pl-4 pr-2 rounded-lg w-full active:ring-2 active:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <select
                name="category"
                id="category"
                className="border-2 border-gray-500 py-2 pl-4 pr-2 rounded-lg active:ring-2 active:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">All Categories</option>
                <option value="category1">Category 1</option>
                <option value="category2">Category 2</option>
                <option value="category3">Category 3</option>
              </select>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-blue-700 mb-4">{filteredTrainees.length === 1 ? 'Trainee' : 'Trainees'}</h2>
            <div className="space-y-4">
              {filteredTrainees.length === 0 ? (
                <div className=" flex items-center justify-center flex-col gap-2 bg-white py-12 rounded-lg shadow">
                  <UserX className="w-12 h-12 inline-block mr-2 text-blue-800" />
                  <h2 className="text-xl text-blue-600">No trainees found.</h2>
                </div>
              ) : (
                <div className="sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 grid gap-4">
                  {filteredTrainees.map((trainee, idx) => (
                    <TraineeCard key={`trainee-${idx}`} trainee={trainee} onAccept={handleOpenApprove}/>
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
    </div>
  );
};

export default TrainerTraineesPage;

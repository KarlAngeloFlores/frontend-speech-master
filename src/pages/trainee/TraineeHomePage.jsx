import { useEffect, useState } from "react";
import SidebarTrainee from "../../components/SidebarTrainee";
import { Menu, NotebookPen, Book, CheckCircle } from "lucide-react";
import LoadingScreen from "../../components/LoadingScreen";
import NotAnsweredQuizCard from "../../components/trainee/quiz/NotAnsweredQuizCard";
import ErrorPage from "../ErrorPage";
import { Logout } from "../../components/auth/Logout";
import quizTraineeService from "../../services/quizTrainee.service";
import traineeService from "../../services/trainee.service";
import "../../styles/animations.css";

const TraineeHomePage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
    const [stats, setStats] = useState({
    modulesCreated: 0,
    availableQuizzes: 0,
    completedQuizzes: 0,
  });

  //implement logic if data available
  const filteredQuizzes = quizzes;

  /**
   * @FETCH_QUIZZES connecting to backend api
   */
  const handleFetchQuizzes = async () => {
    setLoading(true);
    try {
      
      const responseStats = await traineeService.getHome();
      const response = await quizTraineeService.getQuizzes();
      console.log(response);
      setStats(responseStats)
      setQuizzes(response.data);

    } catch (error) {
      setError(error.message || "An error occured. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchQuizzes();
  }, []);

  if (error) return <ErrorPage />;
  if (loading) return <LoadingScreen message={"Loading Quizzes...."} />;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <SidebarTrainee mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/**main-content */}
      <main className="flex-1 min-h-screen flex flex-col overflow-y-auto">
        {/**header */}
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
            <h1 className="text-2xl font-bold text-blue-700">Quizzes Page</h1>
            <p>See the available set of Quizzes</p>
          </section>
          </div>

          <Logout />
        </header>

        {/**content */}
        <div className="sm:p-8 p-4 flex-1 w-full">

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4 w-full">

              <div className="bg-white shadow-md rounded-md p-6 flex justify-between items-center gap-2 relative border-l-4 border-l-blue-600 modal-animation">
                
                <div>
                <p className="text-gray-500 font-medium text-sm">
                  Available Quizzes
                </p>
                <p className="text-2xl text-gray-900 font-bold">
                  {stats.availableQuizzes}
                </p>

                </div>

                <NotebookPen className="text-blue-600 h-8 w-8" />
              </div>

              <div className="bg-white shadow-md rounded-md p-6 flex items-center justify-between gap-2 relative border-l-4 border-l-green-600 modal-animation">
                <div>
                  <p className="text-gray-500 font-medium text-sm">
                    Completed Quizzes
                  </p>
                  <p className="text-2xl text-gray-900 font-bold">
                    {stats.completedQuizzes}
                  </p>
                  
                </div>
                <CheckCircle className="text-green-600 h-8 w-8" />
              </div>

              <div className="bg-white shadow-md rounded-md p-6 flex items-center justify-between gap-2 relative border-l-4 border-l-yellow-500 modal-animation">
                <div>
                <p className="text-gray-500 font-medium text-sm">
                  Total Modules
                </p>
                <p className="text-2xl text-gray-900 font-bold">
                  {stats.modulesCreated}
                </p>

              </div>
                <Book className="text-yellow-500 h-8 w-8" />
              </div>
            </div>

          <h2 className="text-xl font-bold text-blue-700 mb-4">Available Quizzes</h2>
          {filteredQuizzes.length === 0 ? (
            <>
              <div className=" flex items-center justify-center flex-col gap-2 bg-white py-12 rounded-lg shadow-md modal-animation">
                <NotebookPen className="w-12 h-12 inline-block mr-2 text-blue-800" />
                <h2 className="text-xl text-blue-600">No Quizzes found.</h2>
              </div>
            </>
          ) : (
            <>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
            {filteredQuizzes.map((quiz, idx) => (
              <NotAnsweredQuizCard key={`not-answered-${idx}`} quiz={quiz}/>
            ))}
            </div>
            </>
            
          )}
        </div>
      </main>
    </div>
  );
};

export default TraineeHomePage;

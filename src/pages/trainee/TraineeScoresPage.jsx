import { useEffect, useState } from "react";
import SidebarTrainee from "../../components/SidebarTrainee";
import { Menu, NotebookPen } from "lucide-react";
import LoadingScreen from "../../components/LoadingScreen";
import ErrorPage from "../ErrorPage";
import AnsweredQuizCard from "../../components/trainee/quiz/AnsweredQuizCard";
import { Logout } from "../../components/auth/Logout";
import quizTraineeService from "../../services/quizTrainee.service"

const TraineeScoresPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [quizzes, setQuizzes] = useState([]);

  //implement logic if data is available
  const filteredQuizzes = quizzes;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * @FETCH_QUIZZES_SCORES
   */
  const handleFetchQuizScores = async () => {
    setLoading(true);
    try {

      const response = await quizTraineeService.getAnsweredQuizzes();
      console.log(response);
      setQuizzes(response.data);

    } catch (error) {
      setError(error.message || "An error occured. Try again later");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchQuizScores();
  }, []);

  if (loading) return <LoadingScreen message={"Loading Quizzes Scores...."} />;
  if (error) return <ErrorPage />;

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
            <h1 className="text-2xl font-bold text-blue-700">Scores</h1>
            {/* <p>See quizzes results and scores</p> */}
          </section>
          </div>
          <Logout />
        </header>

        {/**content */}
        <div className="sm:p-8 p-4 flex-1 w-full">
          <h2 className="text-xl font-bold text-blue-700 mb-4">Quiz Results</h2>
          {filteredQuizzes.length === 0 ? (
            <>
              <div className=" flex items-center justify-center flex-col gap-2 bg-white py-12 rounded-lg shadow">
                <NotebookPen className="w-12 h-12 inline-block mr-2 text-blue-800" />
                <h2 className="text-xl text-blue-600">No Quizzes found.</h2>
              </div>
            </>
          ) : (
            <>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
              {filteredQuizzes.map((quiz, idx) => (
                <AnsweredQuizCard key={`answered-quiz-${idx}`} quiz={quiz}/>
              ))}
            </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default TraineeScoresPage;

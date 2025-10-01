import React, { useEffect, useState } from "react";
import SidebarTrainer from "../../components/SidebarTrainer";
import { Menu, Plus, NotebookPen, } from "lucide-react";
import LoadingPage from "../../components/LoadingScreen";
import ErrorPage from "../ErrorPage";
import quizTrainerService from "../../services/quizTrainer.service";
import { Logout } from "../../components/auth/Logout";

import QuizCard from "../../components/trainer/quiz/QuizCard";
import DeleteQuizModal from "../../components/trainer/quiz/DeleteQuizModal";
import CreateQuizModal from "../../components/trainer/quiz/CreateQuizModal";
import QuizResultModal from "../../components/trainer/quiz/QuizResultModal";

const TrainerQuizzesPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  /**
   * @modals
   */
  const [createOpenModal, setCreateOpenModal] = useState(false);
  const [deleteOpenModal, setDeleteOpenModal] = useState(false);
  const [resultOpenModal, setResultOpenModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  const [quizzes, setQuizzes] = useState([]);


  /**
   * Create quiz connects to backend api
   */
  const handleCreateQuiz = async (type, title, total_points, timer_seconds, questions) => {
    try {
      const newQuiz = await quizTrainerService.createQuiz(type, title, total_points, timer_seconds, questions);
      setQuizzes((prev) => [...prev, newQuiz.data]);
      setCreateOpenModal(false);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * Fetch quizzes from the backend API
   */
  const handleFetchQuizzes = async () => {
    setLoading(true);
    try {
      
      const response = await quizTrainerService.getQuizzes();
      setQuizzes(response.quizzes);
      console.log(response);

    } catch (error) {
      setError(error.message || "An error occurred while fetching quizzes");
    } finally {
      setLoading(false);
    }
  }

  /**
   * delete quiz connects to backend api
   */
  const handleOpenDelete = (quiz) => {
    setSelectedQuiz(quiz);
    setDeleteOpenModal(true);
  } 

  const handleOpenResult = (quiz) => {
    setResultOpenModal(true);
    setSelectedQuiz(quiz); 
  }
  

  const handleDeleteQuiz = async (quiz_id) => {
    try {
      const response = await quizTrainerService.deleteQuiz(quiz_id);
      setQuizzes(quizzes.filter(q => q.id !== quiz_id));
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    handleFetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingPage message={"Loading quizzes...."} />;
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
            <h1 className="text-2xl font-bold text-blue-700">Quizzes</h1>
            <p>Manage your quizzes here.</p>
          </section>
          </div>
          <Logout />
        </header>

        {/**content */}
        <div className="px-8 py-6 flex-1 w-full">
          {/**Filters*/}
          <section className="mb-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search quizzes..."
                className="border-2 border-gray-500 py-2 pl-4 pr-2 rounded-lg w-full active:ring-2 active:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}      
              />

              <select name="category" id="category" className="border-2 border-gray-500 py-2 pl-4 pr-2 rounded-lg active:ring-2 active:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                <option value="">All Categories</option>
                <option value="category1">Category 1</option>
                <option value="category2">Category 2</option>
                <option value="category3">Category 3</option>
              </select>

              <button onClick={() => setCreateOpenModal(true)} className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition ease-in-out duration-150 cursor-pointer text-white px-4 py-2 rounded-lg text-nowrap flex items-center font-semibold text-lg">
                <Plus className="w-4 h-4 inline-block mr-1" />
                Create quiz
              </button>
            </div>
          </section>

          {/**Quiz List */}
          <section>
            <h2 className="text-xl font-bold text-blue-700 mb-4">Quizzes</h2>
            <div className="space-y-4">
              {filteredQuizzes.length === 0 ? (
                <div className=" flex items-center justify-center flex-col gap-2 bg-white py-12 rounded-lg shadow">
                  <NotebookPen className="w-12 h-12 inline-block mr-2 text-blue-800" />
                  <h2 className="text-xl text-blue-600">No quizzes found.</h2>
                </div>
              ) : (
                <div className="sm:grid-cols-2 grid-cols-1 grid gap-4">
                {filteredQuizzes.map((quiz, idx) => (
                  <QuizCard 
                  key={`quiz-${idx}`}
                  quiz={quiz}
                  openDeleteModal={handleOpenDelete}
                  handleOpenResult={handleOpenResult}
                  />
                ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <CreateQuizModal 
      isOpen={createOpenModal} 
      onClose={() => setCreateOpenModal(false)}  
      onCreate={handleCreateQuiz}
    
      />

      <DeleteQuizModal 
        isOpen={deleteOpenModal}
        onClose={() => setDeleteOpenModal(false)}
        onDelete={handleDeleteQuiz}
        quiz={selectedQuiz}
      />

      <QuizResultModal 
      isOpen={resultOpenModal}
      onClose={() => setResultOpenModal(false)}
      quiz={selectedQuiz}
      />
    </div>
  );
};

export default TrainerQuizzesPage;

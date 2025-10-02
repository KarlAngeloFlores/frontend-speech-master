import { BarChart3, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../../styles/animations.css"

const NotAnsweredQuizCard = ({quiz}) => {

    const navigate = useNavigate();
    
    const handleStartQuiz = () => {
        if(quiz.type === "pronounce_it_fast") {
        navigate(`/trainee/pronounce-it-fast/${quiz.id}`);
      } else if(quiz.type === "shoot_the_word") {
        navigate(`/trainee/shoot-the-word/${quiz.id}`);
      }
    }

      const getQuizBadge = (quiz) => {
    if(quiz.type === 'shoot_the_word') {
      return 'Shoot the Word'
    } else if (quiz.type === 'pronounce_it_fast') {
      return `Pronounce it Fast`
    };
  }

  return (
     <div
        className="bg-white rounded-lg shadow-md p-6 hover:shadow-md transition-shadow modal-animation"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {quiz.title}
                    </h3>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {getQuizBadge(quiz)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={16} />
                      <span>{quiz.total_points} points</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>
                      {new Date(quiz.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>
                      {quiz.timer_seconds}s
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleStartQuiz}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 cursor-pointer"
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
  )
}

export default NotAnsweredQuizCard

import {
  BarChart as BarChartIcon,
  Eye,
  BarChart3,
  Calendar,
  Trash
} from "lucide-react";
// import SweetAlert from '../util/SweetAlert';

const QuizCard = ({quiz, handleShowQuizResult, openDeleteModal}) => {

  const getQuizBadge = (quiz) => {
    if(quiz.type === 'shoot_the_word') {
      return 'Shoot the Word'
    } else if (quiz.type === 'pronounce_it_fast') {
      return `Pronounce it Fast`
    };
  }

  const getQuizType = (quiz) => {
    if(quiz.type === 'shoot_the_word') {
      return 'Collective Points'
    } else if (quiz.type === 'pronounce_it_fast') {
      return `Total Points: ${quiz.total_points}`
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{quiz.title}</h3>
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {getQuizBadge(quiz)}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => openDeleteModal(quiz)} className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded">
            <Trash size={16} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">

        
        <div className="flex items-center gap-2">
          <BarChart3 size={16} />
          {getQuizType(quiz)}
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>{new Date(quiz.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => handleShowQuizResult(quiz.id)} className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 cursor-pointer">
          View Results
        </button>
      </div>
    </div>
  )
}

export default QuizCard
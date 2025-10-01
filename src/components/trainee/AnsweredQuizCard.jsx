import { BarChart3, Calendar, CheckCircle } from "lucide-react";
import "../../styles/animations.css";

const AnsweredQuizCard = ({ quiz }) => {

const formatDateOnly = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

  const formatTime = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

  const getScore = () => {
    switch (quiz.type) {
      case "Shoot the Word":
        return `Collected points: ${quiz.score}`;
      case "Pronounce it Fast":
        return `Score: ${quiz.score} / ${quiz.total_points}`;
      default:
        return `Score: ${quiz.score}`;
    }
  };

  const DetailRow = ({ icon: Icon, label }) => (
    <div className="flex items-center gap-2">
      <Icon size={16} />
      <span>{label}</span>
    </div>
  );

  return (
    <div className="bg-green-50 rounded-lg shadow-md p-6 transition-shadow hover:shadow-lg modal-animation">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            {quiz.title}
          </h3>
          <span className="inline-block px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full">
            {quiz.type}
          </span>
        </div>

        <div>
        <CheckCircle className="text-green-600" size={20} />
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
        <DetailRow icon={BarChart3} label={getScore()} />
        <DetailRow icon={Calendar} label={`Completed: ${formatDateOnly(quiz.completed_at)}`} />
        <DetailRow icon={Calendar} label={`Started: ${formatTime(quiz.started_at)}`} />
        <DetailRow icon={Calendar} label={`Finished: ${formatTime(quiz.completed_at)}`} />
      </div>
    </div>
  );
};

export default AnsweredQuizCard;

import { BookOpen, Calendar, ChevronRight } from 'lucide-react'
const ModuleCard = ({ module, handleOpenModule }) => {

      /**
   * @FORMAT_DATE
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
  key={module.id}
  onClick={() => handleOpenModule(module)}
  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-300 transition cursor-pointer group"
>
  <div className="flex items-start justify-between">
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition break-words">
          {module.title}
        </h3>
      </div>
      {module.description && (
        <p className="text-gray-600 mb-3 break-words whitespace-pre-line line-clamp-2">
          {module.description}
        </p>
      )}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Calendar className="w-4 h-4 flex-shrink-0" />
        <span className="truncate">Posted on {formatDate(module.created_at)}</span>
      </div>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition flex-shrink-0" />
  </div>
</div>
  )
}

export default ModuleCard
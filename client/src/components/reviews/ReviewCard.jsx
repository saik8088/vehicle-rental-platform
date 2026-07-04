import { HiStar } from 'react-icons/hi2';

const ReviewCard = ({ review }) => {
  const { name, role, content, rating, date } = review;

  return (
    <div className="card p-6 flex flex-col h-full bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Stars */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <HiStar
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-warning-500' : 'text-surface-200'}`}
          />
        ))}
      </div>

      {/* Content */}
      <p className="text-body text-surface-700 italic flex-grow mb-6">
        "{content}"
      </p>

      {/* Author info */}
      <div className="flex items-center justify-between border-t border-surface-100 pt-4 mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <span className="text-body font-semibold text-primary-700">
              {name.charAt(0)}
            </span>
          </div>
          <div>
            <h4 className="text-body-sm font-semibold text-surface-900">{name}</h4>
            {role && <p className="text-caption text-surface-500">{role}</p>}
          </div>
        </div>
        {date && <span className="text-caption text-surface-400">{date}</span>}
      </div>
    </div>
  );
};

export default ReviewCard;

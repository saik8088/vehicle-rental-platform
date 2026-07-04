import { Link } from 'react-router-dom';
import { HiStar, HiMapPin } from 'react-icons/hi2';
import { Badge } from '../common';

const VehicleCard = ({ vehicle }) => {
  const {
    _id,
    name,
    type,
    fuelType,
    transmission,
    seats,
    pricePerDay,
    location,
    images,
    averageRating,
    reviewCount,
    isAvailable,
  } = vehicle;

  const defaultImage = images?.[0]?.url || 'https://via.placeholder.com/600x400?text=No+Image';

  return (
    <Link 
      to={`/vehicles/${_id}`}
      className="card overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 block"
    >
      {/* Image Container */}
      <div className="relative h-36 sm:h-48 overflow-hidden bg-surface-100">
        <img
          src={defaultImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {!isAvailable && (
            <Badge variant="error" size="sm">Currently Unavailable</Badge>
          )}
          <Badge variant="primary" size="sm" className="capitalize shadow-sm">
            {type}
          </Badge>
        </div>
        
        {/* Rating Overlay */}
        {averageRating > 0 && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
            <HiStar className="w-3.5 h-3.5 text-warning-500" />
            <span className="text-caption font-bold text-surface-900">{averageRating}</span>
            <span className="text-[0.625rem] text-surface-500">({reviewCount})</span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-3 sm:p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="text-body font-semibold sm:text-h6 text-surface-900 line-clamp-1">{name}</h3>
        </div>
        
        <div className="flex items-center gap-1 text-[0.6875rem] sm:text-caption text-surface-500 mb-3 sm:mb-4">
          <HiMapPin className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
          <span>{location}</span>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-y-1.5 sm:gap-y-2 gap-x-2 sm:gap-x-4 mb-3 sm:mb-5 flex-grow">
          <div className="flex items-center gap-1 sm:gap-2 text-[0.6875rem] sm:text-body-sm text-surface-600">
            <span className="w-4 sm:w-5 text-center">⚙️</span>
            <span className="capitalize line-clamp-1">{transmission}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-[0.6875rem] sm:text-body-sm text-surface-600">
            <span className="w-4 sm:w-5 text-center">⛽</span>
            <span className="capitalize line-clamp-1">{fuelType}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-[0.6875rem] sm:text-body-sm text-surface-600">
            <span className="w-4 sm:w-5 text-center">💺</span>
            <span className="line-clamp-1">{seats} Seats</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 sm:pt-4 border-t border-surface-100 mt-auto">
          <span className="text-body font-bold sm:text-h5 text-primary-600">₹{pricePerDay.toLocaleString('en-IN')}</span>
          <span className="text-[0.6875rem] sm:text-caption text-surface-500"> / day</span>
        </div>
      </div>
    </Link>
  );
};

export default VehicleCard;

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  HiMapPin, 
  HiStar, 
  HiShieldCheck, 
  HiChevronLeft,
  HiCheckCircle,
  HiUserGroup
} from 'react-icons/hi2';
import { Button, Input, Badge, Skeleton, EmptyState } from '../../components/common';
import { ReviewCard } from '../../components/reviews';

const tempReviews = [
  { id: 1, name: 'Rahul Sharma', role: 'Customer', content: 'Booked a Honda City for my weekend getaway. The process was incredibly smooth and the car was in perfect condition.', rating: 5, avatar: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=random' },
  { id: 2, name: 'Amit Kumar', role: 'Customer', content: 'The best car rental experience I\'ve had. Transparent pricing and the host was very accommodating.', rating: 4, avatar: 'https://ui-avatars.com/api/?name=Amit+Kumar&background=random' }
];
import { getVehicle } from '../../features/vehicles/vehicleSlice';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeImage, setActiveImage] = useState(0);

  const { vehicle, isLoading } = useSelector((state) => state.vehicle);

  useEffect(() => {
    dispatch(getVehicle(id));
  }, [dispatch, id]);

  // Mock state for booking
  const [bookingDates, setBookingDates] = useState({
    startDate: '',
    endDate: '',
  });

  const reviews = tempReviews.filter(r => r.vehicle === id);

  if (isLoading) {
    return <div className="container-app py-20 text-center text-surface-500">Loading vehicle details...</div>;
  }

  if (!vehicle) {
    return (
      <div className="container-app py-20">
        <EmptyState 
          title="Vehicle Not Found" 
          message="The vehicle you are looking for does not exist or has been removed."
          action={<Button onClick={() => navigate('/vehicles')}>Back to Vehicles</Button>}
        />
      </div>
    );
  }

  const handleBooking = (e) => {
    e.preventDefault();
    // Proceed to login or checkout in Phase 3/5
    if (!bookingDates.startDate || !bookingDates.endDate) return;
    alert(`Proceeding to book ${vehicle.name} from ${bookingDates.startDate} to ${bookingDates.endDate}`);
  };

  return (
    <div className="bg-surface-50 min-h-screen pb-20">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-surface-100 py-4 sticky top-[4.5rem] z-30">
        <div className="container-app">
          <Link 
            to="/vehicles"
            className="inline-flex items-center gap-2 text-body-sm font-medium text-surface-500 hover:text-primary-600 transition-colors"
          >
            <HiChevronLeft className="w-4 h-4" />
            Back to Search
          </Link>
        </div>
      </div>

      <div className="container-app py-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="primary" className="capitalize">{vehicle.type}</Badge>
              {vehicle.isAvailable ? (
                <Badge variant="success">Available Now</Badge>
              ) : (
                <Badge variant="error">Currently Booked</Badge>
              )}
            </div>
            <h1 className="text-h2 text-surface-900 mb-2">{vehicle.name}</h1>
            <div className="flex items-center gap-4 text-body-sm text-surface-500">
              <span className="flex items-center gap-1">
                <HiMapPin className="w-4 h-4 text-surface-400" />
                {vehicle.location}
              </span>
              <span className="flex items-center gap-1">
                <HiStar className="w-4 h-4 text-warning-500" />
                <span className="font-semibold text-surface-900">{vehicle.averageRating}</span>
                ({vehicle.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-surface-100">
                <img 
                  src={vehicle.images[activeImage]?.url || 'https://via.placeholder.com/1200x600?text=No+Image'} 
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {vehicle.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                  {vehicle.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        activeImage === index ? 'border-primary-500' : 'border-transparent hover:opacity-80'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Overview */}
            <div className="card p-6 sm:p-8">
              <h2 className="text-h4 text-surface-900 mb-4">Overview</h2>
              <p className="text-body text-surface-600 leading-relaxed mb-8">
                {vehicle.description}
              </p>

              <h3 className="text-h5 text-surface-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-caption text-surface-400 uppercase tracking-wider">Transmission</span>
                  <span className="text-body font-medium text-surface-900 capitalize">{vehicle.transmission}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-caption text-surface-400 uppercase tracking-wider">Fuel Type</span>
                  <span className="text-body font-medium text-surface-900 capitalize">{vehicle.fuelType}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-caption text-surface-400 uppercase tracking-wider">Seats</span>
                  <span className="text-body font-medium text-surface-900">{vehicle.seats} Persons</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-caption text-surface-400 uppercase tracking-wider">Brand</span>
                  <span className="text-body font-medium text-surface-900">{vehicle.brand}</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="card p-6 sm:p-8">
              <h2 className="text-h4 text-surface-900 mb-6">Key Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vehicle.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <HiCheckCircle className="w-5 h-5 text-primary-500" />
                    <span className="text-body text-surface-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Provider Info */}
            <div className="card p-6 sm:p-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
                  <HiUserGroup className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-caption text-surface-500 uppercase tracking-wider mb-1">Provided by</p>
                  <h3 className="text-h5 text-surface-900">{vehicle.provider.name}</h3>
                </div>
              </div>
              <HiShieldCheck className="w-8 h-8 text-success-500" title="Verified Provider" />
            </div>

            {/* Reviews */}
            <div className="card p-6 sm:p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-h4 text-surface-900">Reviews</h2>
                <div className="flex items-center gap-2">
                  <HiStar className="w-5 h-5 text-warning-500" />
                  <span className="text-h5 text-surface-900">{vehicle.averageRating}</span>
                  <span className="text-body text-surface-500">({vehicle.reviewCount})</span>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review._id} className="border-b border-surface-100 last:border-0 pb-6 last:pb-0">
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <HiStar
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-warning-500' : 'text-surface-200'}`}
                          />
                        ))}
                      </div>
                      <p className="text-body text-surface-700 mb-3">{review.comment}</p>
                      <div className="flex items-center gap-2 text-caption text-surface-500">
                        <span className="font-medium text-surface-900">{review.customer.name}</span>
                        <span>•</span>
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-body text-surface-500">No reviews yet for this vehicle.</p>
              )}
            </div>

          </div>

          {/* Booking Widget (Right Sidebar) */}
          <div className="lg:col-span-1">
            <div className="sticky top-[7rem]">
              <div className="card p-6">
                <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-surface-100">
                  <span className="text-h3 text-primary-600">₹{vehicle.pricePerDay.toLocaleString('en-IN')}</span>
                  <span className="text-body text-surface-500">/ day</span>
                </div>

                <form onSubmit={handleBooking} className="space-y-4">
                  <Input 
                    type="date"
                    label="Pickup Date"
                    name="startDate"
                    required
                    value={bookingDates.startDate}
                    onChange={(e) => setBookingDates({...bookingDates, startDate: e.target.value})}
                  />
                  <Input 
                    type="date"
                    label="Drop-off Date"
                    name="endDate"
                    required
                    value={bookingDates.endDate}
                    onChange={(e) => setBookingDates({...bookingDates, endDate: e.target.value})}
                  />

                  {bookingDates.startDate && bookingDates.endDate && (
                    <div className="bg-surface-50 p-4 rounded-xl mt-6 space-y-3">
                      <div className="flex justify-between text-body-sm text-surface-600">
                        <span>₹{vehicle.pricePerDay.toLocaleString('en-IN')} x 1 days</span>
                        <span>₹{vehicle.pricePerDay.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-body-sm text-surface-600">
                        <span>Service Fee</span>
                        <span>₹250</span>
                      </div>
                      <div className="border-t border-surface-200 pt-3 flex justify-between font-bold text-surface-900">
                        <span>Total Estimate</span>
                        <span>₹{(vehicle.pricePerDay + 250).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit"
                    size="lg" 
                    fullWidth 
                    className="mt-6"
                    disabled={!vehicle.isAvailable}
                  >
                    {vehicle.isAvailable ? 'Proceed to Book' : 'Not Available'}
                  </Button>

                  <p className="text-center text-caption text-surface-500 mt-4">
                    You won't be charged yet
                  </p>
                </form>
              </div>

              <div className="mt-6 card p-6 bg-primary-50 border-none">
                <div className="flex items-start gap-4">
                  <HiShieldCheck className="w-8 h-8 text-primary-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-body font-semibold text-primary-900 mb-1">RideEasy Guarantee</h4>
                    <p className="text-caption text-primary-700">
                      Your money is protected. We hold the payment until you receive the vehicle.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;

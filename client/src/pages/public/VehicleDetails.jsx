import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { 
  HiMapPin, 
  HiShieldCheck, 
  HiChevronLeft,
  HiCheckCircle,
  HiUserGroup,
  HiXMark,
  HiChevronRight
} from 'react-icons/hi2';
import { Button, Input, Badge, EmptyState } from '../../components/common';
import { getVehicle } from '../../features/vehicles/vehicleSlice';
import { createBooking } from '../../features/bookings/bookingSlice';
import { getSettings } from '../../features/settings/settingsSlice';
import api from '../../utils/api';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [activeImage, setActiveImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // For full screen image viewer

  const { vehicle, isLoading } = useSelector((state) => state.vehicle);
  const { user } = useSelector((state) => state.auth);
  const { settings } = useSelector((state) => state.settings);

  useEffect(() => {
    dispatch(getVehicle(id));
    if (!settings) {
      dispatch(getSettings());
    }
  }, [dispatch, id, settings]);

  const [bookingDates, setBookingDates] = useState({
    startDate: '',
    endDate: '',
  });

  const [availabilityStatus, setAvailabilityStatus] = useState(null); // null | 'checking' | 'available' | 'unavailable'
  const [availabilityMessage, setAvailabilityMessage] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // Calculate duration and price based on hours/days
  const calculateDurationAndPrice = () => {
    if (!bookingDates.startDate || !bookingDates.endDate || !vehicle) {
      return { totalHours: 0, days: 0, hours: 0, subtotal: 0 };
    }
    const start = new Date(bookingDates.startDate);
    const end = new Date(bookingDates.endDate);
    const diffInMs = end - start;
    
    if (diffInMs <= 0) {
      return { totalHours: 0, days: 0, hours: 0, subtotal: 0 };
    }

    const totalHours = Math.ceil(diffInMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    
    let subtotal = 0;
    if (vehicle.pricePerHour && totalHours < 24) {
      subtotal = totalHours * vehicle.pricePerHour;
    } else {
      subtotal = days * vehicle.pricePerDay;
      if (hours > 0) {
        if (vehicle.pricePerHour) {
          subtotal += hours * vehicle.pricePerHour;
        } else {
          subtotal += (hours / 24) * vehicle.pricePerDay;
        }
      }
    }
    
    return { 
      totalHours, 
      days, 
      hours, 
      subtotal: Math.round(subtotal) 
    };
  };

  const { totalHours, days, hours, subtotal } = calculateDurationAndPrice();
  const feePercentage = settings?.platformFee ?? 5;
  const serviceFee = subtotal > 0 ? Math.round(subtotal * (feePercentage / 100)) : 0;
  const totalPrice = subtotal + serviceFee;

  // Check availability when dates change
  useEffect(() => {
    if (bookingDates.startDate && bookingDates.endDate && vehicle) {
      const start = new Date(bookingDates.startDate);
      const end = new Date(bookingDates.endDate);
      
      if (end <= start) {
        setAvailabilityStatus('unavailable');
        setAvailabilityMessage('Drop-off date must be after pickup date.');
        return;
      }

      setAvailabilityStatus('checking');
      api.post('/bookings/check-availability', {
        vehicleId: vehicle._id,
        startDate: new Date(bookingDates.startDate).toISOString(),
        endDate: new Date(bookingDates.endDate).toISOString(),
      })
      .then((res) => {
        if (res.data.available) {
          setAvailabilityStatus('available');
          setAvailabilityMessage('');
        } else {
          setAvailabilityStatus('unavailable');
          setAvailabilityMessage(res.data.reason || 'Vehicle is not available for these dates.');
        }
      })
      .catch(() => {
        setAvailabilityStatus(null);
      });
    } else {
      setAvailabilityStatus(null);
    }
  }, [bookingDates.startDate, bookingDates.endDate, vehicle]);

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to book a vehicle');
      navigate('/login');
      return;
    }

    if (user.role !== 'customer') {
      toast.error('Only customers can book vehicles');
      return;
    }

    if (!bookingDates.startDate || !bookingDates.endDate) {
      toast.error('Please select pickup and drop-off dates');
      return;
    }

    if (availabilityStatus !== 'available') {
      toast.error('Vehicle is not available for selected dates');
      return;
    }

    setIsBooking(true);

    try {
      // 1. Create Razorpay order
      const orderRes = await api.post('/payments/create-order', { amount: totalPrice });
      const { orderId, keyId } = orderRes.data.data;

      // 2. Load Razorpay
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Failed to load payment gateway');
        setIsBooking(false);
        return;
      }

      // 3. Open Razorpay checkout
      const options = {
        key: keyId,
        amount: totalPrice * 100,
        currency: 'INR',
        name: 'RideEasy',
        description: `Booking: ${vehicle.name}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // 4. Create booking
            const bookingRes = await dispatch(createBooking({
              vehicle: vehicle._id,
              startDate: new Date(bookingDates.startDate).toISOString(),
              endDate: new Date(bookingDates.endDate).toISOString(),
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
            })).unwrap();

            // 5. Verify payment
            await api.post('/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingId: bookingRes._id,
            });

            toast.success('Booking confirmed! Payment successful.');
            navigate('/dashboard/bookings');
          } catch (err) {
            toast.error('Booking created but payment verification failed. Contact support.');
          }
          setIsBooking(false);
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || '',
        },
        theme: {
          color: '#7c3aed',
        },
        modal: {
          ondismiss: function () {
            setIsBooking(false);
            toast.error('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to initiate payment');
      setIsBooking(false);
    }
  };

  // Image Modal Navigation
  const nextImage = (e) => {
    e.stopPropagation();
    if (vehicle?.images?.length) {
      setActiveImage((prev) => (prev + 1) % vehicle.images.length);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (vehicle?.images?.length) {
      setActiveImage((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
    }
  };

  // Get current date time for min attribute
  const getMinDateTime = () => {
    const now = new Date();
    // Adjust to local timezone for the input value
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const minStartDateTime = getMinDateTime();
  const minEndDateTime = bookingDates.startDate || minStartDateTime;

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

  return (
    <div className="bg-surface-50 min-h-screen pb-20">
      
      {/* Fullscreen Image Viewer Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <HiXMark className="w-6 h-6" />
          </button>
          
          {/* Main Image */}
          <div className="relative w-full max-w-5xl px-4 flex items-center justify-center">
            {vehicle.images?.length > 1 && (
              <button 
                onClick={prevImage}
                className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors"
              >
                <HiChevronLeft className="w-8 h-8" />
              </button>
            )}
            
            <img 
              src={vehicle.images?.[activeImage]?.url || 'https://via.placeholder.com/1200x600?text=No+Image'} 
              alt={vehicle.name}
              className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {vehicle.images?.length > 1 && (
              <button 
                onClick={nextImage}
                className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-colors"
              >
                <HiChevronRight className="w-8 h-8" />
              </button>
            )}
          </div>
          
          {/* Thumbnails */}
          {vehicle.images?.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 overflow-x-auto max-w-full px-4" onClick={(e) => e.stopPropagation()}>
              {vehicle.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImage === index ? 'border-primary-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

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
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Image Gallery */}
            <div className="space-y-4">
              <div 
                className="aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-surface-100 cursor-pointer group relative"
                onClick={() => setIsModalOpen(true)}
              >
                <img 
                  src={vehicle.images?.[activeImage]?.url || 'https://via.placeholder.com/1200x600?text=No+Image'} 
                  alt={vehicle.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-body-sm font-medium text-surface-900 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 shadow-lg">
                    Click to enlarge
                  </span>
                </div>
              </div>
              
              {vehicle.images?.length > 1 && (
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
            {vehicle.features?.length > 0 && (
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
            )}

            {/* Provider Info */}
            <div className="card p-6 sm:p-8 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center">
                  <HiUserGroup className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-caption text-surface-500 uppercase tracking-wider mb-1">Provided by</p>
                  <h3 className="text-h5 text-surface-900">{vehicle.provider?.name || 'Unknown'}</h3>
                  {vehicle.provider?.email && <p className="text-body-sm text-surface-600 mt-1">{vehicle.provider.email}</p>}
                  {vehicle.provider?.phone && <p className="text-body-sm text-surface-600">{vehicle.provider.phone}</p>}
                </div>
              </div>
              <HiShieldCheck className="w-8 h-8 text-success-500" title="Verified Provider" />
            </div>
          </div>

          {/* Booking Widget (Right Sidebar) */}
          <div className="lg:col-span-1">
            <div className="sticky top-[7rem]">
              <div className="card p-6">
                <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-surface-100">
                  <span className="text-h3 text-primary-600">₹{vehicle.pricePerDay?.toLocaleString('en-IN')}</span>
                  <span className="text-body text-surface-500">/ day</span>
                  {vehicle.pricePerHour && (
                    <span className="text-caption text-surface-400 ml-2">(₹{vehicle.pricePerHour}/hr for short trips)</span>
                  )}
                </div>

                <form onSubmit={handleBooking} className="space-y-4">
                  <Input 
                    type="datetime-local"
                    label="Pickup Date & Time"
                    name="startDate"
                    required
                    min={minStartDateTime}
                    value={bookingDates.startDate}
                    onChange={(e) => setBookingDates({...bookingDates, startDate: e.target.value})}
                  />
                  <Input 
                    type="datetime-local"
                    label="Drop-off Date & Time"
                    name="endDate"
                    required
                    min={minEndDateTime}
                    value={bookingDates.endDate}
                    onChange={(e) => setBookingDates({...bookingDates, endDate: e.target.value})}
                  />

                  {/* Availability status */}
                  {availabilityStatus === 'checking' && (
                    <p className="text-body-sm text-surface-500 text-center">Checking availability...</p>
                  )}
                  {availabilityStatus === 'available' && (
                    <p className="text-body-sm text-success-600 text-center font-medium">✓ Available for selected dates</p>
                  )}
                  {availabilityStatus === 'unavailable' && (
                    <p className="text-body-sm text-error-600 text-center font-medium">{availabilityMessage}</p>
                  )}

                  {totalHours > 0 && availabilityStatus === 'available' && (
                    <div className="bg-surface-50 p-4 rounded-xl mt-6 space-y-3">
                      <div className="flex justify-between text-body-sm text-surface-600">
                        <span>Duration</span>
                        <span>{days > 0 ? `${days} day${days > 1 ? 's' : ''}` : ''} {hours > 0 ? `${hours} hr${hours > 1 ? 's' : ''}` : ''}</span>
                      </div>
                      <div className="flex justify-between text-body-sm text-surface-600">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-body-sm text-surface-600">
                        <span>Service Fee ({feePercentage}%)</span>
                        <span>₹{serviceFee.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="border-t border-surface-200 pt-3 flex justify-between font-bold text-surface-900">
                        <span>Total</span>
                        <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit"
                    size="lg" 
                    fullWidth 
                    className="mt-6"
                    disabled={!vehicle.isAvailable || availabilityStatus !== 'available' || isBooking}
                    isLoading={isBooking}
                  >
                    {!user ? 'Login to Book' : vehicle.isAvailable ? 'Pay & Book Now' : 'Not Available'}
                  </Button>

                  <p className="text-center text-caption text-surface-500 mt-4">
                    Secure payment via Razorpay
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

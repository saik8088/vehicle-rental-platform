import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiMagnifyingGlass, HiCalendarDays, HiMapPin, HiShieldCheck, HiCreditCard, HiCheckBadge } from 'react-icons/hi2';
import { Button } from '../../components/common';
import { VehicleCard } from '../../components/vehicles';
import { getVehicles } from '../../features/vehicles/vehicleSlice';
import heroBanner from '../../assets/hero-banner.png';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { vehicles } = useSelector((state) => state.vehicle);

  useEffect(() => {
    dispatch(getVehicles());
  }, [dispatch]);

  const [searchParams, setSearchParams] = useState({
    location: '',
    startDate: '',
    endDate: '',
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams(searchParams).toString();
    navigate(`/vehicles?${query}`);
  };

  const featuredVehicles = useMemo(() => {
    if (!vehicles || vehicles.length === 0) return [];
    const shuffled = [...vehicles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [vehicles]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBanner}
            alt="Premium Vehicle Rental"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-surface-900/60 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-transparent to-transparent" />
        </div>

        <div className="container-app relative z-10 text-center">
          <h1 className="text-hero text-white mb-6 animate-fade-in drop-shadow-lg">
            Your Journey. Your Vehicle.<br />
            <span className="text-primary-400">Your Way.</span>
          </h1>
          <p className="text-body-lg text-surface-200 max-w-2xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '100ms' }}>
            Experience the freedom of the open road with India's most trusted premium vehicle rental platform. Cars, bikes, and scooters ready when you are.
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white p-3 sm:p-4 rounded-3xl shadow-elevated animate-slide-up" style={{ animationDelay: '200ms' }}>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
              {/* Location Input */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <HiMapPin className="w-5 h-5 text-surface-400" />
                </div>
                <input
                  type="text"
                  placeholder="Your location"
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-50 border border-transparent hover:border-surface-200 focus:border-primary-500 focus:bg-white rounded-2xl text-body transition-colors focus-ring"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                  required
                />
              </div>

              {/* Date Inputs Container */}
              <div className="flex-1 flex gap-3">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <HiCalendarDays className="w-5 h-5 text-surface-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-50 border border-transparent hover:border-surface-200 focus:border-primary-500 focus:bg-white rounded-2xl text-body text-surface-600 transition-colors focus-ring"
                    value={searchParams.startDate}
                    onChange={(e) => setSearchParams({ ...searchParams, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <HiCalendarDays className="w-5 h-5 text-surface-400" />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-12 pr-4 py-3.5 bg-surface-50 border border-transparent hover:border-surface-200 focus:border-primary-500 focus:bg-white rounded-2xl text-body text-surface-600 transition-colors focus-ring"
                    value={searchParams.endDate}
                    onChange={(e) => setSearchParams({ ...searchParams, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="xl"
                className="md:w-auto flex-shrink-0"
                rightIcon={<HiMagnifyingGlass className="w-5 h-5" />}
              >
                Find Vehicles
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="section bg-surface-50">
        <div className="container-app">
          <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-10">
            <div>
              <h2 className="text-h2 text-surface-900 mb-2">Featured Vehicles</h2>
              <p className="text-body text-surface-500">Discover our most popular rentals available now.</p>
            </div>
            <Button variant="ghost" onClick={() => navigate('/vehicles')}>
              View all vehicles →
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>



      {/* How it Works / Benefits */}
      <section className="section bg-surface-900 text-surface-200">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="text-h2 text-white mb-2">Why Choose RideEasy?</h2>
            <p className="text-body text-surface-400">Premium service, transparent pricing, and peace of mind.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-surface-800 rounded-2xl flex items-center justify-center mb-6">
                <HiShieldCheck className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-h4 text-white mb-3">Verified Vehicles</h3>
              <p className="text-body-sm text-surface-400 leading-relaxed">
                Every vehicle on our platform undergoes strict quality and safety checks before being listed.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-surface-800 rounded-2xl flex items-center justify-center mb-6">
                <HiCreditCard className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-h4 text-white mb-3">Transparent Pricing</h3>
              <p className="text-body-sm text-surface-400 leading-relaxed">
                No hidden fees. What you see is what you pay. Secure and seamless payment process.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-surface-800 rounded-2xl flex items-center justify-center mb-6">
                <HiCheckBadge className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-h4 text-white mb-3">Instant Booking</h3>
              <p className="text-body-sm text-surface-400 leading-relaxed">
                Book your ride instantly without waiting for approvals. Just pick, pay, and drive.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 bg-primary-600 relative overflow-hidden">
        {/* Decorative background circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary-500 opacity-50 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-primary-700 opacity-50 blur-3xl" />

        <div className="container-app relative z-10 text-center">
          <h2 className="text-h2 text-white mb-4">Ready for your next adventure?</h2>
          <p className="text-body-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Join the RideEasy community today. Rent a vehicle or list your own to start earning.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              className="!bg-white !text-primary-700 !border-white hover:!bg-surface-50 shadow-md"
              onClick={() => navigate('/vehicles')}
            >
              Explore Vehicles
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="!bg-primary-800 !text-white !border !border-primary-500 hover:!bg-primary-900 shadow-md"
              onClick={() => navigate('/become-provider')}
            >
              Become a Provider
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

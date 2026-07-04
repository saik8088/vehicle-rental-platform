import { useNavigate } from 'react-router-dom';
import { HiBanknotes, HiClock, HiShieldCheck, HiChartBar } from 'react-icons/hi2';
import { Button } from '../../components/common';
import heroBanner from '../../assets/hero-banner.png';

const BecomeProvider = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-28 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroBanner}
            alt="Provider Hero"
            className="w-full h-full object-cover filter brightness-[0.3]"
          />
        </div>
        <div className="container-app relative z-10 text-center">
          <Badge className="mb-6 bg-primary-500/20 text-primary-200 border border-primary-500/30 backdrop-blur-md">
            For Vehicle Owners
          </Badge>
          <h1 className="text-hero text-white mb-6 max-w-4xl mx-auto">
            Turn your idle vehicle into an <span className="text-primary-400">earning asset.</span>
          </h1>
          <p className="text-body-lg text-surface-300 max-w-2xl mx-auto mb-10">
            Join thousands of providers on RideEasy and start earning money by sharing your car, bike, or scooter with our verified community.
          </p>
          <Button 
            size="xl" 
            onClick={() => navigate('/register?role=provider')}
            className="shadow-xl shadow-primary-900/50"
          >
            Start Earning Today
          </Button>
        </div>
      </section>

      {/* Why Host Section */}
      <section className="container-app py-20">
        <div className="text-center mb-16">
          <h2 className="text-h2 text-surface-900 mb-4">Why host on RideEasy?</h2>
          <p className="text-body text-surface-500 max-w-2xl mx-auto">
            We handle the heavy lifting so you can focus on earning. Our platform is designed to give you maximum control with minimal effort.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card p-8">
            <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-6">
              <HiBanknotes className="w-7 h-7 text-primary-600" />
            </div>
            <h3 className="text-h5 text-surface-900 mb-3">Earn Consistently</h3>
            <p className="text-body-sm text-surface-600">
              Set your own prices and earn a reliable side income. Top providers make up to ₹50,000 per month.
            </p>
          </div>
          
          <div className="card p-8">
            <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-6">
              <HiClock className="w-7 h-7 text-primary-600" />
            </div>
            <h3 className="text-h5 text-surface-900 mb-3">Total Flexibility</h3>
            <p className="text-body-sm text-surface-600">
              You're the boss. Block dates when you need your vehicle, and open it for rent when you don't.
            </p>
          </div>

          <div className="card p-8">
            <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-6">
              <HiShieldCheck className="w-7 h-7 text-primary-600" />
            </div>
            <h3 className="text-h5 text-surface-900 mb-3">Verified Renters</h3>
            <p className="text-body-sm text-surface-600">
              Every customer is identity-verified before they can book. Your vehicle is only handed to trusted users.
            </p>
          </div>

          <div className="card p-8">
            <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mb-6">
              <HiChartBar className="w-7 h-7 text-primary-600" />
            </div>
            <h3 className="text-h5 text-surface-900 mb-3">Insights & Analytics</h3>
            <p className="text-body-sm text-surface-600">
              Track your earnings, monitor vehicle performance, and manage everything from a powerful dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white py-20 border-y border-surface-100">
        <div className="container-app">
          <div className="text-center mb-16">
            <h2 className="text-h2 text-surface-900 mb-4">How it works</h2>
            <p className="text-body text-surface-500 max-w-2xl mx-auto">
              Getting started is quick, easy, and completely free.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-surface-100" />
            
            <div className="relative text-center z-10">
              <div className="w-24 h-24 mx-auto bg-white border-[8px] border-surface-50 rounded-full flex items-center justify-center text-h3 font-bold text-primary-600 mb-6 shadow-sm">
                1
              </div>
              <h3 className="text-h5 text-surface-900 mb-3">Create your listing</h3>
              <p className="text-body-sm text-surface-600 px-4">
                Upload photos, set your pricing, and define your vehicle's availability.
              </p>
            </div>

            <div className="relative text-center z-10">
              <div className="w-24 h-24 mx-auto bg-white border-[8px] border-surface-50 rounded-full flex items-center justify-center text-h3 font-bold text-primary-600 mb-6 shadow-sm">
                2
              </div>
              <h3 className="text-h5 text-surface-900 mb-3">Accept bookings</h3>
              <p className="text-body-sm text-surface-600 px-4">
                Get notified when verified users book your vehicle. Approve and manage via dashboard.
              </p>
            </div>

            <div className="relative text-center z-10">
              <div className="w-24 h-24 mx-auto bg-white border-[8px] border-surface-50 rounded-full flex items-center justify-center text-h3 font-bold text-primary-600 mb-6 shadow-sm">
                3
              </div>
              <h3 className="text-h5 text-surface-900 mb-3">Earn and get paid</h3>
              <p className="text-body-sm text-surface-600 px-4">
                Hand over the keys, sit back, and receive payments securely to your bank account.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Quick missing Badge component import fix
import { Badge } from '../../components/common';

export default BecomeProvider;

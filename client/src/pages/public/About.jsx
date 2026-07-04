import { HiGlobeAsiaAustralia, HiShieldCheck, HiUserGroup, HiCurrencyRupee } from 'react-icons/hi2';

const About = () => {
  return (
    <div className="bg-surface-50 min-h-screen">
      {/* Header */}
      <div className="bg-primary-900 text-white py-20 md:py-32 relative overflow-hidden">
        {/* Decorative BG */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-primary-800 transform rotate-12 opacity-50" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[120%] bg-primary-950 transform -rotate-12 opacity-50" />
        </div>
        
        <div className="container-app relative z-10 text-center">
          <h1 className="text-hero mb-6">Our Mission</h1>
          <p className="text-body-lg text-primary-100 max-w-2xl mx-auto">
            To revolutionize mobility in India by making vehicle rentals accessible, transparent, and hassle-free for everyone.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="container-app py-20">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-h2 text-surface-900 mb-6">The RideEasy Story</h2>
          <p className="text-body text-surface-600 leading-relaxed mb-6">
            Born out of the frustration with traditional vehicle rental services, RideEasy was created to bridge the gap between people who need temporary mobility and those who have underutilized vehicles. 
          </p>
          <p className="text-body text-surface-600 leading-relaxed">
            We noticed that finding a reliable rental car or bike involved too much paperwork, hidden fees, and uncertainty about vehicle condition. RideEasy solves this by providing a unified, transparent platform where every vehicle is verified, prices are clear upfront, and the entire booking process takes less than a minute.
          </p>
        </div>

        {/* Core Values */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="card p-8 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 mx-auto bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
              <HiShieldCheck className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-h5 text-surface-900 mb-3">Trust & Safety</h3>
            <p className="text-body-sm text-surface-600">
              Every user and vehicle is thoroughly verified to ensure a safe community for all.
            </p>
          </div>

          <div className="card p-8 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 mx-auto bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
              <HiGlobeAsiaAustralia className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-h5 text-surface-900 mb-3">Accessibility</h3>
            <p className="text-body-sm text-surface-600">
              Providing mobility solutions across major cities, towns, and tourist destinations in India.
            </p>
          </div>

          <div className="card p-8 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 mx-auto bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
              <HiCurrencyRupee className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-h5 text-surface-900 mb-3">Transparency</h3>
            <p className="text-body-sm text-surface-600">
              No hidden charges or surprise fees. What you see on the screen is exactly what you pay.
            </p>
          </div>

          <div className="card p-8 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 mx-auto bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
              <HiUserGroup className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-h5 text-surface-900 mb-3">Community First</h3>
            <p className="text-body-sm text-surface-600">
              Empowering local vehicle owners to earn while providing value to travelers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

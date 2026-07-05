import { HiGlobeAsiaAustralia, HiShieldCheck, HiUserGroup, HiCurrencyRupee, HiMagnifyingGlass, HiCalendarDays, HiKey } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-surface-50 min-h-screen font-sans">
      


      {/* Story & Mission Section */}
      <section className="py-24 bg-surface-50">
        <div className="container-app">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="space-y-8">
              <div>
                <h2 className="text-sm font-bold tracking-widest text-primary-600 uppercase mb-3">Our Story</h2>
                <h3 className="text-3xl lg:text-4xl font-bold text-surface-900 mb-6 leading-tight">Born from Frustration, Built for Freedom.</h3>
                <p className="text-lg text-surface-600 leading-relaxed">
                  We noticed that finding a reliable rental car or bike involved too much paperwork, hidden fees, and uncertainty about vehicle condition. Traditional rentals felt like a chore rather than the start of an adventure.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface-100">
                <h4 className="text-xl font-bold text-surface-900 mb-3">The RideEasy Solution</h4>
                <p className="text-surface-600 leading-relaxed">
                  We bridge the gap between people who need temporary mobility and those with underutilized vehicles. Every vehicle is verified, prices are clear upfront, and the entire booking process takes less than a minute.
                </p>
              </div>
            </div>
            
            {/* Visual Grid */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              <div className="space-y-4 lg:space-y-6 pt-8 lg:pt-12">
                <div className="bg-primary-100 p-6 lg:p-8 rounded-3xl h-40 lg:h-48 flex flex-col justify-end transform hover:-translate-y-1 transition-transform">
                  <span className="text-4xl font-black text-primary-700 block mb-1">100%</span>
                  <span className="text-sm font-medium text-primary-600">Verified Vehicles</span>
                </div>
                <div 
                  className="bg-surface-200 p-8 rounded-3xl h-56 lg:h-64 bg-cover bg-center shadow-inner" 
                  style={{backgroundImage: 'url("https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80")'}}
                />
              </div>
              <div className="space-y-4 lg:space-y-6">
                <div 
                  className="bg-surface-200 p-8 rounded-3xl h-56 lg:h-64 bg-cover bg-center shadow-inner" 
                  style={{backgroundImage: 'url("https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80")'}}
                />
                <div className="bg-success-100 p-6 lg:p-8 rounded-3xl h-40 lg:h-48 flex flex-col justify-end transform hover:-translate-y-1 transition-transform">
                  <span className="text-4xl font-black text-success-700 block mb-1">24/7</span>
                  <span className="text-sm font-medium text-success-600">Support Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white border-y border-surface-100">
        <div className="container-app">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-surface-900 mb-4">How RideEasy Works</h2>
            <p className="text-lg text-surface-600">Renting a vehicle has never been easier. We've streamlined the process so you can get on the road in minutes.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: HiMagnifyingGlass, title: 'Find Your Ride', desc: 'Search by location, dates, and vehicle type to find the perfect match.' },
              { icon: HiCalendarDays, title: 'Choose Dates', desc: 'Select precise pick-up and drop-off times. Pricing is fully transparent.' },
              { icon: HiCurrencyRupee, title: 'Book & Pay', desc: 'Complete your booking with our secure gateway. No hidden fees.' },
              { icon: HiKey, title: 'Hit the Road', desc: 'Meet the provider, get the keys, and enjoy the freedom of the open road.' }
            ].map((step, idx) => (
              <div key={idx} className="relative group">
                <div className="bg-surface-50 rounded-2xl p-8 transition-all duration-300 group-hover:bg-primary-50 group-hover:shadow-md h-full border border-surface-100 flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600 mb-6 transform group-hover:scale-110 transition-transform">
                    <step.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-surface-900 mb-3">{idx + 1}. {step.title}</h3>
                  <p className="text-surface-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-surface-900 text-surface-50">
        <div className="container-app">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Our Core Values</h2>
            <p className="text-lg text-surface-400">The principles that guide everything we do at RideEasy.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: HiShieldCheck, title: 'Trust & Safety', desc: 'Every user and vehicle is thoroughly verified to ensure a safe community.' },
              { icon: HiGlobeAsiaAustralia, title: 'Accessibility', desc: 'Providing mobility solutions across major cities and tourist destinations.' },
              { icon: HiCurrencyRupee, title: 'Transparency', desc: 'No hidden charges. What you see on the screen is exactly what you pay.' },
              { icon: HiUserGroup, title: 'Community First', desc: 'Empowering local vehicle owners to earn while providing value to travelers.' }
            ].map((value, idx) => (
              <div key={idx} className="bg-surface-800 p-8 rounded-2xl border border-surface-700 hover:border-primary-500 transition-colors">
                <value.icon className="w-10 h-10 text-primary-400 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-surface-400 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;

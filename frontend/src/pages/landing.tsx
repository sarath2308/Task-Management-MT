import React from 'react';
import { useNavigate } from 'react-router';
import { Zap, Target, Users, LayoutDashboard, CheckCircle } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/auth'); // Navigate to the signup page you created
  };

  const handleLearnMore = () => {
    // Smooth scroll to features section
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: Zap,
      title: 'Lightweight & Fast',
      description: 'Zero lag, instant updates. Focus on work, not the tool.',
      color: 'text-amber-400',
    },
    {
      icon: Target,
      title: 'Goal Alignment',
      description: 'Connect daily tasks to your big-picture quarterly objectives.',
      color: 'text-rose-400',
    },
    {
      icon: Users,
      title: 'Seamless Collaboration',
      description: 'Assign tasks, share feedback, and track team progress in real-time.',
      color: 'text-sky-400',
    },
    {
      icon: LayoutDashboard,
      title: 'Intuitive Views',
      description: 'Switch between Kanban, List, and Calendar views instantly.',
      color: 'text-emerald-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      {/* 1. HEADER / NAV */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-extrabold tracking-tight">
              Task<span className="text-blue-500">Flow</span>
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-300">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#" className="hover:text-white transition">Pricing</a>
            <a href="#" className="hover:text-white transition">Enterprise</a>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/auth')}
              className="text-sm font-medium text-gray-300 hover:text-white transition"
            >
              Log In
            </button>
            <button 
              onClick={handleGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition duration-200 shadow-lg shadow-blue-600/20"
            >
              Get Started Free
            </button>
          </div>
        </nav>
      </header>

      {/* 2. HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 bg-gray-800 border border-gray-700 px-4 py-1.5 rounded-full text-sm text-gray-300 mb-8">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Version 2.0 is here with enhanced AI automation</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
          Stop managing tools.<br /> Start mastering tasks.
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-gray-400 mb-12 leading-relaxed">
          TaskFlow centralizes your projects, simplifies collaboration, and uses intelligent automation to keep your team aligned and productive.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24">
          <button 
            onClick={handleGetStarted}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-10 py-4 rounded-xl transition duration-200 shadow-xl shadow-blue-600/30 transform hover:-translate-y-0.5"
          >
            Join Us & Streamline Your Workflow
          </button>
          <button 
            onClick={handleLearnMore}
            className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white text-lg font-semibold px-10 py-4 rounded-xl transition border border-gray-700"
          >
            Learn More
          </button>
        </div>

        {/* 3. FEATURE GRID */}
        <section id="features" className="py-24 border-t border-gray-800">
          <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">Why TaskFlow?</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-16">
            Built for modern, agile teams.
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-gray-900 border border-gray-800 p-8 rounded-2xl hover:border-gray-700 transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-base leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* 4. FOOTER */}
      <footer className="border-t border-gray-800 bg-gray-900 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-gray-600" />
            <span className="font-bold text-gray-300">TaskFlow Inc.</span>
            <span>&copy; 2026. All rights reserved.</span>
          </div>
          
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
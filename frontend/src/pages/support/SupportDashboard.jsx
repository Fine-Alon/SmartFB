import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const SupportDashboard = () => {
  const navigate = useNavigate();
  // Assuming standard Redux slice with user info
  const user = useSelector((state) => state.auth?.user) || { name: 'Support Agent' };

  const metrics = [
    {
      label: 'Pending Urgent Reviews',
      value: 12,
      icon: AlertTriangle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      border: 'border-orange-500/20'
    },
    {
      label: 'Resolved Today',
      value: 45,
      icon: CheckCircle,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      label: 'Average Response Time',
      value: '2.4h',
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-slate-500 mt-1">Here is your support overview for today.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, idx) => (
          <div 
            key={idx}
            className={`p-6 rounded-2xl border ${metric.border} bg-white shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 font-medium">{metric.label}</span>
              <div className={`p-3 rounded-full ${metric.bgColor} ${metric.color}`}>
                <metric.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-4xl font-bold text-slate-800">
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      {/* Primary Action Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div 
          onClick={() => navigate('/support/queue')}
          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {/* Glassmorphism decorative circles */}
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/5 backdrop-blur-3xl group-hover:bg-white/10 transition-colors"></div>
          <div className="absolute bottom-0 right-10 -mb-8 w-24 h-24 rounded-full bg-white/5 backdrop-blur-3xl group-hover:bg-white/10 transition-colors"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Review Queue</h3>
              <p className="text-slate-300 max-w-md">
                Jump into the urgent review queue to resolve flagged feedback and moderate AI-escalated messages.
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;

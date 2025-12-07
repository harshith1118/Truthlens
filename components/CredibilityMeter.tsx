import React from 'react';

interface CredibilityMeterProps {
  score: number;
}

export const CredibilityMeter: React.FC<CredibilityMeterProps> = ({ score }) => {
  // Determine color theme based on score
  let colorClass = 'text-red-500';
  let strokeColor = '#ef4444';
  let label = 'Low Credibility';
  let bgGlow = 'bg-red-500/10';
  
  if (score >= 80) {
    colorClass = 'text-emerald-500';
    strokeColor = '#10b981';
    label = 'High Credibility';
    bgGlow = 'bg-emerald-500/10';
  } else if (score >= 50) {
    colorClass = 'text-amber-500';
    strokeColor = '#f59e0b';
    label = 'Questionable';
    bgGlow = 'bg-amber-500/10';
  }

  // SVG parameters
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative w-48 h-48 flex items-center justify-center">
        
        {/* Glow behind */}
        <div className={`absolute inset-0 rounded-full blur-2xl ${bgGlow} scale-75 animate-pulse`}></div>

        <svg className="w-full h-full transform -rotate-90 relative z-10 drop-shadow-sm">
          {/* Track */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#e2e8f0"
            strokeWidth="10"
            fill="transparent"
            className="opacity-50"
          />
          {/* Progress */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={strokeColor}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className={`text-5xl font-extrabold tracking-tighter ${colorClass}`}>
            {score}
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Trust Score</span>
        </div>
      </div>
      <div className={`mt-2 px-4 py-1 rounded-full text-sm font-bold border border-current opacity-90 ${colorClass.replace('text-', 'bg-').replace('500', '50')} ${colorClass}`}>
        {label}
      </div>
    </div>
  );
};
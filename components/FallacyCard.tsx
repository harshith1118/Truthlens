import React, { useState } from 'react';
import { Fallacy } from '../types';
import { AlertTriangle, ChevronDown, Info } from 'lucide-react';

interface FallacyCardProps {
  fallacy: Fallacy;
}

export const FallacyCard: React.FC<FallacyCardProps> = ({ fallacy }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-orange-200 hover:shadow-md hover:shadow-orange-100/50 rounded-xl overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-600 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors">
            <Info size={16} className="font-bold" />
          </div>
          <span className="font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{fallacy.name}</span>
        </div>
        <ChevronDown 
          size={18} 
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-5 pb-5 pt-0">
          <div className="pl-11 border-l-2 border-orange-100 space-y-2">
            <p className="text-sm text-slate-600 leading-relaxed">{fallacy.description}</p>
            
            {fallacy.exampleInText && (
              <div className="mt-3 bg-white p-3 rounded-lg border border-slate-100 text-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">Detected in text:</span>
                <p className="italic text-slate-800 font-medium">"{fallacy.exampleInText}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
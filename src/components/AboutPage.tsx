import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';

export const AboutButton = () => {
  return (
    <Link
      to="/about"
      className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-sm font-medium transition-all duration-200 rounded-lg shadow-sm hover:shadow-md group backdrop-blur-sm"
      title="About this app"
    >
      <Info className="w-4 h-4 group-hover:scale-110 transition-transform" />
      <span>About & Features</span>
    </Link>
  );
};

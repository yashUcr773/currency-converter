import { useState } from 'react';
import { Heart, Coffee, Gift } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const DonateButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const donationOptions = [
    {
      name: 'Buy Me a Coffee',
      icon: '☕',
      url: 'https://coff.ee/yash773',
      description: 'Support with a coffee',
      color: 'from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600'
    }
  ];

  const handleDonationClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold text-sm sm:text-base rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 touch-manipulation group"
          title="Support the development of this app"
        >
          <Coffee className="w-4 h-4 group-hover:animate-bounce" />
          <span>Support This App</span>
          <Heart className="w-4 h-4 group-hover:animate-pulse text-red-200" />
        </button>
      </DialogTrigger>
      
      <DialogContent className="w-[95vw] max-w-md mx-auto bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-700 text-center justify-center">
            <Gift className="w-5 h-5 text-orange-500" />
            Support This Project
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 p-2">
          <p className="text-sm text-slate-600 text-center leading-relaxed">
            If you find this currency converter helpful, consider supporting its development!
          </p>
          
          <div className="grid gap-3">
            {donationOptions.map((option) => (
              <button
                key={option.name}
                onClick={() => handleDonationClick(option.url)}
                className={`flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r ${option.color} text-white shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation`}
              >
                <span className="text-xl">{option.icon}</span>
                <div className="text-left flex-1">
                  <div className="font-semibold text-sm">{option.name}</div>
                  <div className="text-xs opacity-90">{option.description}</div>
                </div>
                <span className="text-white/70">→</span>
              </button>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-slate-50 rounded-xl">
            <p className="text-xs text-slate-600 text-center">
              💝 Any support helps keep this app free and improving!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

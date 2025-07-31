import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import type { Unit } from '../constants-units';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface UnitSelectorProps {
  availableUnits: Unit[];
  onSelectUnit: (unit: Unit) => void;
  categoryName: string;
}

export const UnitSelector = ({ 
  availableUnits, 
  onSelectUnit, 
  categoryName
}: UnitSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUnits = availableUnits.filter(unit =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUnit = (unit: Unit) => {
    onSelectUnit(unit);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="group cursor-pointer overflow-hidden bg-gradient-to-br from-slate-50/90 to-white/90 backdrop-blur-md border border-dashed border-slate-300 hover:border-blue-400 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 touch-manipulation h-full flex flex-col rounded-xl">
          <CardContent className="p-3 sm:p-4 flex-1 flex flex-col items-center justify-center text-center space-y-2 sm:space-y-3">
            {/* Icon container */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-sm group-hover:blur-none transition-all duration-300"></div>
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 rounded-full border border-blue-200/60 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                <Plus size={16} className="sm:w-5 sm:h-5 text-blue-600 group-hover:text-blue-700" />
              </div>
            </div>
            
            {/* Text content */}
            <div className="space-y-0.5 sm:space-y-1">
              <h3 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-blue-600 transition-colors duration-200">
                Add Unit
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-tight">
                {categoryName}
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-sm mx-auto bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-800 text-center">
            Add {categoryName} Unit
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
            <Input
              type="text"
              inputMode="search"
              placeholder="Search units..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-50/80 border-2 border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all duration-200 rounded-xl h-12 text-base touch-manipulation"
              autoFocus
            />
          </div>

          {/* Units list */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredUnits.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                {searchTerm ? 'No units found' : 'All units are already added'}
              </div>
            ) : (
              filteredUnits.map((unit) => (
                <Button
                  key={unit.id}
                  variant="ghost"
                  className="w-full justify-start p-4 h-auto bg-white/50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all duration-200"
                  onClick={() => handleSelectUnit(unit)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="text-lg font-bold text-blue-600 min-w-[3rem] text-left">
                      {unit.symbol}
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-slate-800">{unit.name}</div>
                    </div>
                  </div>
                </Button>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

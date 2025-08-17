import { useUnitConverter } from '../hooks/useUnitConverter';
import { UnitInput } from './UnitInput';
import { UnitSelector } from './UnitSelector';
import { LoadingSpinner } from './LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronDown } from 'lucide-react';

export const UnitConverter = () => {
  const {
    activeCategory,
    pinnedUnits,
    categories,
    setCategory,
    updateUnitValue,
    pinUnit,
    unpinUnit,
    getAvailableUnits
  } = useUnitConverter();

  const currentCategory = categories.find(cat => cat.id === activeCategory);
  
  if (!currentCategory) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Category Selection - Similar to Base Currency Indicator */}
      <div className="text-center">
        <div className="inline-flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 lg:gap-3 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-card/80 backdrop-blur-sm rounded-lg sm:rounded-xl border border-border shadow-lg max-w-full">
          <span className="text-muted-foreground font-medium text-xs sm:text-sm lg:text-base">
            Converting
          </span>
          
          {/* Category Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="font-bold text-sm sm:text-base lg:text-lg text-primary hover:text-primary/80 hover:bg-primary/5 px-2 py-1 h-auto rounded-lg transition-all duration-200"
              >
                <span className="text-2xl mr-2">{currentCategory.icon}</span>
                {currentCategory.name}
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-2 bg-card/95 backdrop-blur-sm border border-border shadow-xl rounded-xl">
              <ScrollArea className="h-72">
                <div className="grid grid-cols-2 gap-2 p-1">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      onClick={() => setCategory(category.id)}
                      variant="ghost"
                      className={`h-auto p-3 flex flex-col items-center gap-2 transition-all duration-200 rounded-xl border border-transparent group touch-manipulation ${
                        activeCategory === category.id
                          ? 'bg-primary/10 text-primary border-primary/20 shadow-sm'
                          : 'text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/20'
                      }`}
                    >
                      <span className="text-xl">{category.icon}</span>
                      <span className="text-xs font-medium text-center leading-tight">
                        {category.name}
                      </span>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
          
          <span className="text-muted-foreground text-xs hidden sm:block">
            Click to change category
          </span>
        </div>
      </div>

      {/* Unit Conversion Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 xl:gap-6">
        {/* Pinned Units */}
        {pinnedUnits.map((pinnedUnit) => (
          <div key={pinnedUnit.unit.id} className="min-h-[140px] sm:min-h-[160px]">
            <UnitInput
              pinnedUnit={pinnedUnit}
              onValueChange={(value) => updateUnitValue(pinnedUnit.unit.id, value)}
              onUnpin={() => unpinUnit(pinnedUnit.unit.id)}
            />
          </div>
        ))}

        {/* Unit Selector */}
        <div className="min-h-[140px] sm:min-h-[160px]">
          <UnitSelector
            availableUnits={getAvailableUnits()}
            onSelectUnit={pinUnit}
            categoryName={currentCategory.name}
          />
        </div>
      </div>
    </div>
  );
};

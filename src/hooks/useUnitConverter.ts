import { useState, useCallback, useEffect } from 'react';
import { UNIT_CATEGORIES, DEFAULT_UNITS_BY_CATEGORY, type Unit } from '../constants-units';
import { UnitConverter } from '../utils/unitConverter';
import { storage } from '../utils/storage';

export interface PinnedUnit {
  unit: Unit;
  categoryId: string;
  value: number;
}

export const useUnitConverter = () => {
  const [activeCategory, setActiveCategory] = useState<string>('length');
  const [pinnedUnits, setPinnedUnits] = useState<PinnedUnit[]>([]);

  // Helper function to get pinned units for a category
  const getPinnedUnitsForCategory = useCallback((categoryId: string): PinnedUnit[] => {
    const storedUnitIds = storage.getPinnedUnitsForCategory(categoryId);
    const unitIds = storedUnitIds.length > 0 ? storedUnitIds : (DEFAULT_UNITS_BY_CATEGORY[categoryId] || []);
    
    const category = UNIT_CATEGORIES.find(cat => cat.id === categoryId);
    if (!category) return [];

    return unitIds.map(unitId => {
      const unit = category.units.find(u => u.id === unitId);
      return unit ? {
        unit,
        categoryId,
        value: 0
      } : null;
    }).filter(Boolean) as PinnedUnit[];
  }, []);

  // Helper function to save pinned units for current category
  const savePinnedUnitsForCategory = useCallback((categoryId: string, units: PinnedUnit[]) => {
    const unitIds = units.map(p => p.unit.id);
    storage.savePinnedUnitsForCategory(categoryId, unitIds);
  }, []);

  // Initialize pinned units for the active category
  useEffect(() => {
    const initialPinnedUnits = getPinnedUnitsForCategory(activeCategory);
    setPinnedUnits(initialPinnedUnits);
  }, [activeCategory, getPinnedUnitsForCategory]);

  // Change active category and load its pinned units
  const setCategory = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    // The useEffect will handle loading the pinned units for the new category
  }, []);

  // Update a unit's value and convert all others
  const updateUnitValue = useCallback((unitId: string, value: number) => {
    setPinnedUnits((current: PinnedUnit[]) => {
      return current.map((pinnedUnit: PinnedUnit) => {
        if (pinnedUnit.unit.id === unitId) {
          return { ...pinnedUnit, value };
        } else {
          // Convert from the updated unit to this unit
          try {
            const convertedValue = UnitConverter.convert(
              value,
              unitId,
              pinnedUnit.unit.id,
              activeCategory
            );
            return { ...pinnedUnit, value: convertedValue };
          } catch (error) {
            console.error('Conversion error:', error);
            return pinnedUnit;
          }
        }
      });
    });
  }, [activeCategory]);

  // Add a unit to the pinned list
  const pinUnit = useCallback((unit: Unit) => {
    setPinnedUnits((current: PinnedUnit[]) => {
      // Check if already pinned
      if (current.find((p: PinnedUnit) => p.unit.id === unit.id)) {
        return current;
      }

      // Calculate initial value based on first pinned unit
      let initialValue = 0;
      if (current.length > 0) {
        const firstUnit = current[0];
        try {
          initialValue = UnitConverter.convert(
            firstUnit.value,
            firstUnit.unit.id,
            unit.id,
            activeCategory
          );
        } catch (error) {
          console.error('Conversion error:', error);
        }
      }

      const newPinnedUnits = [...current, {
        unit,
        categoryId: activeCategory,
        value: initialValue
      }];

      // Save to storage
      savePinnedUnitsForCategory(activeCategory, newPinnedUnits);
      
      return newPinnedUnits;
    });
  }, [activeCategory, savePinnedUnitsForCategory]);

  // Remove a unit from the pinned list
  const unpinUnit = useCallback((unitId: string) => {
    setPinnedUnits((current: PinnedUnit[]) => {
      const newPinnedUnits = current.filter((p: PinnedUnit) => p.unit.id !== unitId);
      
      // Save to storage
      savePinnedUnitsForCategory(activeCategory, newPinnedUnits);
      
      return newPinnedUnits;
    });
  }, [activeCategory, savePinnedUnitsForCategory]);

  // Get available units for current category (excluding already pinned)
  const getAvailableUnits = useCallback(() => {
    const category = UNIT_CATEGORIES.find(cat => cat.id === activeCategory);
    if (!category) return [];

    const pinnedUnitIds = new Set(pinnedUnits.map((p: PinnedUnit) => p.unit.id));
    return category.units.filter(unit => !pinnedUnitIds.has(unit.id));
  }, [activeCategory, pinnedUnits]);

  return {
    activeCategory,
    pinnedUnits,
    categories: UNIT_CATEGORIES,
    setCategory,
    updateUnitValue,
    pinUnit,
    unpinUnit,
    getAvailableUnits
  };
};

import { UNIT_CATEGORIES, type Unit, type UnitCategory } from '../constants-units';

export class UnitConverter {
  // Convert between units of the same category
  static convert(value: number, fromUnitId: string, toUnitId: string, categoryId: string): number {
    if (fromUnitId === toUnitId) {
      return value;
    }

    const category = UNIT_CATEGORIES.find(cat => cat.id === categoryId);
    if (!category) {
      throw new Error(`Category ${categoryId} not found`);
    }

    const fromUnit = category.units.find(unit => unit.id === fromUnitId);
    const toUnit = category.units.find(unit => unit.id === toUnitId);

    if (!fromUnit || !toUnit) {
      throw new Error(`Units not found: ${fromUnitId} or ${toUnitId}`);
    }

    // Special handling for temperature
    if (categoryId === 'temperature') {
      return this.convertTemperature(value, fromUnitId, toUnitId);
    }

    // Special handling for fuel economy (L/100km has inverse relationship)
    if (categoryId === 'fuel') {
      return this.convertFuelEconomy(value, fromUnitId, toUnitId);
    }

    // Convert to base unit first, then to target unit
    const baseValue = value * fromUnit.baseMultiplier;
    const result = baseValue / toUnit.baseMultiplier;

    return Math.round(result * 1000000) / 1000000; // Round to 6 decimal places
  }

  // Special temperature conversion handling
  private static convertTemperature(value: number, fromUnitId: string, toUnitId: string): number {
    if (fromUnitId === toUnitId) return value;

    let celsius: number;

    // Convert to Celsius first
    switch (fromUnitId) {
      case 'c':
        celsius = value;
        break;
      case 'f':
        celsius = (value - 32) * 5/9;
        break;
      case 'k':
        celsius = value - 273.15;
        break;
      case 'r': // Rankine
        celsius = (value - 491.67) * 5/9;
        break;
      case 're': // Réaumur
        celsius = value * 5/4;
        break;
      case 'n': // Newton
        celsius = value * 100/33;
        break;
      case 'de': // Delisle
        celsius = 100 - value * 2/3;
        break;
      case 'ro': // Rømer
        celsius = (value - 7.5) * 40/21;
        break;
      default:
        throw new Error(`Unknown temperature unit: ${fromUnitId}`);
    }

    // Convert from Celsius to target
    switch (toUnitId) {
      case 'c':
        return Math.round(celsius * 1000000) / 1000000;
      case 'f':
        return Math.round((celsius * 9/5 + 32) * 1000000) / 1000000;
      case 'k':
        return Math.round((celsius + 273.15) * 1000000) / 1000000;
      case 'r': // Rankine
        return Math.round((celsius * 9/5 + 491.67) * 1000000) / 1000000;
      case 're': // Réaumur
        return Math.round((celsius * 4/5) * 1000000) / 1000000;
      case 'n': // Newton
        return Math.round((celsius * 33/100) * 1000000) / 1000000;
      case 'de': // Delisle
        return Math.round(((100 - celsius) * 3/2) * 1000000) / 1000000;
      case 'ro': // Rømer
        return Math.round((celsius * 21/40 + 7.5) * 1000000) / 1000000;
      default:
        throw new Error(`Unknown temperature unit: ${toUnitId}`);
    }
  }

  // Special fuel economy conversion handling
  private static convertFuelEconomy(value: number, fromUnitId: string, toUnitId: string): number {
    if (fromUnitId === toUnitId) return value;

    // Convert everything to km/L as base
    let kmPerLiter: number;

    switch (fromUnitId) {
      case 'kmpl':
        kmPerLiter = value;
        break;
      case 'mpg_us':
        kmPerLiter = value * 0.425144; // US MPG to km/L
        break;
      case 'mpg_uk':
        kmPerLiter = value * 0.354006; // UK MPG to km/L
        break;
      case 'l100km':
        // L/100km is inverse: if you use X liters per 100km, then you get 100/X km per liter
        kmPerLiter = value > 0 ? 100 / value : 0;
        break;
      default:
        throw new Error(`Unknown fuel economy unit: ${fromUnitId}`);
    }

    // Convert from km/L to target unit
    switch (toUnitId) {
      case 'kmpl':
        return Math.round(kmPerLiter * 1000000) / 1000000;
      case 'mpg_us':
        return Math.round((kmPerLiter / 0.425144) * 1000000) / 1000000;
      case 'mpg_uk':
        return Math.round((kmPerLiter / 0.354006) * 1000000) / 1000000;
      case 'l100km':
        // Convert back to L/100km (inverse relationship)
        return kmPerLiter > 0 ? Math.round((100 / kmPerLiter) * 1000000) / 1000000 : 0;
      default:
        throw new Error(`Unknown fuel economy unit: ${toUnitId}`);
    }
  }

  // Get unit by ID from any category
  static getUnit(unitId: string): { unit: Unit, category: UnitCategory } | null {
    for (const category of UNIT_CATEGORIES) {
      const unit = category.units.find(u => u.id === unitId);
      if (unit) {
        return { unit, category };
      }
    }
    return null;
  }

  // Get category by ID
  static getCategory(categoryId: string): UnitCategory | null {
    return UNIT_CATEGORIES.find(cat => cat.id === categoryId) || null;
  }

  // Get all available units for a category
  static getUnitsForCategory(categoryId: string): Unit[] {
    const category = this.getCategory(categoryId);
    return category ? category.units : [];
  }

  // Format number for display with proper precision
  static formatValue(value: number): string {
    if (value === 0) return '0';
    
    // For very small numbers, use scientific notation
    if (Math.abs(value) < 0.000001 && value !== 0) {
      return value.toExponential(3);
    }
    
    // For very large numbers, use scientific notation
    if (Math.abs(value) >= 1000000000) {
      return value.toExponential(3);
    }
    
    // For normal numbers, format with appropriate decimal places
    const formatter = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
      useGrouping: true,
    });
    
    return formatter.format(value);
  }
}

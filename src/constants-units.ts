// Unit conversion constants and data

export interface UnitCategory {
  id: string;
  name: string;
  icon: string;
  units: Unit[];
}

export interface Unit {
  id: string;
  name: string;
  symbol: string;
  baseMultiplier: number; // Multiplier to convert to base unit
}

export const UNIT_CATEGORIES: UnitCategory[] = [
  {
    id: 'length',
    name: 'Length',
    icon: '📏',
    units: [
      // Metric units
      { id: 'pm', name: 'Picometer', symbol: 'pm', baseMultiplier: 0.000000000001 },
      { id: 'nm', name: 'Nanometer', symbol: 'nm', baseMultiplier: 0.000000001 },
      { id: 'μm', name: 'Micrometer', symbol: 'μm', baseMultiplier: 0.000001 },
      { id: 'mm', name: 'Millimeter', symbol: 'mm', baseMultiplier: 0.001 },
      { id: 'cm', name: 'Centimeter', symbol: 'cm', baseMultiplier: 0.01 },
      { id: 'dm', name: 'Decimeter', symbol: 'dm', baseMultiplier: 0.1 },
      { id: 'm', name: 'Meter', symbol: 'm', baseMultiplier: 1 }, // Base unit
      { id: 'dam', name: 'Dekameter', symbol: 'dam', baseMultiplier: 10 },
      { id: 'hm', name: 'Hectometer', symbol: 'hm', baseMultiplier: 100 },
      { id: 'km', name: 'Kilometer', symbol: 'km', baseMultiplier: 1000 },
      
      // Imperial/US units
      { id: 'mil', name: 'Mil (thou)', symbol: 'mil', baseMultiplier: 0.0000254 },
      { id: 'in', name: 'Inch', symbol: 'in', baseMultiplier: 0.0254 },
      { id: 'ft', name: 'Foot', symbol: 'ft', baseMultiplier: 0.3048 },
      { id: 'yd', name: 'Yard', symbol: 'yd', baseMultiplier: 0.9144 },
      { id: 'chain', name: 'Chain', symbol: 'ch', baseMultiplier: 20.1168 },
      { id: 'furlong', name: 'Furlong', symbol: 'fur', baseMultiplier: 201.168 },
      { id: 'mi', name: 'Mile', symbol: 'mi', baseMultiplier: 1609.344 },
      { id: 'league', name: 'League', symbol: 'lea', baseMultiplier: 4828.032 },
      
      // Nautical and aviation
      { id: 'nmi', name: 'Nautical Mile', symbol: 'nmi', baseMultiplier: 1852 },
      { id: 'cable', name: 'Cable Length', symbol: 'cable', baseMultiplier: 185.2 },
      { id: 'fathom', name: 'Fathom', symbol: 'ftm', baseMultiplier: 1.8288 },
      
      // Astronomical units
      { id: 'au', name: 'Astronomical Unit', symbol: 'AU', baseMultiplier: 1.496e11 },
      { id: 'ly', name: 'Light Year', symbol: 'ly', baseMultiplier: 9.461e15 },
      { id: 'pc', name: 'Parsec', symbol: 'pc', baseMultiplier: 3.086e16 },
      
      // Typography
      { id: 'pt', name: 'Point (typography)', symbol: 'pt', baseMultiplier: 0.000352778 },
      { id: 'pica', name: 'Pica', symbol: 'P̸', baseMultiplier: 0.004233333 },
      { id: 'em', name: 'Em (typography)', symbol: 'em', baseMultiplier: 0.004233333 },
    ]
  },
  {
    id: 'weight',
    name: 'Weight & Mass',
    icon: '⚖️',
    units: [
      // Metric units
      { id: 'μg', name: 'Microgram', symbol: 'μg', baseMultiplier: 1e-9 },
      { id: 'mg', name: 'Milligram', symbol: 'mg', baseMultiplier: 0.000001 },
      { id: 'cg', name: 'Centigram', symbol: 'cg', baseMultiplier: 0.00001 },
      { id: 'dg', name: 'Decigram', symbol: 'dg', baseMultiplier: 0.0001 },
      { id: 'g', name: 'Gram', symbol: 'g', baseMultiplier: 0.001 },
      { id: 'dag', name: 'Dekagram', symbol: 'dag', baseMultiplier: 0.01 },
      { id: 'hg', name: 'Hectogram', symbol: 'hg', baseMultiplier: 0.1 },
      { id: 'kg', name: 'Kilogram', symbol: 'kg', baseMultiplier: 1 }, // Base unit
      { id: 't', name: 'Metric Ton', symbol: 't', baseMultiplier: 1000 },
      
      // Imperial/US units
      { id: 'gr', name: 'Grain', symbol: 'gr', baseMultiplier: 0.00006479891 },
      { id: 'dr', name: 'Dram', symbol: 'dr', baseMultiplier: 0.0017718451953125 },
      { id: 'oz', name: 'Ounce', symbol: 'oz', baseMultiplier: 0.0283495 },
      { id: 'lb', name: 'Pound', symbol: 'lb', baseMultiplier: 0.453592 },
      { id: 'st', name: 'Stone', symbol: 'st', baseMultiplier: 6.35029 },
      { id: 'qtr', name: 'Quarter', symbol: 'qtr', baseMultiplier: 12.70059 },
      { id: 'cwt', name: 'Hundredweight (US)', symbol: 'cwt', baseMultiplier: 45.359237 },
      { id: 'ton_us', name: 'US Ton (Short)', symbol: 'ton', baseMultiplier: 907.185 },
      { id: 'ton_uk', name: 'UK Ton (Long)', symbol: 'LT', baseMultiplier: 1016.047 },
      
      // Troy weight system
      { id: 'dwt', name: 'Pennyweight', symbol: 'dwt', baseMultiplier: 0.00155517384 },
      { id: 'oz_t', name: 'Troy Ounce', symbol: 'oz t', baseMultiplier: 0.0311034768 },
      { id: 'lb_t', name: 'Troy Pound', symbol: 'lb t', baseMultiplier: 0.3732417216 },
      
      // Precious metals and gems
      { id: 'ct', name: 'Carat', symbol: 'ct', baseMultiplier: 0.0002 },
      { id: 'point', name: 'Point (carat)', symbol: 'pt', baseMultiplier: 0.00002 },
      
      // Asian units
      { id: 'tael', name: 'Tael', symbol: 'tael', baseMultiplier: 0.0378 },
      { id: 'catty', name: 'Catty', symbol: 'catty', baseMultiplier: 0.6048 },
      
      // Atomic scale
      { id: 'u', name: 'Atomic Mass Unit', symbol: 'u', baseMultiplier: 1.66054e-27 },
    ]
  },
  {
    id: 'volume',
    name: 'Volume',
    icon: '🥤',
    units: [
      // Metric units
      { id: 'μl', name: 'Microliter', symbol: 'μL', baseMultiplier: 0.000001 },
      { id: 'ml', name: 'Milliliter', symbol: 'mL', baseMultiplier: 0.001 },
      { id: 'cl', name: 'Centiliter', symbol: 'cL', baseMultiplier: 0.01 },
      { id: 'dl', name: 'Deciliter', symbol: 'dL', baseMultiplier: 0.1 },
      { id: 'l', name: 'Liter', symbol: 'L', baseMultiplier: 1 }, // Base unit
      { id: 'dal', name: 'Dekaliter', symbol: 'daL', baseMultiplier: 10 },
      { id: 'hl', name: 'Hectoliter', symbol: 'hL', baseMultiplier: 100 },
      { id: 'kl', name: 'Kiloliter', symbol: 'kL', baseMultiplier: 1000 },
      
      // Cubic units
      { id: 'mm3', name: 'Cubic Millimeter', symbol: 'mm³', baseMultiplier: 0.000001 },
      { id: 'cm3', name: 'Cubic Centimeter', symbol: 'cm³', baseMultiplier: 0.001 },
      { id: 'dm3', name: 'Cubic Decimeter', symbol: 'dm³', baseMultiplier: 1 },
      { id: 'm3', name: 'Cubic Meter', symbol: 'm³', baseMultiplier: 1000 },
      { id: 'km3', name: 'Cubic Kilometer', symbol: 'km³', baseMultiplier: 1e12 },
      
      // Imperial cubic units
      { id: 'in3', name: 'Cubic Inch', symbol: 'in³', baseMultiplier: 0.0163871 },
      { id: 'ft3', name: 'Cubic Foot', symbol: 'ft³', baseMultiplier: 28.3168 },
      { id: 'yd3', name: 'Cubic Yard', symbol: 'yd³', baseMultiplier: 764.555 },
      
      // US liquid measures
      { id: 'minim', name: 'Minim (US)', symbol: 'min', baseMultiplier: 0.0000616115 },
      { id: 'fl_dr', name: 'Fluid Dram (US)', symbol: 'fl dr', baseMultiplier: 0.00369669 },
      { id: 'tsp_us', name: 'Teaspoon (US)', symbol: 'tsp', baseMultiplier: 0.00492892 },
      { id: 'tbsp_us', name: 'Tablespoon (US)', symbol: 'tbsp', baseMultiplier: 0.0147868 },
      { id: 'floz_us', name: 'Fluid Ounce (US)', symbol: 'fl oz', baseMultiplier: 0.0295735 },
      { id: 'jigger', name: 'Jigger', symbol: 'jigger', baseMultiplier: 0.0443603 },
      { id: 'gill_us', name: 'Gill (US)', symbol: 'gi', baseMultiplier: 0.118294 },
      { id: 'cup_us', name: 'Cup (US)', symbol: 'cup', baseMultiplier: 0.236588 },
      { id: 'pt_us', name: 'Pint (US)', symbol: 'pt', baseMultiplier: 0.473176 },
      { id: 'qt_us', name: 'Quart (US)', symbol: 'qt', baseMultiplier: 0.946353 },
      { id: 'gal_us', name: 'Gallon (US)', symbol: 'gal', baseMultiplier: 3.78541 },
      
      // Imperial liquid measures
      { id: 'tsp_uk', name: 'Teaspoon (UK)', symbol: 'tsp', baseMultiplier: 0.00591939 },
      { id: 'tbsp_uk', name: 'Tablespoon (UK)', symbol: 'tbsp', baseMultiplier: 0.0177582 },
      { id: 'floz_uk', name: 'Fluid Ounce (UK)', symbol: 'fl oz', baseMultiplier: 0.0284131 },
      { id: 'gill_uk', name: 'Gill (UK)', symbol: 'gi', baseMultiplier: 0.142065 },
      { id: 'cup_uk', name: 'Cup (UK)', symbol: 'cup', baseMultiplier: 0.284131 },
      { id: 'pt_uk', name: 'Pint (UK)', symbol: 'pt', baseMultiplier: 0.568261 },
      { id: 'qt_uk', name: 'Quart (UK)', symbol: 'qt', baseMultiplier: 1.13652 },
      { id: 'gal_uk', name: 'Gallon (UK)', symbol: 'gal', baseMultiplier: 4.54609 },
      
      // Wine and spirits
      { id: 'shot', name: 'Shot', symbol: 'shot', baseMultiplier: 0.0443603 },
      { id: 'wine_bottle', name: 'Wine Bottle', symbol: 'bottle', baseMultiplier: 0.75 },
      { id: 'magnum', name: 'Magnum', symbol: 'magnum', baseMultiplier: 1.5 },
      
      // Oil industry
      { id: 'bbl_oil', name: 'Oil Barrel', symbol: 'bbl', baseMultiplier: 158.987 },
      { id: 'bbl_us', name: 'US Barrel', symbol: 'bbl', baseMultiplier: 119.24 },
    ]
  },
  {
    id: 'temperature',
    name: 'Temperature',
    icon: '🌡️',
    units: [
      { id: 'c', name: 'Celsius', symbol: '°C', baseMultiplier: 1 }, // Base unit (Kelvin calculation handled separately)
      { id: 'f', name: 'Fahrenheit', symbol: '°F', baseMultiplier: 1 },
      { id: 'k', name: 'Kelvin', symbol: 'K', baseMultiplier: 1 },
      { id: 'r', name: 'Rankine', symbol: '°R', baseMultiplier: 1 },
      { id: 're', name: 'Réaumur', symbol: '°Ré', baseMultiplier: 1 },
      { id: 'n', name: 'Newton', symbol: '°N', baseMultiplier: 1 },
      { id: 'de', name: 'Delisle', symbol: '°De', baseMultiplier: 1 },
      { id: 'ro', name: 'Rømer', symbol: '°Rø', baseMultiplier: 1 },
    ]
  },
  {
    id: 'area',
    name: 'Area',
    icon: '🔲',
    units: [
      // Metric units
      { id: 'mm2', name: 'Square Millimeter', symbol: 'mm²', baseMultiplier: 0.000001 },
      { id: 'cm2', name: 'Square Centimeter', symbol: 'cm²', baseMultiplier: 0.0001 },
      { id: 'dm2', name: 'Square Decimeter', symbol: 'dm²', baseMultiplier: 0.01 },
      { id: 'm2', name: 'Square Meter', symbol: 'm²', baseMultiplier: 1 }, // Base unit
      { id: 'dam2', name: 'Square Dekameter', symbol: 'dam²', baseMultiplier: 100 },
      { id: 'hm2', name: 'Square Hectometer', symbol: 'hm²', baseMultiplier: 10000 },
      { id: 'km2', name: 'Square Kilometer', symbol: 'km²', baseMultiplier: 1000000 },
      { id: 'ha', name: 'Hectare', symbol: 'ha', baseMultiplier: 10000 },
      { id: 'a', name: 'Are', symbol: 'a', baseMultiplier: 100 },
      { id: 'ca', name: 'Centiare', symbol: 'ca', baseMultiplier: 1 },
      
      // Imperial/US units
      { id: 'mil2', name: 'Square Mil', symbol: 'mil²', baseMultiplier: 6.4516e-10 },
      { id: 'in2', name: 'Square Inch', symbol: 'in²', baseMultiplier: 0.00064516 },
      { id: 'ft2', name: 'Square Foot', symbol: 'ft²', baseMultiplier: 0.092903 },
      { id: 'yd2', name: 'Square Yard', symbol: 'yd²', baseMultiplier: 0.836127 },
      { id: 'rod2', name: 'Square Rod', symbol: 'rod²', baseMultiplier: 25.2929 },
      { id: 'rood', name: 'Rood', symbol: 'rood', baseMultiplier: 1011.71 },
      { id: 'ac', name: 'Acre', symbol: 'ac', baseMultiplier: 4046.86 },
      { id: 'mi2', name: 'Square Mile', symbol: 'mi²', baseMultiplier: 2590000 },
      { id: 'twp', name: 'Township', symbol: 'twp', baseMultiplier: 93239571.97 },
      
      // Traditional units
      { id: 'barn', name: 'Barn', symbol: 'b', baseMultiplier: 1e-28 },
      { id: 'dunam', name: 'Dunam', symbol: 'dunam', baseMultiplier: 1000 },
      { id: 'ping', name: 'Ping', symbol: 'ping', baseMultiplier: 3.3058 },
      { id: 'tsubo', name: 'Tsubo', symbol: 'tsubo', baseMultiplier: 3.3058 },
      
      // Paper sizes
      { id: 'a0', name: 'A0 Paper', symbol: 'A0', baseMultiplier: 0.999949 },
      { id: 'a1', name: 'A1 Paper', symbol: 'A1', baseMultiplier: 0.499975 },
      { id: 'a2', name: 'A2 Paper', symbol: 'A2', baseMultiplier: 0.249987 },
      { id: 'a3', name: 'A3 Paper', symbol: 'A3', baseMultiplier: 0.124994 },
      { id: 'a4', name: 'A4 Paper', symbol: 'A4', baseMultiplier: 0.0624997 },
      { id: 'letter', name: 'Letter Paper', symbol: 'letter', baseMultiplier: 0.0603226 },
      { id: 'legal', name: 'Legal Paper', symbol: 'legal', baseMultiplier: 0.0774192 },
    ]
  },
  {
    id: 'speed',
    name: 'Speed',
    icon: '🚗',
    units: [
      // Metric units
      { id: 'mps', name: 'Meters per Second', symbol: 'm/s', baseMultiplier: 1 }, // Base unit
      { id: 'kph', name: 'Kilometers per Hour', symbol: 'km/h', baseMultiplier: 0.277778 },
      { id: 'mpm', name: 'Meters per Minute', symbol: 'm/min', baseMultiplier: 0.0166667 },
      { id: 'mph', name: 'Miles per Hour', symbol: 'mph', baseMultiplier: 0.44704 },
      { id: 'fps', name: 'Feet per Second', symbol: 'ft/s', baseMultiplier: 0.3048 },
      { id: 'fpm', name: 'Feet per Minute', symbol: 'ft/min', baseMultiplier: 0.00508 },
      { id: 'ips', name: 'Inches per Second', symbol: 'in/s', baseMultiplier: 0.0254 },
      
      // Nautical and aviation
      { id: 'knot', name: 'Knot', symbol: 'kn', baseMultiplier: 0.514444 },
      { id: 'mach', name: 'Mach Number', symbol: 'M', baseMultiplier: 343 }, // At sea level
      
      // Light speed
      { id: 'c', name: 'Speed of Light', symbol: 'c', baseMultiplier: 299792458 },
      
      // Running pace (time per distance)
      { id: 'min_km', name: 'Minutes per Kilometer', symbol: 'min/km', baseMultiplier: -1 }, // Inverse
      { id: 'min_mi', name: 'Minutes per Mile', symbol: 'min/mi', baseMultiplier: -1 }, // Inverse
      
      // Swimming
      { id: 'mps_swim', name: 'Meters per Second (Swimming)', symbol: 'm/s', baseMultiplier: 1 },
      
      // Very slow speeds
      { id: 'cmh', name: 'Centimeters per Hour', symbol: 'cm/h', baseMultiplier: 0.00000278 },
      { id: 'furlong_fortnight', name: 'Furlongs per Fortnight', symbol: 'fur/fn', baseMultiplier: 0.000166309 },
    ]
  },
  {
    id: 'energy',
    name: 'Energy',
    icon: '⚡',
    units: [
      // SI units
      { id: 'j', name: 'Joule', symbol: 'J', baseMultiplier: 1 }, // Base unit
      { id: 'kj', name: 'Kilojoule', symbol: 'kJ', baseMultiplier: 1000 },
      { id: 'mj', name: 'Megajoule', symbol: 'MJ', baseMultiplier: 1000000 },
      { id: 'gj', name: 'Gigajoule', symbol: 'GJ', baseMultiplier: 1000000000 },
      
      // Electrical energy
      { id: 'wh', name: 'Watt-hour', symbol: 'Wh', baseMultiplier: 3600 },
      { id: 'kwh', name: 'Kilowatt-hour', symbol: 'kWh', baseMultiplier: 3600000 },
      { id: 'mwh', name: 'Megawatt-hour', symbol: 'MWh', baseMultiplier: 3.6e9 },
      { id: 'gwh', name: 'Gigawatt-hour', symbol: 'GWh', baseMultiplier: 3.6e12 },
      
      // Thermal energy
      { id: 'cal', name: 'Calorie', symbol: 'cal', baseMultiplier: 4.184 },
      { id: 'kcal', name: 'Kilocalorie', symbol: 'kcal', baseMultiplier: 4184 },
      { id: 'cal_it', name: 'IT Calorie', symbol: 'cal_IT', baseMultiplier: 4.1868 },
      { id: 'btu', name: 'British Thermal Unit', symbol: 'BTU', baseMultiplier: 1055.06 },
      { id: 'btu_it', name: 'IT British Thermal Unit', symbol: 'BTU_IT', baseMultiplier: 1055.06 },
      { id: 'therm', name: 'Therm', symbol: 'thm', baseMultiplier: 105506000 },
      { id: 'quad', name: 'Quad', symbol: 'quad', baseMultiplier: 1.055e18 },
      
      // Mechanical energy
      { id: 'erg', name: 'Erg', symbol: 'erg', baseMultiplier: 1e-7 },
      { id: 'ftlb', name: 'Foot-pound', symbol: 'ft·lb', baseMultiplier: 1.35582 },
      { id: 'inlb', name: 'Inch-pound', symbol: 'in·lb', baseMultiplier: 0.112985 },
      
      // Nuclear and atomic
      { id: 'ev', name: 'Electron Volt', symbol: 'eV', baseMultiplier: 1.602176634e-19 },
      { id: 'kev', name: 'Kiloelectron Volt', symbol: 'keV', baseMultiplier: 1.602176634e-16 },
      { id: 'mev', name: 'Megaelectron Volt', symbol: 'MeV', baseMultiplier: 1.602176634e-13 },
      { id: 'gev', name: 'Gigaelectron Volt', symbol: 'GeV', baseMultiplier: 1.602176634e-10 },
      
      // TNT equivalent
      { id: 'tnt_g', name: 'Gram of TNT', symbol: 'g TNT', baseMultiplier: 4184 },
      { id: 'tnt_kg', name: 'Kilogram of TNT', symbol: 'kg TNT', baseMultiplier: 4.184e6 },
      { id: 'tnt_ton', name: 'Ton of TNT', symbol: 'ton TNT', baseMultiplier: 4.184e9 },
      
      // Fuel energy
      { id: 'gasoline_l', name: 'Liter of Gasoline', symbol: 'L gas', baseMultiplier: 3.47e7 },
      { id: 'gasoline_gal', name: 'Gallon of Gasoline', symbol: 'gal gas', baseMultiplier: 1.31e8 },
      { id: 'diesel_l', name: 'Liter of Diesel', symbol: 'L diesel', baseMultiplier: 3.83e7 },
    ]
  },
  {
    id: 'power',
    name: 'Power',
    icon: '🔌',
    units: [
      // SI units
      { id: 'μw', name: 'Microwatt', symbol: 'μW', baseMultiplier: 0.000001 },
      { id: 'mw_small', name: 'Milliwatt', symbol: 'mW', baseMultiplier: 0.001 },
      { id: 'w', name: 'Watt', symbol: 'W', baseMultiplier: 1 }, // Base unit
      { id: 'kw', name: 'Kilowatt', symbol: 'kW', baseMultiplier: 1000 },
      { id: 'mw', name: 'Megawatt', symbol: 'MW', baseMultiplier: 1000000 },
      { id: 'gw', name: 'Gigawatt', symbol: 'GW', baseMultiplier: 1000000000 },
      { id: 'tw', name: 'Terawatt', symbol: 'TW', baseMultiplier: 1e12 },
      
      // Horsepower variants
      { id: 'hp', name: 'Horsepower (Mechanical)', symbol: 'hp', baseMultiplier: 745.7 },
      { id: 'hp_metric', name: 'Metric Horsepower', symbol: 'PS', baseMultiplier: 735.5 },
      { id: 'hp_electric', name: 'Electric Horsepower', symbol: 'hp(E)', baseMultiplier: 746 },
      { id: 'hp_boiler', name: 'Boiler Horsepower', symbol: 'hp(S)', baseMultiplier: 9809.5 },
      
      // Thermal power
      { id: 'btu_hr', name: 'BTU per Hour', symbol: 'BTU/h', baseMultiplier: 0.293071 },
      { id: 'btu_min', name: 'BTU per Minute', symbol: 'BTU/min', baseMultiplier: 17.5843 },
      { id: 'btu_sec', name: 'BTU per Second', symbol: 'BTU/s', baseMultiplier: 1055.06 },
      { id: 'cal_sec', name: 'Calorie per Second', symbol: 'cal/s', baseMultiplier: 4.184 },
      { id: 'kcal_hr', name: 'Kilocalorie per Hour', symbol: 'kcal/h', baseMultiplier: 1.16222 },
      
      // Traditional units
      { id: 'ftlb_sec', name: 'Foot-pound per Second', symbol: 'ft·lb/s', baseMultiplier: 1.35582 },
      { id: 'ftlb_min', name: 'Foot-pound per Minute', symbol: 'ft·lb/min', baseMultiplier: 0.0225970 },
      
      // Refrigeration
      { id: 'ton_refrig', name: 'Ton of Refrigeration', symbol: 'TR', baseMultiplier: 3516.85 },
      
      // Solar and light
      { id: 'lumen', name: 'Lumen', symbol: 'lm', baseMultiplier: 0.00146 }, // Approximate conversion
      
      // Historical/obscure
      { id: 'poncelet', name: 'Poncelet', symbol: 'p', baseMultiplier: 980.665 },
    ]
  },
  {
    id: 'data',
    name: 'Digital Storage',
    icon: '💾',
    units: [
      // Bits
      { id: 'bit', name: 'Bit', symbol: 'bit', baseMultiplier: 0.125 },
      { id: 'kbit', name: 'Kilobit', symbol: 'kbit', baseMultiplier: 128 },
      { id: 'mbit', name: 'Megabit', symbol: 'Mbit', baseMultiplier: 131072 },
      { id: 'gbit', name: 'Gigabit', symbol: 'Gbit', baseMultiplier: 134217728 },
      { id: 'tbit', name: 'Terabit', symbol: 'Tbit', baseMultiplier: 137438953472 },
      
      // Bytes (Binary - 1024 based)
      { id: 'b', name: 'Byte', symbol: 'B', baseMultiplier: 1 }, // Base unit
      { id: 'kb', name: 'Kilobyte (Binary)', symbol: 'KiB', baseMultiplier: 1024 },
      { id: 'mb', name: 'Megabyte (Binary)', symbol: 'MiB', baseMultiplier: 1048576 },
      { id: 'gb', name: 'Gigabyte (Binary)', symbol: 'GiB', baseMultiplier: 1073741824 },
      { id: 'tb', name: 'Terabyte (Binary)', symbol: 'TiB', baseMultiplier: 1.1e12 },
      { id: 'pb', name: 'Petabyte (Binary)', symbol: 'PiB', baseMultiplier: 1.13e15 },
      { id: 'eb', name: 'Exabyte (Binary)', symbol: 'EiB', baseMultiplier: 1.15e18 },
      
      // Bytes (Decimal - 1000 based)
      { id: 'kb_dec', name: 'Kilobyte (Decimal)', symbol: 'KB', baseMultiplier: 1000 },
      { id: 'mb_dec', name: 'Megabyte (Decimal)', symbol: 'MB', baseMultiplier: 1000000 },
      { id: 'gb_dec', name: 'Gigabyte (Decimal)', symbol: 'GB', baseMultiplier: 1000000000 },
      { id: 'tb_dec', name: 'Terabyte (Decimal)', symbol: 'TB', baseMultiplier: 1e12 },
      { id: 'pb_dec', name: 'Petabyte (Decimal)', symbol: 'PB', baseMultiplier: 1e15 },
      { id: 'eb_dec', name: 'Exabyte (Decimal)', symbol: 'EB', baseMultiplier: 1e18 },
      
      // Legacy units
      { id: 'nibble', name: 'Nibble', symbol: 'nibble', baseMultiplier: 0.5 },
      { id: 'word16', name: '16-bit Word', symbol: 'word', baseMultiplier: 2 },
      { id: 'word32', name: '32-bit Word', symbol: 'dword', baseMultiplier: 4 },
      { id: 'word64', name: '64-bit Word', symbol: 'qword', baseMultiplier: 8 },
      
      // Storage media
      { id: 'floppy_35', name: '3.5" Floppy Disk', symbol: 'floppy', baseMultiplier: 1474560 },
      { id: 'floppy_525', name: '5.25" Floppy Disk', symbol: 'floppy', baseMultiplier: 1228800 },
      { id: 'cd', name: 'CD (650 MB)', symbol: 'CD', baseMultiplier: 681574400 },
      { id: 'cd_700', name: 'CD (700 MB)', symbol: 'CD', baseMultiplier: 734003200 },
      { id: 'dvd', name: 'DVD (4.7 GB)', symbol: 'DVD', baseMultiplier: 5046586572.8 },
      { id: 'dvd_dl', name: 'DVD Dual Layer', symbol: 'DVD-DL', baseMultiplier: 8547991552 },
      { id: 'bluray', name: 'Blu-ray (25 GB)', symbol: 'BD', baseMultiplier: 26843545600 },
      { id: 'bluray_dl', name: 'Blu-ray Dual Layer', symbol: 'BD-DL', baseMultiplier: 53687091200 },
    ]
  },
  {
    id: 'time',
    name: 'Time',
    icon: '⏰',
    units: [
      { id: 'ms', name: 'Millisecond', symbol: 'ms', baseMultiplier: 0.001 },
      { id: 's', name: 'Second', symbol: 's', baseMultiplier: 1 }, // Base unit
      { id: 'min', name: 'Minute', symbol: 'min', baseMultiplier: 60 },
      { id: 'hr', name: 'Hour', symbol: 'hr', baseMultiplier: 3600 },
      { id: 'day', name: 'Day', symbol: 'day', baseMultiplier: 86400 },
      { id: 'week', name: 'Week', symbol: 'week', baseMultiplier: 604800 },
      { id: 'month', name: 'Month', symbol: 'month', baseMultiplier: 2629746 }, // Average month
      { id: 'year', name: 'Year', symbol: 'year', baseMultiplier: 31556952 }, // Average year
    ]
  },
  {
    id: 'pressure',
    name: 'Pressure',
    icon: '🌪️',
    units: [
      { id: 'pa', name: 'Pascal', symbol: 'Pa', baseMultiplier: 1 }, // Base unit
      { id: 'kpa', name: 'Kilopascal', symbol: 'kPa', baseMultiplier: 1000 },
      { id: 'mpa', name: 'Megapascal', symbol: 'MPa', baseMultiplier: 1000000 },
      { id: 'bar', name: 'Bar', symbol: 'bar', baseMultiplier: 100000 },
      { id: 'atm', name: 'Atmosphere', symbol: 'atm', baseMultiplier: 101325 },
      { id: 'psi', name: 'Pounds per Square Inch', symbol: 'psi', baseMultiplier: 6895 },
      { id: 'torr', name: 'Torr', symbol: 'Torr', baseMultiplier: 133.322 },
      { id: 'mmhg', name: 'Millimeter of Mercury', symbol: 'mmHg', baseMultiplier: 133.322 },
      { id: 'inhg', name: 'Inch of Mercury', symbol: 'inHg', baseMultiplier: 3386.39 },
    ]
  },
  {
    id: 'angle',
    name: 'Angle',
    icon: '📐',
    units: [
      { id: 'rad', name: 'Radian', symbol: 'rad', baseMultiplier: 1 }, // Base unit
      { id: 'deg', name: 'Degree', symbol: '°', baseMultiplier: 0.0174533 },
      { id: 'grad', name: 'Gradian', symbol: 'grad', baseMultiplier: 0.0157080 },
      { id: 'turn', name: 'Turn', symbol: 'turn', baseMultiplier: 6.28319 },
      { id: 'arcmin', name: 'Arcminute', symbol: "'", baseMultiplier: 0.000290888 },
      { id: 'arcsec', name: 'Arcsecond', symbol: '"', baseMultiplier: 0.00000484814 },
    ]
  },
  {
    id: 'frequency',
    name: 'Frequency',
    icon: '📻',
    units: [
      { id: 'hz', name: 'Hertz', symbol: 'Hz', baseMultiplier: 1 }, // Base unit
      { id: 'khz', name: 'Kilohertz', symbol: 'kHz', baseMultiplier: 1000 },
      { id: 'mhz', name: 'Megahertz', symbol: 'MHz', baseMultiplier: 1000000 },
      { id: 'ghz', name: 'Gigahertz', symbol: 'GHz', baseMultiplier: 1000000000 },
      { id: 'rpm', name: 'Revolutions per Minute', symbol: 'rpm', baseMultiplier: 0.0166667 },
      { id: 'rps', name: 'Revolutions per Second', symbol: 'rps', baseMultiplier: 1 },
    ]
  },
  {
    id: 'force',
    name: 'Force',
    icon: '💪',
    units: [
      { id: 'n', name: 'Newton', symbol: 'N', baseMultiplier: 1 }, // Base unit
      { id: 'kn', name: 'Kilonewton', symbol: 'kN', baseMultiplier: 1000 },
      { id: 'lbf', name: 'Pound Force', symbol: 'lbf', baseMultiplier: 4.44822 },
      { id: 'kgf', name: 'Kilogram Force', symbol: 'kgf', baseMultiplier: 9.80665 },
      { id: 'dyn', name: 'Dyne', symbol: 'dyn', baseMultiplier: 0.00001 },
    ]
  },
  {
    id: 'fuel',
    name: 'Fuel Economy',
    icon: '⛽',
    units: [
      { id: 'kmpl', name: 'Kilometers per Liter', symbol: 'km/L', baseMultiplier: 1 }, // Base unit
      { id: 'mpg_us', name: 'Miles per Gallon (US)', symbol: 'mpg (US)', baseMultiplier: 0.425144 },
      { id: 'mpg_uk', name: 'Miles per Gallon (UK)', symbol: 'mpg (UK)', baseMultiplier: 0.354006 },
      { id: 'l100km', name: 'Liters per 100 Kilometers', symbol: 'L/100km', baseMultiplier: -1 }, // Inverse relationship
    ]
  },
  {
    id: 'density',
    name: 'Density',
    icon: '🧱',
    units: [
      { id: 'kgm3', name: 'Kilogram per Cubic Meter', symbol: 'kg/m³', baseMultiplier: 1 }, // Base unit
      { id: 'gcm3', name: 'Gram per Cubic Centimeter', symbol: 'g/cm³', baseMultiplier: 1000 },
      { id: 'lbft3', name: 'Pound per Cubic Foot', symbol: 'lb/ft³', baseMultiplier: 16.0185 },
      { id: 'lbin3', name: 'Pound per Cubic Inch', symbol: 'lb/in³', baseMultiplier: 27679.9 },
    ]
  },
  {
    id: 'cooking',
    name: 'Cooking',
    icon: '👨‍🍳',
    units: [
      { id: 'tsp_cook', name: 'Teaspoon', symbol: 'tsp', baseMultiplier: 1 }, // Base unit (using tsp as base)
      { id: 'tbsp_cook', name: 'Tablespoon', symbol: 'tbsp', baseMultiplier: 3 },
      { id: 'cup_cook', name: 'Cup', symbol: 'cup', baseMultiplier: 48 },
      { id: 'pint_cook', name: 'Pint', symbol: 'pt', baseMultiplier: 96 },
      { id: 'quart_cook', name: 'Quart', symbol: 'qt', baseMultiplier: 192 },
      { id: 'gallon_cook', name: 'Gallon', symbol: 'gal', baseMultiplier: 768 },
      { id: 'floz_cook', name: 'Fluid Ounce', symbol: 'fl oz', baseMultiplier: 6 },
      { id: 'ml_cook', name: 'Milliliter', symbol: 'mL', baseMultiplier: 4.92892 },
      { id: 'l_cook', name: 'Liter', symbol: 'L', baseMultiplier: 202.884 },
    ]
  },
  {
    id: 'illuminance',
    name: 'Illuminance',
    icon: '💡',
    units: [
      { id: 'lux', name: 'Lux', symbol: 'lx', baseMultiplier: 1 }, // Base unit
      { id: 'footcandle', name: 'Foot-candle', symbol: 'fc', baseMultiplier: 10.764 },
      { id: 'phot', name: 'Phot', symbol: 'ph', baseMultiplier: 10000 },
    ]
  },
  {
    id: 'radiation',
    name: 'Radiation',
    icon: '☢️',
    units: [
      { id: 'gy', name: 'Gray', symbol: 'Gy', baseMultiplier: 1 }, // Base unit
      { id: 'rad_dose', name: 'Rad', symbol: 'rad', baseMultiplier: 0.01 },
      { id: 'sv', name: 'Sievert', symbol: 'Sv', baseMultiplier: 1 },
      { id: 'rem', name: 'Rem', symbol: 'rem', baseMultiplier: 0.01 },
      { id: 'bq', name: 'Becquerel', symbol: 'Bq', baseMultiplier: 1 },
      { id: 'ci', name: 'Curie', symbol: 'Ci', baseMultiplier: 37000000000 },
    ]
  }
];

// Default units to show for each category
export const DEFAULT_UNITS_BY_CATEGORY: Record<string, string[]> = {
  length: ['m', 'cm', 'ft', 'in', 'km', 'mm'],
  weight: ['kg', 'g', 'lb', 'oz', 't', 'mg'],
  volume: ['l', 'ml', 'cup_us', 'gal_us', 'm3', 'floz_us'],
  temperature: ['c', 'f', 'k', 'r'],
  area: ['m2', 'ft2', 'ha', 'ac', 'cm2', 'km2'],
  speed: ['kph', 'mph', 'mps', 'knot', 'fps'],
  energy: ['j', 'kj', 'cal', 'kcal', 'kwh', 'btu'],
  power: ['w', 'kw', 'hp', 'hp_metric', 'mw'],
  data: ['gb', 'mb', 'kb', 'tb', 'gb_dec', 'pb'],
  time: ['s', 'min', 'hr', 'day', 'ms', 'week'],
  pressure: ['pa', 'psi', 'bar', 'atm', 'kpa', 'torr'],
  angle: ['deg', 'rad', 'grad', 'turn'],
  frequency: ['hz', 'khz', 'mhz', 'ghz'],
  force: ['n', 'lbf', 'kgf', 'kn'],
  fuel: ['kmpl', 'mpg_us', 'l100km', 'mpg_uk'],
  density: ['kgm3', 'gcm3', 'lbft3', 'lbin3'],
  cooking: ['cup_cook', 'tbsp_cook', 'ml_cook', 'tsp_cook', 'floz_cook'],
  illuminance: ['lux', 'footcandle', 'phot'],
  radiation: ['gy', 'sv', 'bq', 'ci']
};

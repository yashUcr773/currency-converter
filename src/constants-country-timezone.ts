// Comprehensive mapping of countries/territories to timezone identifiers
// Includes countries that follow other countries' timezones
export const COUNTRY_TO_TIMEZONE: Record<string, string> = {
  // North America
  'united states': 'America/New_York',
  'usa': 'America/New_York',
  'us': 'America/New_York',
  'america': 'America/New_York',
  'canada': 'America/Toronto',
  'mexico': 'America/Mexico_City',
  
  // Europe
  'united kingdom': 'Europe/London',
  'uk': 'Europe/London',
  'britain': 'Europe/London',
  'england': 'Europe/London',
  'scotland': 'Europe/London',
  'wales': 'Europe/London',
  'northern ireland': 'Europe/London',
  'ireland': 'Europe/Dublin',
  'france': 'Europe/Paris',
  'germany': 'Europe/Berlin',
  'spain': 'Europe/Madrid',
  'italy': 'Europe/Rome',
  'netherlands': 'Europe/Amsterdam',
  'belgium': 'Europe/Brussels',
  'switzerland': 'Europe/Zurich',
  'austria': 'Europe/Vienna',
  'portugal': 'Europe/Lisbon',
  'sweden': 'Europe/Stockholm',
  'norway': 'Europe/Oslo',
  'denmark': 'Europe/Copenhagen',
  'finland': 'Europe/Helsinki',
  'poland': 'Europe/Warsaw',
  'russia': 'Europe/Moscow',
  'greece': 'Europe/Athens',
  'turkey': 'Europe/Istanbul',
  'czech republic': 'Europe/Prague',
  'czechia': 'Europe/Prague',
  'hungary': 'Europe/Budapest',
  'romania': 'Europe/Bucharest',
  'bulgaria': 'Europe/Sofia',
  'croatia': 'Europe/Zagreb',
  'serbia': 'Europe/Belgrade',
  'ukraine': 'Europe/Kiev',
  
  // Asia
  'china': 'Asia/Shanghai',
  'japan': 'Asia/Tokyo',
  'south korea': 'Asia/Seoul',
  'korea': 'Asia/Seoul',
  'india': 'Asia/Kolkata',
  'singapore': 'Asia/Singapore',
  'thailand': 'Asia/Bangkok',
  'vietnam': 'Asia/Ho_Chi_Minh',
  'philippines': 'Asia/Manila',
  'indonesia': 'Asia/Jakarta',
  'malaysia': 'Asia/Kuala_Lumpur',
  'hong kong': 'Asia/Hong_Kong',
  'taiwan': 'Asia/Taipei',
  'israel': 'Asia/Jerusalem',
  'saudi arabia': 'Asia/Riyadh',
  'united arab emirates': 'Asia/Dubai',
  'uae': 'Asia/Dubai',
  'dubai': 'Asia/Dubai',
  'qatar': 'Asia/Qatar',
  'kuwait': 'Asia/Kuwait',
  'iran': 'Asia/Tehran',
  'iraq': 'Asia/Baghdad',
  'pakistan': 'Asia/Karachi',
  'bangladesh': 'Asia/Dhaka',
  'sri lanka': 'Asia/Colombo',
  'myanmar': 'Asia/Yangon',
  'cambodia': 'Asia/Phnom_Penh',
  'laos': 'Asia/Vientiane',
  'mongolia': 'Asia/Ulaanbaatar',
  'nepal': 'Asia/Kathmandu',
  'afghanistan': 'Asia/Kabul',
  'uzbekistan': 'Asia/Tashkent',
  'kazakhstan': 'Asia/Almaty',
  
  // Africa
  'south africa': 'Africa/Johannesburg',
  'egypt': 'Africa/Cairo',
  'nigeria': 'Africa/Lagos',
  'kenya': 'Africa/Nairobi',
  'morocco': 'Africa/Casablanca',
  'algeria': 'Africa/Algiers',
  'tunisia': 'Africa/Tunis',
  'libya': 'Africa/Tripoli',
  'ethiopia': 'Africa/Addis_Ababa',
  'ghana': 'Africa/Accra',
  'senegal': 'Africa/Dakar',
  'ivory coast': 'Africa/Abidjan',
  'cameroon': 'Africa/Douala',
  'democratic republic of congo': 'Africa/Kinshasa',
  'congo': 'Africa/Kinshasa',
  'angola': 'Africa/Luanda',
  'zimbabwe': 'Africa/Harare',
  'zambia': 'Africa/Lusaka',
  'tanzania': 'Africa/Dar_es_Salaam',
  'uganda': 'Africa/Kampala',
  'madagascar': 'Indian/Antananarivo',
  'mauritius': 'Indian/Mauritius',
  
  // Oceania
  'australia': 'Australia/Sydney',
  'new zealand': 'Pacific/Auckland',
  'fiji': 'Pacific/Fiji',
  'papua new guinea': 'Pacific/Port_Moresby',
  'solomon islands': 'Pacific/Guadalcanal',
  'vanuatu': 'Pacific/Efate',
  'new caledonia': 'Pacific/Noumea',
  'samoa': 'Pacific/Apia',
  'tonga': 'Pacific/Tongatapu',
  'palau': 'Pacific/Palau',
  'guam': 'Pacific/Guam',
  'marshall islands': 'Pacific/Majuro',
  'micronesia': 'Pacific/Chuuk',
  
  // South America
  'brazil': 'America/Sao_Paulo',
  'argentina': 'America/Argentina/Buenos_Aires',
  'chile': 'America/Santiago',
  'colombia': 'America/Bogota',
  'peru': 'America/Lima',
  'venezuela': 'America/Caracas',
  'ecuador': 'America/Guayaquil',
  'bolivia': 'America/La_Paz',
  'uruguay': 'America/Montevideo',
  'paraguay': 'America/Asuncion',
  'guyana': 'America/Guyana',
  'suriname': 'America/Paramaribo',
  'french guiana': 'America/Cayenne',
  
  // Caribbean & Central America
  'cuba': 'America/Havana',
  'jamaica': 'America/Jamaica',
  'haiti': 'America/Port-au-Prince',
  'dominican republic': 'America/Santo_Domingo',
  'puerto rico': 'America/Puerto_Rico',
  'bahamas': 'America/Nassau',
  'barbados': 'America/Barbados',
  'trinidad and tobago': 'America/Port_of_Spain',
  'guatemala': 'America/Guatemala',
  'belize': 'America/Belize',
  'honduras': 'America/Tegucigalpa',
  'el salvador': 'America/El_Salvador',
  'nicaragua': 'America/Managua',
  'costa rica': 'America/Costa_Rica',
  'panama': 'America/Panama',
  
  // Countries/territories that follow other timezones
  'monaco': 'Europe/Paris', // Follows France
  'vatican': 'Europe/Rome', // Follows Italy
  'san marino': 'Europe/Rome', // Follows Italy
  'liechtenstein': 'Europe/Zurich', // Follows Switzerland
  'andorra': 'Europe/Madrid', // Follows Spain
  'luxembourg': 'Europe/Brussels', // Follows Belgium
  'malta': 'Europe/Rome', // Follows Central European Time
  'cyprus': 'Europe/Athens', // Follows Eastern European Time
  'iceland': 'Atlantic/Reykjavik',
  
  // British territories following UK time
  'jersey': 'Europe/London',
  'guernsey': 'Europe/London',
  'isle of man': 'Europe/London',
  'gibraltar': 'Europe/London',
  'falkland islands': 'Atlantic/Stanley',
  
  // French territories
  'martinique': 'America/Martinique',
  'guadeloupe': 'America/Guadeloupe',
  'reunion': 'Indian/Reunion',
  'mayotte': 'Indian/Mayotte',
  'french polynesia': 'Pacific/Tahiti',
  
  // US territories
  'american samoa': 'Pacific/Pago_Pago',
  'virgin islands': 'America/St_Thomas',
  'northern mariana islands': 'Pacific/Saipan',
  
  // Other territories and dependencies
  'greenland': 'America/Godthab',
  'faroe islands': 'Atlantic/Faroe',
  'bermuda': 'Atlantic/Bermuda',
  'cayman islands': 'America/Cayman',
  'turks and caicos': 'America/Grand_Turk',
  'british virgin islands': 'America/Tortola',
  'anguilla': 'America/Anguilla',
  'montserrat': 'America/Montserrat',
  'saint kitts and nevis': 'America/St_Kitts',
  'antigua and barbuda': 'America/Antigua',
  'dominica': 'America/Dominica',
  'saint lucia': 'America/St_Lucia',
  'saint vincent and the grenadines': 'America/St_Vincent',
  'grenada': 'America/Grenada',
  'aruba': 'America/Aruba',
  'curacao': 'America/Curacao',
  'bonaire': 'America/Kralendijk',
  
  // Pacific territories
  'cook islands': 'Pacific/Rarotonga',
  'kiribati': 'Pacific/Tarawa',
  'nauru': 'Pacific/Nauru',
  'niue': 'Pacific/Niue',
  'norfolk island': 'Pacific/Norfolk',
  'pitcairn islands': 'Pacific/Pitcairn',
  'tokelau': 'Pacific/Fakaofo',
  'tuvalu': 'Pacific/Funafuti',
  'wallis and futuna': 'Pacific/Wallis',
  
  // Antarctic territories (using research station times)
  'antarctica': 'Antarctica/McMurdo',
};

// Additional country aliases and common variations
export const COUNTRY_ALIASES: Record<string, string[]> = {
  'united states': ['usa', 'us', 'america', 'united states of america'],
  'united kingdom': ['uk', 'britain', 'great britain', 'england', 'scotland', 'wales'],
  'south korea': ['korea', 'republic of korea'],
  'north korea': ['democratic people\'s republic of korea', 'dprk'],
  'czech republic': ['czechia'],
  'democratic republic of congo': ['congo', 'drc', 'congo-kinshasa'],
  'republic of congo': ['congo-brazzaville'],
  'ivory coast': ['cote d\'ivoire'],
  'cape verde': ['cabo verde'],
  'east timor': ['timor-leste'],
  'myanmar': ['burma'],
  'swaziland': ['eswatini'],
  'macedonia': ['north macedonia'],
  'bosnia': ['bosnia and herzegovina'],
  'trinidad': ['trinidad and tobago'],
  'saint kitts': ['saint kitts and nevis'],
  'saint vincent': ['saint vincent and the grenadines'],
  'papua new guinea': ['png'],
  'uae': ['united arab emirates'],
  'usa': ['united states'],
};

// Function to find timezone by country name
export const findTimezoneByCountry = (countryName: string): string | null => {
  const normalizedName = countryName.toLowerCase().trim();
  
  // Direct match
  if (COUNTRY_TO_TIMEZONE[normalizedName]) {
    return COUNTRY_TO_TIMEZONE[normalizedName];
  }
  
  // Check aliases
  for (const [mainCountry, aliases] of Object.entries(COUNTRY_ALIASES)) {
    if (aliases.includes(normalizedName)) {
      return COUNTRY_TO_TIMEZONE[mainCountry];
    }
  }
  
  // Partial match (for cases like "United" matching "United States")
  for (const [country, timezone] of Object.entries(COUNTRY_TO_TIMEZONE)) {
    if (country.includes(normalizedName) || normalizedName.includes(country.split(' ')[0])) {
      return timezone;
    }
  }
  
  return null;
};

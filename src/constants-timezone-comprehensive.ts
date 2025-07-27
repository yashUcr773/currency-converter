import type { Timezone } from './types';

// Comprehensive timezone list with all major world timezones
export const ALL_TIMEZONES: Timezone[] = [
  // North America - United States
  {
    id: 'america-new-york',
    value: 'America/New_York',
    label: 'New York (Eastern)',
    country: 'United States',
    flag: '🇺🇸',
    utcOffset: -300
  },
  {
    id: 'america-chicago',
    value: 'America/Chicago',
    label: 'Chicago (Central)',
    country: 'United States',
    flag: '🇺🇸',
    utcOffset: -360
  },
  {
    id: 'america-denver',
    value: 'America/Denver',
    label: 'Denver (Mountain)',
    country: 'United States',
    flag: '🇺🇸',
    utcOffset: -420
  },
  {
    id: 'america-los-angeles',
    value: 'America/Los_Angeles',
    label: 'Los Angeles (Pacific)',
    country: 'United States',
    flag: '🇺🇸',
    utcOffset: -480
  },
  {
    id: 'anchorage-alaska',
    value: 'America/Anchorage',
    label: 'Anchorage (Alaska)',
    country: 'United States',
    flag: '🇺🇸',
    utcOffset: -540
  },
  {
    id: 'honolulu-hawaii',
    value: 'Pacific/Honolulu',
    label: 'Honolulu (Hawaii)',
    country: 'United States',
    flag: '🇺🇸',
    utcOffset: -600
  },
  {
    id: 'phoenix-arizona',
    value: 'America/Phoenix',
    label: 'Phoenix (Arizona)',
    country: 'United States',
    flag: '🇺🇸',
    utcOffset: -420
  },

  // North America - Canada
  {
    id: 'toronto-eastern',
    value: 'America/Toronto',
    label: 'Toronto (Eastern)',
    country: 'Canada',
    flag: '🇨🇦',
    utcOffset: -300
  },
  {
    id: 'vancouver-pacific',
    value: 'America/Vancouver',
    label: 'Vancouver (Pacific)',
    country: 'Canada',
    flag: '🇨🇦',
    utcOffset: -480
  },
  {
    id: 'winnipeg-central',
    value: 'America/Winnipeg',
    label: 'Winnipeg (Central)',
    country: 'Canada',
    flag: '🇨🇦',
    utcOffset: -360
  },
  {
    id: 'edmonton-mountain',
    value: 'America/Edmonton',
    label: 'Edmonton (Mountain)',
    country: 'Canada',
    flag: '🇨🇦',
    utcOffset: -420
  },
  {
    id: 'halifax-atlantic',
    value: 'America/Halifax',
    label: 'Halifax (Atlantic)',
    country: 'Canada',
    flag: '🇨🇦',
    utcOffset: -240
  },
  {
    id: 'st-johns-newfoundland',
    value: 'America/St_Johns',
    label: 'St. Johns (Newfoundland)',
    country: 'Canada',
    flag: '🇨🇦',
    utcOffset: -150
  },

  // North America - Mexico
  {
    id: 'mexico-city',
    value: 'America/Mexico_City',
    label: 'Mexico City',
    country: 'Mexico',
    flag: '🇲🇽',
    utcOffset: -360
  },
  {
    id: 'tijuana',
    value: 'America/Tijuana',
    label: 'Tijuana',
    country: 'Mexico',
    flag: '🇲🇽',
    utcOffset: -480
  },
  {
    id: 'cancun',
    value: 'America/Cancun',
    label: 'Cancun',
    country: 'Mexico',
    flag: '🇲🇽',
    utcOffset: -300
  },

  // Europe - United Kingdom
  {
    id: 'london',
    value: 'Europe/London',
    label: 'London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    utcOffset: 0
  },

  // Europe - Germany
  {
    id: 'berlin',
    value: 'Europe/Berlin',
    label: 'Berlin',
    country: 'Germany',
    flag: '🇩🇪',
    utcOffset: 60
  },

  // Europe - France
  {
    id: 'paris',
    value: 'Europe/Paris',
    label: 'Paris',
    country: 'France',
    flag: '🇫🇷',
    utcOffset: 60
  },

  // Europe - Spain
  {
    id: 'madrid',
    value: 'Europe/Madrid',
    label: 'Madrid',
    country: 'Spain',
    flag: '🇪🇸',
    utcOffset: 60
  },
  {
    id: 'canary-islands',
    value: 'Atlantic/Canary',
    label: 'Canary Islands',
    country: 'Spain',
    flag: '🇪🇸',
    utcOffset: 0
  },

  // Europe - Italy
  {
    id: 'rome',
    value: 'Europe/Rome',
    label: 'Rome',
    country: 'Italy',
    flag: '🇮🇹',
    utcOffset: 60
  },

  // Europe - Netherlands
  {
    id: 'amsterdam',
    value: 'Europe/Amsterdam',
    label: 'Amsterdam',
    country: 'Netherlands',
    flag: '🇳🇱',
    utcOffset: 60
  },

  // Europe - Switzerland
  {
    id: 'zurich',
    value: 'Europe/Zurich',
    label: 'Zurich',
    country: 'Switzerland',
    flag: '🇨🇭',
    utcOffset: 60
  },

  // Europe - Austria
  {
    id: 'vienna',
    value: 'Europe/Vienna',
    label: 'Vienna',
    country: 'Austria',
    flag: '🇦🇹',
    utcOffset: 60
  },

  // Europe - Belgium
  {
    id: 'brussels',
    value: 'Europe/Brussels',
    label: 'Brussels',
    country: 'Belgium',
    flag: '🇧🇪',
    utcOffset: 60
  },

  // Europe - Portugal
  {
    id: 'lisbon',
    value: 'Europe/Lisbon',
    label: 'Lisbon',
    country: 'Portugal',
    flag: '🇵🇹',
    utcOffset: 0
  },

  // Europe - Sweden
  {
    id: 'stockholm',
    value: 'Europe/Stockholm',
    label: 'Stockholm',
    country: 'Sweden',
    flag: '🇸🇪',
    utcOffset: 60
  },

  // Europe - Norway
  {
    id: 'oslo',
    value: 'Europe/Oslo',
    label: 'Oslo',
    country: 'Norway',
    flag: '🇳🇴',
    utcOffset: 60
  },

  // Europe - Denmark
  {
    id: 'copenhagen',
    value: 'Europe/Copenhagen',
    label: 'Copenhagen',
    country: 'Denmark',
    flag: '🇩🇰',
    utcOffset: 60
  },

  // Europe - Finland
  {
    id: 'helsinki',
    value: 'Europe/Helsinki',
    label: 'Helsinki',
    country: 'Finland',
    flag: '🇫🇮',
    utcOffset: 120
  },

  // Europe - Poland
  {
    id: 'warsaw',
    value: 'Europe/Warsaw',
    label: 'Warsaw',
    country: 'Poland',
    flag: '🇵🇱',
    utcOffset: 60
  },

  // Europe - Czech Republic
  {
    id: 'prague',
    value: 'Europe/Prague',
    label: 'Prague',
    country: 'Czech Republic',
    flag: '🇨🇿',
    utcOffset: 60
  },

  // Europe - Hungary
  {
    id: 'budapest',
    value: 'Europe/Budapest',
    label: 'Budapest',
    country: 'Hungary',
    flag: '🇭🇺',
    utcOffset: 60
  },

  // Europe - Romania
  {
    id: 'bucharest',
    value: 'Europe/Bucharest',
    label: 'Bucharest',
    country: 'Romania',
    flag: '🇷🇴',
    utcOffset: 120
  },

  // Europe - Bulgaria
  {
    id: 'sofia',
    value: 'Europe/Sofia',
    label: 'Sofia',
    country: 'Bulgaria',
    flag: '🇧🇬',
    utcOffset: 120
  },

  // Europe - Greece
  {
    id: 'athens',
    value: 'Europe/Athens',
    label: 'Athens',
    country: 'Greece',
    flag: '🇬🇷',
    utcOffset: 120
  },

  // Europe - Turkey
  {
    id: 'istanbul',
    value: 'Europe/Istanbul',
    label: 'Istanbul',
    country: 'Turkey',
    flag: '🇹🇷',
    utcOffset: 180
  },

  // Europe - Russia
  {
    id: 'moscow',
    value: 'Europe/Moscow',
    label: 'Moscow',
    country: 'Russia',
    flag: '🇷🇺',
    utcOffset: 180
  },
  {
    id: 'yekaterinburg',
    value: 'Asia/Yekaterinburg',
    label: 'Yekaterinburg',
    country: 'Russia',
    flag: '🇷🇺',
    utcOffset: 300
  },
  {
    id: 'novosibirsk',
    value: 'Asia/Novosibirsk',
    label: 'Novosibirsk',
    country: 'Russia',
    flag: '🇷🇺',
    utcOffset: 420
  },
  {
    id: 'krasnoyarsk',
    value: 'Asia/Krasnoyarsk',
    label: 'Krasnoyarsk',
    country: 'Russia',
    flag: '🇷🇺',
    utcOffset: 420
  },
  {
    id: 'irkutsk',
    value: 'Asia/Irkutsk',
    label: 'Irkutsk',
    country: 'Russia',
    flag: '🇷🇺',
    utcOffset: 480
  },
  {
    id: 'vladivostok',
    value: 'Asia/Vladivostok',
    label: 'Vladivostok',
    country: 'Russia',
    flag: '🇷🇺',
    utcOffset: 600
  },

  // Europe - Iceland
  {
    id: 'reykjavik',
    value: 'Atlantic/Reykjavik',
    label: 'Reykjavik',
    country: 'Iceland',
    flag: '🇮🇸',
    utcOffset: 0
  },

  // Europe - Ireland
  {
    id: 'dublin',
    value: 'Europe/Dublin',
    label: 'Dublin',
    country: 'Ireland',
    flag: '🇮🇪',
    utcOffset: 0
  },

  // Europe - Croatia
  {
    id: 'zagreb',
    value: 'Europe/Zagreb',
    label: 'Zagreb',
    country: 'Croatia',
    flag: '🇭🇷',
    utcOffset: 60
  },

  // Europe - Serbia
  {
    id: 'belgrade',
    value: 'Europe/Belgrade',
    label: 'Belgrade',
    country: 'Serbia',
    flag: '🇷🇸',
    utcOffset: 60
  },

  // Europe - Ukraine
  {
    id: 'kiev',
    value: 'Europe/Kiev',
    label: 'Kiev',
    country: 'Ukraine',
    flag: '🇺🇦',
    utcOffset: 120
  },

  // Asia - China
  {
    id: 'shanghai',
    value: 'Asia/Shanghai',
    label: 'Shanghai',
    country: 'China',
    flag: '🇨🇳',
    utcOffset: 480
  },
  {
    id: 'beijing',
    value: 'Asia/Shanghai',
    label: 'Beijing',
    country: 'China',
    flag: '🇨🇳',
    utcOffset: 480
  },
  {
    id: 'hong-kong',
    value: 'Asia/Hong_Kong',
    label: 'Hong Kong',
    country: 'Hong Kong',
    flag: '🇭🇰',
    utcOffset: 480
  },

  // Asia - Japan
  {
    id: 'tokyo',
    value: 'Asia/Tokyo',
    label: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    utcOffset: 540
  },

  // Asia - South Korea
  {
    id: 'seoul',
    value: 'Asia/Seoul',
    label: 'Seoul',
    country: 'South Korea',
    flag: '🇰🇷',
    utcOffset: 540
  },

  // Asia - India
  {
    id: 'kolkata',
    value: 'Asia/Kolkata',
    label: 'Kolkata',
    country: 'India',
    flag: '🇮🇳',
    utcOffset: 330
  },
  {
    id: 'mumbai',
    value: 'Asia/Kolkata',
    label: 'Mumbai',
    country: 'India',
    flag: '🇮🇳',
    utcOffset: 330
  },
  {
    id: 'delhi',
    value: 'Asia/Kolkata',
    label: 'Delhi',
    country: 'India',
    flag: '🇮🇳',
    utcOffset: 330
  },

  // Asia - Singapore
  {
    id: 'singapore',
    value: 'Asia/Singapore',
    label: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    utcOffset: 480
  },

  // Asia - Thailand
  {
    id: 'bangkok',
    value: 'Asia/Bangkok',
    label: 'Bangkok',
    country: 'Thailand',
    flag: '🇹🇭',
    utcOffset: 420
  },

  // Asia - Vietnam
  {
    id: 'ho-chi-minh-city',
    value: 'Asia/Ho_Chi_Minh',
    label: 'Ho Chi Minh City',
    country: 'Vietnam',
    flag: '🇻🇳',
    utcOffset: 420
  },

  // Asia - Philippines
  {
    id: 'manila',
    value: 'Asia/Manila',
    label: 'Manila',
    country: 'Philippines',
    flag: '🇵🇭',
    utcOffset: 480
  },

  // Asia - Indonesia
  {
    id: 'jakarta-western',
    value: 'Asia/Jakarta',
    label: 'Jakarta (Western)',
    country: 'Indonesia',
    flag: '🇮🇩',
    utcOffset: 420
  },
  {
    id: 'makassar-central',
    value: 'Asia/Makassar',
    label: 'Makassar (Central)',
    country: 'Indonesia',
    flag: '🇮🇩',
    utcOffset: 480
  },
  {
    id: 'jayapura-eastern',
    value: 'Asia/Jayapura',
    label: 'Jayapura (Eastern)',
    country: 'Indonesia',
    flag: '🇮🇩',
    utcOffset: 540
  },

  // Asia - Malaysia
  {
    id: 'kuala-lumpur',
    value: 'Asia/Kuala_Lumpur',
    label: 'Kuala Lumpur',
    country: 'Malaysia',
    flag: '🇲🇾',
    utcOffset: 480
  },

  // Asia - Taiwan
  {
    id: 'taipei',
    value: 'Asia/Taipei',
    label: 'Taipei',
    country: 'Taiwan',
    flag: '🇹🇼',
    utcOffset: 480
  },

  // Asia - Israel
  {
    id: 'jerusalem',
    value: 'Asia/Jerusalem',
    label: 'Jerusalem',
    country: 'Israel',
    flag: '🇮🇱',
    utcOffset: 120
  },

  // Asia - Saudi Arabia
  {
    id: 'riyadh',
    value: 'Asia/Riyadh',
    label: 'Riyadh',
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    utcOffset: 180
  },

  // Asia - UAE
  {
    id: 'dubai',
    value: 'Asia/Dubai',
    label: 'Dubai',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    utcOffset: 240
  },

  // Asia - Qatar
  {
    id: 'doha',
    value: 'Asia/Qatar',
    label: 'Doha',
    country: 'Qatar',
    flag: '🇶🇦',
    utcOffset: 180
  },

  // Asia - Kuwait
  {
    id: 'kuwait-city',
    value: 'Asia/Kuwait',
    label: 'Kuwait City',
    country: 'Kuwait',
    flag: '🇰🇼',
    utcOffset: 180
  },

  // Asia - Iran
  {
    id: 'tehran',
    value: 'Asia/Tehran',
    label: 'Tehran',
    country: 'Iran',
    flag: '🇮🇷',
    utcOffset: 210
  },

  // Asia - Iraq
  {
    id: 'baghdad',
    value: 'Asia/Baghdad',
    label: 'Baghdad',
    country: 'Iraq',
    flag: '🇮🇶',
    utcOffset: 180
  },

  // Asia - Pakistan
  {
    id: 'karachi',
    value: 'Asia/Karachi',
    label: 'Karachi',
    country: 'Pakistan',
    flag: '🇵🇰',
    utcOffset: 300
  },

  // Asia - Bangladesh
  {
    id: 'dhaka',
    value: 'Asia/Dhaka',
    label: 'Dhaka',
    country: 'Bangladesh',
    flag: '🇧🇩',
    utcOffset: 360
  },

  // Asia - Sri Lanka
  {
    id: 'colombo',
    value: 'Asia/Colombo',
    label: 'Colombo',
    country: 'Sri Lanka',
    flag: '🇱🇰',
    utcOffset: 330
  },

  // Asia - Myanmar
  {
    id: 'yangon',
    value: 'Asia/Yangon',
    label: 'Yangon',
    country: 'Myanmar',
    flag: '🇲🇲',
    utcOffset: 390
  },

  // Asia - Cambodia
  {
    id: 'phnom-penh',
    value: 'Asia/Phnom_Penh',
    label: 'Phnom Penh',
    country: 'Cambodia',
    flag: '🇰🇭',
    utcOffset: 420
  },

  // Asia - Laos
  {
    id: 'vientiane',
    value: 'Asia/Vientiane',
    label: 'Vientiane',
    country: 'Laos',
    flag: '🇱🇦',
    utcOffset: 420
  },

  // Asia - Mongolia
  {
    id: 'ulaanbaatar',
    value: 'Asia/Ulaanbaatar',
    label: 'Ulaanbaatar',
    country: 'Mongolia',
    flag: '🇲🇳',
    utcOffset: 480
  },

  // Asia - Nepal
  {
    id: 'kathmandu',
    value: 'Asia/Kathmandu',
    label: 'Kathmandu',
    country: 'Nepal',
    flag: '🇳🇵',
    utcOffset: 345
  },

  // Asia - Afghanistan
  {
    id: 'kabul',
    value: 'Asia/Kabul',
    label: 'Kabul',
    country: 'Afghanistan',
    flag: '🇦🇫',
    utcOffset: 270
  },

  // Asia - Uzbekistan
  {
    id: 'tashkent',
    value: 'Asia/Tashkent',
    label: 'Tashkent',
    country: 'Uzbekistan',
    flag: '🇺🇿',
    utcOffset: 300
  },

  // Asia - Kazakhstan
  {
    id: 'almaty',
    value: 'Asia/Almaty',
    label: 'Almaty',
    country: 'Kazakhstan',
    flag: '🇰🇿',
    utcOffset: 360
  },

  // Africa - South Africa
  {
    id: 'johannesburg',
    value: 'Africa/Johannesburg',
    label: 'Johannesburg',
    country: 'South Africa',
    flag: '🇿🇦',
    utcOffset: 120
  },
  {
    id: 'cape-town',
    value: 'Africa/Johannesburg',
    label: 'Cape Town',
    country: 'South Africa',
    flag: '🇿🇦',
    utcOffset: 120
  },

  // Africa - Egypt
  {
    id: 'cairo',
    value: 'Africa/Cairo',
    label: 'Cairo',
    country: 'Egypt',
    flag: '🇪🇬',
    utcOffset: 120
  },

  // Africa - Nigeria
  {
    id: 'lagos',
    value: 'Africa/Lagos',
    label: 'Lagos',
    country: 'Nigeria',
    flag: '🇳🇬',
    utcOffset: 60
  },

  // Africa - Kenya
  {
    id: 'nairobi',
    value: 'Africa/Nairobi',
    label: 'Nairobi',
    country: 'Kenya',
    flag: '🇰🇪',
    utcOffset: 180
  },

  // Africa - Morocco
  {
    id: 'casablanca',
    value: 'Africa/Casablanca',
    label: 'Casablanca',
    country: 'Morocco',
    flag: '🇲🇦',
    utcOffset: 60
  },

  // Africa - Algeria
  {
    id: 'algiers',
    value: 'Africa/Algiers',
    label: 'Algiers',
    country: 'Algeria',
    flag: '🇩🇿',
    utcOffset: 60
  },

  // Africa - Tunisia
  {
    id: 'tunis',
    value: 'Africa/Tunis',
    label: 'Tunis',
    country: 'Tunisia',
    flag: '🇹🇳',
    utcOffset: 60
  },

  // Africa - Libya
  {
    id: 'tripoli',
    value: 'Africa/Tripoli',
    label: 'Tripoli',
    country: 'Libya',
    flag: '🇱🇾',
    utcOffset: 120
  },

  // Africa - Ethiopia
  {
    id: 'addis-ababa',
    value: 'Africa/Addis_Ababa',
    label: 'Addis Ababa',
    country: 'Ethiopia',
    flag: '🇪🇹',
    utcOffset: 180
  },

  // Africa - Ghana
  {
    id: 'accra',
    value: 'Africa/Accra',
    label: 'Accra',
    country: 'Ghana',
    flag: '🇬🇭',
    utcOffset: 0
  },

  // Africa - Senegal
  {
    id: 'dakar',
    value: 'Africa/Dakar',
    label: 'Dakar',
    country: 'Senegal',
    flag: '🇸🇳',
    utcOffset: 0
  },

  // Africa - Ivory Coast
  {
    id: 'abidjan',
    value: 'Africa/Abidjan',
    label: 'Abidjan',
    country: 'Ivory Coast',
    flag: '🇨🇮',
    utcOffset: 0
  },

  // Africa - Cameroon
  {
    id: 'douala',
    value: 'Africa/Douala',
    label: 'Douala',
    country: 'Cameroon',
    flag: '🇨🇲',
    utcOffset: 60
  },

  // Africa - Democratic Republic of Congo
  {
    id: 'kinshasa-western',
    value: 'Africa/Kinshasa',
    label: 'Kinshasa (Western)',
    country: 'Democratic Republic of Congo',
    flag: '🇨🇩',
    utcOffset: 60
  },
  {
    id: 'lubumbashi-eastern',
    value: 'Africa/Lubumbashi',
    label: 'Lubumbashi (Eastern)',
    country: 'Democratic Republic of Congo',
    flag: '🇨🇩',
    utcOffset: 120
  },

  // Africa - Angola
  {
    id: 'luanda',
    value: 'Africa/Luanda',
    label: 'Luanda',
    country: 'Angola',
    flag: '🇦🇴',
    utcOffset: 60
  },

  // Africa - Zimbabwe
  {
    id: 'harare',
    value: 'Africa/Harare',
    label: 'Harare',
    country: 'Zimbabwe',
    flag: '🇿🇼',
    utcOffset: 120
  },

  // Africa - Zambia
  {
    id: 'lusaka',
    value: 'Africa/Lusaka',
    label: 'Lusaka',
    country: 'Zambia',
    flag: '🇿🇲',
    utcOffset: 120
  },

  // Africa - Tanzania
  {
    id: 'dar-es-salaam',
    value: 'Africa/Dar_es_Salaam',
    label: 'Dar es Salaam',
    country: 'Tanzania',
    flag: '🇹🇿',
    utcOffset: 180
  },

  // Africa - Uganda
  {
    id: 'kampala',
    value: 'Africa/Kampala',
    label: 'Kampala',
    country: 'Uganda',
    flag: '🇺🇬',
    utcOffset: 180
  },

  // Africa - Madagascar
  {
    id: 'antananarivo',
    value: 'Indian/Antananarivo',
    label: 'Antananarivo',
    country: 'Madagascar',
    flag: '🇲🇬',
    utcOffset: 180
  },

  // Africa - Mauritius
  {
    id: 'port-louis',
    value: 'Indian/Mauritius',
    label: 'Port Louis',
    country: 'Mauritius',
    flag: '🇲🇺',
    utcOffset: 240
  },

  // Oceania - Australia
  {
    id: 'sydney-eastern',
    value: 'Australia/Sydney',
    label: 'Sydney (Eastern)',
    country: 'Australia',
    flag: '🇦🇺',
    utcOffset: 600
  },
  {
    id: 'melbourne-eastern',
    value: 'Australia/Melbourne',
    label: 'Melbourne (Eastern)',
    country: 'Australia',
    flag: '🇦🇺',
    utcOffset: 600
  },
  {
    id: 'brisbane-eastern',
    value: 'Australia/Brisbane',
    label: 'Brisbane (Eastern)',
    country: 'Australia',
    flag: '🇦🇺',
    utcOffset: 600
  },
  {
    id: 'perth-western',
    value: 'Australia/Perth',
    label: 'Perth (Western)',
    country: 'Australia',
    flag: '🇦🇺',
    utcOffset: 480
  },
  {
    id: 'adelaide-central',
    value: 'Australia/Adelaide',
    label: 'Adelaide (Central)',
    country: 'Australia',
    flag: '🇦🇺',
    utcOffset: 570
  },
  {
    id: 'darwin-central',
    value: 'Australia/Darwin',
    label: 'Darwin (Central)',
    country: 'Australia',
    flag: '🇦🇺',
    utcOffset: 570
  },

  // Oceania - New Zealand
  {
    id: 'auckland',
    value: 'Pacific/Auckland',
    label: 'Auckland',
    country: 'New Zealand',
    flag: '🇳🇿',
    utcOffset: 720
  },

  // Oceania - Fiji
  {
    id: 'suva',
    value: 'Pacific/Fiji',
    label: 'Suva',
    country: 'Fiji',
    flag: '🇫🇯',
    utcOffset: 720
  },

  // Oceania - Papua New Guinea
  {
    id: 'port-moresby',
    value: 'Pacific/Port_Moresby',
    label: 'Port Moresby',
    country: 'Papua New Guinea',
    flag: '🇵🇬',
    utcOffset: 600
  },

  // Oceania - Solomon Islands
  {
    id: 'honiara',
    value: 'Pacific/Guadalcanal',
    label: 'Honiara',
    country: 'Solomon Islands',
    flag: '🇸🇧',
    utcOffset: 660
  },

  // Oceania - Vanuatu
  {
    id: 'port-vila',
    value: 'Pacific/Efate',
    label: 'Port Vila',
    country: 'Vanuatu',
    flag: '🇻🇺',
    utcOffset: 660
  },

  // Oceania - New Caledonia
  {
    id: 'noumea',
    value: 'Pacific/Noumea',
    label: 'Noumea',
    country: 'New Caledonia',
    flag: '🇳🇨',
    utcOffset: 660
  },

  // Oceania - Samoa
  {
    id: 'apia',
    value: 'Pacific/Apia',
    label: 'Apia',
    country: 'Samoa',
    flag: '🇼🇸',
    utcOffset: 780
  },

  // Oceania - Tonga
  {
    id: 'nukualofa',
    value: 'Pacific/Tongatapu',
    label: 'Nuku\'alofa',
    country: 'Tonga',
    flag: '🇹🇴',
    utcOffset: 780
  },

  // Oceania - Palau
  {
    id: 'ngerulmud',
    value: 'Pacific/Palau',
    label: 'Ngerulmud',
    country: 'Palau',
    flag: '🇵🇼',
    utcOffset: 540
  },

  // Oceania - Guam
  {
    id: 'hagatna',
    value: 'Pacific/Guam',
    label: 'Hagatna',
    country: 'Guam',
    flag: '🇬🇺',
    utcOffset: 600
  },

  // Oceania - Marshall Islands
  {
    id: 'majuro',
    value: 'Pacific/Majuro',
    label: 'Majuro',
    country: 'Marshall Islands',
    flag: '🇲🇭',
    utcOffset: 720
  },

  // Oceania - Micronesia
  {
    id: 'weno',
    value: 'Pacific/Chuuk',
    label: 'Weno',
    country: 'Micronesia',
    flag: '🇫🇲',
    utcOffset: 600
  },

  // South America - Brazil
  {
    id: 'so-paulo',
    value: 'America/Sao_Paulo',
    label: 'São Paulo',
    country: 'Brazil',
    flag: '🇧🇷',
    utcOffset: -180
  },
  {
    id: 'rio-branco-acre',
    value: 'America/Rio_Branco',
    label: 'Rio Branco (Acre)',
    country: 'Brazil',
    flag: '🇧🇷',
    utcOffset: -300
  },
  {
    id: 'manaus-amazonas',
    value: 'America/Manaus',
    label: 'Manaus (Amazonas)',
    country: 'Brazil',
    flag: '🇧🇷',
    utcOffset: -240
  },
  {
    id: 'recife',
    value: 'America/Recife',
    label: 'Recife',
    country: 'Brazil',
    flag: '🇧🇷',
    utcOffset: -180
  },

  // South America - Argentina
  {
    id: 'buenos-aires',
    value: 'America/Argentina/Buenos_Aires',
    label: 'Buenos Aires',
    country: 'Argentina',
    flag: '🇦🇷',
    utcOffset: -180
  },

  // South America - Chile
  {
    id: 'santiago',
    value: 'America/Santiago',
    label: 'Santiago',
    country: 'Chile',
    flag: '🇨🇱',
    utcOffset: -180
  },
  {
    id: 'easter-island',
    value: 'Pacific/Easter',
    label: 'Easter Island',
    country: 'Chile',
    flag: '🇨🇱',
    utcOffset: -360
  },

  // South America - Colombia
  {
    id: 'bogot',
    value: 'America/Bogota',
    label: 'Bogotá',
    country: 'Colombia',
    flag: '🇨🇴',
    utcOffset: -300
  },

  // South America - Peru
  {
    id: 'lima',
    value: 'America/Lima',
    label: 'Lima',
    country: 'Peru',
    flag: '🇵🇪',
    utcOffset: -300
  },

  // South America - Venezuela
  {
    id: 'caracas',
    value: 'America/Caracas',
    label: 'Caracas',
    country: 'Venezuela',
    flag: '🇻🇪',
    utcOffset: -240
  },

  // South America - Ecuador
  {
    id: 'guayaquil',
    value: 'America/Guayaquil',
    label: 'Guayaquil',
    country: 'Ecuador',
    flag: '🇪🇨',
    utcOffset: -300
  },
  {
    id: 'galpagos-islands',
    value: 'Pacific/Galapagos',
    label: 'Galápagos Islands',
    country: 'Ecuador',
    flag: '🇪🇨',
    utcOffset: -360
  },

  // South America - Bolivia
  {
    id: 'la-paz',
    value: 'America/La_Paz',
    label: 'La Paz',
    country: 'Bolivia',
    flag: '🇧🇴',
    utcOffset: -240
  },

  // South America - Uruguay
  {
    id: 'montevideo',
    value: 'America/Montevideo',
    label: 'Montevideo',
    country: 'Uruguay',
    flag: '🇺🇾',
    utcOffset: -180
  },

  // South America - Paraguay
  {
    id: 'asuncin',
    value: 'America/Asuncion',
    label: 'Asunción',
    country: 'Paraguay',
    flag: '🇵🇾',
    utcOffset: -180
  },

  // South America - Guyana
  {
    id: 'georgetown',
    value: 'America/Guyana',
    label: 'Georgetown',
    country: 'Guyana',
    flag: '🇬🇾',
    utcOffset: -240
  },

  // South America - Suriname
  {
    id: 'paramaribo',
    value: 'America/Paramaribo',
    label: 'Paramaribo',
    country: 'Suriname',
    flag: '🇸🇷',
    utcOffset: -180
  },

  // South America - French Guiana
  {
    id: 'cayenne',
    value: 'America/Cayenne',
    label: 'Cayenne',
    country: 'French Guiana',
    flag: '🇬🇫',
    utcOffset: -180
  },

  // Central America - Guatemala
  {
    id: 'guatemala-city',
    value: 'America/Guatemala',
    label: 'Guatemala City',
    country: 'Guatemala',
    flag: '🇬🇹',
    utcOffset: -360
  },

  // Central America - Belize
  {
    id: 'belize-city',
    value: 'America/Belize',
    label: 'Belize City',
    country: 'Belize',
    flag: '🇧🇿',
    utcOffset: -360
  },

  // Central America - Honduras
  {
    id: 'tegucigalpa',
    value: 'America/Tegucigalpa',
    label: 'Tegucigalpa',
    country: 'Honduras',
    flag: '🇭🇳',
    utcOffset: -360
  },

  // Central America - El Salvador
  {
    id: 'san-salvador',
    value: 'America/El_Salvador',
    label: 'San Salvador',
    country: 'El Salvador',
    flag: '🇸🇻',
    utcOffset: -360
  },

  // Central America - Nicaragua
  {
    id: 'managua',
    value: 'America/Managua',
    label: 'Managua',
    country: 'Nicaragua',
    flag: '🇳🇮',
    utcOffset: -360
  },

  // Central America - Costa Rica
  {
    id: 'san-jos',
    value: 'America/Costa_Rica',
    label: 'San José',
    country: 'Costa Rica',
    flag: '🇨🇷',
    utcOffset: -360
  },

  // Central America - Panama
  {
    id: 'panama-city',
    value: 'America/Panama',
    label: 'Panama City',
    country: 'Panama',
    flag: '🇵🇦',
    utcOffset: -300
  },

  // Caribbean - Cuba
  {
    id: 'havana',
    value: 'America/Havana',
    label: 'Havana',
    country: 'Cuba',
    flag: '🇨🇺',
    utcOffset: -300
  },

  // Caribbean - Jamaica
  {
    id: 'kingston',
    value: 'America/Jamaica',
    label: 'Kingston',
    country: 'Jamaica',
    flag: '🇯🇲',
    utcOffset: -300
  },

  // Caribbean - Haiti
  {
    id: 'portauprince',
    value: 'America/Port-au-Prince',
    label: 'Port-au-Prince',
    country: 'Haiti',
    flag: '🇭🇹',
    utcOffset: -300
  },

  // Caribbean - Dominican Republic
  {
    id: 'santo-domingo',
    value: 'America/Santo_Domingo',
    label: 'Santo Domingo',
    country: 'Dominican Republic',
    flag: '🇩🇴',
    utcOffset: -240
  },

  // Caribbean - Puerto Rico
  {
    id: 'san-juan',
    value: 'America/Puerto_Rico',
    label: 'San Juan',
    country: 'Puerto Rico',
    flag: '🇵🇷',
    utcOffset: -240
  },

  // Caribbean - Bahamas
  {
    id: 'nassau',
    value: 'America/Nassau',
    label: 'Nassau',
    country: 'Bahamas',
    flag: '🇧🇸',
    utcOffset: -300
  },

  // Caribbean - Barbados
  {
    id: 'bridgetown',
    value: 'America/Barbados',
    label: 'Bridgetown',
    country: 'Barbados',
    flag: '🇧🇧',
    utcOffset: -240
  },

  // Caribbean - Trinidad and Tobago
  {
    id: 'port-of-spain',
    value: 'America/Port_of_Spain',
    label: 'Port of Spain',
    country: 'Trinidad and Tobago',
    flag: '🇹🇹',
    utcOffset: -240
  },

  // UTC
  {
    id: 'utc-coordinated-universal-time',
    value: 'UTC',
    label: 'UTC (Coordinated Universal Time)',
    country: 'UTC',
    flag: '🌍',
    utcOffset: 0
  }
];

// Keep popular timezones for backwards compatibility
export const POPULAR_TIMEZONES = ALL_TIMEZONES;

// Default pinned timezones
export const DEFAULT_PINNED_TIMEZONES = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];

// Function to get timezone info by value
export const getTimezoneInfo = (value: string): Timezone | null => {
  try {
    return ALL_TIMEZONES.find(tz => tz.value === value) || null;
  } catch (error) {
    console.error(`Error getting timezone info for ${value}:`, error);
    return null;
  }
};

// Function to get UTC offset string
export const getUTCOffsetString = (offsetMinutes: number): string => {
  const hours = Math.floor(Math.abs(offsetMinutes) / 60);
  const minutes = Math.abs(offsetMinutes) % 60;
  const sign = offsetMinutes >= 0 ? '+' : '-';
  
  if (minutes === 0) {
    return `${sign}${hours}`;
  } else {
    return `${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
  }
};

// Common timezone abbreviations mapping
const TIMEZONE_ABBREVIATIONS: Record<string, string[]> = {
  // GMT and UTC
  'gmt': ['Europe/London'],
  'utc': ['UTC', 'Europe/London'],
  'greenwich': ['Europe/London'],
  
  // US Timezones
  'est': ['America/New_York'],
  'edt': ['America/New_York'],
  'eastern': ['America/New_York'],
  'cst': ['America/Chicago'],
  'cdt': ['America/Chicago'],
  'central': ['America/Chicago'],
  'mst': ['America/Denver'],
  'mdt': ['America/Denver'],
  'mountain': ['America/Denver'],
  'pst': ['America/Los_Angeles'],
  'pdt': ['America/Los_Angeles'],
  'pacific': ['America/Los_Angeles'],
  'akst': ['America/Anchorage'],
  'akdt': ['America/Anchorage'],
  'alaska': ['America/Anchorage'],
  'hst': ['Pacific/Honolulu'],
  'hdt': ['Pacific/Honolulu'],
  'hawaii': ['Pacific/Honolulu'],
  
  // Europe
  'cet': ['Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 'Europe/Madrid'],
  'cest': ['Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 'Europe/Madrid'],
  'eet': ['Europe/Athens', 'Europe/Helsinki', 'Europe/Bucharest'],
  'eest': ['Europe/Athens', 'Europe/Helsinki', 'Europe/Bucharest'],
  'wet': ['Europe/Lisbon'],
  'west': ['Europe/Lisbon'],
  'bst': ['Europe/London'],
  'british': ['Europe/London'],
  
  // Asia
  'ist': ['Asia/Kolkata'],
  'india': ['Asia/Kolkata'],
  'jst': ['Asia/Tokyo'],
  'japan': ['Asia/Tokyo'],
  'kst': ['Asia/Seoul'],
  'korea': ['Asia/Seoul'],
  'china': ['Asia/Shanghai'],
  'beijing': ['Asia/Shanghai'],
  'hkt': ['Asia/Hong_Kong'],
  'hongkong': ['Asia/Hong_Kong'],
  'sgt': ['Asia/Singapore'],
  'singapore': ['Asia/Singapore'],
  'jkt': ['Asia/Jakarta'],
  'jakarta': ['Asia/Jakarta'],
  'pht': ['Asia/Manila'],
  'philippines': ['Asia/Manila'],
  'ict': ['Asia/Bangkok'],
  'thailand': ['Asia/Bangkok'],
  'myt': ['Asia/Kuala_Lumpur'],
  'malaysia': ['Asia/Kuala_Lumpur'],
  'wib': ['Asia/Jakarta'],
  'wit': ['Asia/Makassar'],
  'wita': ['Asia/Makassar'],
  'indonesia': ['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura'],
  
  // Australia/Oceania
  'aest': ['Australia/Sydney', 'Australia/Melbourne'],
  'aedt': ['Australia/Sydney', 'Australia/Melbourne'],
  'acst': ['Australia/Adelaide'],
  'acdt': ['Australia/Adelaide'],
  'awst': ['Australia/Perth'],
  'sydney': ['Australia/Sydney'],
  'melbourne': ['Australia/Melbourne'],
  'perth': ['Australia/Perth'],
  'nzst': ['Pacific/Auckland'],
  'nzdt': ['Pacific/Auckland'],
  'newzealand': ['Pacific/Auckland'],
  'auckland': ['Pacific/Auckland'],
  
  // Middle East/Africa
  'msk': ['Europe/Moscow'],
  'moscow': ['Europe/Moscow'],
  'cairo': ['Africa/Cairo'],
  'cat': ['Africa/Johannesburg'],
  'eat': ['Africa/Nairobi'],
  'wat': ['Africa/Lagos'],
  'dubai': ['Asia/Dubai'],
  'riyadh': ['Asia/Riyadh'],
  
  // South America
  'brt': ['America/Sao_Paulo'],
  'brazil': ['America/Sao_Paulo'],
  'saopaulo': ['America/Sao_Paulo'],
  'art': ['America/Argentina/Buenos_Aires'],
  'argentina': ['America/Argentina/Buenos_Aires'],
  'buenosaires': ['America/Argentina/Buenos_Aires'],
  'clt': ['America/Santiago'],
  'chile': ['America/Santiago'],
  'santiago': ['America/Santiago'],
  'pet': ['America/Lima'],
  'peru': ['America/Lima'],
  'lima': ['America/Lima'],
  'cot': ['America/Bogota'],
  'colombia': ['America/Bogota'],
  'bogota': ['America/Bogota'],
  'vet': ['America/Caracas'],
  'venezuela': ['America/Caracas'],
  'caracas': ['America/Caracas'],
};

// Function to search timezones by abbreviation
export const getTimezonesByAbbreviation = (abbreviation: string): Timezone[] => {
  const normalizedAbbr = abbreviation.toLowerCase().trim();
  const timezoneValues = TIMEZONE_ABBREVIATIONS[normalizedAbbr] || [];
  
  return timezoneValues
    .map(value => ALL_TIMEZONES.find(tz => tz.value === value))
    .filter((tz): tz is Timezone => tz !== undefined);
};

// Function to search timezones by country
export const getTimezonesByCountry = (countryName: string): Timezone[] => {
  const normalizedCountry = countryName.toLowerCase().trim();
  return ALL_TIMEZONES.filter(tz => 
    tz.country.toLowerCase().includes(normalizedCountry)
  );
};

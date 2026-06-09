import { UserInput } from '../types';

export interface CompressedPayload {
  n?: string; // name
  d?: string; // birthDate (YYYYMMDD)
  t?: string; // birthTime (HHMM)
  u?: number; // isTimeUnknown (1 or 0)
  c?: string; // city
  g?: string; // gender ('m' | 'f' | 'nb' | 'p')
  l?: string; // calendarType ('s' | 'l')
  s?: string; // socialContext
  x?: number; // lat
  y?: number; // lon
  v?: number; // version (always 3)
}

export function compressPayload(input: UserInput, lat?: number, lon?: number): CompressedPayload {
  const compressed: CompressedPayload = { v: 3 };
  if (input.name) compressed.n = input.name;
  
  if (input.birthDate) {
    // Remove dashes from YYYY-MM-DD
    compressed.d = input.birthDate.replace(/-/g, '');
  }
  
  if (input.birthTime) {
    // Remove colon from HH:MM
    compressed.t = input.birthTime.replace(/:/g, '');
  }
  
  if (input.isTimeUnknown) {
    compressed.u = 1;
  }
  
  if (input.city) compressed.c = input.city;
  
  if (input.gender) {
    if (input.gender === 'male') compressed.g = 'm';
    else if (input.gender === 'female') compressed.g = 'f';
    else if (input.gender === 'non-binary') compressed.g = 'nb';
    else if (input.gender === 'prefer-not-to-tell') compressed.g = 'p';
  }
  
  if (input.calendarType) {
    compressed.l = input.calendarType === 'solar' ? 's' : 'l';
  }
  
  if (input.socialContext) {
    compressed.s = input.socialContext;
  }
  
  if (lat !== undefined) {
    compressed.x = Math.round(lat * 1000) / 1000; // 3 decimal places is plenty (~110m accuracy)
  }
  if (lon !== undefined) {
    compressed.y = Math.round(lon * 1000) / 1000;
  }
  
  return compressed;
}

export function decompressPayload(compressed: any): any {
  if (!compressed) return null;
  
  // If it's the old uncompressed format
  if (compressed.birthDate && !compressed.v) {
    return compressed;
  }
  
  // Handle v2
  if (compressed.v === 2) {
    const decompressed: any = {};
    if (compressed.n) decompressed.name = compressed.n;
    if (compressed.d) decompressed.birthDate = compressed.d;
    if (compressed.t) decompressed.birthTime = compressed.t;
    decompressed.isTimeUnknown = compressed.u === 1;
    if (compressed.c) decompressed.city = compressed.c;
    if (compressed.g) {
      if (compressed.g === 'm') decompressed.gender = 'male';
      else if (compressed.g === 'f') decompressed.gender = 'female';
      else if (compressed.g === 'nb') decompressed.gender = 'non-binary';
      else if (compressed.g === 'p') decompressed.gender = 'prefer-not-to-tell';
    }
    if (compressed.l) {
      decompressed.calendarType = compressed.l === 's' ? 'solar' : 'lunar';
    }
    if (compressed.s) decompressed.socialContext = compressed.s;
    if (compressed.x) decompressed.lat = compressed.x;
    if (compressed.y) decompressed.lon = compressed.y;
    return decompressed;
  }

  // Handle v3 (most compressed)
  if (compressed.v === 3) {
    const decompressed: any = {};
    if (compressed.n) decompressed.name = compressed.n;
    
    if (compressed.d && compressed.d.length === 8) {
      // Re-add dashes: YYYYMMDD -> YYYY-MM-DD
      decompressed.birthDate = `${compressed.d.slice(0, 4)}-${compressed.d.slice(4, 6)}-${compressed.d.slice(6, 8)}`;
    } else if (compressed.d) {
      decompressed.birthDate = compressed.d;
    }
    
    if (compressed.t && compressed.t.length === 4) {
      // Re-add colon: HHMM -> HH:MM
      decompressed.birthTime = `${compressed.t.slice(0, 2)}:${compressed.t.slice(2, 4)}`;
    } else if (compressed.t) {
      decompressed.birthTime = compressed.t;
    }
    
    decompressed.isTimeUnknown = compressed.u === 1;
    if (compressed.c) decompressed.city = compressed.c;
    
    if (compressed.g) {
      if (compressed.g === 'm') decompressed.gender = 'male';
      else if (compressed.g === 'f') decompressed.gender = 'female';
      else if (compressed.g === 'nb') decompressed.gender = 'non-binary';
      else if (compressed.g === 'p') decompressed.gender = 'prefer-not-to-tell';
    }
    
    if (compressed.l) {
      decompressed.calendarType = compressed.l === 's' ? 'solar' : 'lunar';
    }
    
    if (compressed.s) decompressed.socialContext = compressed.s;
    if (compressed.x) decompressed.lat = compressed.x;
    if (compressed.y) decompressed.lon = compressed.y;
    
    return decompressed;
  }
  
  return compressed;
}

const SOCIAL_CODES: Record<string, string> = {
  military_public: 'a',
  corporate: 'b',
  business_freelance: 'c',
  student: 'd',
  education: 'e',
  professional_it: 'f',
  arts_creative: 'g',
  none: 'h'
};

const SOCIAL_DECODES: Record<string, string> = {
  a: 'military_public',
  b: 'corporate',
  c: 'business_freelance',
  d: 'student',
  e: 'education',
  f: 'professional_it',
  g: 'arts_creative',
  h: 'none'
};

const SOCIAL_V5_MAP: Record<string, number> = {
  military_public: 0,
  corporate: 1,
  business_freelance: 2,
  student: 3,
  education: 4,
  professional_it: 5,
  arts_creative: 6,
  none: 7
};

const SOCIAL_V5_DECODE = [
  'military_public',
  'corporate',
  'business_freelance',
  'student',
  'education',
  'professional_it',
  'arts_creative',
  'none'
];

export function compressToShortId(input: UserInput, lat?: number, lon?: number): string {
  try {
    // 1. Pack Date & Time
    const dateParts = (input.birthDate || '1993-01-01').split('-');
    const year = parseInt(dateParts[0]) || 1993;
    const month = parseInt(dateParts[1]) || 1;
    const day = parseInt(dateParts[2]) || 1;
    
    const timeParts = (input.birthTime || '12:00').split(':');
    const hour = parseInt(timeParts[0]) || 0;
    const minute = parseInt(timeParts[1]) || 0;
    
    const unknown = input.isTimeUnknown ? 1 : 0;
    
    // YYYYMMDDHHmmU (13 digits)
    const dateTimeNum = year * 1000000000 + month * 10000000 + day * 100000 + hour * 1000 + minute * 10 + unknown;
    const dateTimeStr = dateTimeNum.toString(36).padStart(8, '0');

    // 2. Pack Categorical fields (Gender, Calendar, Social Context)
    let genderVal = 3; // prefer-not-to-tell
    if (input.gender === 'male') genderVal = 0;
    else if (input.gender === 'female') genderVal = 1;
    else if (input.gender === 'non-binary') genderVal = 2;

    const calVal = input.calendarType === 'lunar' ? 1 : 0;
    const socialVal = SOCIAL_V5_MAP[input.socialContext || 'none'] ?? 7;
    
    const categoricalVal = genderVal * 16 + calVal * 8 + socialVal;
    const categoricalStr = categoricalVal.toString(36).padStart(2, '0');

    // 3. Pack coordinates (Latitude & Longitude)
    let latVal = 40000;
    if (lat !== undefined && !isNaN(lat)) {
      latVal = Math.round((Math.max(-90, Math.min(90, lat)) + 90) * 100);
    }
    let lonVal = 40000;
    if (lon !== undefined && !isNaN(lon)) {
      lonVal = Math.round((Math.max(-180, Math.min(180, lon)) + 180) * 100);
    }
    
    const latStr = latVal.toString(36).padStart(3, '0');
    const lonStr = lonVal.toString(36).padStart(3, '0');

    const packed = `${dateTimeStr}${categoricalStr}${latStr}${lonStr}`; // 16 chars

    const name = encodeURIComponent(input.name || '');
    const city = encodeURIComponent(input.city || '');

    return `v5_${packed}_${name}_${city}`;
  } catch (e) {
    console.error("Failed to compress v5, falling back to legacy format", e);
    // Safe legacy fallback format
    const name = encodeURIComponent(input.name || '');
    const date = (input.birthDate || '').replace(/-/g, '');
    const time = (input.birthTime || '').replace(/:/g, '');
    const unknown = input.isTimeUnknown ? '1' : '0';
    const cal = input.calendarType === 'lunar' ? 'l' : 's';
    return `v4_${name}_${date}_${time}_${unknown}_p_${cal}_h___`;
  }
}

export function decompressV5(shortId: string): any {
  if (!shortId || !shortId.startsWith('v5_')) return null;
  const parts = shortId.split('_');
  if (parts.length < 4) return null;

  const packed = parts[1];
  const name = decodeURIComponent(parts[2]);
  const city = decodeURIComponent(parts[3]);

  if (packed.length !== 16) return null;

  // 1. Decode Date & Time
  const dateTimeStr = packed.substring(0, 8);
  const dateTimeNum = parseInt(dateTimeStr, 36);

  const unknown = (dateTimeNum % 10) === 1;
  const minute = Math.floor(dateTimeNum / 10) % 100;
  const hour = Math.floor(dateTimeNum / 1000) % 100;
  const day = Math.floor(dateTimeNum / 100000) % 100;
  const month = Math.floor(dateTimeNum / 10000000) % 100;
  const year = Math.floor(dateTimeNum / 1000000000);

  const birthDate = `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const birthTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

  // 2. Decode Categoricals
  const categoricalStr = packed.substring(8, 10);
  const categoricalVal = parseInt(categoricalStr, 36);

  const socialVal = categoricalVal % 8;
  const calVal = Math.floor(categoricalVal / 8) % 2;
  const genderVal = Math.floor(categoricalVal / 16);

  let gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-tell' = 'prefer-not-to-tell';
  if (genderVal === 0) gender = 'male';
  else if (genderVal === 1) gender = 'female';
  else if (genderVal === 2) gender = 'non-binary';

  const calendarType = calVal === 1 ? 'lunar' : 'solar';
  const socialContext = SOCIAL_V5_DECODE[socialVal] || 'none';

  // 3. Decode Coordinates
  const latStr = packed.substring(10, 13);
  const lonStr = packed.substring(13, 16);

  const latVal = parseInt(latStr, 36);
  const lonVal = parseInt(lonStr, 36);

  const decompressed: any = {
    name,
    birthDate,
    birthTime,
    isTimeUnknown: unknown,
    city,
    gender,
    calendarType,
    socialContext
  };

  if (latVal !== 40000) {
    decompressed.lat = (latVal / 100) - 90;
  }
  if (lonVal !== 40000) {
    decompressed.lon = (lonVal / 100) - 180;
  }

  return decompressed;
}

export function decompressV4(shortId: string): any {
  if (!shortId || !shortId.startsWith('v4_')) return null;
  const parts = shortId.split('_');
  if (parts.length < 11) return null;

  const name = decodeURIComponent(parts[1]);
  const dateRaw = parts[2];
  const timeRaw = parts[3];
  const unknown = parts[4] === '1';
  const genderRaw = parts[5];
  const calRaw = parts[6];
  const socialRaw = parts[7];
  const latRaw = parts[8];
  const lonRaw = parts[9];
  const city = decodeURIComponent(parts[10]);

  const decompressed: any = {
    name,
    isTimeUnknown: unknown,
    city
  };

  if (dateRaw && dateRaw.length === 8) {
    decompressed.birthDate = `${dateRaw.slice(0, 4)}-${dateRaw.slice(4, 6)}-${dateRaw.slice(6, 8)}`;
  }
  if (timeRaw && timeRaw.length === 4) {
    decompressed.birthTime = `${timeRaw.slice(0, 2)}:${timeRaw.slice(2, 4)}`;
  }

  if (genderRaw === 'm') decompressed.gender = 'male';
  else if (genderRaw === 'f') decompressed.gender = 'female';
  else if (genderRaw === 'n') decompressed.gender = 'non-binary';
  else decompressed.gender = 'prefer-not-to-tell';

  decompressed.calendarType = calRaw === 'l' ? 'lunar' : 'solar';
  decompressed.socialContext = SOCIAL_DECODES[socialRaw] || 'none';

  if (latRaw) decompressed.lat = parseFloat(latRaw);
  if (lonRaw) decompressed.lon = parseFloat(lonRaw);

  return decompressed;
}

export function decompressFromShortId(shortId: string): any {
  if (!shortId) return null;
  if (shortId.startsWith('v5_')) {
    return decompressV5(shortId);
  }
  if (shortId.startsWith('v4_')) {
    return decompressV4(shortId);
  }
  return null;
}



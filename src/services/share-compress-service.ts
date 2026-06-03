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

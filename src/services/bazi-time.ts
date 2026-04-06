import { DateTime } from 'luxon';

export interface TimeCorrectionResult {
  rawTime: string;
  correctedSolarTime: string;
  isNextDay: boolean;
  correctedYear: number;
  correctedMonth: number;
  correctedDay: number;
  correctedHour: number;
  correctedMinute: number;
  messages: string[];
}

export const KOREAN_CITIES = [
  { name: '서울', longitude: 126.97 },
  { name: '부산', longitude: 129.07 },
  { name: '인천', longitude: 126.70 },
  { name: '대구', longitude: 128.60 },
  { name: '광주', longitude: 126.85 },
  { name: '대전', longitude: 127.38 },
  { name: '울산', longitude: 129.31 },
  { name: '세종', longitude: 127.28 },
  { name: '제주', longitude: 126.52 },
  { name: '백령도', longitude: 124.60 },
  { name: '울릉도', longitude: 130.80 },
  { name: '기타 (한국 표준시)', longitude: 127.5 },
];

export function getPreciseSajuTime(
  solarYear: number,
  solarMonth: number,
  solarDay: number,
  inputTime: string,
  longitude?: number
): TimeCorrectionResult {
  const messages: string[] = [];
  
  if (!inputTime || inputTime === '00:00') {
    return {
      rawTime: inputTime,
      correctedSolarTime: inputTime,
      isNextDay: false,
      correctedYear: solarYear,
      correctedMonth: solarMonth,
      correctedDay: solarDay,
      correctedHour: 0,
      correctedMinute: 0,
      messages: []
    };
  }

  const [hourStr, minuteStr] = inputTime.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  const dt = DateTime.fromObject({
    year: solarYear,
    month: solarMonth,
    day: solarDay,
    hour,
    minute
  });

  let standardLongitude = 135;
  let isSummerTime = false;
  let offsetMinutes = 0;

  const dateStr = dt.toFormat('yyyyMMdd');

  if (dateStr <= '19540320') {
    standardLongitude = 135;
  } else if (dateStr >= '19540321' && dateStr <= '19610809') {
    standardLongitude = 127.5;
  } else {
    standardLongitude = 135;
  }

  const isDST1987 = dt >= DateTime.fromISO('1987-05-10T02:00:00') && dt < DateTime.fromISO('1987-10-11T03:00:00');
  const isDST1988 = dt >= DateTime.fromISO('1988-05-08T02:00:00') && dt < DateTime.fromISO('1988-10-09T03:00:00');

  if (isDST1987 || isDST1988) {
    isSummerTime = true;
  }

  if (longitude) {
    offsetMinutes = -(standardLongitude - longitude) * 4;
  } else {
    if (standardLongitude === 135) {
      offsetMinutes = -30;
    } else {
      offsetMinutes = 0;
    }
  }

  if (isSummerTime) {
    offsetMinutes -= 60;
  }

  if (standardLongitude === 127.5 || isSummerTime) {
    messages.push("해당 시기의 특수한 표준시/서머타임 정책을 반영하여 보정되었습니다.");
  }

  const correctedDt = dt.plus({ minutes: offsetMinutes });
  const correctedSolarTime = correctedDt.toFormat('HH:mm');

  let isNextDay = false;

  if (hour === 23 || hour === 0 || (hour === 1 && minute <= 30)) {
    messages.push(`입력하신 시간(${inputTime})은 자시(23:00~01:30) 부근입니다. 정확한 경도와 표준시를 반영한 실제 태양시(${correctedSolarTime})를 기준으로 시주가 계산되었습니다.`);
  }

  if (correctedDt.hour === 23) {
    if (correctedDt.plus({ days: 1 }).toFormat('yyyy-MM-dd') > dt.toFormat('yyyy-MM-dd')) {
      isNextDay = true;
      messages.push("정통 명리학 원리(조자시)에 따라 자시(밤 11시 이후) 출생은 익일 일주로 계산됩니다.");
    }
  }

  return {
    rawTime: inputTime,
    correctedSolarTime,
    isNextDay,
    correctedYear: correctedDt.year,
    correctedMonth: correctedDt.month,
    correctedDay: correctedDt.day,
    correctedHour: correctedDt.hour,
    correctedMinute: correctedDt.minute,
    messages
  };
}

export const courseMIN = 10000;
export const courseMAX = 99999;

export type Course = {
  courseNum: number;
  seatAvailable: boolean;
  waitlistAvailable: boolean;
  valid: boolean;
};

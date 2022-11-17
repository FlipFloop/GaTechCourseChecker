import { open } from "@tauri-apps/api/shell";

export type Course = {
  id: number;
  courseNum: number;
  seatAvailable: boolean;
  waitlistAvailable: boolean;
};

export const openLink = async () => {
  open("https://oscar.gatech.edu/bprod/twbkwbis.P_GenMenu?name=bmenu.P_RegMnu");
};

export const courseMIN = 10000;
export const courseMAX = 99999;
import { invoke } from "@tauri-apps/api/tauri";
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

export const checkCourseExists = async (courseNumber: number) => {
  console.log('HELLO')
  const exists = await invoke("check_course_exists", {
    courseId: courseNumber,
  });

  console.log(exists)

  return exists;
};

export const courseMIN = 10000;
export const courseMAX = 99999;

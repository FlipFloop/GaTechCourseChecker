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
  const exists = await invoke("check_course_exists", {
    courseId: courseNumber,
  })

  return exists;
};

export const get_courses = async (courseArr: number[]) => {
  const data = await invoke("get_courses", { courses: courseArr.join(" ") });
  return data as string;
};

export const courseMIN = 10000;
export const courseMAX = 99999;

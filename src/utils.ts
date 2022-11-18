import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/shell";

export type Course = {
  id: number;
  courseNum: number;
  seatAvailable: boolean;
  waitlistAvailable: boolean;
  valid: boolean;
};

export const openLink = async () => {
  open("https://oscar.gatech.edu/bprod/twbkwbis.P_GenMenu?name=bmenu.P_RegMnu");
};

const existingCourses: number[] = [];
const nonExistingCourses: number[] = [];

export const checkCourseExists = async (courseNumber: number) => {
  const startTime = performance.now();

  if (
    nonExistingCourses.includes(courseNumber) ||
    courseNumber > courseMAX ||
    courseNumber < courseMIN
  ) {
    console.log("Doesn't exist or not in bounds");
    return false;
  }

  if (existingCourses.includes(courseNumber)) {
    console.log("Exists");
    return true;
  }

  console.log("invoke");

  const exists = await invoke("check_course_exists", {
    courseId: courseNumber,
  });

  if (exists) {
    existingCourses.push(courseNumber);
  } else {
    nonExistingCourses.push(courseNumber);
  }
  console.log("Existing: " + existingCourses);
  console.log("Non existing: " + nonExistingCourses);

  const endTime = performance.now();

  console.log("TTE: " + (endTime - startTime));

  return exists;
};

export const get_courses = async (courseArr: number[]) => {
  const data = await invoke("get_courses", { courses: courseArr.join(" ") });
  return data as string;
};

export const courseMIN = 10000;
export const courseMAX = 99999;

import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/shell";

import { courseMIN, courseMAX } from "./types";

const existingCourses: number[] = [];
const nonExistingCourses: number[] = [];

export const checkCourseExists = async (
  courseNumber: number
): Promise<boolean> => {
  if (
    nonExistingCourses.includes(courseNumber) ||
    courseNumber > courseMAX ||
    courseNumber < courseMIN
  ) {
    return false;
  }

  if (existingCourses.includes(courseNumber)) {
    return true;
  }

  const exists: boolean = await invoke("check_course_exists", {
    courseId: courseNumber,
  });

  if (exists) {
    existingCourses.push(courseNumber);
  } else {
    nonExistingCourses.push(courseNumber);
  }
  console.log("Existing: " + existingCourses);
  console.log("Non existing: " + nonExistingCourses);

  return exists;
};

export const get_courses = async (courseArr: number[]) => {
  const data = await invoke("get_courses", { courses: courseArr.join(" ") });
  return data as string;
};

export const openLink = async () => {
  open("https://oscar.gatech.edu/bprod/twbkwbis.P_GenMenu?name=bmenu.P_RegMnu");
};

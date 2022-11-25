import { createStore } from "solid-js/store";
import toast from "solid-toast";
import { Course, courseMAX, courseMIN } from "./types";
import { checkCourseExists } from "./backend";

export const [courses, setCourses] = createStore<Course[]>([]);

export const addCourse = async (courseCRN: number) => {
  if (courseCRN > courseMAX || courseCRN < courseMIN) {
    toast.error("Course value not in range");
    return;
  }

  const courseExists = await checkCourseExists(courseCRN);

  if (!courseExists) {
    toast.error("Course CRN doesn't exist");
    return;
  }

  const isInList = courses.some((course: any) => course.courseNum == courseCRN);

  if (isInList) {
    toast.error("Course already in your list");
    return;
  }

  setCourses([
    ...courses,
    {
      courseNum: courseCRN,
      seatAvailable: false,
      waitlistAvailable: false,
      valid: true,
    },
  ]);
};

export const saveCourses = async () => {
  if (courses.length == 0) {
    toast.error("No courses to save/fetch!");
    return false;
  }

  const loadToast = toast.loading("Saving courses...");

  await checkCoursesValid().then(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  });

  toast.success("Course CRNs saved!");
  console.log("Course CRNs saved!");
  toast.remove(loadToast);

  return true;
};

const checkCoursesValid = async () => {
  let invalidCourses: number[] = [];
  let validCourses: number[] = [];

  for (let i = 0; i < courses.length; i++) {
    const courseExists = await checkCourseExists(courses[i].courseNum);
    if (!courseExists) {
      invalidCourses.push(i);
      console.log(`Course CRN ${courses[i].courseNum} is invalid!`);
    } else {
      validCourses.push(i);
      console.log(`Course CRN ${courses[i].courseNum} is valid!`);
    }
  }

  for (let i = 0; i < invalidCourses.length; i++) {
    setCourses(invalidCourses[i], { valid: false });
  }

  for (let i = 0; i < validCourses.length; i++) {
    setCourses(validCourses[i], { valid: true });
  }
};

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

  if (!(await checkCourseExists(courseCRN))) {
    toast.error("Course CRN doesn't exist");
    return;
  }

  if (courses.some((course: any) => course.courseNum === courseCRN)) {
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
  if (courses.length === 0) {
    toast.error("No courses to save/fetch!");
    return false;
  }

  const loadToast = toast.loading("Saving courses...");

  await checkCoursesValid();
  localStorage.setItem("courses", JSON.stringify(courses));

  toast.success("Course CRNs saved!");
  console.log("Course CRNs saved!");
  toast.remove(loadToast);

  return true;
};

// chatGPT made this better ngl
const checkCoursesValid = async () => {
  const isValid: boolean[] = await Promise.all(
    courses.map(async (course: Course) => {
      return await checkCourseExists(course.courseNum);
    })
  );

  setCourses(
    courses.map((course, i) => {
      return {
        ...course,
        valid: isValid[i],
      };
    })
  );
};

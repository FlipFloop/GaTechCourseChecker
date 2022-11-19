import { createEffect, createSignal, For, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import toast, { Toaster } from "solid-toast";

import "./App.scss";

import {
  Course,
  openLink,
  checkCourseExists,
  courseMAX,
  courseMIN,
  get_courses,
} from "./utils";

const [courses, setCourses] = createStore<Course[]>([
  // {
  //   id: 1,
  //   courseNum: 21135,
  //   seatAvailable: false,
  //   waitlistAvailable: false,
  // },
  // {
  //   id: 2,
  //   courseNum: 25587,
  //   seatAvailable: false,
  //   waitlistAvailable: false,
  // },
  // {
  //   id: 3,
  //   courseNum: 27395,
  //   seatAvailable: false,
  //   waitlistAvailable: false,
  // },
  // {
  //   id: 4,
  //   courseNum: 24649,
  //   seatAvailable: false,
  //   waitlistAvailable: false,
  // },
]);

const [newCourse, setNewCourse] = createSignal(0);

const addCourse = async () => {
  if (newCourse() > courseMAX || newCourse() < courseMIN) {
    toast.error("Course value not in range");
    return;
  }

  const courseExists = await checkCourseExists(newCourse());

  console.log(courseExists);

  if (!courseExists) {
    toast.error("Course CRN doesn't exist");
    return;
  }

  const isInList = courses.some(
    (course: any) => course.courseNum == newCourse()
  );

  if (isInList) {
    toast.error("Course already in your list");
    return;
  }

  setCourses([
    ...courses,
    {
      courseNum: newCourse(),
      seatAvailable: false,
      waitlistAvailable: false,
      valid: true,
    },
  ]);
};

const App = () => {
  const [data, setData] = createSignal("No data fetched!");

  onMount(() => {
    const localStorageItems: string = localStorage.getItem("courses") || "";
    if (localStorageItems?.length > 5) {
      setCourses(JSON.parse(localStorageItems));
      toast.success("Loaded in Local Data");
    }
  });

  const saveCourses = async () => {
    console.log(courses);
    const loadToast = toast.loading("Saving courses...");

    if (courses.length == 0) {
      toast.error("No courses to save/fetch!");
      return false;
    }

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

    console.log(courses);

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
      console.log(invalidCourses[i]);
      setCourses(invalidCourses[i], { valid: false });
    }

    for (let i = 0; i < validCourses.length; i++) {
      console.log(validCourses[i]);
      setCourses(validCourses[i], { valid: true });
    }
  };

  const getData = async () => {
    if (!(await saveCourses())) {
      return;
    }

    setData("Loading");
    const loadToast = toast.loading("Fetching your data");

    const courseArr = courses
      .filter((el: Course) => {
        return el.valid == true;
      })
      .map((el: Course) => {
        return el.courseNum;
      });

    console.log(courseArr);
    setData(await get_courses(courseArr));

    toast.remove(loadToast);
    toast.success("Retrieved!");
  };

  return (
    <div class="container">
      <Toaster />
      <h1>Georgia Tech self-course checker!</h1>
      <For each={courses}>
        {(course: Course) => (
          <div>
            <input
              value={course.courseNum}
              min={courseMIN}
              max={courseMAX}
              type="number"
              onChange={async (e) => {
                const idx = courses.findIndex(
                  (el: Course) => el.courseNum === course.courseNum
                );
                setCourses(idx, { courseNum: e.target.value as number });
              }}
            />
            <button
              onClick={() => {
                setCourses(
                  courses.filter((el: any) => el.courseNum !== course.courseNum)
                );
              }}
            >
              &#10060 Remove
            </button>
            <Show when={course.valid}>
              <button>&#x2705 Course CRN is valid</button>
            </Show>
            <Show when={!course.valid}>
              <button>! CRN Doesn't exist !</button>
            </Show>
          </div>
        )}
      </For>
      <hr />
      <div class="row">
        <input
          id="course-num-input"
          value={newCourse()}
          onChange={(e) => setNewCourse(e.target.value as number)}
          placeholder=""
          type="number"
          min={courseMIN}
          max={courseMAX}
        />
        <button onClick={addCourse}>&#10133 Add Course</button>
      </div>
      <button type="button" onClick={saveCourses}>
        Save Courses
      </button>
      <br />
      <button type="button" onClick={getData}>
        Get Course Data
      </button>

      <h2>{data()}</h2>

      <button type="button" onClick={openLink}>
        Go register!
      </button>
    </div>
  );
};

export default App;

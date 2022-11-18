import { createSignal, For } from "solid-js";
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

  if (courseExists) {
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

  if (courses.length > 0) {
    setCourses([
      ...courses,
      {
        id: courses[courses.length - 1].id + 1,
        courseNum: newCourse(),
        seatAvailable: false,
        waitlistAvailable: false,
      },
    ]);
    return;
  }

  setCourses([
    {
      id: 1,
      courseNum: newCourse(),
      seatAvailable: false,
      waitlistAvailable: false,
    },
  ]);
};

const App = () => {
  const [data, setData] = createSignal("No data fetched!");

  const getData = async () => {
    if (courses.length == 0) {
      toast.error("Add a course before fetching data!");
      return;
    }
    setData("Loading");
    toast.loading("Fetching your data");

    const courseArr = courses.map((el: Course) => {
      return el.courseNum;
    });

    setData(await get_courses(courseArr));

    toast.remove();
    toast.success("Retrieved!");
  };

  return (
    <div class="container">
      <Toaster />
      <h1>Georgia Tech self-coursicle!</h1>
      <For each={courses}>
        {(course: Course) => (
          <div>
            <input
              value={course.courseNum}
              min={courseMIN}
              max={courseMAX}
              type="number"
              onChange={async (e) => {
                const value: number = e.target.value as number;

                if (value < courseMAX && value > courseMIN) {
                  const idx = courses.findIndex(
                    (el: Course) => el.id === course.id
                  );
                  setCourses(idx, { courseNum: e.target.value as number });
                }
              }}
            />
            <button
              onClick={() => {
                setCourses(courses.filter((el: any) => el.id !== course.id));
              }}
            >
              &#10060
            </button>
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

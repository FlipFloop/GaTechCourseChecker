import { createSignal, For, onMount, Show } from "solid-js";
import toast, { Toaster } from "solid-toast";
import "./stylesheets/App.scss";

import type { Course } from "./utils/types";
import { courseMAX, courseMIN } from "./utils/types";
import { openLink, get_courses } from "./utils/backend";
import {
  addCourse,
  saveCourses,
  courses,
  setCourses,
  clearLocalStorage,
} from "./utils/dataManagement";
import Results from "./components/Results";
import CourseEntry from "./components/CourseEntry";

const App = () => {
  const [courseData, setCourseData] = createSignal<number[][]>([]);
  const [newCourse, setNewCourse] = createSignal<number>(0);
  const [gtScheduleCourses, setGtScheduleCourses] = createSignal<number[]>([]);
  const [fetched, setFetched] = createSignal<boolean>(false);

  onMount(() => {
    const localStorageItems: string = localStorage.getItem("courses") || "";
    if (localStorageItems?.length > 5) {
      setCourses(JSON.parse(localStorageItems));
      toast.success("Loaded in Local Data");
    }
  });

  const getData = async () => {
    if (!(await saveCourses())) {
      return;
    }

    setCourseData([]);
    setFetched(true);
    const loadToast = toast.loading("Fetching your data");

    const courseArr = courses
      .filter((el: Course) => {
        return el.valid == true;
      })
      .map((el: Course) => {
        return el.courseNum;
      });

    setCourseData(await get_courses(courseArr));

    toast.remove(loadToast);
    toast.success("Retrieved!");
  };

  return (
    <main class="container">
      <Toaster />
      <h1>Georgia Tech self-course checker!</h1>
      <For each={courses}>
        {(course: Course) => <CourseEntry course={course} />}
      </For>
      <hr />
      <section class="col">
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
          <button
            onClick={() => {
              addCourse(newCourse());
            }}
          >
            &#10133 Add Course
          </button>
        </div>
        <div class="row">
          <input
            id="gt-scheduler-input"
            value={gtScheduleCourses().join(", ")}
            onChange={(e) => setGtScheduleCourses(e.target.value)}
            placeholder=""
            type="txt"
          />
          <p>{gtScheduleCourses()}</p>
          <button
            onClick={() => {
              addCourse(newCourse());
            }}
          >
            &#10133 Add Courses from GT-Scheduler
          </button>
        </div>
      </section>
      <button type="button" onClick={saveCourses}>
        Save Courses
      </button>

      <br />
      <button type="button" onClick={getData}>
        Get Course Data
      </button>

      <Results data={courseData()} fetched={fetched()} />

      <button type="button" onClick={openLink}>
        Go register!
      </button>

      <button type="button" onClick={clearLocalStorage}>
        Cler Storage
      </button>
    </main>
  );
};

export default App;

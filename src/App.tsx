import { createEffect, createSignal, For, onMount, Show } from "solid-js";
import toast, { Toaster } from "solid-toast";
import "./App.scss";

import type { Course } from "./utils/types";
import { courseMAX, courseMIN } from "./utils/types";
import { openLink, get_courses } from "./utils/backend";
import {
  addCourse,
  saveCourses,
  courses,
  setCourses,
} from "./utils/dataManagement";

const App = () => {
  const [data, setData] = createSignal("No data fetched!");
  const [newCourse, setNewCourse] = createSignal(0);

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

    setData("Loading");
    const loadToast = toast.loading("Fetching your data");

    const courseArr = courses
      .filter((el: Course) => {
        return el.valid == true;
      })
      .map((el: Course) => {
        return el.courseNum;
      });

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
        <button
          onClick={() => {
            addCourse(newCourse());
          }}
        >
          &#10133 Add Course
        </button>
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

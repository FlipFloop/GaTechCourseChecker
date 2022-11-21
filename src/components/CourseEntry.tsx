import { Component, Show } from "solid-js";
import { SetStoreFunction } from "solid-js/store";

import { courses, setCourses } from "../utils/dataManagement";
import { courseMAX, courseMIN, Course } from "../utils/types";

const CourseEntry: Component<{ course: Course }> = (props) => {
  return (
    <div>
      <input
        value={props.course.courseNum}
        min={courseMIN}
        max={courseMAX}
        type="number"
        onChange={async (e) => {
          const idx = courses.findIndex(
            (el: Course) => el.courseNum === props.course.courseNum
          );
          setCourses(idx, { courseNum: e.target.value as number });
        }}
      />
      <button
        onClick={() => {
          setCourses(
            courses.filter((el: any) => el.courseNum !== props.course.courseNum)
          );
        }}
      >
        &#10060 Remove
      </button>
      <Show when={props.course.valid}>
        <button>&#x2705 Course CRN is valid</button>
      </Show>
      <Show when={!props.course.valid}>
        <button>! CRN Doesn't exist !</button>
      </Show>
    </div>
  );
};

export default CourseEntry;

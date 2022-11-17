import { createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/shell";
import "./App.css";

const App = () => {
  const [data, setData] = createSignal("");

  const [courses, setCourses] = createSignal([
    21135, 25587, 27395, 24649,
  ]);

  const getData = async () => {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setData(await invoke("get_courses"));
  };

  const openLink = async () => {
    open(
      "https://oscar.gatech.edu/bprod/twbkwbis.P_GenMenu?name=bmenu.P_RegMnu"
    );
  };

  return (
    <div class="container">
      <h1>Georgia Tech self-coursicle!</h1>
      <h4>{courses().join(", ")}</h4>
      <div class="row">
        <div>
          {/* <input
            id="course-num-input"
            onChange={(e) => setCourses([e.target.value])}
            placeholder="432432"
            type="number"
            use:model={[courses, setCourses]}
          /> */}
          <button
            type="button"
            onClick={() => {
              setData("Loading");
              getData();
            }}
          >
            Get Course Data
          </button>
        </div>
      </div>

      <h2>{data()}</h2>

      <button onClick={openLink}>Go register!</button>
    </div>
  );
};

export default App;

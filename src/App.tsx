import { createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/shell";
import "./App.css";

import toast, { Toaster } from "solid-toast";

const showSuccess = () => toast.success("Retrieved!");

const App = () => {
  
  const [courses, setCourses] = createSignal([21135, 25587, 27395, 24649]);
  const [data, setData] = createSignal("");
  

  const getData = async () => {
    setData("Loading");
    toast.loading("Fetching your data");
    setData(await invoke("get_courses"));

    toast.remove();
    showSuccess();
  };

  const openLink = async () => {
    open(
      "https://oscar.gatech.edu/bprod/twbkwbis.P_GenMenu?name=bmenu.P_RegMnu"
    );
  };

  return (
    <div class="container">
      <Toaster />
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
          <button type="button" onClick={getData}>
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

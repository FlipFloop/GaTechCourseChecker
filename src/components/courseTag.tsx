import { Component } from "solid-js";
import { Course } from "../utils";

export const courseTag = (course: Course) => {
  return (
    <div>
      {/* <input
                type="checkbox"
                style="width:50px;"
                checked=${course.done}
                onchange=${(e) => {
                  const idx = state.todos.findIndex((t) => t.id === todo.id);
                  setState("todos", idx, { done: e.target.checked });
                }}
              />
              <input
                type="text"
                value=${todo.title}
                onchange=${(e) => {
                  const idx = state.todos.findIndex((t) => t.id === todo.id);
                  setState("todos", idx, { title: e.target.value });
                }}
              />
              <button
                onclick=${() =>
                  setState("todos", (t) => t.filter((t) => t.id !== todo.id))}
              >
                &#10060
              </button> */}
    </div>
  );
};

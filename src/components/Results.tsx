import { Component, createEffect, For, onMount } from "solid-js";

const Results: Component<{ data: number[][]; fetched: boolean }> = (props) => {
  onMount(() => {
    return <h1>No data fetched.</h1>;
  });

  return (
    <div>
      {props.fetched ? (
        <>
          {props.data.length === 0 && <h2>Loading...</h2>}
          {props.data[0] && props.data[0].length !== 0 && (
            <>
              <h2>
                Courses with available seats:
                <ul>
                  <For each={props.data[0]}>
                    {(courseNum: number) => <li>{courseNum}</li>}
                  </For>
                </ul>
              </h2>
            </>
          )}
          {props.data[1] && props.data[1].length !== 0 && (
            <>
              <h2>
                Courses with available waitlist seats:
                <ul>
                  <For each={props.data[1]}>
                    {(courseNum: number) => <li>{courseNum}</li>}
                  </For>
                </ul>
              </h2>
            </>
          )}
          {props.data[0] &&
            props.data[1] &&
            props.data[0].length === 0 &&
            props.data[1].length === 0 && <h2>Nothing is available.</h2>}
        </>
      ) : (
        <h2>You haven't checked yet.</h2>
      )}
    </div>
  );
};

export default Results;

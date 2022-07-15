import React from "react";

const Mic = ({ ToggleAudio, startRecording }) => {
  return (
    // <div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "25px",
        height: "25px",
        cursor: "pointer",
        color: "white",
        marginLeft: "15px",
      }}
      class="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
      onClick={() => {
        ToggleAudio();
      }}
    >
      <path
        fill-rule="evenodd"
        d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
        clip-rule="evenodd"
      />
    </svg>
    // </div>
  );
};

export default Mic;

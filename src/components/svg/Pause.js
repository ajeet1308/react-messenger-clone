import { ref } from "firebase/storage";
import React from "react";

const Pause = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{width:"35px",height:"30px",cursor:"pointer",color:"#f24957"}}
      class="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
        clip-rule="evenodd"
      />
    </svg>
  );
};

export default Pause;

import { hover } from "@testing-library/user-event/dist/hover";
import React, { useState } from "react";

const Dots = ({DeleteMessage}) => {
  const [isClicked, setIsClicked] = useState(false);
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "20px",
          height: "20px",
          cursor: "pointer",
          float: "right",
          color:"red"
          // display:"none"
        }}
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        onClick={DeleteMessage}
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
      {/* {isClicked?
        <>
          <div className="dropdown">
            <button>Delete</button>
          </div>
        </>
        : null
      } */}
    </div>
  );
};

export default Dots;

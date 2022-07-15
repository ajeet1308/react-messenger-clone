import React from "react";

const Stop = ({ToggleAudio}) => {
  return (
    // <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "25px",
          height: "25px",
          cursor: "pointer",
          color: "red",
          position:"absolute",
          marginTop:"10px",
          marginLeft:"35px"
        }}
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
        onClick={ToggleAudio}
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
          clip-rule="evenodd"
        />
      </svg>
    // </div>
  );
};

export default Stop;

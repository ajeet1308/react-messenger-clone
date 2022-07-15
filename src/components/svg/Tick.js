import React from "react";

const Tick = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{width:"35px",height:"35px",cursor:"pointer"}}
      viewBox="0 0 48 48"
      width="48px"
      height="48px"
      baseProfile="basic"
    >
      <circle cx="24" cy="24" r="20" fill="#6be3a2" />
      <path
        fill="#324561"
        d="M22.5,33c-0.226,0-0.446-0.076-0.625-0.219l-7.5-6c-0.431-0.345-0.501-0.974-0.156-1.405	c0.347-0.431,0.975-0.501,1.406-0.156l6.667,5.334l9.889-14.126c0.316-0.454,0.94-0.562,1.393-0.246	c0.453,0.317,0.562,0.94,0.246,1.393l-10.5,15c-0.158,0.227-0.403,0.377-0.677,0.417C22.595,32.997,22.547,33,22.5,33z"
      />
    </svg>
  );
};

export default Tick;

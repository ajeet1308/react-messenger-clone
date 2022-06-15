import React from "react";
import { useNavigate } from "react-router-dom";

const LinkTo = ({msg}) => {

    const navigate = useNavigate();
    const GoTo = () =>{
        const url = msg.media;
        window.location.href = url; 
    }

  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{width:"25px", height:"25px", cursor:"pointer",color:'gray'}}
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        onClick={GoTo}
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </div>
  );
};

export default LinkTo;

import React from "react";

const CancelPreviewButton = ({setImg}) => {
  const handleCancelPreview = () =>{
    setImg("");
  }
  return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={
            {   width: "25px",
                height: "25px",
                cursor: "pointer",
                color: "white",
                marginTop: "15px",
                marginLeft: "15px",
            }
        }
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
        onClick={handleCancelPreview}
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
  );
};

export default CancelPreviewButton;

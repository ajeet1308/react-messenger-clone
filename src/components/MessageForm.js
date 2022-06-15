// import React from "react";
// import Attachment from "./svg/Attachment";

// const MessageForm = () => {
//   return (
//     <>
//       <form className="message_form">
//         <label htmlFor="img">
//           <Attachment />
//         </label>
//       </form>
//       <input
//         type="file"
//         id="img"
//         accept="image/*"
//         style={{ display: "none" }}
//       />
//       <div>
//         <button className="btn">Send</button>
//       </div>
//     </>
//   );
// };

// export default MessageForm;

import React from "react";
import Attachment from "./svg/Attachment";

const MessageForm = ({ handleSubmit, text, setText, setImg, img }) => {
  return (
    <form className="message_form" onSubmit={handleSubmit}>
      

      <input
        type="file"
        id="img"
        // accept="image/*"
        // value={img}
        onChange={(e) => setImg(e.target.files[0])}
        // style={{ marginLeft:"-10vh"}}
      />
      <div>
        <input
          type="text"
          placeholder="Enter message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div>
        {img || text ? 
          <>
            <button className="btn">Send</button>
          </>
          :
          null
        }
      </div>
    </form>
  );
};

export default MessageForm;
import React, { useRef, useEffect } from "react";
import Moment from "react-moment";
import LinkTo from "./svg/LinkTo";
import Seen from  "./svg/Seen"

const Message = ({ msg, user1 }) => {
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);
  return (
          <div
            className={`message_wrapper ${msg.from === user1 ? "own" : ""}`}
            ref={scrollRef}
          >
          <p className={msg.from === user1 ? "me" : "friend"}>
            {msg.media ? <embed src= {msg.media}  className="images"/> : null}
            <br/>
            {msg.text}
            <br/>
            <small>
              <Moment fromNow>{msg.createdAt.toDate()}</Moment>
            </small>
          </p>
          {msg.media?<LinkTo msg={msg}/>:null}
        </div>
  );
};

export default Message;
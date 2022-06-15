// import React from 'react'
// import Img from '../photo.svg'

// const User = ({user,selectUser}) => {
//   return (
//     <div className='user-wrapper' onClick={()=>selectUser(user)} style={{cursor:"pointer"}}>
//         <div className='user-info' >
//             <div className='user_detail'>
//                 <img src={user.avatar || Img} alt='avatar' className='avatar'/>
//                 <h4>{user.name}</h4>
//             </div>
//             <div className={`user_status ${user.isOnline ? "online":"offline"}`}>
//             </div>
//             <div className='underLine'></div>
//         </div>
//     </div>
//   )
// }

// export default User

import React, { useEffect, useState } from "react";
import Img from "../photo.svg";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";

const User = ({ user1, user, selectUser, chat }) => {
  const user2 = user?.uid;
  const [data, setData] = useState("");

  useEffect(() => {
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
    let unsub = onSnapshot(doc(db, "lastMsg", id), (doc) => {
      setData(doc.data());
    });
    return () => unsub();
  }, []);

  return (
    <>
      <div
        className={`user_wrapper ${chat.name === user.name && "selected_user"}`}
        onClick={() => selectUser(user)}
      >
        <div className="user_info">
          <div className="user_detail">
            <img src={user.avatar || Img} alt="avatar" className="avatar" />
            <h4>{user.name}</h4>
            {data?.from !== user1 && data?.unread && (
              <small className="unread">New</small>
            )}
          </div>
          <div
            className={`user_status ${user.isOnline ? "online" : "offline"}`}
          ></div>
        </div>
        {data && (
          <p className="truncate">
            <strong>{data.from === user1 ? "Sent:" : "Recieved: "}</strong>
            {data.text||"Media file"}
          </p>
        )}
      </div>
      <div
        onClick={() => selectUser(user)}
        className={`sm_container ${chat.name === user.name && "selected_user"}`}
      >
        <img
          src={user.avatar || Img}
          alt="avatar"
          className="avatar sm_screen"
        />
      </div>
      <div className='underLine'></div>
    </>
  );
};

export default User;
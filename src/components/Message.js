import React, { useRef, useEffect } from "react";
import Moment from "react-moment";
import LinkTo from "./svg/LinkTo";
import Dots from './svg/Dots'
import Edit from './svg/Edit'
import { deleteDoc,doc,collection,updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import Swal from "sweetalert2";

const Message = ({ msg, user1,user2,user2Name}) => {
  const scrollRef = useRef();
  // console.log(user2Name)
  console.log(user1)
  console.log(msg)
  console.log(user2)
  const id= user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
  const next_id = msg[1]
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);
  const DeleteMessage = async()=>{
    Swal.fire({
      title: 'Do you want to Delete the message?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      denyButtonText: `Don't Delete`,
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire('Deleted!', '', 'success')
        const docRef = doc(db, "messages", id, "chat",next_id)
        await deleteDoc(docRef);
        await deleteDoc(doc(db,"lastMsg",id));
      } else if (result.isDenied) {
        Swal.fire('Message not Deleted', '', 'info')
      }
    })
  }
  const EditMessage = async()=>{
    const tempText = msg[0].text;
    const { value: text } = await Swal.fire({
      input: 'textarea',
      inputLabel: 'Message',
      inputPlaceholder: tempText,
      inputAttributes: {
        'aria-label': 'Type your message here'
      },
      showCancelButton: true
    })
    
    if (text) {
      // Swal.fire(text)
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire('Saved!', '', 'success')
          const docRef = doc(db,"messages",id,"chat",next_id);
          await updateDoc(docRef,{
            text:text,
          });
          await updateDoc(doc(db,"lastMsg",id),{
            text:text,
          })
        } else if (result.isDenied) {
          Swal.fire('Changes are not saved', '', 'info')
        }
      })
    }
  }
  return (
          <div
            className={`message_wrapper ${msg[0].from === user1 ? "own" : ""}`}
            ref={scrollRef}
          >
          <p className={msg[0].from === user1 ? "me" : "friend"}>
            {msg[0].from !== user1 ? 
              <>
              <div className="userName">
                {user2Name + " :"}
              
              </div>
              <Dots DeleteMessage={DeleteMessage}/>
              </>
              :
              <>
                <div className="userName">
                  Me:
                
                </div>
                <Dots DeleteMessage={DeleteMessage}/>
                <Edit EditMessage={EditMessage}/>
              </>
            }
            <br/>
            <div>{msg[0].media ? <embed src= {msg[0].media}  className="images"/> : null}</div>
            <div>{msg[0].listen ? <audio src={msg[0].listen} className="images" controls="controls"/> : null}</div>
            <br/>
            <div> {msg[0].text} </div>
            {/* <br/> */}
            <small>
              <Moment fromNow>{msg[0].createdAt.toDate()}</Moment>
            </small>
          </p>
          {msg[0].media?<LinkTo msg={msg[0]}/>:null}
        </div>
  );
};

export default Message;
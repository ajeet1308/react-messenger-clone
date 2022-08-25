// export default VideoChatContainer
import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import {useNavigate} from 'react-router-dom'

function VideoChatContainer() {
  let { id } = useParams();
  const [peerId, setPeerId] = useState("");
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const [user1, setUser1] = useState("");
  const navigate = useNavigate();
  const [disable,setDisable] = useState(false);

  useEffect(() => {
    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
    });

    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser1(docSnap.data());
      }
    });

    peer.on("call", (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();
        call.answer(mediaStream);
        call.on("stream", function (remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      });
    });

    peerInstance.current = peer;
  }, []);

  const call = (remotePeerId) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.play();

      const call = peerInstance.current.call(remotePeerId, mediaStream);

      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.play();
      });
    });
  };
    let pid=peerId;
    if(!user1.incoming){
        // This means this is user is calling
        const fun = async () =>{    
            await updateDoc(doc(db,"users",id),{
                incoming:pid,
            })
        }
        fun();
    }
    const handleback = async ()=>{
        await updateDoc(doc(db,"users",auth.currentUser.uid),{
            incoming:"",
        });
        navigate('/');
    }


  return (
    <>
      <div className="videoApp" style={{ textAlign: "center" }}>
        <h1>Current user id is {peerId}</h1>
        <br />
        {!user1.incoming? 
            <Button
            variant="danger"
            onClick={() => {handleback();}}
            style={{ marginTop: "15px" }}
            >
            Reject
            </Button>
            :
            <>
            <Button variant="success" onClick={()=>{call(user1.incoming);setDisable(true)}} style={{marginTop:"15px"}}>Answer</Button> {' '}
            <Button variant="danger" onClick={()=>{handleback()}} style={{marginTop:"15px"} }>Reject</Button>
            </>
        }
          <>
            <div
              style={{
                margin: "50px",
                background: "white",
                height: "300px",
                padding: "30px",
              }}
            >
              <div style={{ width: "45%", float: "left", height: "100%" }}>
                <video
                  ref={currentUserVideoRef}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
              <div style={{ width: "45%", float: "right", height: "100%" }}>
                <video
                  ref={remoteVideoRef}
                  style={{ width: "100%", height: "100%" }}
                />
              </div>
            </div>
            <div
              style={{
                margin: "50px",
                padding: "30px",
              }}
            >
              <span
                style={{
                  width: "45%",
                  float: "left",
                  height: "100%",
                  background: "darkcyan",
                  fontSize: "25px",
                  borderRadius: "10px",
                  padding: "5px",
                }}
              >
                Current User
              </span>
              <span
                style={{
                  width: "45%",
                  float: "right",
                  height: "100%",
                  background: "darkcyan",
                  fontSize: "25px",
                  borderRadius: "10px",
                  padding: "5px",
                }}
              >
                Remote User
              </span>
            </div>
          </>
      </div>
    </>
  );
}

export default VideoChatContainer;

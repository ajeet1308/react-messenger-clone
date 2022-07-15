// import { async } from '@firebase/util';
// import React, { useEffect, useRef } from 'react'
// import { deleteDoc,doc,collection,updateDoc, Firestore } from "firebase/firestore";
// import { db } from "../firebase";

// const VideoChatContainer = () => {
//     const servers = {
//         iceServers: [
//           {
//             urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
//           },
//         ],
//         iceCandidatePoolSize: 10,
//       };
//     let pc = new RTCPeerConnection(servers);
//     let localStream = null;
//     let remoteStream = null;

//     // HTML elements
//     const webcamButton = useRef(null);
//     const webcamVideo = useRef(null);
//     const callButton = useRef(null);
//     const callInput = useRef(null);
//     const answerButton = useRef(null);
//     const remoteVideo = useRef(null);
//     const hangupButton = useRef(null);

//     // 1. Setup media sources
//     const webcamButton1 = async () => {
//         console.log('clicked')
//         localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
//         remoteStream = new MediaStream();

//         // Push tracks from local stream to peer connection
//         localStream.getTracks().forEach((track) => {
//           pc.addTrack(track, localStream);
//         });

//         // Pull tracks from remote stream, add to video stream
//         pc.ontrack = (event) => {
//           event.streams[0].getTracks().forEach((track) => {
//             remoteStream.addTrack(track);
//           });
//         };

//         webcamVideo.current.srcObject = localStream;
//         remoteVideo.current.srcObject = remoteStream;
//         webcamVideo.play();

//         callButton.current.disabled = false;
//         answerButton.current.disabled = false;
//         webcamButton.current.disabled = true;
//       };

//       // 2. Create an offer
//       const callButton1 = async () => {
//         // Reference Firestore collections for signaling
//         const callDoc = db.collection('calls').doc();
//         const offerCandidates = callDoc.collection('offerCandidates');
//         const answerCandidates = callDoc.collection('answerCandidates');

//         callInput.current.value = callDoc.id;

//         // Get candidates for caller, save to db
//         pc.onicecandidate = (event) => {
//           event.candidate && offerCandidates.add(event.candidate.toJSON());
//         };

//         // Create offer
//         const offerDescription = await pc.createOffer();
//         await pc.setLocalDescription(offerDescription);

//         const offer = {
//           sdp: offerDescription.sdp,
//           type: offerDescription.type,
//         };

//         await callDoc.set({ offer });

//         // Listen for remote answer
//         callDoc.onSnapshot((snapshot) => {
//           const data = snapshot.data();
//           if (!pc.currentRemoteDescription && data?.answer) {
//             const answerDescription = new RTCSessionDescription(data.answer);
//             pc.setRemoteDescription(answerDescription);
//           }
//         });

//         // When answered, add candidate to peer connection
//         answerCandidates.onSnapshot((snapshot) => {
//           snapshot.docChanges().forEach((change) => {
//             if (change.type === 'added') {
//               const candidate = new RTCIceCandidate(change.doc.data());
//               pc.addIceCandidate(candidate);
//             }
//           });
//         });

//         hangupButton.current.disabled = false;
//       };

//       // 3. Answer the call with the unique ID
//       const answerButton1 = async () => {
//         const callId = callInput.current.value;
//         const callDoc = db.collection('calls').doc(callId);
//         const answerCandidates = callDoc.collection('answerCandidates');
//         const offerCandidates = callDoc.collection('offerCandidates');

//         pc.onicecandidate = (event) => {
//           event.candidate && answerCandidates.add(event.candidate.toJSON());
//         };

//         const callData = (await callDoc.get()).data();

//         const offerDescription = callData.offer;
//         await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

//         const answerDescription = await pc.createAnswer();
//         await pc.setLocalDescription(answerDescription);

//         const answer = {
//           type: answerDescription.type,
//           sdp: answerDescription.sdp,
//         };

//         await callDoc.update({ answer });

//         offerCandidates.onSnapshot((snapshot) => {
//           snapshot.docChanges().forEach((change) => {
//             console.log(change);
//             if (change.type === 'added') {
//               let data = change.doc.data();
//               pc.addIceCandidate(new RTCIceCandidate(data));
//             }
//           });
//         });
//       };
//   return (
//     <>
//         <h2>1. Start your Webcam</h2>
//         <div class="videos">
//         <span>
//             <h3>Local Stream</h3>
//             <video ref={webcamVideo} autoplay playsinline></video>
//         </span>
//         <span>
//             <h3>Remote Stream</h3>
//             <video ref={remoteVideo} autoplay playsinline></video>
//         </span>

//         </div>

//         <button onclick={()=>{webcamButton1();console.log("clicked")}} ref={webcamButton}>Start webcam</button>
//         <h2>2. Create a new Call</h2>
//         <button onclick={callButton1} ref={callButton} disabled>Create Call (offer)</button>

//         <h2>3. Join a Call</h2>
//         <p>Answer the call from a different browser window or device</p>

//         <input ref={callInput} />
//         <button onclick={answerButton1} ref={answerButton} disabled>Answer</button>

//         <h2>4. Hangup</h2>

//         <button ref={hangupButton} disabled>Hangup</button>

//     </>

//   )
// }

// export default VideoChatContainer
import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { Button } from "react-bootstrap";
import { Navigate, useParams } from "react-router-dom";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth, storage } from "../firebase";
import {useNavigate} from 'react-router-dom'
import { async } from "@firebase/util";

function VideoChatContainer() {
  let { id } = useParams();
  console.log(id);
  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const [user1, setUser1] = useState("");
  const [user2, setUser2] = useState("");
  const [virtualRemotePeerIdValue, setVirtualRemotePeerIdValue] = useState("");
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
    console.log(peerId)
    console.log("peerId")
    console.log(user1);
    // getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
    //   if (docSnap.exists) {
    //     setUser1(docSnap.data());
    //   }
    // });
    // getDoc(doc(db, "users", id)).then((docSnap) => {
    //     if (docSnap.exists) {
    //     setUser2(docSnap.data());
    //     }
    // });
    let pid=peerId;
    // console.log(pid)
    console.log(user1.incoming)
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
        {/* <input
          type="text"
          value={remotePeerIdValue}
          onChange={(e) => setRemotePeerIdValue(e.target.value)}
          style={{ width: "50%", height: "50px", borderRadius: "5px" }}
          placeholder="Please Enter your peers Id"
        /> */}
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
        {/* {currentUserVideoRef ? ( */}
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
        {/* ) : null} */}
      </div>
    </>
  );
}

export default VideoChatContainer;

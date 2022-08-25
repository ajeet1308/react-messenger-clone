import React, { useRef, useEffect, useState } from "react";
import DeleteAudio from "./svg/DeleteAudio";
import Pause from "./svg/Pause";
import AudioMic from "./svg/AudioMic";
import { ref } from "firebase/storage";
import Tick from "./svg/Tick";
import RecordingSpinner from "./svg/RecordingSpinner";

const AudioFile = ({ img, setImg, setAudio}) => {
  const [IsAudio, setIsAudio] = useState(true);
  const [blobUrl, setBlobUrl] = useState("");
  const [Recordingstatus, setRecordingStatus] = useState("Recording");
  const stopButtonRef = useRef("");
  useEffect(()=>{
    startRecording();
  })
  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(function (stream) {
        const options = { mimeType: "audio/webm" };
        const recordedChunks = [];
        // const mediaRecorder = new MediaRecorder(stream, options);
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.addEventListener("dataavailable", function (e) {
          if (e.data.size > 0) recordedChunks.push(e.data)
        });

        mediaRecorder.addEventListener("stop", function () {
          const blob = new Blob(recordedChunks, { type: "audio/mp3" });
          blob.name = "audio";
          const blobVal = URL.createObjectURL(blob);

          //  blob.lastModified = new Date();
          console.log(
            "blob is ",
            blob,
            "type of blob is ",
            typeof blob,
            "BLOB Val IS ",
            blobVal,
            " type of this is ",
            typeof blobVal
          );

          // const myFile = new File([blob], "audio", {
          //   type: blob.type,
          // });

          setBlobUrl(blobVal);
          setImg(blob);
        });
        if (stopButtonRef && stopButtonRef.current)
          stopButtonRef?.current?.addEventListener(
            "click",
            function onStopClick() {
              mediaRecorder.stop();
              this.removeEventListener("click", onStopClick);
            }
          );

        mediaRecorder.start();
      });
  };

  return (
    <>
      <div className="footer">
        <div className="smile-footer-null">
          <span onClick={()=>{setAudio(false);setImg("")}}><DeleteAudio /></span>
        </div>
        <div></div>
        {IsAudio?
        <>
          <div className="smile-footer-null-status">
            <span>{Recordingstatus+" "}
              <RecordingSpinner/>
            </span>
          </div>
          </>
          :
          <audio src={blobUrl} controls style={{width:"40%",height:"35px",marginLeft:"20px",float:"left",marginRight:"10px"}}/>
        }     

        <div className="smile-footer-null">
          {IsAudio ? (
            <span onClick={()=>{setIsAudio(false)}} ref={stopButtonRef}><Pause/></span>
          ) : (
            <span onClick={()=>{setIsAudio(true);setImg("");startRecording();}}><AudioMic/></span>
          )}
        </div>
        {!IsAudio?
          <div className="smile-footer-null">
            <span onClick={()=>{setAudio(false);}}><Tick/></span>
          </div>
          :
          null
        }
      </div>
      {/* <div className="video-container">
            {status?
                <>
                    <div className="status"><div>{status}</div></div>
                </>
                : 
                null
            }
            <div className="audio-button">
                <Button onClick={()=>{startRecording();setStatus("Recording....")}} style={{background:"green"}}>Start Recording</Button>{' '}
                <Button style={{background:"red"}} onClick={()=>{setStatus("Recording Stopped")}} ref={stopButtonRef}>Stop Recording</Button>
            </div>
            {blobUrl?<audio src={blobUrl} controls />:null}
        </div> */}
    </>
  );
};

export default AudioFile;

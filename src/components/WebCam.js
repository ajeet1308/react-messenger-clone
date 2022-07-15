import React, { useRef, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import TakePhoto from "./svg/TakePhoto";
import Cancel from "./svg/Cancel";
import Revert from "./svg/Revert";

const WebCam = ({ setPhoto, setImg, handleSubmit, setIsWebCam}) => {
  let videoRef = useRef(null);
  let photoRef = useRef(null);
  const [finalPhoto, setFinalPhoto] = useState("");
  const [confirm, setConfirm] = useState(false);
  useEffect(() => {
    getUserCamera();
  }, [videoRef]);
  const getUserCamera = () => {
    // get access to user webcamera
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((stream) => {
        // attach the stream to the video tag
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const takePicture = () => {
    // width and height

    let width = 400;
    let height = 300;
    console.log(photoRef.current);
    let photo = photoRef.current;
    let video = videoRef.current;

    // set the photo width and height

    photo.width = width;
    photo.height = height;
    console.log(photo);
    let ctx = photo.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);
    setFinalPhoto(ctx.canvas.toDataURL("image/webp", 0.25));
    console.log(finalPhoto);
    // console.log(ctx.canvas.toDataURL());
    setConfirm(true);
  };
  return (
    <>
      <div className="video-container">
        <div style={{ background: "#03816b", height: "55px" }}>
          <Cancel setPhoto={setPhoto} setImg={setImg} />
          <div
            style={{
              position: "absolute",
              marginLeft: "80px",
              marginTop: "-30px",
              fontSize: "20px",
            }}
          >
            Take Photo
          </div>
        </div>
        <video ref={videoRef}> </video>
        <div className="video-button">
          <Button
            variant="success"
            style={{ background: "#00a884" }}
            onClick={() => {
              takePicture();
            }}
          >
            <TakePhoto />
          </Button>{" "}
        </div>
      </div>
      <div className={"result" + (confirm ? "-hasPhoto" : "")}>
        <div style={{ background: "#03816b", height: "55px" }}>
          <Cancel setPhoto={setPhoto} setImg={setImg}/>
          <div
            style={{
              position: "absolute",
              marginLeft: "80px",
              marginTop: "-30px",
              fontSize: "20px",
            }}
          >
            <div>Take Photo</div>
          </div>
          <div
            style={{
              position: "relative",
              // marginLeft: "-6",
              // marginTop: "15px",
              fontSize: "20px",
              marginLeft: "5px",
              float: "right",
              marginRight: "35px",
            }}
            onClick={()=>{setConfirm(false)}}
          >
            <Revert />
            <div style={{ float: "right", marginTop: "15px" , cursor:"pointer"}}>Retake</div>
          </div>
        </div>
        <canvas ref={photoRef} alt="myimage"></canvas>
        <div className="video-button">
          <Button
            variant="success"
            style={{ background: "#00a884" }}
            onClick={() => {
              setImg(finalPhoto);
              setConfirm(false);
              setIsWebCam(true);
            }}
          >
            Select
          </Button>
        </div>
      </div>
    </>
  );
};

export default WebCam;

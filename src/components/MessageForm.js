import React, { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
import { Recorder } from "react-voice-recorder";
import "react-voice-recorder/dist/index.css";
import Mic from "../components/svg/Mic";
import ChatCamera from "../components/svg/ChatCamera";
import Photo from "../photo.svg";
import WebCam from "./WebCam";
import Stop from "../components/svg/Stop";
import { ref } from "firebase/storage";
import AudioFile from "./AudioFile";
import Attachment from "./svg/Attachment";
import Folder from "./svg/Folder";
import ShowFilePreview from "./ShowFilePreview";
const MessageForm = ({
  handleSubmit,
  text,
  setText,
  setImg,
  img,
  loading,
  setLoading,
  setListen,
  setIsWebCam,
  setConfirm,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [audio, setAudio] = useState(false);
  const [photo, setPhoto] = useState(false);
  const ToggleCamera = () => {
    setPhoto((val) => !val);
  };
  const ToggleAudio = () => {
    setAudio(!audio);
  };
  const onEmojiClick = (event, emojiObject) => {
    setText((prevInput) => prevInput + emojiObject.emoji);
    setShowPicker(false);
  };
  console.log("MessageForm",img)
  return (
    <form className="message_form" onSubmit={handleSubmit}>
      <div className="picker-container">
        {showPicker && (
          <Picker pickerStyle={{ width: "100%" }} onEmojiClick={onEmojiClick} />
        )}
      </div>
      {photo ? (
        <>
          <WebCam
            setPhoto={setPhoto}
            setImg={setImg}
            setIsWebCam={setIsWebCam}
          />
        </>
      ) : (
        <div></div>
      )}
      {audio ? (
        <>
          <AudioFile img={img} setImg={setImg} setAudio={setAudio} />
        </>
      ) : (
        <div></div>
      )}
      {img?<ShowFilePreview img={img} setImg={setImg} /> : null}

      <div className={!audio?"footer":"footer-null"}>
        <div className="smile">
          <img
            className="emoji-icon"
            src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
            onClick={() => setShowPicker((val) => !val)}
          />
          <label htmlFor="img">
            {!img? <Attachment /> : <Folder/>}
          </label>
          <input
            type="file"
            id="img"
            style={{ display: "none" }}
            onChange={(e) => {
              setImg(e.target.files[0]);
              setLoading(false);
            }}
          />
        </div>
        <div className="InputMessage">
          <input
            type="text"
            placeholder="Enter message"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setLoading(false);
            }}
          />
        </div>
        {img || text ? (
          <>
            <button className="btn">{loading ? "Sending..." : "Send"}</button>
          </>
        ) : (
          <>
            <div className="smile">
              <ChatCamera ToggleCamera={ToggleCamera} />
              <Mic ToggleAudio={ToggleAudio} />
            </div>
          </>
        )}
      </div>
    </form>
  );
};

export default MessageForm;

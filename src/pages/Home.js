import React, { useEffect, useState } from "react";
import { db, auth, storage } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import User from "../components/User";
import MessageForm from "../components/MessageForm";
import Message from "../components/Message";
import Img from "../photo.svg";
import { useNavigate } from "react-router-dom";
import VideoCall from "../components/svg/VideoCall";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [listen, setListen] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [isWebCam, setIsWebCam] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [user1detail, setUser1detail] = useState("");
  const navigate = useNavigate();
  const user1 = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    if (auth.currentUser === null) {
      navigate("/login");
    }
    const usersRef = collection(db, "users");
    // create query object
    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser1detail(docSnap.data());
      }
    });

    const q = query(usersRef, where("uid", "not-in", [user1]));
    // execute query
    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
    return () => unsub();
  }, []);
  if (user1detail.incoming) {
    if (window.confirm("Incoming call")) {
      navigate("/call/incoming");
    }
  }
  const selectUser = async (user) => {
    setChat(user);
    const user2 = user.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    const msgsRef = collection(db, "messages", id, "chat");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push([doc.data(), doc.id]);
      });
      setMsgs(msgs);
    });

    // get last message b/w logged in user and selected user
    const docSnap = await getDoc(doc(db, "lastMsg", id));
    // if last message exists and message is from selected user
    if (docSnap.data() && docSnap.data().from !== user1) {
      // update last message doc, set unread to false
      await updateDoc(doc(db, "lastMsg", id), { unread: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (img === "" && text === "" && listen === "") {
      setLoading(false);
      return;
    }
    const user2 = chat.uid;

    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    let url = img;
    if (img && !isWebCam) {
      const imgRef = ref(
        storage,
        `images/${new Date().getTime()} - ${img.name}`
      );
      const snap = await uploadBytes(imgRef, img);
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = dlUrl;
    }

    await addDoc(collection(db, "messages", id, "chat"), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      listen,
    });

    await setDoc(doc(db, "lastMsg", id), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      unread: true,
    });
    setText("");
    setImg("");
    setListen("");
    setLoading(false);
    setIsWebCam(false);
  };
  const handleVideoCall = () => {
    navigate("/call/" + chat.uid);
  };
  return (
    <div className="home_container">
      <div className="users_container">
        <div className="search_container">
          <input
            type="text"
            name="search"
            placeholder="Search or start new chat"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        <div className="underLine"></div>
        {users
          .filter((val) => {
            if (searchTerm === "") {
              return val;
            } else if (
              val.name.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              return val;
            }
          })
          .map((user) => (
            <User
              key={user.uid}
              user={user}
              selectUser={selectUser}
              user1={user1}
              chat={chat}
            />
          ))}
      </div>
      <div className="messages_container">
        {chat ? (
          <>
            <div
              className="messages_user"
              style={{ backgroundColor: "#dfc9d0", color: "black" }}
            >
              <div className="user_detail">
                <img src={chat.avatar || Img} alt="avatar" className="avatar" />
                <h4>{chat.name}</h4>
              </div>
              <div className="video-call" onClick={handleVideoCall}>
                <VideoCall />
              </div>
            </div>

            <div className="messages">
              {msgs.length >= 0
                ? msgs.map((msg, i) => (
                    <Message
                      key={i}
                      msg={msg}
                      user1={user1}
                      user2={chat.uid}
                      user2Name={chat.name}
                      listen={listen}
                    />
                  ))
                : null}
            </div>
            <MessageForm
              handleSubmit={handleSubmit}
              text={text}
              setText={setText}
              setImg={setImg}
              img={img}
              setLoading={setLoading}
              loading={loading}
              setListen={setListen}
              setIsWebCam={setIsWebCam}
            />
          </>
        ) : (
          <h3 className="no_conv">Select a user to start conversation</h3>
        )}
      </div>
    </div>
  );
};

export default Home;

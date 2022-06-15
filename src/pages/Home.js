// import React, { useEffect, useState } from "react";
// import { db, auth } from "../firebase";
// import {
//   collection,
//   query,
//   where,
//   onSnapshot,
//   QuerySnapshot,
//   addDoc,
// } from "firebase/firestore";
// import User from "../components/User";
// import MessageForm from "../components/MessageForm";

// const Home = () => {
//   const [users, setUsers] = useState([]);
//   const [chat, setChat] = useState("");
//   const [text,setText] = useState('');
//   useEffect(() => {
//     const usersRef = collection(db, "users");
//     // Create query object
//     const q = query(usersRef, where("uid", "not-in", [auth.currentUser.uid]));
//     // execute query
//     const unsub = onSnapshot(q, (QuerySnapshot) => {
//       let users = [];
//       QuerySnapshot.forEach((doc) => {
//         users.push(doc.data());
//       });
//       setUsers(users);
//     });
//     return () => unsub();
//   }, []);
//   console.log(users);
//   const selectUser = (user) => {
//     setChat(user);
//     console.log(user);
//   };
//   const handleSubmit = async (e)=>{
//     e.preventDefault();
//     const user2 = chat.uid;
//     const id = user1>user2?`${user1+user2}`:`$(user2+user1)`
//     await addDoc(collection(db,'messages',))
//   }
//   // onSnapShot : online listener (to check user status : online or offline)
//   return (
//     <>
//       <div className="home_container">
//         <div className="users_container">
//           {users.map((user) => (
//             <User key={user.uid} user={user} selectUser={selectUser} />
//           ))}
//         </div>
//       </div>

//       <div className="messages_container">
//         {chat ? (
//           <>
//             <div className="messages_user">
//               <h3>{chat.name}</h3>
//             </div>
//             <MessageForm/>
//             <div></div>
//           </>
//         ) : (
//           <h3 className="no_conv">Select a user to start conversation</h3>
//         )}
//       </div>
//     </>
//   );
// };

// export default Home;

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

const Home = () => {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [searchTerm,setSearchTerm] = useState("");
  const navigate = useNavigate();
  const user1 = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    if (auth.currentUser === null) {
      navigate("/login");
    }
    const usersRef = collection(db, "users");
    // create query object
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

  const selectUser = async (user) => {
    setChat(user);

    const user2 = user.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    console.log(user1);
    console.log(user2);
    const msgsRef = collection(db, "messages", id, "chat");
    const q = query(msgsRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
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

    const user2 = chat.uid;

    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    let url;
    if (img) {
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
    });

    await setDoc(doc(db, "lastMsg", id), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      unread: true,
    });
    console.log(user2.name);
    setText("");
    setImg("");
  };
  console.log(chat);
  return (
    <div className="home_container">
      <div className="users_container">
        <div className="search_container">
          <input
            type="text"
            name="search"
            placeholder="Search or start new chat"
            onChange={(e)=>{setSearchTerm(e.target.value)}}
          />
        </div>
        <div className='underLine'></div>
        {users.filter((val)=>{
          if(searchTerm==""){
            return val;
          }else if(val.name.toLowerCase().includes(searchTerm.toLowerCase())){
            return val;
          }

        }).map((user) => (
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
              {/* <img src={chat.avatar}/>
              <h3>{chat.name}</h3> */}
              <div className="user_detail">
                <img src={chat.avatar || Img} alt="avatar" className="avatar" />
                <h4>{chat.name}</h4>
              </div>
            </div>

            <div className="messages">
              {msgs.length >= 0
                ? msgs.map((msg, i) => (
                    <Message key={i} msg={msg} user1={user1} />
                  ))
                : null}
            </div>
            <MessageForm
              handleSubmit={handleSubmit}
              text={text}
              setText={setText}
              setImg={setImg}
              img = {img}
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
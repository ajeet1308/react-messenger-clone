import React, { useEffect, useState } from "react";
import Img from "../photo.svg";
import Camera from "../components/svg/Camera";
import Delete from "../components/svg/Delete";
import { storage, db, auth } from "../firebase";
import { ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Edit1 from "../components/svg/Edit1";
import { async } from "@firebase/util";
import Swal from "sweetalert2";

const Profile = () => {
  const [img, setImg] = useState("");
  const [user, setUser] = useState(
    {
      name : "",
      email : "",
      avatar : "",
    }
  );

  const navigate = useNavigate();
  const handleChange = (e) => {
    setImg(e.target.files[0]);
  };

  useEffect(() => {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data());
      }
    });
    if (img) {
      const uploadImg = async () => {
        const imgRef = ref(
          storage,
          `avatar/${new Date().getTime()} - ${img.name}`
        );
        try {
          if(user.avatarPath){
            await deleteObject(ref(storage,user.avatarPath));
          }
          const snap = await uploadBytes(imgRef, img);
          console.log(snap.ref.fullPath);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
          console.log(url);
          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
          });
          setImg("");
        } catch (err) {
          console.log(err.message);
        }
      };
      uploadImg();
    }
  }, [img]);

  const deleteImage = async () =>{
    try{
      const confirm = window.confirm('Delete avatar?');
      if(confirm){
        await deleteObject(ref(storage,user.avatarPath));
        
        await updateDoc(doc(db,'users',auth.currentUser.uid),{
          avatar : '',
          avatarPath:'',
        });
        navigate('/');
      }
    }catch(err){
      console.log(err.message);
    }
  }
  const Edit1Message = async()=>{
    const { value: text } = await Swal.fire({
      input: 'textarea',
      inputLabel: 'Message',
      inputPlaceholder: 'Please Enter your Name here...',
      inputAttributes: {
        'aria-label': 'Please Enter your Name here'
      },
      showCancelButton: true
    })
    
    if (text) {
      await updateDoc(doc(db,'users',auth.currentUser.uid),{
        name:text,
      })
      window.location.reload();
    }
  }
  return (
    <section>
      <div className="profile_container">
        <div className="img_container">
          <img src={user.avatar || Img} alt="avatar" /> 

          <div className="overlay">
            <div>
              <label htmlFor="photo">
                <Camera />
              </label>
              {user.avatar ? <Delete deleteImage={deleteImage}/>:null}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="photo"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div>
          <h3 style={{float:"left"}}>{user.name}</h3>
          <Edit1 Edit1Message={Edit1Message}/>
          <p>{user.email}</p>
          <hr />
          {/* <small>Joined on: {user.createdAt.toDate().toDateString()}</small> */}
        </div>
      </div>
    </section>
  );
};

export default Profile;

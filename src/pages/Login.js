import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const navigate = useNavigate();
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const { email, password, error, loading } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  function Validate(){
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!email || !password) {
      setData({ ...data, error: "* All fields are required" });
      return false;
    } else if (!email.match(regex)) {
      setData({ ...data, error: "Email Invalid Format" });
      return false;
    }
    return true;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if(Validate())
    {
        try {
          const result = await signInWithEmailAndPassword(auth, email, password);
          // And once we successfully created the user we are nowing pushing this data into our firestore
          await updateDoc(doc(db, "users", result.user.uid), {
              isOnline: true,
          });
          // And finally after user's detail is stored in our firestore we are resetting the values.
          setData({
              email: "",
              password: "",
              error: null,
              loading: false,
          });
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          
          Toast.fire({
            icon: 'success',
            title: 'Signed in successfully'
          })
          await delay(1000);
          navigate("/");
        } catch (err) {
        setData({ ...data, error: err.message, loading: false });
        }
    }
  };

  return (
    <>
      <section>
        <h3>Log into your Account</h3>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input_container">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </div>
          <div className="input_container">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
            />
          </div>
          {error ? <p className="error">{error}</p> : null}
          <div className="btn_container">
            <button className="btn" disabled={loading}>
              {loading?"Logging ..." : "Login"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Login;

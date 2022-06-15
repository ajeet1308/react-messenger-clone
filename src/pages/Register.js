import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const navigate = useNavigate();

  const { name, email, password, error, loading } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  function Validate() {
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
    if (Validate()) {
      try {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // And once we successfully created the user we are nowing pushing this data into our firestore
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          name,
          email,
          createdAt: Timestamp.fromDate(new Date()),
          isOnline: true,
          Seen: true,
        });
        // And finally after user's detail is stored in our firestore we are resetting the values.
        setData({
          name: "",
          email: "",
          password: "",
          error: null,
          loading: false,
        });
        navigate("/");
      } catch (err) {
        setData({ ...data, error: err.message, loading: false });
      }
    }
  };

  return (
    <>
      <section>
        <h3>Create An Account</h3>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input_container">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
            />
          </div>
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
              {loading ? "Creating ..." : "Register"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default Register;

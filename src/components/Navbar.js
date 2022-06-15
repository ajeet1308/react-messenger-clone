import React,{useContext} from "react";
import { Link } from "react-router-dom";
import { auth,db } from "../firebase";
import {signOut} from "firebase/auth";
import {updateDoc,doc} from 'firebase/firestore';
import {useNavigate} from 'react-router-dom'
import {AuthContext} from '../context/auth';
import Swal from "sweetalert2";

const Navbar = () => {
  
  const navigate = useNavigate();
  const delay = ms => new Promise(res => setTimeout(res, ms));

  const {user} = useContext(AuthContext);

  const handleSignOut= async()=>{
    await updateDoc(doc(db,'users',auth.currentUser.uid),{
      isOnline: false,
    })
    await signOut(auth);
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
      title: 'Logged out successfully'
    })
    await delay(1000);
    navigate('/login');
  };

  return (
    <nav>
      <h3>
        <Link to="/">Messenger</Link>
      </h3>
      <div>
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <button className="btn" onClick={handleSignOut}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

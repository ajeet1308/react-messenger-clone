import "./App.css";
import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthProvider from "./context/auth";
import PrivateRoute from "./components/PrivateRoute";
import Profile from './pages/Profile'
import VideoChatContainer from "./pages/VideoChatContainer";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          {/* <Route exact path='/' element={<PrivateRoute/>}>
            <Route exact path='/' element={<Home/>}/>
          </Route> */}
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/profile" element={<Profile/>} />
          <Route exact path="/call/:id/" element={<VideoChatContainer/>}/>
          {/* <Route exact path="/call/:id" element={(props) => <VideoChatContainer {...props}/>}/> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

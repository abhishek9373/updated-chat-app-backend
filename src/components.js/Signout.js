import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router';

export default function Signout() {
    const navigate = useNavigate();
    const Signout = () =>{
        localStorage.setItem('token','');
        navigate('/');
    }
  return (
    <div>
     <span onClick={Signout}>
      Sign Out
    </span> 
    </div>
  )
}

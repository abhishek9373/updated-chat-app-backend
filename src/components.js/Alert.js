import React, { useEffect, useState } from "react";
import "./all-css/Alert.css";

export default function Alert(props) {

    useEffect(()=>{
        const alertbox = document.getElementById("Main");
        alertbox.style.display = "block";
    })

    setTimeout(()=>{
        const alertbox = document.getElementById("Main");
        alertbox.style.display = "none";
    },5000)

    console.log("hello")

  return (
    <div id="Main">
      <div className="align">{props.msg}</div>
      <span className="closebutton">X</span>
    </div>
  );
}

import React from "react";
import '../all-css/Usercard.css'

export default function Usercard(props) {
  return (
    <div id="users">
      <div className="chip">
        <div className="avatar2"></div>
        <div className="usernamechip">{props.name}</div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import "../all-css/Main.css";

export default function Chatbubble(props) {
    // console.log(props.mess.sid  + "   "  +props.owner)
    const date = new Date(props.mess.createdAt);
    const thr = date.getHours();
    const min = date.getMinutes();
    const ampm = thr >=12 ? 'pm' : 'am' ;
    const hr = thr > 12 ? thr - 12 : thr ;
  return (
    <div>
      {props.mess.sid == props.owner ? (
        <div className="chatbubble" id="sender">
          <div className="discol">
            <div id="ins">{props.mess.message}</div>
            <div className="timetag">{hr}:{min}{ampm}</div>
          </div>
        </div>
      ) : (
        <div className="chatbubble" id="reciever">
          <div className="discol">
            <div id="inr">{props.mess.message}</div>
            <div className="timetag">{hr}:{min}{ampm}</div>
          </div>
        </div>
      )}
    </div>
  );
}

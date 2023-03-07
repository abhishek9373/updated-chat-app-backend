import React, { useContext } from "react";
import '../all-css/Usercard.css'
import { MessageNotificationContext } from "../Context";

export default function Usercard(props) {
  const {Alerts} = useContext(MessageNotificationContext);
  const No_of_Alerts = Alerts[props.id];
  return (
    <div id="users">
      <div className="chip">
        <div className="avatar2"></div>
        <div className="usernamechip">{props.name}</div>
        <p>{No_of_Alerts ? No_of_Alerts : ''}</p>
      </div>
    </div>
  );
}

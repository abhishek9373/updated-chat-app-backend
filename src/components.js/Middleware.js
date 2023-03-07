import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GET_USER_DATA } from "../Constant";
import axios from "axios";
import Loadingbar from "./chat components/Loadingbar";
import { MyContext } from "./Context";
import { MessageNotificationContext } from "./Context";
let Alerts = {};


export default function Middleware(props) {
  const { updatevalue } = useContext(MyContext);
  const usenavigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [progressval, setprogressval] = useState(10);
  // const [Alerts,setAlerts] = useState({});


  useEffect(() => {
    const auth_token = localStorage.getItem("token");
    setprogressval(30);
    if (auth_token != null) {
      // Make authentication from backend
      setprogressval(40);
      axios
        .post(GET_USER_DATA, { token: auth_token })
        .then((e) => {
          if (e.data.verified) {
            setprogressval(60);
            setIsAuthenticated(true);
            setprogressval(90);
            updatevalue({ owneridcon: e.data.ownerid, users: e.data.users });
          } else {
            setIsAuthenticated(false);
            usenavigate("/login");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("Session Expired");
      usenavigate("/login");
    }
  }, []);


  const updateAlert = (update_log) =>{
    // console.log(Alerts[update_log.userid]);
    if(Alerts[update_log.userid]){
      // setAlerts({...Alerts,[Alerts[update_log.userid]] : Alerts[update_log.userid]+1});
      Alerts[update_log.userid] = Alerts[update_log.userid] + 1;
    }
    else{
      // setAlerts({...Alerts, [update_log.userid] : 1 });
      Alerts[update_log.userid] = 1;

    }
  }

  return (
    <div>
      {isAuthenticated ? (
        <MessageNotificationContext.Provider value={{Alerts,updateAlert}}>
          <props.Component />
        </MessageNotificationContext.Provider>
      ) : (
        <Loadingbar value={progressval} />
      )}
    </div>
  );
}

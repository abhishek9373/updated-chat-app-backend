// import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import Register from "./Register";
// import Login from "./Login";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { BASE_URL, GET_USER_DATA } from "../Constant";

// export default function Middleware(props) {

//   const usenavigate = useNavigate();
//   const [showcomp, setshowcomp] = useState(false);

//   useEffect(() => {
//     const auth_token = localStorage.getItem("token");
//     if(auth_token != null){
//       // make authentication from backend
//       axios.post(GET_USER_DATA,{token:auth_token}).then((e)=>{
//         {
//           {
//             (e.data.verified == true)  ? setshowcomp(true) : usenavigate('/login')
//           }
//         }
//       }).catch((error)=>{
//         console.log(error);
//       })
//     }
//     else{
//       alert("session Expired")
//       usenavigate('/login')
//     }

//   }, [props]);

//   return (
//     <div>
//       { showcomp ? <props.Component /> : "Loading ..."}
//     </div>
//   );
// }

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GET_USER_DATA } from "../Constant";
import axios from "axios";
import Loadingbar from "./chat components/Loadingbar";
import { MyContext } from "./Context";

export default function Middleware(props) {
  const { updatevalue } = useContext(MyContext);

  const usenavigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [progressval, setprogressval] = useState(10);

  useEffect(() => {
    const auth_token = localStorage.getItem("token");
    setprogressval(20);
    if (auth_token != null) {
      // Make authentication from backend
      setprogressval(30);
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

  return (
    <div>
      {isAuthenticated ? (
        <props.Component />
      ) : (
        <Loadingbar value={progressval} />
      )}
    </div>
  );
}

import React, { useContext, useEffect, useState } from "react";
import "./all-css/Main.css";
import logo from "../assets/logo.svg";
import Sidebar from "./chat components/Sidebar";
import send from "../assets/send.png";
import Signout from "./Signout";
import { io } from "socket.io-client";
import axios from "axios";
import { GET_USER_CHAT } from "../Constant";
import Chatbubble from "./chat components/Chatbubble";
import Smallloader from "./chat components/Smallloader";
import { MyContext, MessageNotificationContext } from "./Context";
const socket = io("https://message-service-jrof.onrender.com");

export default function Main() {
  // note -- true for people and false for groups
  const [grouporpeople, setgrouporpeople] = useState(true);
  const [currentuser, setcurrentuser] = useState({});
  const [messages, setmessages] = useState([]);
  const [namechip, setnamechip] = useState("");
  const [message, setmessage] = useState("");
  const [ownerid, setownerid] = useState("");
  const [progress, setprogress] = useState(0);

  const {updateAlert} = useContext(MessageNotificationContext);
  const { value } = useContext(MyContext);
  useEffect(() => {
    setownerid(value.owneridcon);
    socket.emit("sendmyid", { userid: value.owneridcon });
  }, []);

  useEffect(() => {
    if (
      sessionStorage.getItem("selecteduserid") &&
      sessionStorage.getItem("selectedusername")
    ) {
      const useridlocal = sessionStorage.getItem("selecteduserid");
      const usernamelocal = sessionStorage.getItem("selectedusername");
      const useerr = {
        username: usernamelocal,
        userid: useridlocal,
      };
      setnamechip(usernamelocal);
      setcurrentuser(useerr);
    }
  }, []);

  useEffect(() => {
    let group = document.getElementById("g");
    let people = document.getElementById("p");
    if (grouporpeople) {
      people.style.color = "red";
      group.style.color = "black";
    } else {
      group.style.color = "red";
      people.style.color = "black";
    }
  }, [grouporpeople]);

  useEffect(() => {
    const userid = currentuser.userid;
    const token = localStorage.getItem("token");
    // ----make request to get userchatting---->
    setprogress(10);
    setprogress(20);
    setprogress(30);
    setprogress(40);
    axios
      .post(GET_USER_CHAT, {
        anotheruid: userid,
        token: token,
      })
      .then((e) => {
        if (e.data) {
          setprogress(70);
          setprogress(80);
          setprogress(90);
          setmessages(e.data.messages);
          setprogress(95);
          setprogress(1);

          setTimeout(() => {
            const scrollDiv = document.getElementById("chatcontainer");
            scrollDiv.scrollTo({
              top: scrollDiv.scrollHeight,
              behavior: "smooth",
            });
          }, 1000);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [currentuser]);

  const updateuser = ({ username, userid }) => {
    if (currentuser.userid != userid) {
      // work here for when user refresh page save selected user in session storage

      setnamechip(username);
      const userrr = {
        username: username,
        userid: userid,
      };
      setcurrentuser(userrr);
      sessionStorage.setItem("selecteduserid", `${userid}`);
      sessionStorage.setItem("selectedusername", `${username}`);
    }
  };

  // -----send chat to the user --------->
  const sendMessage = () => {
    if (currentuser) {
      if (message.trim().length > 0) {
        const msgdraft = {
          sid: ownerid,
          rid: currentuser.userid,
          message: message,
          createdAt: Date(),
        };
        setmessages([...messages, msgdraft]);
        setmessage("");

        setTimeout(() => {
          const scrollDiv = document.getElementById("chatcontainer");
          scrollDiv.scrollTo({
            top: scrollDiv.scrollHeight,
            behavior: "smooth",
          });
        }, 600);

        // --------socket io starts------>
        // backend event name  msgfromfrontToback

        socket.emit("msgfromfrontToback", msgdraft, (respose) => {});

        // console.log(messages)
      } else {
      }
    }
  };

  // -------listen for incomming messages on event messagefromuser------->

  useEffect(() => {
    socket.on("messagefromuser", (data) => {
      // -----all notification bar goes from here---->
      // const {}
      if (sessionStorage.getItem('selecteduserid') && sessionStorage.getItem('selecteduserid') == data.sid) {
        const ndata = {
          sid: data.sid,
          rid: data.rid,
          createdAt: Date(),
          message: data.message,
        };


        setmessages((oldmsg) => {
          return [...oldmsg, ndata];
        });
        updateAlert({userid:data.sid});

        setTimeout(() => {
          const scrollDiv = document.getElementById("chatcontainer");
          scrollDiv.scrollTo({
            top: scrollDiv.scrollHeight,
            behavior: "smooth",
          });
        }, 600);
      }
    });
  },[]);

  useEffect(() => {
    if (namechip) {
      const getit = document.getElementById("getme");
      const clicker = document.getElementById("clicker");
      getit.addEventListener("keydown", (e) => {
        if (e.code == "Enter") {
          clicker.click();
        } else {
        }
      });
    }
  }, [namechip]);

  return (
    <div className="container">
      <div className="Top-bar">
        <div>
          <img src={logo} />
        </div>
        <div className="userinfo">
          {namechip && (
            <>
              <div className="avatar">{/* Avatar image */}</div>
              <div className="namechip">{namechip}</div>
            </>
          )}
          <div className="sign-out">
            <Signout />
          </div>
        </div>
      </div>

      <div className="Userbar">
        <div className="userTab">
          <span
            id="p"
            onClick={() => {
              setgrouporpeople(true);
            }}
          >
            Peoples
          </span>
          <span
            id="g"
            onClick={() => {
              setgrouporpeople(false);
            }}
          >
            Groups
          </span>
        </div>
        <Sidebar updateuser={updateuser} peopleorgroup={grouporpeople} />
      </div>
      <div id="chat-area">
        <div id="chatcontainer">
          {currentuser.userid && progress != 1 ? (
            <Smallloader value={progress} />
          ) : (
            ""
          )}
          {messages.map((mess, indx) => {
            return (
              <div key={indx}>
                <Chatbubble mess={mess} owner={ownerid} />
              </div>
            );
          })}
        </div>
      </div>
      {namechip && (
        <div className="">
          <input
            id="getme"
            type="text"
            className="inpute"
            placeholder="Message ..."
            onChange={(e) => {
              setmessage(e.target.value);
            }}
            value={message}
          />
          <img
            src={send}
            alt=""
            className="send"
            onClick={sendMessage}
            id="clicker"
          />
        </div>
      )}
    </div>
  );
}

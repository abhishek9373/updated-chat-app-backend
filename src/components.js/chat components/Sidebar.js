import React, { useEffect, useState } from "react";
import "../all-css/Sidebar.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { FIND_BY_EMAIL_ID } from "../../Constant";
import { GET_USER_DATA } from "../../Constant";
import Usercard from "./Usercard";
import Loding from './Loadingbar'
import Loadingbar from "./Loadingbar";
import Smallloader from "./Smallloader";

export default function Sidebar(props) {
  const [newChatEmail, setnewChatEmail] = useState("");
  const [users, setusers] = useState([]);
  const token = localStorage.getItem("token");
  const [progress,setprogress] = useState(10);
  // -------pending implementation of groups----->
  const [peopleorgroup, setgrouporpeople] = useState(props.peopleorgroup);

  // -------Create new chat and group code -->
  const showCreateChat = () => {
    const hide = document.getElementById("users");
    const newgroup = document.getElementById("newgroup");
    const newchat = document.getElementById("newchat");

    hide.style.display = "none";
    newgroup.style.display = "none";
    newchat.style.display = "block";
  };

  const showCreateGroup = () => {
    const hide = document.getElementById("users");
    const newgroup = document.getElementById("newgroup");
    const newchat = document.getElementById("newchat");

    // hide.style.display = "none";
    // newchat.style.display = "none";
    // newgroup.style.display = "none";

    alert("Thise Field Is under development")

  };

  const cancel = (e) => {
    const hide = document.getElementById("users");
    const newgroup = document.getElementById("newgroup");
    const newchat = document.getElementById("newchat");
    if (e.target.id == "newchatcancel") {
      hide.style.display = "block";
      newchat.style.display = "none";
    } else {
      hide.style.display = "block";
      newgroup.style.display = "none";
    }
  };

  // ---------------->//

  // ----------chack for valid email ------ >

  function isValidEmail(email) {
    // Regular expression for email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test the email against the regular expression
    return emailRegex.test(email);
  }

  //  --------------- > //

  // ------start new chat ------------>
  const CreateNewChat = () => {
    if (isValidEmail(newChatEmail)) {
      const token = localStorage.getItem("token");
      axios
        .post(FIND_BY_EMAIL_ID, { email: newChatEmail, token: token })
        .then((e) => {
          if (e.data) {
            const user = { username: e.data.username, userid: e.data.userid };
            const hide = document.getElementById("users");
            const newchat = document.getElementById("newchat");
            hide.style.display = "block";
            newchat.style.display = "none";
            setusers([user, ...users]);
            props.updateuser({
              username: e.data.username,
              userid: e.data.userid,
            });
          } else {
            alert(e.data);
          }
        })
        .catch((error) => {
          alert(error.response.data);
        });
    } else {
      alert("error");
    }
  };

  // -----------------> //

  // -------------get users -------------->

  useEffect(() => {
    //get all users
    setprogress(20)
    axios
      .post(GET_USER_DATA, { token: token })
      .then((e) => {
        if (e.data) {
          // console.log(e.data.users);
          setprogress(80)
          setusers(e.data.users);
          setprogress(100)
          setprogress(null)
          props.getowner({ owner: e.data.ownerid });
          // console.log(e.data.users)
        } else {
          console.log("No data found");
        }
      })
      .catch(() => {
        alert("error no data or users");
      });
  }, []);

  const updateuser = ({ username, userid }) => {
    props.updateuser({ username: username, userid: userid });
  };

  return (
    <>
      <div>
        {progress && <Smallloader value={setprogress}/>}
        <div id="users">
          {users.map((user, index) => {
            return (
              <div
                style={{ cursor: "pointer" }}
                key={index}
                onClick={() =>
                  updateuser({
                    username: user.username,
                    userid: user.userid,
                  })
                }
              >
                <Usercard name={user.username} />
              </div>
            );
          })}
        </div>
        <div className="newchatorgroup">
          <div id="newchat">
            Email-id of user
            <input
              type="email"
              name="uname"
              onChange={(e) => {
                setnewChatEmail(e.target.value);
              }}
            />
            <br />
            <br />
            <button onClick={CreateNewChat}>next</button>
            &nbsp;
            <button onClick={cancel} id="newchatcancel">
              cancel
            </button>
          </div>
          <div id="newgroup">
            Group Name
            <input type="text" name="gname" />
            <br />
            <br />
            Group Description
            <input type="text" name="description" />
            <br />
            <br />
            <button>next</button>
            &nbsp;
            <button id="newgroupcancel" onClick={cancel}>
              cancel
            </button>
          </div>
        </div>
        <div className="addUserandPeople">
          <button onClick={showCreateChat}>New Chat</button> &nbsp;&nbsp;
          <button onClick={showCreateGroup}>Create Group</button>
        </div>
      </div>
    </>
  );
}

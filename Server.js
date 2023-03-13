const express = require("express");
const app = express();
require("dotenv").config();
const DbConnect = require("./MongoConnection");
const cors = require("cors");
const bodyparser = require("body-parser");
const { createServer } = require("http");
const { Server } = require("socket.io");
const fs = require("fs");

const { ConnectionModel, MessageModel } = require("./Models");
DbConnect();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: "http://localhost:3000",
});
const PORT = 5000;

// const options = {
//   key: fs.readFileSync("/path/to/key.pem"),
//   cert: fs.readFileSync("/path/to/cert.pem"),
// };

// const corsOptions = {
//   origin: "http://localhost:3000",
// };

// routers
const LoginRouter = require("./Routers/Login");
const RegisterRouter = require("./Routers/Register");
const getUsers = require("./Routers/Getusers");
const findByEmailId = require("./Routers/FindByEmail");
const getChats = require("./Routers/Getchats");

app.use(cors());
app.use(express.json());
app.use(bodyparser.json());

app.use("/", LoginRouter);
app.use("/", RegisterRouter);
app.use("/", getUsers);
app.use("/", findByEmailId);
app.use("/", getChats);

app.get("/", (req, res) => {
  console.log("Requested");
  res.send("Working fine");
});

//  ------- all socket connection code ------------->

// function to update connections

const updateConnections = (sid, rid) => {
  ConnectionModel.updateOne(
    {
      ownerid: sid,
      users: {
        $elemMatch: {
          userid: rid,
        },
      },
    },
    {
      $set: {
        "users.$.lastmsg": new Date(),
      },
    }
  )
    .then((e) => {
      ConnectionModel.updateOne(
        {
          ownerid: rid,
          users: {
            $elemMatch: {
              userid: sid,
            },
          },
        },
        {
          $set: {
            "users.$.lastmsg": new Date(),
          },
        }
      ).then((e) => {
        console.log("both connections update");
        return true;
      });
    })
    .catch((error) => {
      console.log(error)
      return false;
    });
};

// storage for socket ids
const socks = {};
const useridtosocks = {};

io.on("connection", (socket) => {
  socket.on("sendmyid", (data) => {
    socks[data.userid] = socket.id;
    useridtosocks[socket.id] = data.userid;
    console.log(socks);
  });

  socket.on("msgfromfrontToback", (data, cb) => {
    const { rid, sid, message } = data;
    const MessageDraft = new MessageModel({
      rid: rid,
      sid: sid,
      message: message,
    });
    console.log(rid);
    if (socks[rid]) {
      console.log("User online");
      // now both users are online and also roomid
      MessageDraft.save()
        .then((e) => {
          if (e) {
            // -------send chat to the reciever by room------->
            console.log("message saved");
            io.to(socks[rid]).emit("messagefromuser", {
              sid: sid,
              message: message,
              rid: rid,
            });
            if(updateConnections(sid,rid)){
              cb("message send to reciever")
            }
            // -------update connection last msg  to change the order of the recently messaged user----->
            // ConnectionModel.updateOne(
            //   {
            //     ownerid: sid,
            //     users: {
            //       $elemMatch: {
            //         userid: rid,
            //       },
            //     },
            //   },
            //   {
            //     $set: {
            //       "users.$.lastmsg": new Date(),
            //     },
            //   }
            // )
            //   .then((e) => {
            //     console.log(e);
            //     ConnectionModel.updateOne(
            //       {
            //         ownerid: rid,
            //         users: {
            //           $elemMatch: {
            //             userid: sid,
            //           },
            //         },
            //       },
            //       {
            //         $set: {
            //           "users.$.lastmsg": new Date(),
            //         },
            //       }
            //     ).then((e) => {
            //       console.log("both connections update");
            //       cb("message send");
            //     });
            //   })
            //   .catch((error) => {
            //     console.log(error);
            //   });
          }
          else{
            console.log("some error in online user updation")
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // console.log(socketids)
      console.log("user Not Online saving message to database..");
      MessageDraft.save()
        .then((e) => {
          if (e) {
            // -------send chat to the reciever by room------->
            if(updateConnections(sid,rid)){
              console.log("ok")
              cb("user not online message saved");
            }else{
              console.log("no update");
            }
          }
          else{
            console.log("some error in offline user updation");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });

  socket.on("disconnect", () => {
    console.log("user gone");
    let sockuserid = useridtosocks[socket.id];
    delete useridtosocks[socket.id];
    delete socks[sockuserid];
    console.log(socks[sockuserid]);
    socket.disconnect();
  });
});

httpServer.listen(PORT, (e) => {
  console.log("Project is listening On Port: " + PORT);
});

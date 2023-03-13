const express = require("express");
const { Usermodel, ConnectionModel } = require("../Models");
var findByEmailId = express.Router();
const bcryptjs = require("bcryptjs");
const Decode = require("../middlewares/Decode");
const { ObjectId } = require("mongodb");

findByEmailId.post("/findbyemailid", Decode, (req, res, next) => {
  if (req.body.email && req.body.userid) {
    const { email, userid } = req.body;
    Usermodel.findOne({
      email: email,
    }).then((e) => {
      if (e) {
        // have to add verfy that useconnection present

        Usermodel.findOne({
          _id: new ObjectId(userid),
        }).then(async (ef) => {

          if (ef.email != email) {
            try {
              // console.log()
              const con = await ConnectionModel.updateOne(
                { ownerid: userid },
                {
                    $push: {
                      users: {
                        username: e.name,
                        lastmsg: Date(),
                        userid: e._id.toString(),
                      },
                    },
                },

                //   $addToSet: {
                //     users: {
                //       username: e.name,
                //       lastmsg: Date(),
                //       userid: e._id.toString(),
                //     },
                //   },
                // },
                { new:true, upsert: true }
              );
              console.log(con);

              if (con) { 
                try {
                  const con2 = await ConnectionModel.updateOne(
                    { ownerid: e._id.toString() },
                    {
                        $push: {
                          users: {
                            username: ef.name,
                            lastmsg: Date(),
                            userid: ef._id.toString(),
                          },
                        },

                    //   $addToSet: {
                    //     users: {
                    //       username: ef.name,
                    //       lastmsg: Date(),
                    //       userid: ef._id.toString(),
                    //     },
                    //   },
                    },
                    { new: true, upsert: true }
                  );
                  if (con2) {
                    res.send({
                      username: e.name,
                      userid: e._id.toString(),
                    });
                  }
                } catch (err) {
                  res.status(404).send("user already present");
                }
              }
            } catch (err) {
              console.log(err);
              res.status(404).send("user already present");
            }
          } else {
            res.status(404).send({ itsyou: true });
          }
        });
      } else {
        res.send({ error: true });
      }
    });
  }
});

module.exports = findByEmailId;

const express = require('express');
const { ConnectionModel } = require('../Models');
var getUsers = express.Router();
const token_auth = require("../middlewares/VerifyUser");

getUsers.post('/getusers', token_auth, (req, res, next) => {
    if (req.body.verified && req.body.userid) {
        const { userid } = req.body;
        ConnectionModel.find({ ownerid: userid })
          .then((data, err) => {
            if (data) {
              // console.log(data[0].users[1].username);
              const finalusers = data[0].users.sort(
                (a, b) => {
                        let adate = new Date(a.lastmsg).getTime();
                        let bdate = new Date(b.lastmsg).getTime();
                        return bdate - adate;
                }
              );

              res.send({ verified: true, users: finalusers, ownerid: userid });
            } else {
              res.send({
                nousers: true,
              });
            }
          })
          .catch((error) => {
            res.send({ verified: true, users: [] });
          });
      } else {
        res.status(404).send({ verified: false });
      }
})

module.exports = getUsers

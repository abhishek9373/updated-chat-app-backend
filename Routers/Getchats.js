const express = require('express');
var getChats = express.Router();
const Decode = require('../middlewares/Decode');
const { MessageModel } = require('../Models');

getChats.post('/getuserchatting', Decode, (req, res, next) => {
    if (req.body.userid && req.body.anotheruid) {
        const { userid, anotheruid } = req.body;
    
        MessageModel.find({
          $or: [
            { sid: userid, rid: anotheruid },
            { sid: anotheruid, rid: userid },
          ],
        })
          .sort({
            insertedAt: -1,
          })
          .then(async (data, err) => {
            if (data) {
              // console.log(data);
              res.send({ messages: data, ownerid: userid });
            } else {
              res.send({ error: true });
            }
          })
          .catch((error) => {
            res.status(404).send({ error: true });
          });
      }
})

module.exports = getChats;

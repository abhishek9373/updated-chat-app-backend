const express = require('express');
const { Usermodel } = require('../Models');
var RegisterRouter = express.Router();
const bcryptjs = require("bcryptjs");

RegisterRouter.post('/register',async (req, res, next) => {
    const { email, password, name } = req.body;

    if (email != null && password != null && name != null) {
      bcryptjs.genSalt(10, (err, salt) => {
        if (err) {
          console.error(err);
          return;
        }
  
        // Hash the password using the generated salt
        bcryptjs.hash(password, salt, (err, hash) => {
          if (err) {
            console.error(err);
            return;
          }
          const userModel = new Usermodel({
            name: name,
            email: email,
            password: hash,
          });
  
          userModel.save()
            .then(() => {
              console.log("New user addedd");
              res.send({ inserted: true });
            })
            .catch((error) => {
              console.log(error.code);
              if (error.code == 11000) {
                res.send({ user_already_present: true });
              } else {
                res.status(500).send({ server_error: true });
              }
              //   console.log(error)
            });
        });
      });
    } else {
      res.send({
        invalid_passand_email: true,
      });
    }
})

module.exports = RegisterRouter

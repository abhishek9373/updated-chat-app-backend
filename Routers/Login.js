const express = require('express');
const { Usermodel } = require('../Models');
var LoginRouter = express.Router();
const { GenJWT } = require('../middlewares/GetJWT');
const bcryptjs = require("bcryptjs");

LoginRouter.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    Usermodel.findOne({
      email: email,
    })
      .then((user) => {
        if (user) {
          bcryptjs.compare(password, user.password, (err, result) => {
            if (err) {
              console.log("invalid password");
              res.send({
                invalid_pass: true,
              });
            } else {
              if (result) {
                const token = GenJWT(user._id.toString());
                res.send({ authToken: token, invalid_pass: false });
              } else {
                res.send({
                  invalid_pass: true,
                });
              }
            }
          });
        } else {
          res.send({
            Nouser: true,
          });
        }
      })
      .catch((error) => {
        res.send({ Nouser: true });
      });
})

module.exports = LoginRouter

"use strict";

const { Content } = require("../utils/connect");
const { Comment } = require("../utils/connect");
const { User } = require("../utils/connect");
const { Op } = require("sequelize");

exports.selfWrittencontent = (req, res) => {
    const { page, limit } = req.query;
    let userkey = req.decoded.id;
    Content.findAndCountAll({
        where: { userkey: userkey },
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
    })
        .then((data) => {
            return res.status(200).json({
                data: data.rows,
                maxPage: Math.ceil(data.count / parseInt(limit)),
            });
        })
        .catch((err) => {
            return res.status(500).json({ err });
        });
};

exports.selfWrittencomment = (req, res) => {
    const { page, limit } = req.query;
    let userkey = req.decoded.id;
    Comment.findAndCountAll({
        where: { userkey: userkey },
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
    })
        .then((data) => {
            return res.status(200).json({
                data: data.rows,
                maxPage: Math.ceil(data.count / parseInt(limit)),
            });
        })
        .catch((err) => {
            return res.status(500).json({ err });
        });
};

exports.changeProfile = (req, res) => {
    /*body
      {
          username
          password
          check_pw
          decoded{id} => JWT 통과이후
      }*/
      let { username, password, check_pw } = req.body;
      const id = req.decoded.id;
      User.findOne({
          where: { username: {[ Op.eq ]: username }}
      }).then(( name_check ) => {
          if ( name_check && name_check.id !== id) {
            //이름중복인경우
            return res.status(405).json({
                message: "name is already use"
            });
          } else {
            // 이름중복 X
            User.findOne({
                where: {id: {[ Op.eq ]: id }}
            }).then((profile) => {
                if ( !password ) {
                    password=profile.password;
                } else {
                    if ( password !== check_pw) {
                        return res.status(405).json({
                            message: "Incorrect password",
                        });
                    }
                }
                User.update(
                    {
                        username: username,
                        password: password,
                    },
                    {
                        where: {id: id},
                    }
                )
                .then(( data ) => {
                    return res.status(200).json({ data });
                })
                .catch(( err ) => {
                    return res.status(500).json({ err });
                });
            });
          }
      });
  };

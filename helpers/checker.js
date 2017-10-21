'use strict'

const jwt = require('jsonwebtoken')
const config = require('../config')

module.exports = function(req, res, next){
  let token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(token){
  jwt.verify(token, config.secretkey, function(err, decoded){
    if(err){
      return res.json({success: false, message: 'failed to authenticate token'});
    }else{
      req.decoded = decoded;
      console.log(decoded, "decoded");
        next();
      }
    })
  }else{
  return res.status(403).send({
    success: false,
    message: 'no token provided'
  })
}
}

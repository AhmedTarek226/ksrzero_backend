const express = require('express');
const multer =require("multer");
const router = express.Router();
const orders = require('../model/order');
const crypto = require("crypto")
const jwt = require('jsonwebtoken');
const { json } = require('express');
const dotenv = require("dotenv").config();
const users = require('../model/users');

// create selling order and update orders in user collection
router.post("/order/:id/:ido",(req,res)=>{
    orders.create(req.body,(err,data)=>{
        if(err)
        res.send("ERRRRR!!!!!")
        else{
        users.findOne({'_id':req.params.id}).then((fail,success)=>{
            if(fail)
            res.send("failed update!!!!")
            else{
                success.cart.push(req.params.ido)
                success.save()
                res.send("exchange order added and updated in user!!!")
            }
        })
    }})
    
})

module.exports = router;
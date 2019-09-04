require('dotenv').config();
const routes = require('express').Router();
const db = require("../db.js");

routes.get("/:slug" , (req , res) =>{
    let id = req.params.slug;
    if (id){
        let poll = db.get("polls").find({slug : id}).value();
        if (poll){
            // console.log(poll);
            let context = {
                "poll" : poll
            };
            res.render("poll.html" , context);
            
        }
    }
});

routes.get("/:slug/v/:item" , (req , res) =>{
    let pollid = req.params.slug;
    let itemid = req.params.item;
    if (pollid && itemid){
        let poll = db.get("polls").find({slug : pollid}).get("options").find({slug : itemid}).update('count', n => n + 1).write();
        // console.log(poll);
        // console.log("UP2");
        res.redirect("/thankyou");
        
            
        
    }
});

routes.get("/:slug/result" , (req , res) =>{
    let pollid = req.params.slug;
    if (pollid){
        let poll = db.get("polls").find({slug : pollid}).value();
        let context = {
            "poll" : poll
        };

        res.render("result.html" , context);
        
            
        
    }
});

module.exports = routes;

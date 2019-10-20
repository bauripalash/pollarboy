require('dotenv').config();
const routes = require('express').Router();
const db = require("../db.js");
const cookieParser = require('cookie-parser');

routes.get("/:slug", (req, res) => {
    let id = req.params.slug;
    if (id) {
        let poll = db.get("polls").find({
            slug: id
        }).value();

        if (poll != undefined) {
            if (poll) {
                 console.log(poll);
                let context = {
                    "poll": poll
                };
                res.render("poll.html", context);

            }
        } else {
            res.redirect("/404");
        }

    }
});


//Checks for poll name in the cookie
function getCookie(cookie,cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  //Checks if the person can vote again or not and redirects accordingly
  function MultipleVotes(req,res,pollid,itemid){
    if(db.get("polls").find({
        slug: pollid
    }).get("MultipleVotes")
    .value() == true ){
        if(getCookie(req.headers.cookie,pollid)){
            res.redirect("/sorry");
            return false;
        }else{
            res.cookie(pollid, itemid);
            return true;
        }
    }else{
        return true;
    }
  }

routes.get("/:slug/v/:item", (req, res) => {
    let pollid = req.params.slug;
    let itemid = req.params.item;
    if (pollid && itemid) {
        if (db.get("polls").find({
                slug: pollid
            }).get("options").find({
                slug: itemid
            }).value() != undefined) {

            //Checks if the person can vote again or not
           if( MultipleVotes(req,res,pollid,itemid)){
            db.get("polls").find({
                slug: pollid
            }).get("options").find({
                slug: itemid
            }).update('count', n => n + 1).write();
        }
        } else {
            res.redirect("/err");
        }

        // console.log(poll);
        // console.log("UP2");
        res.redirect("/thankyou/?id=" + pollid);



    } else {
        res.redirect("/");
    }
});

routes.get("/:slug/result", (req, res) => {
    let pollid = req.params.slug;
    if (pollid) {
        let poll = db.get("polls").find({
            slug: pollid
        }).value();
        if (poll != undefined) {
            let context = {
                "poll": poll
            };

            res.render("result.html", context);
        } else {
            res.redirect("/404");
        }




    }
});

module.exports = routes;
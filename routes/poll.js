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
                // console.log(poll);

                if (canVote(req, id)) {
                    res.render("poll.html", { "poll": poll, "canvote": true });
                    // console.log("CAN");
                } else {
                    res.render("poll.html", { "poll": poll});
                    // console.log("CANT")
                }

            }
        } else {
            res.redirect("/404");
        }

    }
});

let canVote = (req, poll) => {
    let iopo = isOnePerOne(req, poll);
    // console.log(iopo)
    let cookie = hasCookie(req.cookies, poll);
    // console.log(cookie)

    if (iopo && cookie) {
        return false;
    } else {
        return true;
    }
}

//Checks for poll name in the cookie
let hasCookie = (cookies, poll) => {
    if (cookies[poll] == 1) {
        return true;
    } else {
        return false;
    }


}

//Checks if the person can vote again or not and redirects accordingly

let isOnePerOne = (req, pollid) => {
    if (db.get("polls").find({
            slug: pollid
        }).get("iopo") //checks if is One Vote Per One Device
        .value() == 1) {

        return true

    } else {
        return false;
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
            // if( MultipleVotes(req,res,pollid,itemid)){
            db.get("polls").find({
                slug: pollid
            }).get("options").find({
                slug: itemid
            }).update('count', n => n + 1).write();
            // }
        } else {
            res.redirect("/err");
        }

        // console.log(poll);
        // console.log("UP2");
        res.cookie(pollid, 1, { expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), httpOnly: false }).redirect("/thankyou/?id=" + pollid);



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

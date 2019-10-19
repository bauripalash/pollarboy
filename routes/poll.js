require('dotenv').config();
const routes = require('express').Router();
const db = require("../db.js");

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

routes.get("/:slug/v/:item", (req, res) => {
    let pollid = req.params.slug;
    let itemid = req.params.item;
    if (pollid && itemid) {
        if (db.get("polls").find({
                slug: pollid
            }).get("options").find({
                slug: itemid
            }).value() != undefined) {
            db.get("polls").find({
                slug: pollid
            }).get("options").find({
                slug: itemid
            }).update('count', n => n + 1).write();
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
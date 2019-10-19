require('dotenv').config();
const routes = require('express').Router();
const {
    check,
    validationResult
} = require('express-validator');
const slugify = require('slugify');
const db = require("../db.js");

getrandom = (m) => {

    return Math.random().toString(36).substring(2, m) + Math.random().toString(36).substring(2, m);
};


routes.get("/", (req, res) => {
    
    res.render("maker.html", {
        msg: req.query.err ? req.query.err : ""
    });

});

routes.post("/", [

    check("title").trim().escape(),
    check("slug").trim().escape(),
    check("polloption").isArray()

], (req, res) => {
    // console.log(req.body)
    const errors = validationResult(req);
    console.log(req.body, errors);
    let rawslug = "";

    if (db.get('polls').find({
            slug: req.body.slug
        }).value() != undefined) {
        res.redirect("/maker/?err=" + "Poll Link Already Used. Choose Another");
    }

    // let options = db
    //     .get('polls')
    //     .find({
    //         slug: req.body.slug
    //     })
    //     .get('options')
    //     .value();
    let ops = [];

    req.body.polloption.forEach(e => {
        ops.push({
            slug: getrandom(4),
            name: e,
            count: 0
        });
    });

    if (req.body.slug != "") {
        rawslug = slugify(req.body.slug, {
            lower: true,
            remove: /[*+~.()'"!:@\/<>{}%$#^&`]/g
        });
    } else {
        rawslug = getrandom(5);
    }

    let MultipleVotes = false;
    if(req.body.MultipleVotes=='on'){
        MultipleVotes = true;
    }

    db.get('polls')
        .push({
            slug: rawslug,
            title: req.body.title,
            total: 0,
            MultipleVotes: MultipleVotes,
            options: ops            
        })
        .write();
    // db.get("polls")
    //     .find({
    //         slug: req.body.slug
    //     })
    //     .assign({
    //         options
    //     })
    //     .write();
    let info = "Wow! You just created a poll! Share the below link to get some awesome votes!";
    res.render("createthank.html", {
        infomsg: info,
        slug: rawslug
    });
});

module.exports = routes;
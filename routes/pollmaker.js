require('dotenv').config();
const routes = require('express').Router();
const {
    check,
    validationResult
} = require('express-validator');
const slugify = require('slugify');
const db = require("../db.js");

routes.get("/", (req, res) => {

    res.render("maker.html");
});

routes.post("/", [

    check("title").trim().escape(),
    check("slug").trim().escape(),
    check("polloption").isArray()

], (req, res) => {
    // console.log(req.body)
    const errors = validationResult(req);
    console.log(req.body, errors);

    

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
            slug: slugify(e , {
                lower : true,
                remove: /[*+~.()'"!:@]/g
            }),
            name: e,
            count: 0
        });
    });
    db.get('polls')
        .push({
            slug: req.body.slug,
            title: req.body.title,
            total: 0,
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

    res.redirect("/maker");
});

module.exports = routes;
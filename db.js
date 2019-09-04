const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('.data/db.json');
const db = low(adapter);

/*
DATABASE STRUCTURE :>

- polllist : [pollslugs]
- polls
    - pollslug > [name , id , total, options]
        - options > [name , count , users (IP)]

sample (draft) :>

polllist : ["likedogs"]

polls : [
    likedogs : {
        "name" : "Do You Like Dogs",
        "id" : 1,
        "total" : 3,
        "options":{
            "yes" : {
                "name" : "YES <3",
                "count" : 2,
                "users" : ["125.65.56.2" , 255.255.255.255] //optional

            },
            "no" : {
                "name" : "Oops No! I'm a Cat Person! Meow",
                "count" : 1,
                "users" : ["125.65.55.55"] //optional
            }
        }
    }
]

*/



module.exports = db;
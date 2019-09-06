require('dotenv').config();

const express = require('express');
const app = express();
const nunjucks = require("nunjucks");
const bodyParser = require('body-parser');
const db = require("./db.js");

// Routes
const PollRoutes = require("./routes/poll.js");
const PollMakerRoutes = require("./routes/pollmaker.js");


// App Configs
nunjucks.configure('views', {
  autoescape: true,
  express: app
});
app.disable('x-powered-by');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

db.defaults({
    polllist: [],
    polls: []
  })
  .write();



// Route Handle
app.get('/', (req, res) => {
  res.render("index.html");
});

app.get('/err', (req, res) => {
  res.render("err.html");
});

app.get('/thankyou', (req, res) => {
  res.render("thankyou.html", {
    slug: req.query.id
  });
});

app.get('/404', (req, res) => {
  res.render("four0four.html");
});


app.use("/p", PollRoutes);
app.use("/maker", PollMakerRoutes);

app.use(function (req, res, next) {
  res.status(404);

  res.format({
    html: function () {
      res.render('four0four.html');
    },
    json: function () {
      res.json({
        error: 'Not found'
      })
    },
    default: function () {
      res.type('txt').send('Not found');
    }
  });
});

// Server
const listener = app.listen(process.env.PORT, () => {
  console.log('POLLARBOY is UP on : ' + listener.address().port);
});
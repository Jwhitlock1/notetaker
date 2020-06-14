/////
// require dependencies

const express = require("express");
const path = require("path");
const fs = require("fs");

/////
// set up Express app

const app = express();
const PORT = process.env.PORT || 3000;
let data = JSON.parse(fs.readFileSync("./json/db.json", "utf8"));

/////
// set up the express app to handle data parsing

app.use(express.static("assets"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/////
// routes

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "notes.html"));
});

app.get("/api/notes", function (req, res) {
  return res.json(data);
});

app.post("/api/notes", function (req, res) {
  const newNote = req.body;

  data.push(newNote);

  fs.writeFile("./json/db.json", JSON.stringify(data), function (err) {
    if (err) throw err;
    console.log("test");

  });

  return res.json(true);

});

app.delete("/api/notes/:id", function (req, res) {
  let id = req.params.id;
  data = data.filter(function (note) {
    if (note.id === id) {
      return false;
    }
    return true;
  });

  fs.writeFile("./json/db.json", JSON.stringify(data), function (err) {
    if (err) throw err;
    res.end();
  });

  return res.json(data);

});

/////
// start the server and set up to listen

app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
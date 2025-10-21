import express from "express";
import path from "node:path";
import morgan from "morgan";
import { addTip, dislike, getTips, like, remove, findUsername } from "./data";
import session from "express-session";

declare module "express-session" {
    interface SessionData {
        userId: string;
    }
}

const app = express();
const PORT = 3001;

app.set("view engine", "ejs");

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(session({
    secret: "keyboard cat",
    cookie: {maxAge: 60000},
    resave: false,
    saveUninitialized: false
}));

app.get("/", (req, res) => {
  // 1) Add a conditional check to see if a user has a session & is logged in. If not, redirect to /login.
  //       2) If they do have a session, get their id from the session and use it to lookup their tips.
  //          You will probably want to modify the getTips function so it takes in a userId and returns the tips for that user

    if (!req.session.userId) res.redirect("/login");
  const tips = getTips(req.session.userId!);
  res.render("index", { tips });
});

app.get("/login", (req, res) => {
  // Replace this with an html form that has:
  //       1) An Email input
  //       2) A  Password input
  //       3) A Login Button
  res.send(`
    <form method="POST" action="/login">
        <h2>Login</h2>
        <label>Username:</label>
        <input type="text" name="username" required />
        <br>
        <label>Password:</label>
        <input type="password" name="password" required />
        <br>
        <button type="submit">Login</button>
    </form>
  `);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  // 1) Check the database to see if you find a matching username + password
  //       2) If you find a match, create a session and redirect them to /tips
  //       3) If you do NOT find a match, redirect them to /login

    const user = findUsername(username);
    if (!user || user.password !== password) {
        return res.redirect("/login");
    }
    req.session.userId = user.id;
    res.redirect("/");
});

app.post("/tips", (req, res) => {
  const { text } = req.body;
  if (text) {
    addTip(text, req.session.userId!);
  }
  res.redirect("/");
});

app.post("/tips/:id/like", (req, res) => {
  const id = req.params.id;
  const likedTip = like(id, req.session.userId!);
  res.redirect("/");
});

app.post("/tips/:id/dislike", (req, res) => {
  const id = req.params.id;
  const dislikedTip = dislike(id, req.session.userId!);
  res.redirect("/");
});

app.post("/tips/:id/delete", (req, res) => {
  const id = req.params.id;
  remove(id, req.session.userId!);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`
🚀 http://localhost:${PORT}`);
});

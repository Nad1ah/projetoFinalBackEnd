require("dotenv").config();
const express = require("express");
const auth = require("./auth/routes");
const polls = require("./polls/routes");
const db = require("./db/mongodb");
const morgan = require("morgan");

const app = express();
app.use(express.json());
app.use(morgan("combined"));
app.use("/auth", auth);
app.use("/polls", polls);

async function start() {
  await db.init();

  app.listen(process.env.PORT, () => {
    console.log("server is running on port " + process.env.PORT);
  });
}

start()
  .then(() => console.log("start complete"))
  .catch((err) => console.log(err));

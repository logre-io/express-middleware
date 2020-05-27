import createLogger from "logreio-express";
import express from "express";

const app = express();
app.use(createLogger({ id: "266629542946275860" }));

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(3004);

const express = require('express')
const app = express();
const port = 3000;
const router = require("./routes/index.js")
const errHand = require("./middlewares/errhand.js")

app.use(express.json());
app.use(express.urlencoded({extended : false}));

app.use(router);

app.use(errHand);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
const express = require('express');
const bodyParser = require("body-parser");

const appRouter = require('./routes/appRoutes');

const app = express();
const port = process.env.PORT || 3000;
 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
appRouter(app);

app.listen(port, () => {
    console.log('Server up and running on port: ' + port);
})




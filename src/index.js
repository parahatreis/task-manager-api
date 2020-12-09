const express = require('express');

// import models
require('./db/mongoose');
// import routers(api s)
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');


const app = express();
const port = process.env.PORT;



// Api to json format
app.use(express.json());
/* Routers */
app.use(userRouter);
app.use(taskRouter);


// start server
app.listen(port, () => {
   console.log('Server is up on :' + port);
});


const express = require('express');
const app = express();
const connectDB = require('./config/db');
const path = require('path');

//connect DB
connectDB();

//app.get('/', (req, res) => res.send(`API Running In ${PORT}`));

// Init middleware
app.use(
  express.json({
    extended: false,
  })
);
//Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));

//Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  //set the static/public folder
  app.use(express.static('client/build'));

  //index.html is the gateway
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server listing in port -> ${PORT}`));

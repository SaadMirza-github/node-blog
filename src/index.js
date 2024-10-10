require('dotenv').config();     // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.set('port', process.env.PORT);

require('./config/db')();

app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);

const port = app.get('port');
app.listen(port, () => {
  console.log(`Server started on port ${port}`);  
});
const cluster = require('cluster');
const os = require('os');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const path = require('path');
require('dotenv').config(); // Load environment variables
require('./config/db')();   // Database connection

const PORT = process.env.PORT || 3000;

// If it's the master process, fork workers
if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    console.log(`Master ${process.pid} is running`);
    console.log(`Forking ${numCPUs} workers...`);

    // Fork a worker for each CPU core
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // When a worker exits, fork a new one
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {
    // Workers will execute this code

    // Create Express app
    const app = express();

    // Middleware setup
    app.use(bodyParser.json());
    app.use(cors());

    // Serve static files
    app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

    // API routes
    app.use('/api/users', userRoutes);
    app.use('/api/blogs', blogRoutes);

    // Start the server
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} is running on port ${PORT}`);
    });
}

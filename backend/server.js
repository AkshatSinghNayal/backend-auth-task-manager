require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const connectDB = require('./config/db');
const swaggerDocument = require('./config/swagger');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

connectDB();

const app = express();

const corsOriginEnv = process.env.CORS_ORIGIN;
const allowedOrigins = corsOriginEnv
  ? corsOriginEnv.split(',').map((origin) => origin.trim())
  : [];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes('*')) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
  })
);

app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

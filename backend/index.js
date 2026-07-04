import express from 'express';
import cors from 'cors';
import './db.js';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js'

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/events', eventRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
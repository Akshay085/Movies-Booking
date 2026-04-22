import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from 'inngest/express';
import { inngest , functions } from './inngest/index.js';


const app = express();
const port = 3000;

// Database connection middleware to ensure connection on every request
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

//Middlware
app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

//Api Routes
app.get('/',(req , res)=> res.send('Server is live!'))
app.use('/api/inngest', serve({client: inngest,functions}))

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
}

export default app;
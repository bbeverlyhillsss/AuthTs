import cookieParser from 'cookie-parser'
import express from 'express'
import authRouter from './routes/auth.router.js'
import errorMiddleware from './middlewares/error.middleware.js'


const app = express()

app.use(cookieParser())
app.use(express.json())

app.use('/api/auth', authRouter)



app.use(errorMiddleware)

export default app
import express from 'express'
import {Request, Response} from 'express-serve-static-core'
import cors from 'cors'
import helmet from 'helmet'
import uploader from './uploaders/imageUploader.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (_req: Request, res: Response) => {
    res.json(`Server is 🏃‍♂️‍➡️🏃‍♂️‍➡️🏃‍♂️‍➡️`)
})

app.post('/api/upload', uploader.single('file'), (req: Request, res: Response) => {
    res.json(req.file)
})

export default app;
import express from 'express'
import './config/dotenv.js'
import cors from 'cors'

const app = express()

app.use(cors())

const PORT = process.env.PORT || 3001
    
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`)
})
const express = require('express')
const { GoogleAuth } = require('google-auth-library')
const axios = require('axios')
const cors = require('cors')
const multer = require('multer')
require('dotenv').config()
const vision = require('@google-cloud/vision')

const app = express()
const port = process.env.PORT || 3001

const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-translation'],
    credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
    }
})

const visionClient = new vision.ImageAnnotatorClient({
    credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
    }
})

const upload = multer({ storage: multer.memoryStorage() })

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.options('*', cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())

app.post('/translate', async (req, res) => {
    const { text, targetLanguage } = req.body

    try {
        const client = await auth.getClient()
        const { token } = await client.getAccessToken()

        const url = 'https://translation.googleapis.com/language/translate/v2'
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
        const data = {
            q: text,
            target: targetLanguage,
        }

        const response = await axios.post(url, data, { headers })
        const translation = response.data.data.translations[0].translatedText

        res.json({ translation })
    } catch (error) {
        console.error('Error translating text:', error)
        res.status(500).json({ error: 'Translation failed' })
    }
})

app.post('/ocr', upload.single('image'), async (req, res) => {
    const { buffer } = req.file
    try {
        const [result] = await visionClient.textDetection(buffer)
        const detections = result.textAnnotations
        const text = detections.length > 0 ? detections[0].description : ''
        res.json({ text })
    } catch (error) {
        console.error('Error performing OCR:', error)
        res.status(500).json({ error: 'OCR failed' })
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
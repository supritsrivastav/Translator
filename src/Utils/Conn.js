
export default async function handleTranslate(textToTranslate, targetLanguage) {
    const response = await fetch('http://192.168.102.2:3001/translate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: textToTranslate,
            targetLanguage: targetLanguage
        })
    })

    const data = await response.json()
    return data.translation
}

export async function handleUpload(file) {
    const formData = new FormData()
    formData.append('image', file)
    try {
        const response = await fetch('http://192.168.102.2:3001/ocr', { method: 'POST', body: formData, })
        const data = await response.json()
        return data.text
    }
    catch (error) {
        console.error('Error performing OCR:', error)
    }
}

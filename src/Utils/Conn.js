
export default async function handleTranslate(textToTranslate, targetLanguage, controller) {
    const response = await fetch(process.env.REACT_APP_SERVER_TRANSLATE, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: textToTranslate,
            targetLanguage: targetLanguage
        }),
        signal: controller.signal
    })

    const data = await response.json()
    return data.translation
}

export async function handleUpload(file, controller) {
    const formData = new FormData()
    formData.append('image', file)
    const response = await fetch(process.env.REACT_APP_SERVER_OCR, {
        method: 'POST', mode: 'cors', body: formData, signal: controller.signal
    })
    const data = await response.json()
    return data.text
}

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { languages } from './Languages'
import './App.css'

export default function App() {

  const [text1, setText1] = useState('Text will appear here')
  const [text2, setText2] = useState('Text will appear here')
  const [lang1, setLang1] = useState(languages[0].code)
  const [lang2, setLang2] = useState(languages[1].code)
  const [mic1, setMic1] = useState(false)
  const [mic2, setMic2] = useState(false)
  const [voices, setVoices] = useState([])
  const timeoutRef = useRef(null)

  useEffect(() => {
    const voices = window.speechSynthesis.getVoices()
    if (Array.isArray(voices) && voices.length) setVoices(voices)
    else window.speechSynthesis.onvoiceschanged = () => setVoices(window.speechSynthesis.getVoices())
  }, [])

  const speechRecognition = useMemo(() => window.SpeechRecognition || window.webkitSpeechRecognition, [])
  const recognition = useMemo(() => (new speechRecognition()), [])

  function handleRecord1() {
    if (mic2) stop()

    recognition.lang = lang1
    recognition.start()

    recognition.onstart = () => setMic1(true)
    recognition.onaudioend = () => timeoutRef.current = setTimeout(() => setMic1(false), 1000)

    recognition.onresult = event => {
      clearTimeout(timeoutRef.current)
      const current = event.resultIndex
      const transcript = event.results[current][0].transcript
      setText1(transcript)
      handleTranslate(transcript, lang2).then(resText => {
        setText2(resText)
        handleSpeak(resText).onend = () => setTimeout(() => {
          setMic1(false)
          handleRecord2()
        }, 500)
      }).catch(e => console.error(e))
    }
  }

  function handleRecord2() {
    if (mic1) stop()

    recognition.lang = lang2
    recognition.start()

    recognition.onstart = () => setMic2(true)
    recognition.onaudioend = () => timeoutRef.current = setTimeout(() => setMic2(false), 1000)

    recognition.onresult = event => {
      clearTimeout(timeoutRef.current)
      const current = event.resultIndex
      const transcript = event.results[current][0].transcript
      setText2(transcript)
      handleTranslate(transcript, lang1).then(resText => {
        setText1(resText)
        handleSpeak(resText).onend = () => setTimeout(() => {
          setMic2(false)
          handleRecord1()
        }, 500)
      }).catch(e => console.error(e))
    }
  }

  async function handleTranslate(textToTranslate, targetLanguage) {
    const response = await fetch('http://localhost:3001/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: textToTranslate,
        targetLanguage: targetLanguage,
      }),
    })

    const data = await response.json()
    return data.translation
  }

  function handleSpeak(text) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang2
    const voice = voices.find(({ lang }) => lang.includes(lang2))
    if (voice) utterance.voice = voice
    window.speechSynthesis.speak(utterance)
    return utterance
  }

  function stop() {
    recognition.abort()
    window.speechSynthesis.cancel()
    setMic1(false)
    setMic2(false)
  }

  const availableLanguages = new Set(voices.map(({ lang }) => lang.slice(0, 2)))
  const filteredLangs = languages.filter(({ code }) => availableLanguages.has(code))
  const languageOptions = filteredLangs.map(({ code, name }) => <option key={code} value={code}>{name}</option>)

  return (
    <div className="App">
      <div className='selection-div'>
        <select onChange={e => setLang1(e.target.value)} value={lang1}>
          {languageOptions}
        </select>
        {mic1 ? <button className='cancel' onClick={stop}>Stop</button>
          : <button onClick={handleRecord1}>Record</button>}
        <p>{text1}</p>
      </div>
      <span>to</span>
      <div className='selection-div'>
        <select onChange={e => setLang2(e.target.value)} value={lang2}>
          {languageOptions}
        </select>
        {mic2 ? <button className='cancel' onClick={stop}>Stop</button>
          : <button onClick={handleRecord2}>Record</button>}
        <p>{text2}</p>
      </div>
    </div>
  )
}
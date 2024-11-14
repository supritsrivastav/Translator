import React, { useEffect, useMemo, useRef, useState } from 'react'
import handleTranslate from '../Utils/Conn'
import { languages } from '../Db/Languages'
import DropDown from '../Components/DropDown/DropDown'
import BottomSheet from '../Components/BottomSheet/BottomSheet'
import { TiMicrophone } from "react-icons/ti"
import { FaStop } from "react-icons/fa6"
import { GoArrowSwitch } from "react-icons/go"
import { HiOutlineSpeakerWave } from "react-icons/hi2"
import { RiSpeakLine } from "react-icons/ri"
import './VoicePage.css'

export default function VoicePage() {

    const [lang1, setLang1] = useState(languages[0].code)
    const [lang2, setLang2] = useState(languages[1].code)
    const [texts, setTexts] = useState([])
    const [mic1, setMic1] = useState(false)
    const [mic2, setMic2] = useState(false)
    const [voices, setVoices] = useState([])
    const [selectedVoice1, setSelectedVoice1] = useState(null)
    const [selectedVoice2, setSelectedVoice2] = useState(null)
    const textsRef = useRef(null)
    const timeoutRef = useRef(null)
    const sheetRef = useRef(null)

    const voices1 = useMemo(() => voices.filter(({ lang }) => lang.slice(0, 2) === lang1), [lang1, voices])
    const voices2 = useMemo(() => voices.filter(({ lang }) => lang.slice(0, 2) === lang2), [lang2, voices])

    useEffect(() => {
        const placeHolder1 = languages.find(({ code }) => code === lang1).placeholder
        const placeHolder2 = languages.find(({ code }) => code === lang2).placeholder
        setTexts([{ text1: placeHolder1, text2: placeHolder2 }])
        setSelectedVoice1(voices1[0])
        setSelectedVoice2(voices2[0])
    }, [lang1, lang2])

    useEffect(() => {
        const voices = window.speechSynthesis.getVoices()
        if (Array.isArray(voices) && voices.length) setVoices(voices)
        else window.speechSynthesis.onvoiceschanged = () => setVoices(window.speechSynthesis.getVoices())
    }, [])

    const speechRecognition = useMemo(() => window.SpeechRecognition || window.webkitSpeechRecognition, [])
    const recognition = useMemo(() => (new speechRecognition()), [])

    function handleRecord1() {
        if (mic2) stop()
        else {
            recognition.lang = lang1
            recognition.start()

            recognition.onstart = () => setMic1(true)
            recognition.onaudioend = () => timeoutRef.current = setTimeout(() => setMic1(false), 1000)

            recognition.onresult = event => {
                clearTimeout(timeoutRef.current)
                const current = event.resultIndex
                const transcript = event.results[current][0].transcript
                handleTranslate(transcript, lang2).then(resText => {
                    setTexts(prevTexts => [...prevTexts, { text1: transcript, text2: resText }])
                    textsRef.current.scrollTop = textsRef.current.scrollHeight
                    handleSpeak(resText, lang2, selectedVoice2).onend = () => setTimeout(() => {
                        setMic1(false)
                        handleRecord2()
                    }, 500)
                }).catch(e => {
                    console.error(e)
                    stop()
                })
            }
        }
    }

    function handleRecord2() {
        if (mic1) stop()
        else {
            recognition.lang = lang2
            recognition.start()

            recognition.onstart = () => setMic2(true)
            recognition.onaudioend = () => timeoutRef.current = setTimeout(() => setMic2(false), 1000)

            recognition.onresult = event => {
                clearTimeout(timeoutRef.current)
                const current = event.resultIndex
                const transcript = event.results[current][0].transcript
                handleTranslate(transcript, lang1).then(resText => {
                    setTexts(prevTexts => [...prevTexts, { text1: resText, text2: transcript }])
                    textsRef.current.scrollTop = textsRef.current.scrollHeight
                    handleSpeak(resText, lang1, selectedVoice1).onend = () => setTimeout(() => {
                        setMic2(false)
                        handleRecord1()
                    }, 500)
                }).catch(e => {
                    console.error(e)
                    stop()
                })
            }
        }
    }

    function handleSpeak(text, lang, selectedVoice) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = lang
        if (selectedVoice) utterance.voice = selectedVoice
        window.speechSynthesis.speak(utterance)
        return utterance
    }

    function stop() {
        recognition.abort()
        window.speechSynthesis.cancel()
        setMic1(false)
        setMic2(false)
    }

    function switchLang() {
        const temp = lang1
        setLang1(lang2)
        setLang2(temp)
    }

    function handleSpeakText(text, e, lang, selectedVoice) {
        const utterance = handleSpeak(text, lang, selectedVoice)
        utterance.onstart = () => e.target.classList.add('speaking')
        utterance.onend = () => e.target.classList.remove('speaking')
    }

    const availableLanguages = new Set(voices.map(({ lang }) => lang.slice(0, 2)))
    const filteredLangs = languages.filter(({ code }) => availableLanguages.has(code))
    const languageOptions = filteredLangs.map(({ code, name }) => ({ text: name, value: code }))

    const transcripts = texts.map(({ text1, text2 }, idx) => (<div key={idx} className='text-div'>
        <p onClick={e => handleSpeakText(text1, e, lang1, selectedVoice1)}>{text1}<HiOutlineSpeakerWave /></p>
        <hr />
        <p onClick={e => handleSpeakText(text2, e, lang2, selectedVoice2)}>{text2}<HiOutlineSpeakerWave /></p>
    </div>))

    function openSheet() {
        sheetRef.current.classList.remove('close')
    }

    return (
        <div className="voice-page-container">
            <span className='voice-sheet-btn' onClick={openSheet}>{<RiSpeakLine />}</span>
            <div className='texts-container' ref={textsRef}>
                {transcripts}
            </div>
            <div className='bottom-container'>
                <DropDown items={languageOptions} selected={lang1} setSelected={setLang1} name='lang1' />
                <button className='switch-btn' onClick={switchLang}>{<GoArrowSwitch />}</button>
                <DropDown items={languageOptions} selected={lang2} setSelected={setLang2} name='lang2' />
                {mic1 ? <button className='cancel' onClick={stop}>{<FaStop />}</button>
                    : <button className='record-btn' onClick={handleRecord1}>{<TiMicrophone size='1.25rem' />}</button>}
                {mic2 ? <button className='cancel' onClick={stop}>{<FaStop />}</button>
                    : <button className='record-btn' onClick={handleRecord2}>{<TiMicrophone size='1.25rem' />}</button>}
            </div>
            <BottomSheet lang1={lang1} lang2={lang2} voices1={voices1} voices2={voices2} setSelected1={setSelectedVoice1} setSelected2={setSelectedVoice2} refEl={sheetRef} />
        </div>
    )
}

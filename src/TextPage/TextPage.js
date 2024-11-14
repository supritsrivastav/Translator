import React, { useEffect, useState } from 'react'
import handleTranslate from '../Utils/Conn'
import { languages } from '../Db/Languages'
import DropDown from '../Components/DropDown/DropDown'
import { HiOutlineSpeakerWave } from "react-icons/hi2"
import { MdOutlineContentCopy } from "react-icons/md"
import { GoArrowSwitch } from "react-icons/go"
import './TextPage.css'

export default function TextPage() {

    const languageOptions = languages.map(({ code, name }) => ({ text: name, value: code }))
    const [lang1, setLang1] = useState(languages[0].code)
    const [lang2, setLang2] = useState(languages[1].code)
    const [text1, setText1] = useState('')
    const [text2, setText2] = useState('')

    useEffect(() => {
        handleTranslate(text1, lang2).then(resText => setText2(resText))
    }, [text1, lang1, lang2])

    function handleSpeak(e, text, lang) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = lang
        window.speechSynthesis.speak(utterance)
        utterance.onstart = () => e.target.classList.add('speaking')
        utterance.onend = () => e.target.classList.remove('speaking')
    }

    function handleCopy(text) {
        navigator.clipboard.writeText(text)
    }

    function switchLang() {
        const temp = lang1
        setLang1(lang2)
        setLang2(temp)
        const tempText = text1
        setText1(text2)
        setText2(tempText)
    }

    return (
        <div className='text-page-container'>
            <div className='text-div'>
                <textarea value={text1} onChange={e => setText1(e.target.value)} placeholder='Enter text here' />
                <HiOutlineSpeakerWave onClick={e => handleSpeak(e, text1, lang1)} />
                <MdOutlineContentCopy onClick={() => handleCopy(text1)} />
            </div>
            <div className='text-div'>
                <textarea value={text2} placeholder='Translated text will appear here' disabled />
                <HiOutlineSpeakerWave onClick={e => handleSpeak(e, text2, lang2)} />
                <MdOutlineContentCopy onClick={() => handleCopy(text2)} />
            </div>
            <div className='language-div'>
                <DropDown items={languageOptions} selected={lang1} setSelected={setLang1} name='lang1' />
                <button className='switch-btn' onClick={switchLang}>{<GoArrowSwitch />}</button>
                <DropDown items={languageOptions} selected={lang2} setSelected={setLang2} name='lang2' />
            </div>
        </div>
    )
}

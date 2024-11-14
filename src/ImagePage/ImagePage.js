import React, { useEffect, useState } from 'react'
import handleTranslate, { handleUpload } from '../Utils/Conn'
import { languages } from '../Db/Languages'
import DropDown from '../Components/DropDown/DropDown'
import { BiImages } from "react-icons/bi"
import { FaStop } from "react-icons/fa6"
import { BsFillPatchExclamationFill } from "react-icons/bs"
import { HiOutlineSpeakerWave } from "react-icons/hi2"
import { MdOutlineContentCopy } from "react-icons/md"
import './ImagePage.css'

export default function ImagePage() {
    const [file, setFile] = useState(null)
    const [lang, setLang] = useState(languages[0].code)
    const [translatedText, setTranslatedText] = useState('Translated text will appear here')
    const [processing, setProcessing] = useState(false)

    function handleFileChange(event) {
        setFile(event.target.files[0])
    }

    useEffect(() => {
        if (file) {
            try {
                setProcessing(true)
                handleUpload(file).then(text => {
                    handleTranslate(text, lang).then(resText => {
                        setTranslatedText(resText)
                        setProcessing(false)
                    })
                })
            } catch (error) {
                console.error(error)
            }
        }
    }, [file, lang])

    const languageOptions = languages.map(({ code, name }) => ({ text: name, value: code }))

    function stopProcessing() {
        setFile(null)
        setProcessing(false)
    }

    function handleSpeak(e) {
        const utterance = new SpeechSynthesisUtterance(translatedText)
        utterance.lang = lang
        window.speechSynthesis.speak(utterance)
        utterance.onstart = () => e.target.classList.add('speaking')
        utterance.onend = () => e.target.classList.remove('speaking')
    }

    function handleCopy() {
        navigator.clipboard.writeText(translatedText)
    }

    return (
        <div className='image-page-container'>
            {processing ?
                <div className='stop-div'>
                    <BsFillPatchExclamationFill />
                    <button className='stop-btn' onClick={stopProcessing}><FaStop /></button>
                </div> :
                <label>
                    <BiImages />
                    <input type="file" onChange={handleFileChange} />
                </label>}
            <DropDown items={languageOptions} selected={lang} setSelected={setLang} name='lang' classname='image-lang' />
            <div className='translate-textbox'>
                <div>{translatedText}</div>
                <HiOutlineSpeakerWave onClick={handleSpeak} />
                <MdOutlineContentCopy onClick={handleCopy} />
            </div>
        </div>
    )
}

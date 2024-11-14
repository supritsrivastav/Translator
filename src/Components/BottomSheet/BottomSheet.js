import React, { useEffect, useState } from 'react'
import DropDown from '../DropDown/DropDown'
import { languages } from '../../Db/Languages'
import { IoClose } from "react-icons/io5"
import './BottomSheet.css'

export default function BottomSheet({ lang1, lang2, voices1, voices2, setSelected1, setSelected2, refEl }) {

    const languageTitle1 = languages.find(({ code }) => code === lang1).name
    const languageTitle2 = languages.find(({ code }) => code === lang2).name

    const voiceNames1 = voices1.map(voice => ({ text: voice.name, value: voice.voiceURI }))
    const voiceNames2 = voices2.map(voice => ({ text: voice.name, value: voice.voiceURI }))

    const [selectedVoice1, setSelectedVoice1] = useState('')
    const [selectedVoice2, setSelectedVoice2] = useState('')

    useEffect(() => {
        if (voices1.length) setSelectedVoice1(voices1[0].voiceURI)
        if (voices2.length) setSelectedVoice2(voices2[0].voiceURI)
    }, [voices1, voices2])

    useEffect(() => {
        const voice1 = voices1.find(voice => voice.voiceURI === selectedVoice1)
        setSelected1(voice1)
        const voice2 = voices2.find(voice => voice.voiceURI === selectedVoice2)
        setSelected2(voice2)
    }, [selectedVoice1, selectedVoice2])

    function closeSheet() {
        refEl.current.classList.add('close')
    }

    return (
        <div className='bottom-sheet close' ref={refEl}>
            <span className='close-btn' onClick={closeSheet}><IoClose /></span>
            <div className='language-voices-container'>
                <p>{languageTitle1}</p>
                <DropDown items={voiceNames1} selected={selectedVoice1} setSelected={setSelectedVoice1} name='lang1' classname='sheet-dropdown' />
            </div>
            <div className='language-voices-container'>
                <p>{languageTitle2}</p>
                <DropDown items={voiceNames2} selected={selectedVoice2} setSelected={setSelectedVoice2} name='lang2' classname='sheet-dropdown' />
            </div>
        </div>
    )
}

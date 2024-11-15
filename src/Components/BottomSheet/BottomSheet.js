import React, { useEffect, useState } from 'react'
import DropDown from '../DropDown/DropDown'
import { languages } from '../../Db/Languages'
import { IoClose } from "react-icons/io5"
import { MdLightMode, MdDarkMode } from "react-icons/md"
import './BottomSheet.css'

export default function BottomSheet({ lang1, lang2, voices1, voices2, setSelected1, setSelected2, refEl, mode, setMode }) {

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

    useEffect(() => {
        function checkBottomSheet(event) {
            if (!refEl.current[0]?.contains(event.target) && !refEl.current[1]?.contains(event.target) &&
                !refEl.current[1]?.classList.contains('close')) closeSheet()
        }
        window.addEventListener('click', checkBottomSheet)
        return () => window.removeEventListener('click', checkBottomSheet)
    }, [])

    function closeSheet() {
        refEl.current[1].classList.add('close')
    }

    function switchMode() {
        setMode(!mode)
    }

    return (
        <div className='bottom-sheet close' ref={el => refEl.current[1] = el}>
            <span onClick={switchMode} className='theme-btn'>{mode ? <MdDarkMode /> : <MdLightMode />}</span>
            <span className='close-btn' onClick={closeSheet}><IoClose /></span>
            <div className='language-voices-container'>
                <p>{languageTitle1}</p>
                {voices1.length > 0 ? <DropDown items={voiceNames1} selected={selectedVoice1} setSelected={setSelectedVoice1} name='lang1' classname='sheet-dropdown' /> : <h3>No voices available</h3>}
            </div>
            <div className='language-voices-container'>
                <p>{languageTitle2}</p>
                {voices2.length > 0 ? <DropDown items={voiceNames2} selected={selectedVoice2} setSelected={setSelectedVoice2} name='lang2' classname='sheet-dropdown' /> : <h3>No voices available</h3>}
            </div>
        </div>
    )
}

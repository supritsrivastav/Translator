import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import useMode from './Utils/Mode'
import VoicePage from './VoicePage/VoicePage'
import Navbar from './Navbar/Navbar'
import ImagePage from './ImagePage/ImagePage'
import TextPage from './TextPage/TextPage'

export default function App() {

    const { mode, setMode } = useMode()

    return (
        <div id='theme' data-mode={mode ? 'light' : 'dark'}>
            <Router>
                <Routes>
                    <Route path='/' element={<Navbar mode={mode} setMode={setMode} />}>
                        <Route index element={<VoicePage />} />
                        <Route path='text' element={<TextPage />} />
                        <Route path='image' element={<ImagePage />} />
                    </Route>
                </Routes>
            </Router>
        </div>
    )
}
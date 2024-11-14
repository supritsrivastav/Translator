import { useEffect, useState } from "react"

export default function useMode() {
    const [mode, setMode] = useState(window.matchMedia('(prefers-color-scheme: light)').matches)

    useEffect(() => {
        let check = window.matchMedia('(prefers-color-scheme: light)')
        function change() {
            setMode(check.matches)
        }
        check.addEventListener('change', change)
        return () => check.removeEventListener('change', change)
    }, [])

    return { mode, setMode }
}

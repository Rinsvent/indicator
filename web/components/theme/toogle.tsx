'use client'

import {useTheme} from '@/context/ThemeContext'
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import IconButton from "@mui/material/IconButton";

export function ThemeToggle() {
    const {theme, toggleTheme} = useTheme()

    return (
        <IconButton
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            {theme === 'light' ? <LightModeIcon/> : <DarkModeIcon/>}
        </IconButton>
    )
}
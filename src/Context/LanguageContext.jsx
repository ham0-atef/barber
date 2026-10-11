/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { translations } from '../data/translations'

const LanguageContext = createContext(null)

const STORAGE_KEY = 'elegance_language'
const DEFAULT_LANG = 'it' // Italian is primary by default

export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            return saved === 'en' ? 'en' : DEFAULT_LANG
        } catch {
            return DEFAULT_LANG
        }
    })

    const setLanguage = useCallback((lang) => {
        const nextLang = lang === 'en' ? 'en' : 'it'
        setLanguageState(nextLang)
        try {
            localStorage.setItem(STORAGE_KEY, nextLang)
        } catch {
            // ignore localStorage errors
        }
    }, [])

    const toggleLanguage = useCallback(() => {
        setLanguageState((prev) => {
            const nextLang = prev === 'it' ? 'en' : 'it'
            try {
                localStorage.setItem(STORAGE_KEY, nextLang)
            } catch {
                // ignore
            }
            return nextLang
        })
    }, [])

    // Synchronize document lang attribute & document title
    useEffect(() => {
        document.documentElement.lang = language
        const currentMeta = translations[language]?.meta
        if (currentMeta?.title) {
            document.title = currentMeta.title
        }
    }, [language])

    const dict = useMemo(() => {
        return translations[language] || translations.it
    }, [language])

    // Nested key resolver helper: t('header.home')
    const t = useCallback((path, fallback = '') => {
        if (!path) return fallback
        const keys = path.split('.')
        let current = dict
        for (const k of keys) {
            if (current && typeof current === 'object' && k in current) {
                current = current[k]
            } else {
                return fallback || path
            }
        }
        return typeof current === 'string' ? current : fallback || path
    }, [dict])

    const value = useMemo(() => ({
        language,
        setLanguage,
        toggleLanguage,
        isItalian: language === 'it',
        isEnglish: language === 'en',
        t,
        dict
    }), [language, setLanguage, toggleLanguage, t, dict])

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}

export default LanguageContext

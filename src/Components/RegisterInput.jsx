import { useState } from 'react'
import { useAuth } from '../Context/AuthContext.jsx'
import { useMessage } from '../Context/MessageContext.jsx'
import { useLanguage } from '../Context/LanguageContext.jsx'
import { Link } from 'react-router-dom'

function RegisterInput() {
    const [fullname, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const { register } = useAuth()
    const { showMessage } = useMessage()
    const { dict, isItalian } = useLanguage()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage(isItalian ? 'Le password non coincidono' : 'Passwords do not match')
            return
        }
        if (phone.length < 10) {
            setMessage(isItalian ? 'Il numero di telefono deve contenere almeno 10 cifre' : 'Phone number must be at least 10 digits')
            return
        }
        const phonePattern = /^(03\d{2}-\d{7}|\+923\d{9}|\+39\d{9,10}|\d{10})$/
        if (!phonePattern.test(phone)) {
            showMessage('error', isItalian ? 'Inserisci un numero di telefono valido (es. +39 02 1234567).' : 'Please enter a valid phone number.')
            return
        }
        if (password.length < 6) {
            setMessage(isItalian ? 'La password deve contenere almeno 6 caratteri' : 'Password must be at least 6 characters')
            return
        }
        const result = await register({ fullname, email, phone, password });
        if (result.success) {
            setMessage(isItalian ? 'Registrazione completata con successo! Ora puoi accedere.' : 'Registration successful! You can now log in.')
            setFullname('')
            setEmail('')
            setPhone('')
            setPassword('')
            setConfirmPassword('')
        }
        else {
            setMessage(result.error)
        }
    }
    return (
        <div className="register-box flex flex-col rounded-2xl shadow-xl bg-white border border-soft-border text-near-black w-full max-w-2xl mx-auto scale-88 overflow-hidden">
            <div className="head bg-ivory border-b border-soft-border p-6 text-center text-near-black font-serif text-2xl md:text-4xl font-bold">
                <h2>{isItalian ? 'Crea il Tuo ' : 'Create Your '}<span className="text-burgundy">{isItalian ? 'Profilo' : 'Account'}</span></h2>
            </div>
            <div className="register-form bg-white pb-6">
                <form className='px-5 md:px-9 py-6' onSubmit={handleSubmit} method="post">
                    <div className="input-forms space-y-4 mb-2">
                        <input type="text" placeholder={dict?.auth?.nameLabel?.toUpperCase() || "NOME COMPLETO"} value={fullname} id='fullname' onChange={(e) => setFullname(e.target.value)} className="w-full font-semibold border-2 border-soft-border p-2 px-3 sm:px-4 py-3 text-sm sm:text-base placeholder:text-warm-gray text-near-black tracking-tight hover:border-burgundy transition-colors focus:outline-none focus:border-burgundy rounded-lg" required />
                        <input type="email" placeholder={dict?.auth?.emailLabel?.toUpperCase() || "INDIRIZZO EMAIL"} value={email} id='email' onChange={(e) => setEmail(e.target.value)} className="w-full font-semibold border-2 border-soft-border p-2 px-3 sm:px-4 py-3 text-sm sm:text-base placeholder:text-warm-gray text-near-black tracking-tight hover:border-burgundy transition-colors focus:outline-none focus:border-burgundy rounded-lg" required />
                        <input type="tel" placeholder={dict?.auth?.phoneLabel?.toUpperCase() || "NUMERO DI TELEFONO"} value={phone} id='phone' onChange={(e) => setPhone(e.target.value)} className="w-full font-semibold border-2 border-soft-border p-2 px-3 sm:px-4 py-3 text-sm sm:text-base placeholder:text-warm-gray text-near-black tracking-tight hover:border-burgundy transition-colors focus:outline-none focus:border-burgundy rounded-lg" required />
                        <input type="password" placeholder={dict?.auth?.passwordLabel?.toUpperCase() || "PASSWORD"} id='password' value={password} onChange={(e) => setPassword(e.target.value)} className="w-full font-semibold border-2 border-soft-border p-2 px-3 sm:px-4 py-3 text-sm sm:text-base placeholder:text-warm-gray text-near-black tracking-tight hover:border-burgundy transition-colors focus:outline-none focus:border-burgundy rounded-lg" required />
                        <input type="password" placeholder={dict?.auth?.confirmPasswordLabel?.toUpperCase() || "CONFERMA PASSWORD"} id='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full font-semibold border-2 border-soft-border p-2 px-3 sm:px-4 py-3 text-sm sm:text-base placeholder:text-warm-gray text-near-black tracking-tight hover:border-burgundy transition-colors focus:outline-none focus:border-burgundy rounded-lg" required />
                    </div>
                    <div className="submit-button mt-6">
                        <input type="submit" value={dict?.auth?.registerBtn || "Registrati"} className="btn-primary-luxury w-full py-3.5 px-6 rounded-lg shadow-md cursor-pointer uppercase text-sm sm:text-base font-bold" />
                    </div>
                    {message && <p className="mt-3 text-center text-burgundy font-semibold text-sm">{message}</p>}
                    <div className="no-account mt-5 sm:mt-6">
                        <p className="text-center font-medium text-xs sm:text-sm text-warm-gray">{dict?.auth?.hasAccount || "Hai già un account?"} <Link to="/login" className='text-burgundy font-bold hover:text-near-black transition-colors'>{dict?.auth?.signIn || "Accedi"}</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default RegisterInput

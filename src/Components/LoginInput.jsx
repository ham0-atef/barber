import { useState, useEffect } from "react"
import { useAuth } from "../Context/AuthContext"
import { useLanguage } from "../Context/LanguageContext"
import { Link, useNavigate } from "react-router-dom"

function LoginInput() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [message, setMessage] = useState("")
    const { login, currentUser } = useAuth()
    const { dict, isItalian } = useLanguage()
    const navigate = useNavigate()

    // Effect to handle navigation after login
    useEffect(() => {
        if (currentUser) {
            if (currentUser.role === "admin") {
                navigate("/admin/dashboard");
            } else if (currentUser.accountRole === 'staff') {
                navigate('/staff/dashboard');
            } else {
                navigate("/");
            }
        }
    }, [currentUser, message, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (currentUser) {
            setMessage(isItalian ? "Hai già effettuato l'accesso!" : "You are already logged in!")
            return
        }
        const result = await login({ email, password, rememberMe });
        if (result.success) {
            setMessage(isItalian ? "Accesso effettuato con successo!" : "Login successful!")
            setEmail("")
            setPassword("")
            // Navigation will be handled by the useEffect hook
        } else {
            setMessage(result.error)
        }
    }
    return (
        <div className="login-box flex flex-col rounded-2xl shadow-xl bg-white border border-soft-border text-near-black w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto overflow-hidden">
            <div className="head bg-ivory border-b border-soft-border p-4 sm:p-5 text-center text-near-black font-serif text-2xl sm:text-3xl md:text-4xl font-bold uppercase">
                <h2><span className="text-burgundy">{isItalian ? 'Acc' : 'Log'}</span>{isItalian ? 'edi' : 'in'}</h2>
            </div>
            <div className="login-form bg-white pb-6 pt-2">
                <form className='p-4 sm:p-6 md:p-8' onSubmit={handleSubmit} method="post">
                    <div className="input-forms space-y-4 sm:space-y-5 md:space-y-6 mb-2">
                        <input type="email" name="userMail" value={email} id="userMail" placeholder={dict?.auth?.emailLabel?.toUpperCase() || "EMAIL"} onChange={(e) => setEmail(e.target.value)} className="w-full font-semibold border-2 border-soft-border p-2 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base placeholder:text-warm-gray text-near-black tracking-tight hover:border-burgundy transition-colors focus:outline-none focus:border-burgundy rounded-lg" required />
                        <input type="password" name="userPassword" id="userPassword" value={password} placeholder={dict?.auth?.passwordLabel?.toUpperCase() || "PASSWORD"} onChange={(e) => setPassword(e.target.value)} className="w-full font-semibold border-2 border-soft-border p-2 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base placeholder:text-warm-gray text-near-black tracking-tight hover:border-burgundy transition-colors focus:outline-none focus:border-burgundy rounded-lg" required />
                    </div>
                    <div className="remember-forgot flex justify-between items-center mt-4 sm:mt-5 mb-8 mx-1">
                        <label className='flex items-center cursor-pointer'>
                            <input type="checkbox" name="rememberMe" id="rememberMe" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className='w-4 h-4 rounded border-2 border-soft-border accent-burgundy cursor-pointer' />
                            <span className='text-xs sm:text-sm ml-2 text-warm-gray tracking-tight font-medium'>{dict?.auth?.rememberMe || "Ricordami"}</span>
                        </label>
                        <a href="#!" className='text-burgundy hover:text-near-black text-xs sm:text-sm font-semibold tracking-tight transition-colors duration-300 hover:underline'>{dict?.auth?.forgotPassword || "Password dimenticata?"}</a>
                    </div>
                    <div className="submit-button">
                        <input type="submit" value={dict?.auth?.loginBtn || "Accedi"} className="btn-primary-luxury w-full py-3.5 px-6 rounded-lg shadow-md cursor-pointer uppercase text-sm sm:text-base font-bold" />
                    </div>
                    {message && <p className="mt-3 text-center text-burgundy font-semibold text-sm">{message}</p>}
                    <div className="no-account mt-6 sm:mt-7">
                        <p className="text-center font-medium text-xs sm:text-sm text-warm-gray">{dict?.auth?.noAccount || "Non hai ancora un account?"} <Link to="/register" className='text-burgundy font-bold hover:text-near-black transition-colors'>{dict?.auth?.signUp || "Registrati"}</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginInput
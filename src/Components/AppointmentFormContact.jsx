import { useState, useRef, useEffect } from 'react'
import { services } from '../data/services'
import { useMessage } from '../Context/MessageContext.jsx'
import { useAppointment } from '../Context/AppointmentContext.jsx'
import { useAuth } from '../Context/AuthContext.jsx'
import { useLanguage } from '../Context/LanguageContext.jsx'

function AppointmentFormContact() {
    const { currentUser } = useAuth()
    const { dict, isItalian } = useLanguage()

    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    const [selectedService, setSelectedService] = useState([])
    const [name, setName] = useState(currentUser ? currentUser.name : '')
    const [email, setEmail] = useState(currentUser ? currentUser.email : '')
    const [phoneNumber, setPhoneNumber] = useState(currentUser ? currentUser.phone : '')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [message, setMessage] = useState('')

    const totalPrice = selectedService.reduce((sum, s) => sum + parseFloat(s.price.replace('$', '')), 0)

    const { showMessage } = useMessage()
    const { bookAppointment } = useAppointment()

    const toggleService = (service) => {
        setSelectedService(prev => {
            const exists = prev.find(s => s.name === service.name)
            if (exists) return prev.filter(s => s.name !== service.name)
            return [...prev, { name: service.name, price: service.price }]
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // validations (same as main appointment form)
        if (selectedService.length === 0) {
            showMessage('error', isItalian ? 'Seleziona un servizio prima di inviare.' : 'Please select a service before submitting the form.')
            return
        }
        if (name === '' || email === '' || phoneNumber === '' || date === '' || time === '') {
            showMessage('error', isItalian ? 'Compila tutti i campi obbligatori.' : 'Please fill in all required fields.')
            return
        }
        if (date < new Date().toISOString().split('T')[0]) {
            showMessage('error', isItalian ? 'Seleziona una data futura corretta.' : 'Please select a correct upcoming date.')
            return
        }
        if (time < '11:00' || time > '20:00') {
            showMessage('error', isItalian ? 'Seleziona un orario tra le 11:00 e le 20:00.' : 'Please select a time between 11:00 AM and 8:00 PM.')
            return
        }
        const selectedDate = new Date(date)
        if (selectedDate.getDay() === 0) {
            showMessage('error', isItalian ? 'Non si effettuano appuntamenti la domenica.' : 'Appointments cannot be booked on Sundays. Please select another day.')
            return
        }
        const phonePattern = /^(03\d{2}-\d{7}|\+923\d{9})$/
        if (!phonePattern.test(phoneNumber)) {
            showMessage('error', isItalian ? 'Inserisci un numero di telefono valido.' : 'Please enter a valid phone number.')
            return
        }

        const formData = {
            name,
            email,
            phoneNumber,
            selectedService,
            date,
            time,
            message,
            totalPrice
        }

        // attempt to persist booking (supports guest bookings)
        const result = await bookAppointment(formData)
        if (result && result.success) {
            const assignmentSummary = result.assignments
                .map(a => `${a.service} → ${a.stylist}`)
                .join(', ')
            showMessage('success', isItalian ? `Prenotazione confermata! ${assignmentSummary}` : `Booking confirmed! ${assignmentSummary}`)
            setName('')
            setEmail('')
            setPhoneNumber('')
            setSelectedService([])
            setDate('')
            setTime('')
            setMessage('')
        } else {
            showMessage('error', result?.error || (isItalian ? 'Si è verificato un errore durante la prenotazione.' : 'An error occurred while booking your appointment.'))
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])
    return (
        <form onSubmit={handleSubmit} className="w-full space-y-4 mt-1">
            <div>
                <label className="font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-warm-gray ml-0.5" htmlFor="name">{dict?.appointment?.fullName || 'Nome e Cognome'} *</label>
                <input type="text" placeholder={dict?.appointment?.fullNamePlaceholder || 'Alessandro Rossi'} id='name' value={name} onChange={(e) => setName(e.target.value)} className="w-full font-semibold border-2 rounded-md border-soft-border px-3 py-2.5 text-sm text-near-black placeholder:text-warm-gray tracking-tight bg-white hover:border-burgundy transition-colors focus:outline-none focus:border-burgundy mt-1.5" required />
            </div>
            <div>
                <label className="font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-warm-gray ml-0.5" htmlFor="email">{dict?.appointment?.email || 'Indirizzo Email'} *</label>
                <input type="email" placeholder={dict?.appointment?.emailPlaceholder || 'alessandro@esempio.it'} id='email' value={email} onChange={(e) => setEmail(e.target.value)} className="w-full font-semibold border-2 rounded-md border-soft-border px-3 py-2.5 text-sm text-near-black placeholder:text-warm-gray tracking-tight bg-white hover:border-burgundy transition-colors focus:outline-none focus:border-burgundy mt-1.5" required />
            </div>
            <div>
                <label className="font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-warm-gray ml-0.5" htmlFor="phone">{dict?.appointment?.phone || 'Numero di Telefono'} *</label>
                <input type="tel" placeholder={dict?.appointment?.phonePlaceholder || '+39 02 1234567'} id='phone' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full font-semibold border-2 rounded-md border-soft-border px-3 py-2.5 text-sm text-near-black placeholder:text-warm-gray tracking-tight bg-white hover:border-burgundy transition-colors focus:outline-none focus:border-burgundy mt-1.5" required />
            </div>
            <div className="date-time-section flex flex-col sm:flex-row gap-3 md:gap-5">
                <div className="flex-1">
                    <label className="font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-warm-gray ml-0.5" htmlFor="date">{dict?.appointment?.dateLabel || 'Data'} *</label>
                    <input type="date" placeholder="DATE" id='date' value={date} onChange={(e) => setDate(e.target.value)} className="w-full font-semibold border-2 rounded-md border-soft-border px-3 py-2.5 text-sm text-near-black tracking-tight bg-white hover:border-burgundy transition-colors focus:outline-none focus:border-burgundy mt-1.5" required />
                </div>
                <div className="flex-1">
                    <label className="font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-warm-gray ml-0.5" htmlFor="time">{dict?.appointment?.timeLabel || 'Orario'} *</label>
                    <input type="time" placeholder="TIME" id='time' value={time} onChange={(e) => setTime(e.target.value)} className="w-full font-semibold border-2 rounded-md border-soft-border px-3 py-2.5 text-sm text-near-black tracking-tight bg-white hover:border-burgundy transition-colors focus:outline-none focus:border-burgundy mt-1.5" required />
                </div>
            </div>
            <div className="service-select w-full relative" ref={dropdownRef}>
                <label className="font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-warm-gray ml-0.5" htmlFor="service">{dict?.appointment?.selectServices || 'Seleziona i Servizi'} *</label>
                {/* Custom Dropdown */}
                <div className="relative mt-1.5">
                    {/* Dropdown Button */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className={`w-full font-semibold border-2 rounded-md p-2 px-3 md:px-4 py-2.5 text-sm tracking-tight bg-white text-left flex justify-between items-center transition-colors ${isOpen ? 'border-burgundy text-burgundy' : 'border-soft-border text-near-black hover:border-burgundy'
                            }`}
                    >
                        <span className={selectedService.length === 0 ? 'text-warm-gray' : 'text-near-black'}>
                            {selectedService.length === 0
                                ? (dict?.appointment?.selectServicesBtn || 'SELEZIONA I SERVIZI')
                                : `${selectedService.length} ${dict?.appointment?.servicesSelected || 'SERVIZI SELEZIONATI'}`}
                        </span>
                        <span className={`transition-transform duration-200 text-burgundy ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute top-full left-0 w-full bg-white rounded-md border-2 border-burgundy shadow-xl z-50 max-h-60 md:max-h-70 overflow-y-auto">
                            {services.map((serviceCategory) => (
                                <div key={serviceCategory.title}>
                                    {/* Category Header */}
                                    <div className="font-bold text-burgundy bg-ivory px-3 md:px-4 py-2 text-xs md:text-sm tracking-wide uppercase border-b border-soft-border">
                                        {serviceCategory.title}
                                    </div>

                                    {/* Service Options */}
                                    {serviceCategory.items.map((service) => {
                                        const isSelected = selectedService.some(s => s.name === service.name)
                                        return (
                                            <button
                                                key={service.name}
                                                type="button"
                                                onClick={() => toggleService(service)}
                                                className={`w-full text-left px-3 md:px-4 py-2 md:py-3 transition-colors font-medium tracking-tight text-xs md:text-sm flex items-center justify-between gap-2 border-b border-soft-border/50 ${isSelected
                                                    ? 'bg-burgundy/10 text-burgundy font-bold'
                                                    : 'text-near-black hover:bg-ivory'
                                                    }`}
                                            >
                                                <span>{service.name} — {service.price}</span>
                                                <span className={`shrink-0 w-4 h-4 border-2 rounded-sm flex items-center justify-center text-[10px] transition-colors ${isSelected ? 'border-burgundy bg-burgundy text-white' : 'border-soft-border'
                                                    }`}>
                                                    {isSelected && '✓'}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Selected Services Chips */}
                {selectedService.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {selectedService.map(s => (
                            <span
                                key={s.name}
                                className="inline-flex items-center gap-1.5 bg-burgundy/10 border border-burgundy/30 text-burgundy text-xs font-bold px-2 py-1 rounded-sm tracking-tight mt-1.5"
                            >
                                {s.name} — {s.price}
                                <button
                                    type="button"
                                    onClick={() => toggleService(s)}
                                    className="text-burgundy hover:text-near-black transition-colors leading-none font-black ml-1"
                                >
                                    ✕
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                {/* Total Price */}
                {selectedService.length > 0 && (
                    <div className="mt-2.5 text-left text-xs font-bold text-warm-gray tracking-wide">
                        {dict?.appointment?.total || 'TOTALE'}: <span className="text-burgundy font-black text-sm">${totalPrice}</span>
                    </div>
                )}
            </div>
            <div className="message-area">
                <label className="font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm text-warm-gray ml-0.5" htmlFor="message">{dict?.contact?.formTitle || (isItalian ? 'Messaggio' : 'Message')}</label>
                <textarea placeholder={dict?.contact?.messagePlaceholder || (isItalian ? 'Come possiamo aiutarti?' : 'Please Write Your Message')} id='message' value={message} onChange={(e) => setMessage(e.target.value)} className="w-full font-semibold border-2 rounded-md border-soft-border px-3 py-2.5 text-sm text-near-black placeholder:text-warm-gray tracking-tight bg-white hover:border-burgundy transition-colors focus:outline-none focus:border-burgundy mt-1.5 h-24" rows={1} />
            </div>
            <div className='pt-3'>
                <button type="submit" className="btn-primary-luxury w-full py-3.5 px-6 rounded-md shadow-md cursor-pointer uppercase tracking-widest text-xs">
                    {dict?.appointment?.confirm || (isItalian ? 'Conferma Prenotazione' : 'Book An Appointment')}
                </button>
            </div>
        </form >
    )
}

export default AppointmentFormContact

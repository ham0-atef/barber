import { Calendar, Clock, Scissors, User, X, Check, AlertCircle } from 'lucide-react'
import { useAppointment } from '../../Context/AppointmentContext.jsx'
import { useMessage } from '../../Context/MessageContext.jsx'
import { useState, useEffect } from 'react'
import ConfirmModal from '../ConfirmModal'

// Normalize any date string to YYYY-MM-DD (required by <input type="date">).
// Handles YYYY-MM-DD (pass-through) and MM/DD/YYYY (legacy) without timezone shift.
const toInputDate = (dateStr) => {
    if (!dateStr) return ''
    // Already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
    // MM/DD/YYYY → YYYY-MM-DD
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        const [month, day, year] = dateStr.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    return ''
}

function AppointmentCards({ name, date, time, items, totalPrice, status, appointmentId, isGuest }) {
    const { cancelAppointment, rescheduleAppointment } = useAppointment()
    const { showMessage } = useMessage()

    const [isRescheduling, setIsRescheduling] = useState(false)
    const [newDate, setNewDate] = useState(toInputDate(date))
    const [newTime, setNewTime] = useState(time)
    const [isVisible, setIsVisible] = useState(false)

    const ANIM_DURATION = 300

    useEffect(() => {
        let t
        if (!isRescheduling && isVisible) {
            t = setTimeout(() => setIsVisible(false), ANIM_DURATION)
        }
        return () => {
            if (t) clearTimeout(t)
        }
    }, [isRescheduling, isVisible])

    const [confirmAction, setConfirmAction] = useState(null)

    const handleCancel = async () => {
        setConfirmAction({
            message: 'Are you sure you want to cancel this appointment?',
            onConfirm: async () => {
                const result = await cancelAppointment(appointmentId)
                if (result.success) {
                    showMessage('success', 'Appointment cancelled successfully')
                    await new Promise(resolve => setTimeout(resolve, 100))
                } else {
                    showMessage('error', `Failed to cancel appointment: ${result.error}`)
                }
                setConfirmAction(null)
            },
            onCancel: () => setConfirmAction(null)
        })
    }

    const handleschedule = async () => {
        if (!newDate || !newTime) {
            showMessage('error', 'Please select both date and time for rescheduling')
            return
        }
        const result = await rescheduleAppointment(appointmentId, newDate, newTime)
        if (result.success) {
            showMessage('success', 'Appointment rescheduled successfully')
            setIsRescheduling(false)
            await new Promise(resolve => setTimeout(resolve, 100))
        } else {
            showMessage('error', `Failed to reschedule appointment: ${result.error}`)
        }
    }

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'bg-emerald-50 text-emerald-800 border-emerald-200'
            case 'pending': return 'bg-amber-50 text-amber-800 border-amber-200'
            case 'cancelled': return 'bg-rose-50 text-rose-800 border-rose-200'
            default: return 'bg-ivory text-warm-gray border-soft-border'
        }
    }

    const appointmentItems = items || []
    const serviceItems = appointmentItems.map(item => item.service)
    const stylistItems = appointmentItems.map(item => item.stylist).filter(Boolean)
    const displayTotal = Number.isFinite(Number(totalPrice)) ? Number(totalPrice) : 0

    return (
        <div className={`group relative bg-white border border-soft-border rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-md hover:border-burgundy/30 overflow-hidden ${isRescheduling ? 'min-h-105 md:min-h-78' : ''}`}>

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-near-black font-serif font-bold text-lg tracking-normal mb-1 flex items-center gap-2">
                        {name}
                        {isGuest && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-gold/15 text-near-black border border-gold/40 text-[10px] font-bold uppercase">
                                Guest
                            </span>
                        )}
                    </h3>
                </div>
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border ${getStatusStyle(status)}`}>
                    {status}
                </span>
            </div>

            {confirmAction && (
                <ConfirmModal
                    message={confirmAction.message}
                    onConfirm={confirmAction.onConfirm}
                    onCancel={confirmAction.onCancel}
                />
            )}

            {/* Details */}
            <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-ivory/50 border border-soft-border transition-colors">
                        <div className="w-8 h-8 rounded-full bg-white border border-soft-border flex items-center justify-center text-burgundy">
                            <Calendar size={14} />
                        </div>
                        <div>
                            <p className="text-[10px] text-warm-gray font-bold uppercase tracking-wider">Date</p>
                            <p className="text-sm font-semibold text-near-black">{date}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-ivory/50 border border-soft-border transition-colors">
                        <div className="w-8 h-8 rounded-full bg-white border border-soft-border flex items-center justify-center text-burgundy">
                            <Clock size={14} />
                        </div>
                        <div>
                            <p className="text-[10px] text-warm-gray font-bold uppercase tracking-wider">Time</p>
                            <p className="text-sm font-semibold text-near-black">{time}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-ivory/50 border border-soft-border transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-burgundy">
                            <Scissors size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-warm-gray">Services</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {serviceItems.length === 0 ? (
                                <span className="text-xs text-warm-gray italic">No services</span>
                            ) : (
                                serviceItems.map((s) => (
                                    <span key={`${s.name}-${s.price}`} className="inline-flex items-center gap-1.5 bg-white border border-soft-border text-near-black text-xs font-medium px-2 py-1 rounded-lg">
                                        <span className="text-near-black font-semibold">{s.name}</span>
                                        <span className="text-burgundy font-bold">{s.price}</span>
                                    </span>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="p-3 rounded-xl bg-ivory/50 border border-soft-border transition-colors">
                        <div className="flex items-center gap-2 mb-2 text-burgundy">
                            <User size={14} />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-warm-gray">Stylists</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {stylistItems.length === 0 ? (
                                <span className="text-xs text-warm-gray italic">Any available</span>
                            ) : (
                                stylistItems.map((s) => (
                                    <span key={`${s.id}-${s.name}`} className="inline-flex items-center gap-1.5 bg-white border border-soft-border text-near-black text-xs font-semibold px-2 py-1 rounded-lg">
                                        <span className="text-near-black">{s.name}</span>
                                    </span>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-ivory border border-soft-border">
                    <span className="text-xs text-warm-gray font-bold uppercase tracking-wider">Total</span>
                    <span className="text-base font-serif font-bold text-burgundy">${displayTotal}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className={`grid grid-cols-2 gap-3 transition-opacity duration-300 ${isRescheduling ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}>
                <button
                    onClick={() => {
                        setIsVisible(true)
                        requestAnimationFrame(() => setIsRescheduling(true))
                    }}
                    disabled={status === 'Cancelled'}
                    className="btn-primary-luxury flex justify-center items-center py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    Reschedule
                </button>
                <button
                    onClick={handleCancel}
                    disabled={status === 'Cancelled'}
                    className="btn-secondary-luxury flex justify-center items-center py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    Cancel
                </button>
            </div>

            {/* Reschedule Form Overlay */}
            <div
                className={`absolute inset-0 bg-white border border-soft-border rounded-2xl p-6 transition-transform duration-300 ease-in-out space-y-5 ${isRescheduling ? 'translate-y-0' : 'translate-y-full'} overflow-y-auto`}
            >
                <div className="flex justify-between items-center">
                    <h4 className="text-near-black font-serif font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                        <Calendar size={14} className="text-burgundy" />
                        Reschedule Appointment
                    </h4>
                    <button
                        onClick={() => setIsRescheduling(false)}
                        className="p-1 hover:bg-ivory rounded-full transition-colors text-warm-gray hover:text-near-black cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-warm-gray uppercase tracking-wider mb-1.5">Select Date</label>
                        <input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="w-full bg-ivory/50 border border-soft-border rounded-xl px-4 py-2.5 text-sm text-near-black focus:border-burgundy focus:ring-1 focus:ring-burgundy/20 focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-warm-gray uppercase tracking-wider mb-1.5">Select Time</label>
                        <input
                            type="time"
                            value={newTime}
                            onChange={(e) => setNewTime(e.target.value)}
                            className="w-full bg-ivory/50 border border-soft-border rounded-xl px-4 py-2.5 text-sm text-near-black focus:border-burgundy focus:ring-1 focus:ring-burgundy/20 focus:outline-none transition-colors"
                        />
                    </div>
                    <button
                        onClick={handleschedule}
                        className="btn-primary-luxury w-full py-3 text-xs font-bold uppercase tracking-widest rounded-xl shadow-md mt-2 flex justify-center items-center gap-2 cursor-pointer"
                    >
                        <Check size={14} />
                        Confirm Change
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AppointmentCards

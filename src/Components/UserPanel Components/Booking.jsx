import { useRef, useState, useEffect } from 'react'
import { useAppointment } from '../../Context/AppointmentContext.jsx'
import AppointmentCards from './AppointmentCards.jsx'

function Booking() {
    const appointmentSectionRef = useRef(null)
    const { displayAppointmentsByUser, appointments } = useAppointment()
    const [userappointments, setUserAppointments] = useState([])

    useEffect(() => {
        const fetchAppointments = async () => {
            const result = await displayAppointmentsByUser()
            if (result.success) {
                setUserAppointments(result.data)
            } else {
                setUserAppointments([])
            }
        }
        fetchAppointments()
    }, [displayAppointmentsByUser, appointments])
    return (
        <div ref={appointmentSectionRef} className="bg-white border border-soft-border px-6 sm:px-8 pb-12 sm:pb-14 shadow-sm rounded-2xl transition-all duration-500" id='appoinments'>
            <div className="head-background bg-ivory/60 border-b border-soft-border w-[calc(100%+3rem)] sm:w-[calc(100%+4rem)] -mx-6 sm:-mx-8 -mt-0 px-6 sm:px-8 py-6 sm:py-8 mb-8 rounded-t-2xl">
                <div className="flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-burgundy rounded-full" />
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-near-black">
                        <span className="text-burgundy">My</span> Appointments
                    </h2>
                </div>
                <p className="text-xs text-warm-gray mt-1 ml-4.5">View your upcoming and past bookings</p>
            </div>
            {userappointments.length === 0 ? (
                <div className="bg-ivory/50 border border-soft-border rounded-2xl p-8 sm:p-12 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
                        <svg className="h-7 w-7 text-burgundy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 7V3" />
                            <path d="M16 7V3" />
                            <path d="M3 11h18" />
                            <rect x="3" y="5" width="18" height="16" rx="2" />
                            <path d="M7 15h5" />
                        </svg>
                    </div>
                    <h3 className="text-near-black font-serif text-lg font-bold mb-2">No appointments found</h3>
                    <p className="text-warm-gray text-sm max-w-sm mx-auto">No reservations currently recorded. Schedule your next bespoke ritual with our master artisans.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {userappointments.map((appointment) => (
                        <AppointmentCards
                            key={appointment.id}
                            name={appointment.name}
                            date={appointment.date}
                            time={appointment.time}
                            items={appointment.items}
                            totalPrice={appointment.totalPrice}
                            status={appointment.status}
                            appointmentId={appointment.id}
                            isGuest={appointment.userId == null}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Booking
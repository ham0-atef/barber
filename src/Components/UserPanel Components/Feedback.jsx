import { useState } from 'react'
import { useAuth } from '../../Context/AuthContext.jsx'
import { useMessage } from '../../Context/MessageContext.jsx'

function Feedback() {
    const { currentUser } = useAuth()
    const { showMessage } = useMessage()

    const [feedbackData, setFeedbackData] = useState({
        userId: currentUser?.id,
        rating: 5,
        experience: '',
        suggestions: ''
    })
    const handleFeedbackChange = (e) => {
        const { name, value } = e.target
        setFeedbackData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Handle feedback submit
    const handleFeedbackSubmit = async (e) => {
        e.preventDefault()
        await localStorage.setItem("FeedbackData", JSON.stringify(feedbackData))
        console.log('Feedback submitted:', feedbackData)
        showMessage('success', 'Thank you for your feedback! We appreciate you taking the time to share your thoughts with us.')

        // Reset form after submission
        setFeedbackData({
            userId: currentUser?.id,
            rating: 5,
            experience: '',
            suggestions: ''
        })
    }

    return (
        <div className="bg-white border border-soft-border px-6 sm:px-8 pb-12 sm:pb-14 shadow-sm rounded-2xl transition-all duration-500">
            <div className="head-background bg-ivory/60 border-b border-soft-border w-[calc(100%+3rem)] sm:w-[calc(100%+4rem)] -mx-6 sm:-mx-8 -mt-0 px-6 sm:px-8 py-6 sm:py-8 mb-6 rounded-t-2xl">
                <div className="flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-burgundy rounded-full" />
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-near-black">
                        <span className="text-burgundy">Submit</span> Feedback
                    </h2>
                </div>
                <p className="text-xs text-warm-gray mt-1 ml-4.5">We value your impression of our Milano grooming experience</p>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-8">
                {/* Rating Field */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-warm-gray mb-3">Rate Your Experience</label>
                    <div className="flex items-center gap-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setFeedbackData(prev => ({ ...prev, rating: star }))}
                                className={`text-3xl transition-all duration-300 cursor-pointer ${feedbackData.rating >= star ? 'text-gold scale-110' : 'text-soft-border hover:text-gold/50'
                                    }`}
                            >
                                ★
                            </button>
                        ))}
                        <span className="text-warm-gray ml-4 text-xs font-bold uppercase tracking-wider bg-ivory px-3 py-1 rounded-full border border-soft-border">
                            {feedbackData.rating} of 5 Stars
                        </span>
                    </div>
                </div>

                {/* Experience Feedback */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-warm-gray mb-2">Your Experience</label>
                    <textarea
                        name="experience"
                        value={feedbackData.experience}
                        onChange={handleFeedbackChange}
                        rows="5"
                        className="w-full font-medium border border-soft-border rounded-xl px-4 py-3 text-sm text-near-black tracking-tight bg-ivory/30 hover:border-burgundy/40 focus:border-burgundy focus:ring-1 focus:ring-burgundy/20 transition-all focus:outline-none resize-none placeholder:text-warm-gray/60"
                        placeholder="Tell us about your experience at Elegance Barber Shop..."
                    />
                </div>

                {/* Suggestions */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-warm-gray mb-2">Suggestions for Improvement</label>
                    <textarea
                        name="suggestions"
                        value={feedbackData.suggestions}
                        onChange={handleFeedbackChange}
                        rows="4"
                        className="w-full font-medium border border-soft-border rounded-xl px-4 py-3 text-sm text-near-black tracking-tight bg-ivory/30 hover:border-burgundy/40 focus:border-burgundy focus:ring-1 focus:ring-burgundy/20 transition-all focus:outline-none resize-none placeholder:text-warm-gray/60"
                        placeholder="What can we improve?"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        className="btn-primary-luxury px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-xl cursor-pointer"
                    >
                        Submit Feedback
                    </button>
                    <button
                        type="button"
                        onClick={() => setFeedbackData({
                            userId: currentUser?.id,
                            rating: 5,
                            experience: '',
                            suggestions: ''
                        })}
                        className="btn-secondary-luxury px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-xl cursor-pointer"
                    >
                        Clear
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Feedback
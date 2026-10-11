import React from 'react'

function LoadingSpinner() {
    return (
        <div className="loading-spinner min-h-screen flex flex-col items-center justify-center bg-ivory">
            <div className="relative">
                <div className="animate-spin inline-block h-14 w-14 border-4 border-soft-border border-t-burgundy rounded-full" role="status" aria-label="Loading">
                    <span className="sr-only">Loading</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                </div>
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-warm-gray font-serif">Milano Sartoriale</p>
        </div>
    )
}

export default LoadingSpinner

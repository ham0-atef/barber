import { createPortal } from 'react-dom'

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-near-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white border border-soft-border rounded-xl shadow-2xl p-6 max-w-sm w-full animate-in zoom-in-95 duration-200">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-4 bg-burgundy rounded-full" />
                    <h3 className="text-near-black font-serif font-bold text-lg">Confirm Action</h3>
                </div>
                <p className="text-warm-gray text-sm mb-6 leading-relaxed">{message}</p>
                <div className="flex justify-end gap-3 pointer-events-auto">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-warm-gray hover:text-near-black bg-ivory border border-soft-border hover:border-burgundy/30 rounded-lg transition-all cursor-pointer"
                    >
                        No, Keep it
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-burgundy hover:bg-near-black border border-burgundy hover:border-gold/60 rounded-lg shadow-sm transition-all cursor-pointer"
                    >
                        Yes, Proceed
                    </button>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default ConfirmModal

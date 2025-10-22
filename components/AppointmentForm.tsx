import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface AppointmentFormProps {
  onClose: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ onClose }) => {
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setSubmitted(true);
        }, 1500);
    }

    if (submitted) {
        return (
            <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Teşekkürler!</h2>
                <p className="text-slate-600 mb-6">Talebiniz alındı. Danışmanımız en kısa sürede sizinle iletişime geçecektir.</p>
                <button 
                    onClick={onClose}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-bold py-2 px-6 rounded-lg hover:from-yellow-500 transition-colors"
                >
                    Sohbete Geri Dön
                </button>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-md mx-auto h-full flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Danışman Görüşmesi Talebi</h2>
            <p className="text-center text-slate-500 mb-6">Lütfen bilgilerinizi girin, uzman danışmanımız sizinle iletişime geçsin.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">Ad Soyad</label>
                    <input type="text" name="name" id="name" required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Telefon Numarası</label>
                    <input type="tel" name="phone" id="phone" required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm" />
                </div>
                 <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">E-posta</label>
                    <input type="email" name="email" id="email" required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm" />
                </div>
                 <div className="pt-4 flex items-center justify-between">
                     <button
                        type="button"
                        onClick={onClose}
                        className="py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none"
                    >
                        İptal
                    </button>
                    <button type="submit" disabled={isLoading} className="w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-slate-900 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-slate-400 disabled:from-slate-400">
                        {isLoading ? <LoadingSpinner /> : 'Talep Gönder'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AppointmentForm;
import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import ConsultationForm from './components/ConsultationForm';
import AnalysisResult from './components/AnalysisResult';
import Chatbot from './components/Chatbot';
import AppointmentForm from './components/AppointmentForm';
import type { AppStep, FormData, AnalysisResponse } from './types';
import { generateInitialAnalysis } from './services/geminiService';

const AnalysisLoadingScreen: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-slate-50">
        <div className="relative mb-6">
            <div className="w-24 h-24 border-8 border-slate-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-24 h-24 border-8 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-yellow-500 font-bold text-lg">AI</div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Analiziniz Hazırlanıyor...</h2>
        <p className="text-slate-600 max-w-sm">
            Akıllı asistanımız SmartConsult, verdiğiniz bilgilere göre size özel ön analizi oluşturuyor. Bu işlem birkaç saniye sürebilir.
        </p>
    </div>
);

const App: React.FC = () => {
    const [step, setStep] = useState<AppStep>('welcome');
    const [formData, setFormData] = useState<FormData | null>(null);
    const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleStart = () => {
        setStep('form');
    };

    const handleFormSubmit = async (data: FormData) => {
        setIsLoading(true);
        setError(null);
        setFormData(data);
        try {
            const result = await generateInitialAnalysis(data);
            setAnalysis(result);
            setStep('analysis');
        } catch (err: any) {
            setError(err.message || 'Analiz sırasında beklenmedik bir hata oluştu.');
            // Optionally, navigate to an error screen or show a message on the form
            setStep('form'); // Go back to form to show error
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalysisContinue = () => {
        if (analysis) {
            setStep('chat');
        }
    };
    
    const handleBookAppointment = () => {
        setStep('appointment');
    };

    const handleAppointmentClose = () => {
        setStep('chat');
    };

    const renderStep = () => {
        if (isLoading && step === 'form') {
            return <AnalysisLoadingScreen />;
        }

        switch (step) {
            case 'welcome':
                return <WelcomeScreen onStart={handleStart} />;
            case 'form':
                return <ConsultationForm onSubmit={handleFormSubmit} isLoading={isLoading} />;
            case 'analysis':
                if (!analysis) {
                    // This case should ideally not be reached if logic is correct
                    return <div className="text-center p-8">Analiz sonucu bulunamadı. Lütfen tekrar deneyin.</div>;
                }
                return <AnalysisResult analysis={analysis} onContinue={handleAnalysisContinue} />;
            case 'chat':
                 if (!analysis) {
                    return <div className="text-center p-8">Sohbete başlamak için analiz verisi gerekli.</div>;
                }
                return <Chatbot initialAnalysis={analysis} onBookAppointment={handleBookAppointment} />;
            case 'appointment':
                return <AppointmentForm onClose={handleAppointmentClose} />;
            default:
                return <WelcomeScreen onStart={handleStart} />;
        }
    };

    return (
        <div className="h-screen w-screen bg-slate-100 font-sans">
            <div className="max-w-4xl mx-auto h-full bg-white md:rounded-2xl md:my-4 shadow-2xl overflow-hidden">
                {renderStep()}
            </div>
        </div>
    );
};

export default App;

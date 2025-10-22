import React, { useState, useEffect } from 'react';
import type { AnalysisResponse } from '../types';
import { GraftIcon, TimeIcon, TechniqueIcon } from './IconComponents';

interface AnalysisResultProps {
    analysis: AnalysisResponse;
    onContinue: () => void;
}

const AnalysisCard: React.FC<{ icon: React.ReactNode, title: string, value: string }> = ({ icon, title, value }) => (
    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg flex items-center space-x-4 h-full">
        <div className="flex-shrink-0">{icon}</div>
        <div>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <p className="text-slate-900 text-xl font-bold">{value}</p>
        </div>
    </div>
);

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, onContinue }) => {
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        // Trigger animation after component mounts
        const timer = setTimeout(() => setIsAnimated(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const baseTransition = 'transition-all duration-500 ease-out';
    const animationClass = isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5';

    return (
        <div className="relative p-4 md:p-8 max-w-3xl mx-auto h-full flex flex-col justify-center text-center overflow-hidden bg-slate-50">
             {/* Decorative Blobs */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-slate-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>

            <div className="relative z-10">
                <img src="https://smilehairclinic.com/wp-content/uploads/2024/02/smile-hair-clinic-logo.svg" alt="Smile Hair Clinic Logo" className="h-10 mb-6 mx-auto" />
                <h2 className={`text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 ${baseTransition} ${animationClass}`} style={{ transitionDelay: '0ms' }}>Ön Analiz Sonucunuz</h2>
                <p className={`text-lg text-slate-600 mb-8 ${baseTransition} ${animationClass}`} style={{ transitionDelay: '100ms' }}>
                    Verdiğiniz bilgilere ve (varsa) fotoğrafınıza dayanarak hazırladığımız kişisel ön analiziniz aşağıdadır.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-left">
                    <div className={`${baseTransition} ${animationClass}`} style={{ transitionDelay: '200ms' }}>
                        <AnalysisCard icon={<GraftIcon />} title="Tahmini Greft Sayısı" value={analysis.graft} />
                    </div>
                    <div className={`${baseTransition} ${animationClass}`} style={{ transitionDelay: '350ms' }}>
                        <AnalysisCard icon={<TimeIcon />} title="Ortalama İyileşme Süresi" value={analysis.recoveryTime} />
                    </div>
                    <div className={`${baseTransition} ${animationClass}`} style={{ transitionDelay: '500ms' }}>
                        <AnalysisCard icon={<TechniqueIcon />} title="Önerilen Teknik" value={analysis.suggestedMethod} />
                    </div>
                </div>

                <div className={`bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-inner ${baseTransition} ${animationClass}`} style={{ transitionDelay: '650ms' }}>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Özet Değerlendirme</h3>
                    <p className="text-slate-700 text-left whitespace-pre-wrap">{analysis.summary}</p>
                </div>
                
                <p className={`text-sm text-slate-500 my-6 ${baseTransition} ${animationClass}`} style={{ transitionDelay: '800ms' }}>
                    *Bu sonuçlar bir ön analiz olup, uzman doktorumuzla yapacağınız detaylı görüşme sonrası kesinlik kazanacaktır.
                </p>

                <div className={` ${baseTransition} ${animationClass}`} style={{ transitionDelay: '950ms' }}>
                    <button
                        onClick={onContinue}
                        className="w-full md:w-auto mx-auto bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-bold py-4 px-12 rounded-lg hover:from-yellow-500 hover:to-yellow-500 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-yellow-400/40 transform hover:scale-105"
                    >
                        Merak Ettiklerin Var mı? Sohbete Başla
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnalysisResult;
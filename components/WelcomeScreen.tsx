import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="relative text-center p-8 flex flex-col items-center justify-center h-full overflow-hidden bg-slate-900">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-96 h-96 bg-yellow-400 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="w-96 h-96 bg-slate-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>
      <div className="relative z-10 flex flex-col items-center">
        <img src="https://smilehairclinic.com/wp-content/uploads/2024/02/smile-hair-clinic-logo.svg" alt="Smile Hair Clinic Logo" className="h-12 mb-8" style={{ filter: 'brightness(0) invert(1)' }}/>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Merhaba, ben SmartConsult!
        </h1>
        <p className="text-lg text-slate-300 mb-10 max-w-lg">
          Saç ekimi hakkında merak ettiklerini öğrenmeye ve sana özel bir ön analiz almaya hazır mısın?
        </p>
        <button
          onClick={onStart}
          className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 font-bold py-4 px-12 rounded-lg hover:from-yellow-500 hover:to-yellow-500 transition-all duration-300 shadow-xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300"
        >
          Evet, Başlayalım!
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
import React, { useState, useRef } from 'react';
import type { FormData } from '../types';
import { fileToBase64 } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

interface ConsultationFormProps {
    onSubmit: (data: FormData) => void;
    isLoading: boolean;
}

const hairLossLevels = [
    { value: 'Norwood 2', label: 'Norwood 2 - Hafif Geri Çekilme' },
    { value: 'Norwood 3', label: 'Norwood 3 - Belirgin Geri Çekilme' },
    { value: 'Norwood 4', label: 'Norwood 4 - Tepe Bölgesinde Seyrelme' },
    { value: 'Norwood 5', label: 'Norwood 5 - İlerlemiş Dökülme' },
    { value: 'Norwood 6', label: 'Norwood 6 - Geniş Kellik Alanı' },
    { value: 'Norwood 7', label: 'Norwood 7 - En İleri Seviye' },
    { value: 'Ludwig I', label: 'Ludwig I - Tepe Çizgisinde Hafif Seyrelme' },
    { value: 'Ludwig II', label: 'Ludwig II - Tepe Çizgisinde Belirgin Seyrelme' },
    { value: 'Ludwig III', label: 'Ludwig III - Tepe Bölgesinde Tam Kellik' },
];

const goalsOptions = [
    'Saç çizgimi restore etmek',
    'Tepe bölgemi sıklaştırmak',
    'Genel saç yoğunluğunu artırmak',
    'Daha genç bir görünüm elde etmek',
];

const ConsultationForm: React.FC<ConsultationFormProps> = ({ onSubmit, isLoading }) => {
    const [formData, setFormData] = useState<Omit<FormData, 'goals' | 'photo'> & { goals: string[], photo?: File }>({
        age: '',
        gender: 'male',
        hairLossLevel: 'Norwood 3',
        previousOperation: 'no',
        goals: [],
    });
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const newGoals = checked
                ? [...prev.goals, value]
                : prev.goals.filter(goal => goal !== value);
            return { ...prev, goals: newGoals };
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 4 * 1024 * 1024) { // 4MB limit
                 setError("Dosya boyutu 4MB'den büyük olamaz.");
                 setPhotoPreview(null);
                 if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                 }
                 return;
            }
            setError(null);
            setFormData(prev => ({ ...prev, photo: file }));
            setPhotoPreview(URL.createObjectURL(file));
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.goals.length === 0) {
            setError("Lütfen en az bir hedef seçin.");
            return;
        }
        setError(null);

        let photoData;
        if (formData.photo) {
            photoData = await fileToBase64(formData.photo);
        }

        const submissionData: FormData = {
            ...formData,
            goals: formData.goals,
            ...(photoData && { photo: photoData }),
        };

        onSubmit(submissionData);
    };

    return (
        <div className="p-4 md:p-8 max-w-2xl mx-auto h-full overflow-y-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Ön Analiz Formu</h2>
            <p className="text-center text-slate-500 mb-8">Size en doğru bilgiyi verebilmemiz için lütfen formu eksiksiz doldurun.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Personal Info */}
                <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="age" className="block text-sm font-medium text-slate-700">Yaşınız</label>
                        <input type="number" name="age" id="age" value={formData.age} onChange={handleChange} required min="18" max="100" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Cinsiyet</label>
                        <div className="mt-2 flex space-x-4">
                            <label className="inline-flex items-center"><input type="radio" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleChange} className="form-radio text-yellow-500 focus:ring-yellow-500" /> <span className="ml-2 text-slate-700">Erkek</span></label>
                            <label className="inline-flex items-center"><input type="radio" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleChange} className="form-radio text-yellow-500 focus:ring-yellow-500" /> <span className="ml-2 text-slate-700">Kadın</span></label>
                            <label className="inline-flex items-center"><input type="radio" name="gender" value="other" checked={formData.gender === 'other'} onChange={handleChange} className="form-radio text-yellow-500 focus:ring-yellow-500" /> <span className="ml-2 text-slate-700">Diğer</span></label>
                        </div>
                    </div>
                </fieldset>

                {/* Hair Loss Info */}
                <fieldset>
                     <div>
                        <label htmlFor="hairLossLevel" className="block text-sm font-medium text-slate-700">Saç Dökülme Seviyeniz (Norwood/Ludwig Skalası)</label>
                        <select name="hairLossLevel" id="hairLossLevel" value={formData.hairLossLevel} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500">
                           {hairLossLevels.map(level => <option key={level.value} value={level.value}>{level.label}</option>)}
                        </select>
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-slate-700">Daha önce saç ekimi operasyonu geçirdiniz mi?</label>
                        <div className="mt-2 flex space-x-4">
                            <label className="inline-flex items-center"><input type="radio" name="previousOperation" value="no" checked={formData.previousOperation === 'no'} onChange={handleChange} className="form-radio text-yellow-500 focus:ring-yellow-500" /> <span className="ml-2 text-slate-700">Hayır</span></label>
                            <label className="inline-flex items-center"><input type="radio" name="previousOperation" value="yes" checked={formData.previousOperation === 'yes'} onChange={handleChange} className="form-radio text-yellow-500 focus:ring-yellow-500" /> <span className="ml-2 text-slate-700">Evet</span></label>
                        </div>
                    </div>
                </fieldset>

                {/* Goals */}
                <fieldset>
                    <label className="block text-sm font-medium text-slate-700">Tedaviden beklentileriniz ve hedefleriniz nelerdir?</label>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {goalsOptions.map(goal => (
                            <label key={goal} className="flex items-center p-2 border border-slate-200 rounded-md hover:bg-yellow-50 cursor-pointer">
                                <input type="checkbox" value={goal} onChange={handleCheckboxChange} className="form-checkbox text-yellow-500 focus:ring-yellow-500 h-5 w-5 rounded" />
                                <span className="ml-3 text-slate-700">{goal}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                 {/* Photo Upload */}
                 <fieldset>
                    <label className="block text-sm font-medium text-slate-700">Fotoğraf Yükleme (Opsiyonel)</label>
                    <p className="text-xs text-slate-500 mb-2">Daha doğru bir analiz için saçınızın farklı açılardan çekilmiş fotoğraflarını yükleyebilirsiniz.</p>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                             {photoPreview ? (
                                <img src={photoPreview} alt="Önizleme" className="mx-auto h-24 w-24 object-cover rounded-md"/>
                            ) : (
                                <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                            <div className="flex text-sm text-slate-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-yellow-600 hover:text-yellow-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-yellow-500">
                                    <span>Dosya seçin</span>
                                    <input id="file-upload" name="file-upload" type="file" ref={fileInputRef} className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
                                </label>
                                <p className="pl-1">veya sürükleyip bırakın</p>
                            </div>
                            <p className="text-xs text-slate-500">PNG, JPG, WEBP (Maks. 4MB)</p>
                        </div>
                    </div>
                </fieldset>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div className="pt-4">
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-bold text-slate-900 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 disabled:from-slate-400 disabled:cursor-not-allowed">
                         {isLoading ? <LoadingSpinner /> : 'Analizi Başlat'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ConsultationForm;
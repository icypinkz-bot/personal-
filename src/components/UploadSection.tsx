import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Camera, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UploadSectionProps {
  onImageSelect: (base64: string) => void;
  isLoading: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onImageSelect, isLoading }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onImageSelect(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <section className="w-full p-6">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative group h-full"
          >
            <div
              onClick={() => fileInputRef.current?.click()}
              className="bg-surface border-2 border-dashed border-white/5 rounded-3xl p-16 flex flex-col items-center justify-center gap-6 cursor-pointer transition-all hover:border-accent-start hover:bg-white/[0.02]"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg border border-white/5">
                <Upload className="w-10 h-10 text-accent-end" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-medium serif text-white italic">Drop your photo here</p>
                <p className="text-sm text-gray-500 mt-2 uppercase tracking-widest">AI Mirror 분석을 위해 선명한 정면 사진을 업로드하세요</p>
              </div>
              <div className="flex gap-4 mt-6">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-white/5 border border-white/5 px-4 py-1.5 rounded-full">
                  <Camera className="w-3 h-3" />
                  Neutral Lighting
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-white/5 border border-white/5 px-4 py-1.5 rounded-full">
                  <ImageIcon className="w-3 h-3" />
                  No Filters
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-3xl overflow-hidden shadow-2xl bg-surface border border-white/10 p-2"
          >
            <div className="relative aspect-square md:aspect-video rounded-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/60 to-transparent z-10" />
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute bottom-6 left-6 z-20">
                <div className="flex items-center gap-2 bg-accent-start/20 border border-accent-start/30 rounded-full px-3 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-end animate-pulse" />
                  <span className="text-[10px] font-bold text-accent-end uppercase tracking-widest">Image Ready for Scan</span>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 flex gap-3">
              <button
                disabled={isLoading}
                onClick={clearPreview}
                className="flex-1 py-3 px-6 rounded-xl border border-white/5 text-gray-400 font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                다시 선택
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </section>
  );
};

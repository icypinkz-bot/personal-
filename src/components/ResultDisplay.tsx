import React from 'react';
import { PersonalColorResponse } from '../types';
import { motion } from 'motion/react';
import { CheckCircle2, AlertTriangle, MessageSquare, Sparkles, Palette, Scissors, ShoppingBag, Heart } from 'lucide-react';

interface ResultDisplayProps {
  data: PersonalColorResponse;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ data }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.98, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  const attributeBar = (label: string, value: string) => {
    // Determine a width percentage based on descriptive values common in personal color analysis
    let width = "50%";
    const lowerVal = value.toLowerCase();
    if (lowerVal.includes("low")) width = "25%";
    if (lowerVal.includes("mid")) width = "50%";
    if (lowerVal.includes("high")) width = "85%";
    if (lowerVal.includes("strong") || lowerVal.includes("high")) width = "90%";
    if (lowerVal.includes("gentle") || lowerVal.includes("soft")) width = "30%";

    return (
      <div className="space-y-2">
        <div className="flex justify-between text-[11px] uppercase tracking-wider">
          <span className="text-white opacity-80">{label}</span>
          <span className="text-gray-500">{value}</span>
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-accent-start to-accent-end shadow-[0_0_8px_rgba(155,137,179,0.5)]"
          />
        </div>
      </div>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-12 gap-8"
    >
      {/* Left Column: Season & Summary */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <motion.div variants={itemVariants} className="immersive-card flex flex-col gap-6 !p-0 overflow-hidden relative group aspect-[3/4]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-dark/20 to-bg-dark z-10" />
          <div className="flex-1 bg-surface flex items-center justify-center p-12">
             <div className="text-center z-20 space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-block px-4 py-1 bg-accent-start/20 border border-accent-start/30 rounded-full mb-2"
                >
                  <span className="text-accent-end text-[10px] font-bold uppercase tracking-widest">Analysis Result v2.4</span>
                </motion.div>
                <h2 className="text-6xl font-serif font-medium text-white italic">{data.season_type}</h2>
                <div className="space-y-1">
                  <p className="text-xl text-gray-400 font-light">{data.sub_type}</p>
                  <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em] font-bold">{data.tone_direction} Tone Strategy</p>
                </div>
             </div>
          </div>
          <div className="absolute bottom-10 left-0 right-0 px-8 z-20 text-center opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="text-[10px] text-accent-end uppercase tracking-widest font-bold">Iris Bio-Mapping Scan Complete</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="immersive-card">
          <p className="immersive-label">Summary Result</p>
          <p className="text-sm leading-relaxed text-[#D1D1D6] serif italic font-light text-lg">
            {data.summary}
          </p>
        </motion.div>
      </div>

      {/* Center Column: Attributes Analysis */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <motion.div variants={itemVariants} className="immersive-card flex-1">
          <p className="immersive-label">Attributes Analysis</p>
          <div className="space-y-8 mt-6">
            {attributeBar("Brightness (명도)", data.analysis.brightness)}
            {attributeBar("Saturation (채도)", data.analysis.saturation)}
            {attributeBar("Contrast (대비감)", data.analysis.contrast)}
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Skin Tone</p>
              <p className="text-sm text-white mt-1 font-medium">{data.analysis.skin_tone}</p>
            </div>
            <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Confidence Score</p>
              <p className="text-sm text-accent-end mt-1 font-medium font-mono">{Math.round(data.confidence * 100)}% Match</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-br from-accent-start/10 to-transparent border border-accent-start/20 rounded-2xl">
            <h4 className="text-xs font-bold text-accent-end uppercase tracking-widest mb-3 flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              Consultant Tip
            </h4>
            <p className="text-[12px] leading-relaxed text-gray-300">
              {data.style_tip}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Recommendations */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        <motion.div variants={itemVariants} className="immersive-card">
          <p className="immersive-label">Personal Palette</p>
          <div className="grid grid-cols-4 gap-3 mb-8">
            {data.recommended_colors.map((color, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.1, rotate: 2 }}
                className="h-14 rounded-xl shadow-lg cursor-help relative group"
                style={{ backgroundColor: color.hex }}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl" />
                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-bg-dark text-[10px] font-bold py-1 px-3 rounded whitespace-nowrap z-50 pointer-events-none">
                  {color.name}
                </div>
              </motion.div>
            ))}
          </div>
          
          <p className="immersive-label !text-rose-500/70">Colors to Avoid</p>
          <div className="grid grid-cols-5 gap-2">
            {data.avoid_colors.map((color, idx) => (
              <div 
                key={idx} 
                className="h-8 rounded-md opacity-40 grayscale-[0.3] border border-white/5" 
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="immersive-card flex-1">
          <p className="immersive-label">Visual Guide</p>
          <div className="space-y-6">
            <div className="flex items-center space-x-5">
              <div className="w-12 h-12 rounded-full border-2 border-white/10 shadow-lg bg-surface flex items-center justify-center">
                <Heart className="w-5 h-5 text-accent-end" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Recommended Lip</p>
                <p className="text-sm text-white font-medium">{data.makeup_recommendations.lip.join(' / ')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-5">
              <div className="w-12 h-12 rounded-full border-2 border-white/10 shadow-lg bg-surface flex items-center justify-center">
                <Scissors className="w-5 h-5 text-accent-end" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Recommended Hair</p>
                <p className="text-sm text-white font-medium">{data.hair_recommendations.join(' / ')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-5">
              <div className="w-12 h-12 rounded-full border-2 border-white/10 shadow-lg bg-surface flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-accent-end" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Fashion Strategy</p>
                <p className="text-sm text-white font-medium italic">{data.fashion_recommendations[0]}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-10">
            <button className="w-full py-4 bg-white text-bg-dark font-bold text-[10px] tracking-widest uppercase rounded-2xl hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Full Digital Persona Ready
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

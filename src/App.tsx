/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { UploadSection } from './components/UploadSection';
import { ResultDisplay } from './components/ResultDisplay';
import { PersonalColorResponse } from './types';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<PersonalColorResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (base64: string) => {
    setSelectedImage(base64);
    setResult(null);
    setError(null);
  };

  const analyzeColor = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: selectedImage }),
      });

      if (!response.ok) {
        throw new Error('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-bg-dark text-[#E0E0E6] flex flex-col selection:bg-accent-end selection:text-bg-dark">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-dark/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent-start to-accent-end flex items-center justify-center shadow-[0_0_20px_rgba(155,137,179,0.4)]">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase">Iris AI Mirror</h1>
            <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">Advanced Color Consultant v2.4</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:block bg-[#1C1C22] border border-white/5 px-4 py-2 rounded-full">
            <span className="text-[11px] text-gray-400 italic">"사진 기반 분석은 참고용으로만 활용하세요."</span>
          </div>
          {result && (
            <button
              onClick={resetAnalysis}
              className="group flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-white transition-colors"
            >
              <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
              새로운 분석
            </button>
          )}
        </div>
      </nav>

      <main className="flex-1 pt-32 pb-20 px-6 overflow-x-hidden">
        <div className="max-w-7xl mx-auto h-full">
          {!result && (
            <section className="text-center mb-16 space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-accent-end mb-2"
              >
                <Sparkles className="w-3 h-3" />
                Next-Gen AI Analysis
              </motion.div>
              <h1 className="text-5xl md:text-8xl font-light serif leading-[1.1] tracking-tight text-white">
                빛을 통해 발견하는<br />
                <span className="italic text-accent-end">당신의 고유한 색채</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-xl mx-auto font-light leading-relaxed">
                정교한 이미지 매핑 기술과 데이터 분석을 통해 당신의 퍼스널 컬러를 실시간으로 진단합니다.
              </p>
            </section>
          )}

          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="upload-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="space-y-12"
              >
                <div className="max-w-3xl mx-auto">
                  <UploadSection onImageSelect={handleImageSelect} isLoading={isLoading} />
                </div>
                
                {selectedImage && !isLoading && (
                  <div className="flex justify-center">
                    <button
                      onClick={analyzeColor}
                      className="group relative px-12 py-5 bg-gradient-to-r from-accent-start to-accent-end text-bg-dark rounded-2xl font-bold tracking-[0.15em] uppercase overflow-hidden shadow-[0_0_40px_rgba(155,137,179,0.3)] hover:scale-105 transition-all"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        분석 시작하기
                        <Sparkles className="w-5 h-5" />
                      </span>
                    </button>
                  </div>
                )}

                {isLoading && (
                  <div className="flex flex-col items-center gap-8 py-20">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full border-t-2 border-accent-end animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                          <Sparkles className="w-8 h-8 text-accent-end animate-pulse" />
                        </div>
                      </div>
                    </div>
                    <div className="text-center space-y-3">
                      <p className="text-2xl serif italic text-white animate-pulse">Scanning Bio-Attributes...</p>
                      <p className="text-sm text-gray-500 uppercase tracking-widest">피부톤 및 명/채도 분석 중</p>
                    </div>
                  </div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm text-center font-medium"
                  >
                    {error}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="result-view"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <ResultDisplay data={result} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="mt-auto py-12 border-t border-white/5 flex justify-between items-center px-12 text-[10px] text-gray-600">
        <div className="flex space-x-6 uppercase tracking-widest">
          <span>AI-Mirror Mapping Active</span>
          <span>Studio Daylight Simulated</span>
        </div>
        <p className="uppercase tracking-[0.4em] font-bold">
          © 2024 IRIS IMAGE LABS. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}


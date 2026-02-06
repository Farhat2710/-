
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Mic, MicOff, Volume2, VolumeX, Info, ChevronRight } from 'lucide-react';
import MascotAvatar from './components/MascotAvatar';
import ChatInterface from './components/ChatInterface';
import { mascotAI } from './services/geminiService';
import { STUDIOS, getIcon } from './constants';
import { Message, StudioType } from './types';

// Utility functions for audio decoding
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Привет! Я Креатик — твой проводник в мир творчества Мурманска. О какой студии хочешь узнать?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [activeStudio, setActiveStudio] = useState<StudioType | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  const playSpeech = async (text: string) => {
    if (!isSoundEnabled) return;

    const ctx = initAudio();
    const base64Audio = await mascotAI.generateSpeech(text);
    
    if (base64Audio) {
      if (currentSourceRef.current) {
        currentSourceRef.current.stop();
      }

      const audioBuffer = await decodeAudioData(
        decodeBase64(base64Audio),
        ctx,
        24000,
        1
      );

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      source.onended = () => {
        setIsSpeaking(false);
        currentSourceRef.current = null;
      };

      setIsSpeaking(true);
      currentSourceRef.current = source;
      source.start();
    }
  };

  const handleSendMessage = useCallback(async (text: string) => {
    setMessages(prev => [...prev, { role: 'user', text }]);
    setIsLoading(true);

    const responseText = await mascotAI.sendMessage(text);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);

    // Trigger TTS
    playSpeech(responseText);
  }, [isSoundEnabled]);

  const handleStudioSelect = (studio: typeof STUDIOS[0]) => {
    setActiveStudio(studio.type);
    handleSendMessage(`Расскажи подробнее про направление "${studio.type}"`);
  };

  const toggleSound = () => {
    if (isSoundEnabled && currentSourceRef.current) {
      currentSourceRef.current.stop();
      setIsSpeaking(false);
    }
    setIsSoundEnabled(!isSoundEnabled);
    // Init audio context on first user interaction with the toggle if needed
    initAudio();
  };

  return (
    <div className="min-h-screen aurora-bg flex flex-col p-4 md:p-8">
      <div className="aurora-glow top-[-200px] left-[-200px]"></div>
      <div className="aurora-glow bottom-[-200px] right-[-200px] opacity-40"></div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center mb-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-600/20">
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white uppercase">Школа Креативных Индустрий</h1>
            <p className="text-xs text-orange-500 font-medium tracking-widest uppercase">Мурманск • AI Mascot</p>
          </div>
        </div>
        
        <div className="hidden md:flex gap-4">
          <button 
            onClick={toggleSound}
            className={`px-4 py-2 border rounded-full flex items-center gap-2 text-xs font-semibold transition-all ${
              isSoundEnabled 
              ? 'bg-orange-600/20 border-orange-500 text-orange-500' 
              : 'bg-white/5 border-white/10 text-zinc-400'
            }`}
          >
            {isSoundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
            ГОЛОС: {isSoundEnabled ? 'ВКЛ' : 'ВЫКЛ'}
          </button>
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2 text-xs font-semibold text-zinc-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            КРЕАТИК ОНЛАЙН
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto w-full">
        
        {/* Left Column: Mascot & Studios */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Mascot Section */}
          <div className="relative flex flex-col md:flex-row items-center gap-8 bg-zinc-900/40 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
            <div className="w-48 md:w-64 shrink-0">
              <MascotAvatar 
                isSpeaking={isSpeaking} 
                onClick={() => handleSendMessage("Привет, Креатик! Как дела?")}
              />
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Привет! <span className="text-orange-500">Я Креатик.</span>
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed">
                Я помогаю ребятам в Мурманске превращать фантазии в реальные проекты. VR, музыка, дизайн — я разбираюсь во всем!
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <button 
                  onClick={() => handleSendMessage("Чем вы занимаетесь в ШКИ?")}
                  className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-600/20 flex items-center gap-2"
                >
                  <Info size={18} />
                  Что такое ШКИ?
                </button>
                <button 
                  onClick={toggleSound}
                  className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                    isSoundEnabled 
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                    : 'bg-white/5 border border-white/10 text-zinc-400'
                  }`}
                >
                  {isSoundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  Голос
                </button>
              </div>
            </div>
          </div>

          {/* Studios Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {STUDIOS.map((studio) => {
              const Icon = getIcon(studio.icon);
              const isActive = activeStudio === studio.type;
              return (
                <button
                  key={studio.type}
                  onClick={() => handleStudioSelect(studio)}
                  className={`group relative p-4 rounded-2xl border transition-all text-left flex flex-col gap-3 ${
                    isActive 
                      ? 'bg-orange-600/20 border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.1)]' 
                      : 'bg-zinc-900/50 border-white/10 hover:border-orange-500/50 hover:bg-zinc-800/50'
                  }`}
                >
                  <div 
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isActive ? 'bg-orange-600' : 'bg-zinc-800 group-hover:bg-orange-600/20'
                    }`}
                  >
                    <Icon size={20} className={isActive ? 'text-white' : 'text-orange-500'} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white leading-tight mb-1">{studio.type}</span>
                    <ChevronRight size={14} className={`transition-transform ${isActive ? 'translate-x-1 text-orange-500' : 'text-zinc-600'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Chat Interface */}
        <div className="lg:col-span-5 h-[600px] lg:h-auto">
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-8 py-6 border-t border-white/5 max-w-7xl mx-auto w-full text-center">
        <p className="text-zinc-500 text-sm">
          &copy; 2024 Школа Креативных Индустрий Мурманск • Создано с помощью Креатика и ИИ
        </p>
      </footer>
    </div>
  );
};

export default App;

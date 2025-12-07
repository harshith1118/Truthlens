import React, { useState, useRef } from 'react';
import { analyzeMisinformation } from './services/geminiService';
import { FullAnalysisResponse } from './types';
import { CredibilityMeter } from './components/CredibilityMeter';
import { FallacyCard } from './components/FallacyCard';
import { Modal } from './components/Modal';
import { 
  Search, 
  ShieldCheck, 
  AlertOctagon, 
  BookOpen, 
  ExternalLink, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  Info,
  BrainCircuit,
  Globe,
  FileSearch,
  Users,
  Upload,
  Image as ImageIcon,
  Type,
  Trash2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [inputText, setInputText] = useState('');
  
  // File State
  const [selectedFile, setSelectedFile] = useState<{data: string, mimeType: string} | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<FullAnalysisResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeModal, setActiveModal] = useState<'none' | 'how-it-works' | 'resources'>('none');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewUrl(result);
        const base64Data = result.split(',')[1];
        setSelectedFile({
          data: base64Data,
          mimeType: file.type
        });
        setActiveTab('image');
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInputText(text);
        setActiveTab('text');
      };
      reader.readAsText(file);
    } else {
      setErrorMsg("Unsupported file type. Please upload an image or text file.");
      setStatus('error');
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'text' && !inputText.trim()) return;
    if (activeTab === 'image' && !selectedFile) return;

    setStatus('loading');
    setResult(null);
    setErrorMsg('');

    try {
      const imageToSend = activeTab === 'image' ? selectedFile || undefined : undefined;
      const textToSend = inputText;
      const data = await analyzeMisinformation(textToSend, imageToSend);
      setResult(data);
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMsg(err.message || 'An error occurred while analyzing content.');
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const resetAll = () => {
    setInputText(''); 
    setResult(null); 
    setStatus('idle');
    clearFile();
  };

  return (
    <div className="font-sans selection:bg-blue-200 text-slate-800">
      
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200/50 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={resetAll}>
            <div className="bg-gradient-to-tr from-blue-600 to-violet-600 p-2 rounded-lg shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              TruthLens
            </span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
            <button 
              onClick={() => setActiveModal('how-it-works')} 
              className="hover:text-blue-600 transition-colors flex items-center gap-1 group"
            >
              How it works
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </button>
            <button 
              onClick={() => setActiveModal('resources')} 
              className="hover:text-blue-600 transition-colors flex items-center gap-1 group"
            >
              Resources
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-6 shadow-sm">
            <Sparkles size={12} /> Powered by Gemini 3
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            Verify content in <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 bg-[length:200%_auto] animate-shimmer">
              the Blink of an AI.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Harness the power of <strong>Gemini 3</strong> and Google Search to detect misinformation, check facts, and spot logical fallacies instantly.
          </p>
        </div>

        {/* Input Area */}
        <div className="max-w-3xl mx-auto mb-20 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleAnalyze} className="relative group">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            
            <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-200/50 border border-white overflow-hidden ring-1 ring-slate-900/5">
              
              {/* Tabs */}
              <div className="flex border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('text')}
                  className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all relative ${
                    activeTab === 'text' 
                      ? 'text-blue-600 bg-blue-50/50' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Type size={18} /> Text Analysis
                  {activeTab === 'text' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 mx-10 rounded-t-full"></div>}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('image')}
                  className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all relative ${
                    activeTab === 'image' 
                      ? 'text-blue-600 bg-blue-50/50' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <ImageIcon size={18} /> Image / Screenshot
                  {activeTab === 'image' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 mx-10 rounded-t-full"></div>}
                </button>
              </div>

              <div className="p-1">
                {/* Text Mode */}
                {activeTab === 'text' && (
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste a link (YouTube/News) or text here to verify..."
                    className="w-full p-6 resize-none bg-transparent outline-none text-slate-700 placeholder:text-slate-400 min-h-[160px] text-lg leading-relaxed font-medium"
                    maxLength={3000}
                  />
                )}

                {/* Image Mode */}
                {activeTab === 'image' && (
                  <div className="p-4">
                    {!previewUrl ? (
                      <div 
                        onClick={triggerFileUpload}
                        className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all min-h-[160px] group/upload"
                      >
                        <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover/upload:scale-110 transition-transform">
                           <Upload className="w-6 h-6 text-blue-500" />
                        </div>
                        <p className="text-base font-semibold text-slate-700">Click to upload text or image</p>
                        <p className="text-sm text-slate-400 mt-1">Supports JPG, PNG, WEBP, TXT</p>
                      </div>
                    ) : (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900/5 aspect-video flex items-center justify-center group/preview">
                         <img src={previewUrl} alt="Preview" className="max-h-[220px] w-auto object-contain shadow-md rounded-lg" />
                         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                           <button 
                             type="button"
                             onClick={clearFile}
                             className="px-4 py-2 bg-white text-red-600 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                           >
                             <Trash2 size={16} /> Remove
                           </button>
                         </div>
                      </div>
                    )}
                    
                    <input 
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Optional: Add context or a specific question about this image..."
                      className="w-full mt-4 p-4 text-sm bg-slate-50 rounded-lg border border-transparent focus:bg-white focus:border-blue-200 focus:ring-2 focus:ring-blue-100 outline-none text-slate-700 transition-all"
                    />
                  </div>
                )}

                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*, text/plain" className="hidden" />

                <div className="flex justify-between items-center px-6 py-4 bg-slate-50/50 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                     {activeTab === 'text' && `${inputText.length}/3000 chars`}
                     {activeTab === 'image' && selectedFile && <span className="text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full"><CheckCircle2 size={12}/> Ready to analyze</span>}
                  </span>
                  <button
                    type="submit"
                    disabled={status === 'loading' || (activeTab === 'text' && !inputText.trim()) || (activeTab === 'image' && !selectedFile)}
                    className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:shadow-blue-600/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" /> Analyzing...
                      </>
                    ) : (
                      <>
                        Check Credibility <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Quick Switch Button */}
            {activeTab === 'text' && inputText.length === 0 && (
              <div className="absolute -right-20 top-0 hidden xl:flex flex-col gap-2">
                <div className="text-xs text-slate-400 font-medium text-center mb-1 rotate-12">Or upload</div>
                 <button 
                   type="button"
                   onClick={() => setActiveTab('image')}
                   className="p-4 bg-white shadow-xl shadow-slate-200/60 border border-white rounded-2xl text-slate-400 hover:text-blue-600 hover:scale-110 transition-all group"
                   title="Switch to Image Upload"
                 >
                   <ImageIcon size={24} className="group-hover:stroke-blue-600" />
                 </button>
              </div>
            )}
          </form>
        </div>

        {/* Error State */}
        {status === 'error' && (
          <div className="max-w-2xl mx-auto mb-10 p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4 text-red-800 shadow-sm animate-fadeIn">
            <div className="p-2 bg-red-100 rounded-full shrink-0">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold mb-1">Analysis Failed</h3>
              <p className="opacity-90">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {status === 'success' && result && result.analysis && (
          <div className="animate-fadeIn space-y-8">
            
            {/* Top Row: Score & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Score Card */}
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 flex flex-col items-center justify-center md:col-span-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                <CredibilityMeter score={result.analysis.trustScore} />
              </div>

              {/* Summary Card */}
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:col-span-8 flex flex-col justify-center relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide border ${
                    result.analysis.trustScore > 70 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : result.analysis.trustScore > 40 
                        ? 'bg-amber-50 text-amber-700 border-amber-100' 
                        : 'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    {result.analysis.verdict}
                  </div>
                  <span className="text-slate-400 text-sm font-medium">Analysis by Gemini 3</span>
                </div>
                
                <p className="text-slate-700 leading-relaxed text-lg font-medium">
                  {result.analysis.summary}
                </p>
                
                {/* Quick Indicators */}
                <div className="mt-8 flex flex-wrap gap-3">
                  {result.analysis.positiveIndicators.slice(0, 3).map((ind, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50/80 text-emerald-700 text-sm font-semibold rounded-lg border border-emerald-100/50">
                      <CheckCircle2 className="w-4 h-4" /> {ind}
                    </span>
                  ))}
                  {result.analysis.negativeIndicators.slice(0, 3).map((ind, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50/80 text-red-700 text-sm font-semibold rounded-lg border border-red-100/50">
                      <XCircle className="w-4 h-4" /> {ind}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Second Row: Fallacies & Education */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Fallacies Column */}
              <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 bg-orange-100 rounded-xl text-orange-600">
                    <AlertOctagon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Detected Manipulation</h3>
                </div>
                
                <div className="space-y-4">
                  {result.analysis.manipulationTechniques.length > 0 ? (
                    result.analysis.manipulationTechniques.map((fallacy, idx) => (
                      <FallacyCard key={idx} fallacy={fallacy} />
                    ))
                  ) : (
                    <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-emerald-400 opacity-50" />
                      <p className="font-medium">No significant logical fallacies detected.</p>
                      <p className="text-sm mt-1">The content appears to be logically consistent.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Education & Sources Column */}
              <div className="space-y-8">
                
                {/* Educational Insight */}
                <div className="relative bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-8 border border-blue-100 overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
                  
                  <div className="flex items-center gap-3 mb-4 text-blue-900 relative z-10">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                       <BookOpen className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg">Media Literacy Insight</h3>
                  </div>
                  <p className="text-slate-700 leading-relaxed italic relative z-10 text-lg">
                    "{result.analysis.educationalInsight}"
                  </p>
                </div>

                {/* Grounding Sources */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-blue-100 rounded-xl text-blue-600">
                      <Search className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Grounding Sources</h3>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Verified by Google Search</p>
                    </div>
                  </div>
                  
                  {result.sources.length > 0 ? (
                    <ul className="space-y-3">
                      {result.sources.map((source, idx) => (
                        <li key={idx}>
                          <a 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group block p-4 rounded-xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md hover:shadow-blue-100/50 transition-all duration-300"
                          >
                            <div className="flex items-start justify-between">
                              <span className="text-base font-semibold text-slate-800 group-hover:text-blue-600 line-clamp-2 transition-colors">
                                {source.title}
                              </span>
                              <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-400 flex-shrink-0 ml-3 mt-1" />
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Globe size={12} className="text-slate-400" />
                              <span className="text-xs text-slate-500 font-medium truncate max-w-[200px]">
                                {new URL(source.uri).hostname}
                              </span>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl text-center">
                      <Info className="w-8 h-8 text-slate-300 mb-2" />
                      <p className="text-slate-500 font-medium">No specific sources found.</p>
                      <p className="text-sm text-slate-400">The AI analyzed the text's logic, but couldn't link it to specific external articles.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
            
          </div>
        )}
      </main>
      
      {/* Modals */}
      <Modal 
        isOpen={activeModal === 'how-it-works'} 
        onClose={() => setActiveModal('none')}
        title="Inside TruthLens"
      >
        <div className="space-y-8 text-slate-600">
          <p className="text-lg leading-relaxed text-slate-700">
            TruthLens combines the reasoning power of Gemini 3 with the real-time knowledge of Google Search to provide a comprehensive credibility assessment.
          </p>
          
          <div className="grid gap-6">
            <div className="flex gap-5 items-start">
              <div className="flex-shrink-0 p-4 bg-blue-50 rounded-2xl text-blue-600 shadow-sm border border-blue-100">
                <BrainCircuit size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">1. Gemini 3 Analysis</h3>
                <p className="mt-2 text-slate-600 leading-relaxed">
                  We send your content to the <strong>Gemini 3 model</strong>. It acts as a linguistic expert, identifying emotional manipulation, logical fallacies (like strawman arguments), and bias patterns in milliseconds.
                </p>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="flex-shrink-0 p-4 bg-emerald-50 rounded-2xl text-emerald-600 shadow-sm border border-emerald-100">
                <Globe size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">2. Google Search Grounding</h3>
                <p className="mt-2 text-slate-600 leading-relaxed">
                  To prevent "hallucinations," the model triggers a live <strong>Google Search</strong>. It cross-references claims in your text against trusted sources on the web to verify specific facts.
                </p>
              </div>
            </div>

            <div className="flex gap-5 items-start">
              <div className="flex-shrink-0 p-4 bg-amber-50 rounded-2xl text-amber-600 shadow-sm border border-amber-100">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">3. Trust Scoring & Education</h3>
                <p className="mt-2 text-slate-600 leading-relaxed">
                  We synthesize this data into a 0-100 score and provide a "Media Literacy Insight" to help you understand <em>why</em> the content might be misleading, educating you for the future.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={activeModal === 'resources'} 
        onClose={() => setActiveModal('none')}
        title="Media Literacy Resources"
      >
        <div className="space-y-6 text-slate-600">
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2 text-lg">
              <FileSearch size={20} /> The "S.I.F.T." Method
            </h3>
            <p className="text-slate-700 mb-3">
              When you encounter a claim, don't just read it. Use the SIFT method:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
                <li><strong>S</strong>top.</li>
                <li><strong>I</strong>nvestigate the source.</li>
                <li><strong>F</strong>ind better coverage.</li>
                <li><strong>T</strong>race claims to the original context.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-lg">
              <Users size={20} /> Trusted Fact-Checking Organizations
            </h3>
            <div className="grid gap-3">
              <a href="https://www.snopes.com" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group">
                <span className="font-semibold text-slate-700 group-hover:text-blue-700">Snopes</span>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-blue-500" />
              </a>
              <a href="https://www.politifact.com" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group">
                <span className="font-semibold text-slate-700 group-hover:text-blue-700">PolitiFact</span>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-blue-500" />
              </a>
              <a href="https://www.reuters.com/fact-check" target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group">
                <span className="font-semibold text-slate-700 group-hover:text-blue-700">Reuters Fact Check</span>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-blue-500" />
              </a>
            </div>
          </div>
        </div>
      </Modal>

      {/* Footer */}
      <footer className="mt-20 py-10 border-t border-slate-200/60 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-900 font-semibold mb-2">TruthLens</p>
          <p className="text-slate-500 text-sm mb-4">Powered by <strong>Gemini 3</strong> & Google Search Grounding</p>
          <p className="text-slate-400 text-xs">© {new Date().getFullYear()} TruthLens. A tool for digital literacy.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
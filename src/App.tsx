import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, TrendingUp, Upload, ShieldCheck, ArrowRight, X, Loader2, CheckCircle2, MessageSquare, Send, Bot, Trash2, Moon, Sun, Edit3, Bold, Italic, Strikethrough, List, ListOrdered, Menu, Settings, Download } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

type View = 'engine' | 'resumes' | 'insights' | 'about';

const Navbar = ({ currentView, setView, isDark, toggleDark, onUpgrade }: { currentView: View, setView: (v: View) => void, isDark: boolean, toggleDark: () => void, onUpgrade: () => void }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-background border-b border-stone h-20 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4 md:gap-10">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-surface-dim transition-colors cursor-pointer border border-transparent hover:border-stone rounded-full"
            >
              <Menu size={20} className="text-onyx" />
            </button>

            <button 
              onClick={() => setView('engine')}
              className="flex items-center gap-3 cursor-pointer p-0 bg-transparent border-none outline-none"
            >
              <div className="w-8 h-8 bg-onyx flex items-center justify-center">
                <div className="w-4 h-4 border border-background"></div>
              </div>
              <span className="hidden sm:inline text-xl font-bold tracking-tighter text-onyx">CAREERLENS</span>
            </button>
            
            <nav className="hidden md:flex items-center gap-8 px-8 border-l border-stone">
              {[
                { id: 'engine', label: 'Engine' },
                { id: 'resumes', label: 'Resumes' },
                { id: 'insights', label: 'Insights' },
                { id: 'about', label: 'About' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id as View)}
                  className={`label-caps hover:text-onyx transition-colors cursor-pointer bg-transparent border-none outline-none relative ${currentView === item.id ? 'text-onyx' : ''}`}
                >
                  {item.label}
                  {currentView === item.id && (
                    <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-onyx" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <button 
              onClick={toggleDark}
              className="p-2 hover:bg-surface-dim transition-colors cursor-pointer border border-transparent hover:border-stone rounded-full"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={18} className="text-onyx" /> : <Moon size={18} className="text-onyx" />}
            </button>
            <div className="hidden lg:block text-right border-r border-stone pr-8 py-1">
              <div className="label-caps !text-[8px] leading-none mb-1">Engine Status</div>
              <div className="text-xs font-mono font-medium">V2.0-STABLE</div>
            </div>
            <button onClick={onUpgrade} className="hidden sm:flex px-6 py-3 bg-onyx text-background label-caps !text-on-primary hover:bg-onyx/90 transition-all items-center gap-2 cursor-pointer border-none outline-none">
              Upgrade
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed inset-0 z-[60] bg-background border-r border-stone flex flex-col md:hidden"
          >
            <div className="h-20 border-b border-stone flex flex-row items-center px-4 justify-between shrink-0">
              <button 
                onClick={() => { setView('engine'); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-3 cursor-pointer p-0 bg-transparent border-none outline-none"
              >
                <div className="w-8 h-8 bg-onyx flex items-center justify-center">
                  <div className="w-4 h-4 border border-background"></div>
                </div>
                <span className="text-xl font-bold tracking-tighter text-onyx">CAREERLENS</span>
              </button>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-surface-dim transition-colors cursor-pointer rounded-full text-slate-gray hover:text-onyx">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col p-8 gap-8 overflow-y-auto">
              {[
                { id: 'engine', label: 'Engine' },
                { id: 'resumes', label: 'Resumes' },
                { id: 'insights', label: 'Insights' },
                { id: 'about', label: 'About' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id as View);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-2xl font-light text-left tracking-tight border-b border-stone pb-4 ${currentView === item.id ? 'text-onyx border-onyx' : 'text-slate-gray'}`}
                >
                  {item.label}
                </button>
              ))}
              <div className="mt-8">
                <button onClick={() => { onUpgrade(); setIsMobileMenuOpen(false); }} className="w-full flex justify-center px-6 py-4 bg-onyx text-background label-caps !text-on-primary hover:bg-onyx/90 transition-all items-center gap-2 cursor-pointer border-none outline-none">
                  Upgrade
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

interface AnalysisResult {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  extractedText?: string;
}

interface HistoryItem {
  id: string;
  fileName: string;
  date: string;
  result: AnalysisResult;
  content: string;
}

const Hero = ({ onAnalyze }: { onAnalyze: (file: File) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAnalyze(file);
    }
  };

  return (
    <section className="pt-32 md:pt-40 pb-16 md:pb-24 px-4 md:px-8 max-w-7xl mx-auto border-x border-stone grid grid-cols-12">
      <div className="col-span-12 lg:col-span-8 lg:pr-20">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="label-caps mb-8 flex items-center gap-3"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Precision Engine Active
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-8xl font-light tracking-tighter leading-[0.9] mb-12"
        >
          THE ART OF <br/>
          <span className="italic font-serif">PROFESSIONAL</span> <br/>
          PRECISION.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-gray max-w-lg leading-relaxed mb-12 border-l border-stone pl-8"
        >
          Clinical ATS optimization for the modern career landscape. Our AI decomposition protocols identify formatting liabilities and semantic opportunities with architectural accuracy.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row flex-wrap gap-2"
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileChange}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-onyx text-white py-4 md:py-5 px-6 md:px-10 label-caps flex items-center justify-center sm:justify-start gap-4 hover:pr-12 transition-all"
          >
            Initialize Analysis
            <ArrowRight size={14} />
          </button>
          <button className="bg-surface-dim py-4 md:py-5 px-6 md:px-10 label-caps hover:bg-stone transition-all text-center">
            View Methodology
          </button>
        </motion.div>
      </div>

      <div className="hidden lg:block col-span-4 border-l border-stone p-10 bg-surface-dim/30">
        <div className="label-caps mb-8">Metrics.01</div>
        <div className="space-y-12">
          <div>
            <div className="text-[10px] uppercase text-slate-gray mb-1">Extraction Rate</div>
            <div className="text-4xl font-light tracking-tight">99.8%</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-gray mb-1">ATS Latency</div>
            <div className="text-4xl font-light tracking-tight font-mono text-sm opacity-50">140ms / SCAN</div>
            <div className="text-4xl font-light tracking-tight">OPTIMIZED</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProcessSection = () => {
  const steps = [
    {
      id: "01",
      title: "DECONSTRUCT",
      desc: "Our engine parses document structures into raw semantic nodes, ensuring zero loss in structural integrity."
    },
    {
      id: "02",
      title: "ANALYZE",
      desc: "Scanning for keyword density and formatting vectors. Every line is evaluated against current industry indices."
    },
    {
      id: "03",
      title: "RECONSTRUCT",
      desc: "Targeted recomposition of phrasing and layout to amplify true professional impact while maintaining stylistic purity."
    }
  ];

  return (
    <section className="border-t border-stone">
      <div className="max-w-7xl mx-auto grid grid-cols-12 border-x border-stone">
        <div className="col-span-12 lg:col-span-3 p-8 border-b lg:border-b-0 lg:border-r border-stone">
          <div className="label-caps mb-8">Process Protocol</div>
          <h2 className="text-3xl font-light leading-tight mb-4">Three stages of clinical <span className="italic">refinement</span>.</h2>
        </div>
        
        <div className="col-span-12 lg:col-span-9 grid grid-cols-1 md:grid-cols-3">
          {steps.map((step, idx) => (
            <div key={idx} className={`p-8 group hover:bg-surface-dim transition-colors ${idx !== 2 ? 'border-b md:border-b-0 md:border-r border-stone' : ''}`}>
              <div className="flex justify-between items-start mb-12">
                <div className="w-10 h-10 border border-stone flex items-center justify-center text-xs font-mono font-bold">
                  {step.id}
                </div>
                <div className="label-caps opacity-0 group-hover:opacity-100 transition-opacity">Active</div>
              </div>
              <h3 className="label-caps !text-onyx mb-4 tracking-[0.4em]">{step.title}</h3>
              <p className="text-sm text-slate-gray leading-relaxed h-24">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TechnicalBanner = () => {
  return (
    <section className="border-y border-stone bg-surface-muted overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-12 min-h-[400px] border-x border-stone">
        <div className="col-span-12 md:col-span-8 relative">
          <div className="absolute inset-0 grid-pattern opacity-30"></div>
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="w-full h-full border border-stone-dark relative flex items-center justify-center bg-white/20 backdrop-blur-sm">
               <div className="absolute w-full h-[1px] bg-stone-dark top-1/2"></div>
               <div className="absolute h-full w-[1px] bg-stone-dark left-1/2"></div>
               <div className="z-10 bg-white p-6 border border-stone-dark shadow-sm">
                 <img
                    alt="AI Matrix"
                    className="w-48 h-64 object-cover filter grayscale sepia-[0.2] brightness-110"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiEXxGSPV7K882iwCE4vVcWTEVg0QTC1wL8zZnXa7J_qbDCkQPxPTmPsou5fK8hLI0U6zK11X6cozD30u3ft13afTNouI8bTEBTUZgdqFEQybl53PIP7gK7Il8aOss0ZTS4pIaurv52PhYBQZQvEfiya9dei7lCIYe-bKpdRldU7aVMqvMj8zTOBn5ZVD2ucVGHaCkCZfje10q2PUSE-IoQ4xLTygxdxPlLLS4ay7PG20EVPcOnzDx3XwThH4Pr6o_QijbO4TPTiKZ"
                  />
               </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 p-12 border-t md:border-t-0 md:border-l border-stone flex flex-col justify-between">
          <div>
            <div className="label-caps mb-6">Extraction View.09</div>
            <p className="text-xl font-light leading-snug">
              Every pixel is evaluated. Every character index is cross-referenced for <span className="italic">maximum resonance</span>.
            </p>
          </div>
          <div className="space-y-4">
             <div className="label-caps !text-[8px]">System Protocol</div>
             <div className="flex gap-2">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className="w-1.5 h-6 bg-onyx"></div>
               ))}
               {[1,2,3].map(i => (
                 <div key={i} className="w-1.5 h-6 bg-stone"></div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AnalysisOverlay = ({ 
  file, 
  onClose, 
  result, 
  isAnalyzing 
}: { 
  file: File | null; 
  onClose: () => void; 
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}) => {
  const downloadAnalysis = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analysis-${file?.name || 'resume'}.json`.replace(/\s+/g, '-');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!file) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-8 bg-background/95 backdrop-blur-sm"
    >
      <div className="w-full h-full md:h-auto md:max-w-4xl bg-white border border-stone shadow-none md:shadow-2xl overflow-hidden flex flex-col md:max-h-[90vh]">
        <div className="h-16 border-b border-stone flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 border border-onyx flex items-center justify-center text-[10px] font-bold">
              FL
            </div>
            <span className="label-caps !text-onyx">{file.name}</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-dim transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {isAnalyzing ? (
            <div className="h-full flex flex-col items-center justify-center gap-6 py-20">
              <Loader2 size={48} className="animate-spin text-onyx" />
              <div className="text-center">
                <div className="label-caps mb-2">Processing Semantic Nodes</div>
                <div className="text-xl font-light italic">Deconstructing professional identity...</div>
              </div>
            </div>
          ) : result ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              <div className="md:col-span-4 space-y-12">
                <div className="p-8 bg-surface-dim border border-stone flex flex-col items-center justify-center text-center">
                  <div className="label-caps mb-4">ATS Compatibility</div>
                  <div className="text-7xl font-light tracking-tighter mb-2">{result.score}%</div>
                  <div className="w-full h-1 bg-stone rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.score}%` }}
                      className="h-full bg-onyx"
                    />
                  </div>
                </div>

                <div className="p-4 bg-surface-dim border border-stone">
                  <div className="label-caps mb-4 text-center">Score Breakdown</div>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                        { subject: 'Impact', A: Math.min(100, result.score + 15), fullMark: 100 },
                        { subject: 'Brevity', A: Math.min(100, result.score + 5), fullMark: 100 },
                        { subject: 'Style', A: Math.max(0, result.score - 10), fullMark: 100 },
                        { subject: 'Skills', A: Math.min(100, result.score + 20), fullMark: 100 },
                        { subject: 'Keywords', A: result.score, fullMark: 100 },
                      ]}>
                        <PolarGrid stroke="var(--color-stone)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-slate-gray)', fontSize: 10 }} />
                        <Radar name="Score" dataKey="A" stroke="var(--color-onyx)" fill="var(--color-onyx)" fillOpacity={0.4} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                   <div className="label-caps mb-4">Core Strengths</div>
                   <ul className="space-y-4">
                     {result.strengths.map((s, i) => (
                       <li key={i} className="flex gap-3 text-sm">
                         <CheckCircle2 size={16} className="shrink-0 text-green-600" />
                         <span>{s}</span>
                       </li>
                     ))}
                   </ul>
                </div>
              </div>

              <div className="md:col-span-8 space-y-12">
                <div>
                  <div className="label-caps mb-4">Deconstruction Summary</div>
                  <p className="text-lg leading-relaxed text-slate-gray border-l-2 border-onyx pl-6">
                    {result.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="label-caps mb-4 !text-red-600">Formatting Liabilities</div>
                    <ul className="space-y-3">
                      {result.weaknesses.map((w, i) => (
                        <li key={i} className="text-xs text-slate-gray py-2 border-b border-stone">
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="label-caps mb-4 !text-primary">Strategic Adjustments</div>
                    <ul className="space-y-3">
                      {result.recommendations.map((r, i) => (
                        <li key={i} className="text-xs text-slate-gray py-2 border-b border-stone">
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-4 py-20 text-red-600">
               <div className="label-caps">Error Protocol</div>
               <div className="text-xl font-light">Analysis failed to initialize correctly.</div>
            </div>
          )}
        </div>

        <div className="h-16 border-t border-stone bg-surface-dim flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="text-[10px] font-mono text-slate-gray">SESSION_ID: {Math.random().toString(36).substring(7).toUpperCase()}</div>
          {result && (
            <button 
              onClick={downloadAnalysis}
              className="bg-onyx text-white label-caps !text-on-primary px-6 py-2 hover:bg-onyx/90 transition-all cursor-pointer"
            >
              Export Analysis
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const RichTextEditor = ({ content, onChange }: { content: string, onChange: (html: string) => void }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content || '<p>No content available to edit.</p>',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-stone-dark flex flex-col bg-surface overflow-hidden flex-1">
      <div className="border-b border-stone-dark bg-surface-dim p-2 flex gap-1 md:gap-2 shrink-0 overflow-x-auto">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 hover:bg-stone transition-colors ${editor.isActive('bold') ? 'bg-stone' : ''}`}>
          <Bold size={16} className="text-slate-gray" />
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 hover:bg-stone transition-colors ${editor.isActive('italic') ? 'bg-stone' : ''}`}>
          <Italic size={16} className="text-slate-gray" />
        </button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-2 hover:bg-stone transition-colors ${editor.isActive('strike') ? 'bg-stone' : ''}`}>
          <Strikethrough size={16} className="text-slate-gray" />
        </button>
        <div className="w-[1px] bg-stone-dark mx-1 my-1"></div>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 hover:bg-stone transition-colors ${editor.isActive('bulletList') ? 'bg-stone' : ''}`}>
          <List size={16} className="text-slate-gray" />
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 hover:bg-stone transition-colors ${editor.isActive('orderedList') ? 'bg-stone' : ''}`}>
          <ListOrdered size={16} className="text-slate-gray" />
        </button>
      </div>
      <div className="p-6 flex-1 overflow-y-auto w-full prose max-w-none text-onyx">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

const EditResumeOverlay = ({ 
  item, 
  onClose,
  onReanalyze
}: { 
  item: HistoryItem | null; 
  onClose: () => void;
  onReanalyze: (file: File) => void;
}) => {
  const [content, setContent] = useState(() => {
    let initialContent = item?.content || '';
    if (initialContent && !initialContent.includes('</')) {
      initialContent = initialContent.split('\n').map((p: string) => p.trim()).filter(Boolean).map((p: string) => `<p>${p}</p>`).join('');
    }
    return initialContent;
  });

  if (!item) return null;

  const handleReanalyze = () => {
    const file = new File([content], `Edited_${item.fileName}.html`, { type: 'text/html' });
    onReanalyze(file);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-8 bg-background/95 backdrop-blur-sm"
    >
      <div className="w-full h-full md:h-[90vh] md:max-w-5xl bg-background border-0 md:border border-stone shadow-none md:shadow-2xl flex flex-col">
        <div className="h-16 border-b border-stone flex items-center justify-between px-4 md:px-8 shrink-0 bg-surface-dim">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 border border-onyx flex items-center justify-center text-[10px] font-bold">
              ED
            </div>
            <span className="label-caps !text-onyx uppercase tracking-widest text-xs">Edit: {item.fileName}</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleReanalyze}
              className="bg-onyx text-white label-caps !text-on-primary px-6 py-2 hover:bg-onyx/90 transition-all cursor-pointer flex items-center gap-2"
            >
              Re-Analyze
              <ArrowRight size={12} />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-surface-muted transition-colors cursor-pointer rounded-full border border-transparent hover:border-stone text-slate-gray hover:text-onyx">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden p-4 md:p-8 flex flex-col bg-surface-muted/30">
          <div className="mb-4 md:mb-6 flex flex-col gap-2">
             <h2 className="text-2xl md:text-3xl font-light tracking-tight">MANUAL OVERRIDE</h2>
             <p className="text-slate-gray text-xs md:text-sm max-w-2xl">Modify the extracted semantic nodes below. Once optimized, re-initialize the engine to calculate a fresh ATS compatibility score.</p>
          </div>
          <RichTextEditor content={content} onChange={setContent} />
        </div>
      </div>
    </motion.div>
  );
};

const ResumesView = ({ history, onView, onEdit }: { history: HistoryItem[], onView: (item: HistoryItem) => void, onEdit: (item: HistoryItem) => void }) => {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto border-x border-stone min-h-screen">
      <div className="px-4 md:px-8 mb-16">
        <div className="label-caps mb-4">Storage Protocol.02</div>
        <h1 className="text-5xl md:text-6xl font-light tracking-tighter mb-8">MY <span className="italic font-serif">RESUMES</span></h1>
        <p className="text-slate-gray max-w-2xl border-l border-stone pl-6 md:pl-8">
          Historical record of precision analyses. Each entry represents a unique semantic decomposition of professional data.
        </p>
      </div>

      <div className="border-t border-stone">
        {history.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border border-stone flex items-center justify-center text-slate-gray">
              <Upload size={20} />
            </div>
            <div className="label-caps">Empty Buffer</div>
            <p className="text-slate-gray font-light">No analysis history detected in the current session.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2">
            {history.map((item) => (
              <div key={item.id} className="p-6 md:p-12 border-b border-stone hover:bg-surface-dim transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="label-caps !text-slate-gray">{item.date}</div>
                    <div className="text-2xl font-light">{item.result.score}%</div>
                  </div>
                  <h3 className="text-2xl font-light tracking-tight mb-2 group-hover:italic transition-all">{item.fileName}</h3>
                  <p className="text-sm text-slate-gray line-clamp-2 leading-relaxed mb-8">
                    {item.result.summary}
                  </p>
                </div>
                <div className="flex gap-4 mt-8 flex-wrap">
                  <button 
                    onClick={() => onView(item)}
                    className="label-caps !text-onyx flex items-center gap-2 hover:translate-x-2 transition-transform cursor-pointer"
                  >
                    View Report
                    <ArrowRight size={14} />
                  </button>
                  <button 
                    onClick={() => onEdit(item)}
                    className="label-caps !text-primary flex items-center gap-2 hover:translate-x-2 transition-transform cursor-pointer"
                  >
                    Edit Content
                    <Edit3 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const InsightsView = () => {
  const insights = [
    { title: "Market Volatility", value: "High", trend: "+12%", desc: "Tech sector demand nodes are shifting toward specialized AI integration roles." },
    { title: "Skill Resonance", value: "88%", trend: "Stable", desc: "Cross-functional systems knowledge is now the primary filter for Tier-1 positions." },
    { title: "ATS Evolution", value: "v4.2", trend: "Active", desc: "LLM-based parsing engines are replacing keyword-only legacy systems." },
    { title: "Remote Purity", value: "62%", trend: "-4%", desc: "Hybrid-centralized models are regaining dominance in architectural leadership." }
  ];

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto border-x border-stone min-h-screen">
      <div className="px-4 md:px-8 mb-16">
        <div className="label-caps mb-4">Intellectual Property.04</div>
        <h1 className="text-5xl md:text-6xl font-light tracking-tighter mb-8">MARKET <span className="italic font-serif">INSIGHTS</span></h1>
        <p className="text-slate-gray max-w-2xl border-l border-stone pl-6 md:pl-8">
          Real-time analysis of industry demand vectors. Our engine deconstructs thousands of job postings to identify precision requirements for the modern professional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-y border-stone">
        {insights.map((item, idx) => (
          <div key={idx} className={`p-6 md:p-8 ${idx !== 3 ? 'border-b lg:border-b-0 lg:border-r border-stone' : ''} bg-surface-dim/30 hover:bg-surface-dim transition-colors`}>
            <div className="label-caps !text-slate-gray mb-6">Index.{idx + 1}</div>
            <div className="flex items-baseline gap-4 mb-4">
              <div className="text-4xl font-light">{item.value}</div>
              <div className="text-xs font-mono font-bold text-green-600">{item.trend}</div>
            </div>
            <h3 className="label-caps !text-onyx mb-3 tracking-widest">{item.title}</h3>
            <p className="text-xs text-slate-gray leading-relaxed italic">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 mt-16 px-8 gap-12">
        <div className="col-span-12 lg:col-span-8 overflow-hidden">
          <div className="label-caps mb-8">Skill Saturation Matrix</div>
          <div className="h-[400px] border border-stone-dark relative flex items-center justify-center p-8 bg-surface-muted/50">
             <div className="absolute inset-0 grid-pattern opacity-20"></div>
             <div className="z-10 w-full h-full flex flex-col justify-between">
                {[
                  { label: "Systems Architecture", width: "90%" },
                  { label: "AI Integration", width: "84%" },
                  { label: "Product Strategy", width: "72%" },
                  { label: "Technical Leadership", width: "65%" },
                  { label: "Data Science", width: "58%" }
                ].map((skill, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-slate-gray">
                      <span>{skill.label}</span>
                      <span>{skill.width}</span>
                    </div>
                    <div className="h-1 bg-stone relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: skill.width }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="absolute h-full bg-onyx"
                      />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 mt-16 px-8 gap-12">
        <div className="col-span-12 lg:col-span-4 border-r border-stone pr-12 flex flex-col justify-center">
          <div className="label-caps mb-6">Historical Trends</div>
          <p className="text-xl font-light leading-snug mb-8">
            Observe the fluctuating vectors of <span className="italic">Skill Resonance</span> versus <span className="italic">Market Volatility</span> over recent analytical periods.
          </p>
          <div className="w-12 h-12 bg-onyx flex items-center justify-center">
            <TrendingUp size={24} className="text-background" />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8 overflow-hidden">
          <div className="label-caps mb-8">Resonance vs. Volatility Index</div>
          <div className="h-[400px] border border-stone-dark relative flex items-center justify-center p-8 bg-surface-muted/50">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { name: 'Q1', resonance: 65, volatility: 40 },
                  { name: 'Q2', resonance: 72, volatility: 55 },
                  { name: 'Q3', resonance: 80, volatility: 68 },
                  { name: 'Q4', resonance: 88, volatility: 85 },
                  { name: 'Q1', resonance: 92, volatility: 88 }
                ]}
                margin={{
                  top: 5,
                  right: 30,
                  left: -20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-stone)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-slate-gray)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--color-slate-gray)' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-stone)', color: 'var(--color-onyx)' }}
                  itemStyle={{ fontSize: 12, fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="resonance" stroke="var(--color-onyx)" strokeWidth={2} dot={{ fill: 'var(--color-onyx)', r: 4 }} activeDot={{ r: 6 }} name="Skill Resonance" />
                <Line type="monotone" dataKey="volatility" stroke="var(--color-slate-gray)" strokeWidth={2} dot={{ fill: 'var(--color-slate-gray)', r: 4 }} name="Market Volatility" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutView = () => {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto border-x border-stone min-h-screen">
      <div className="px-4 md:px-8 mb-16">
        <div className="label-caps mb-4">Documentation.03</div>
        <h1 className="text-5xl md:text-6xl font-light tracking-tighter mb-8">SYSTEM <span className="italic font-serif">ARCHITECTURE</span></h1>
        <p className="text-slate-gray max-w-2xl border-l border-stone pl-6 md:pl-8">
          CareerLens is built on the philosophy of deterministic analysis. We abstract the subjective nature of recruitment into measurable, geometric data points.
        </p>
      </div>

      <div className="border-y border-stone grid grid-cols-1 md:grid-cols-12 bg-surface-dim/30">
        <div className="md:col-span-8 p-12 lg:p-20 border-b md:border-b-0 md:border-r border-stone">
          <div className="label-caps mb-8">Core Tenets</div>
          <div className="space-y-16">
            <div>
               <div className="flex items-baseline gap-4 mb-4">
                 <div className="text-sm font-mono font-bold text-onyx">01</div>
                 <h3 className="text-3xl font-light tracking-tight">Radical Objectivity</h3>
               </div>
               <p className="text-slate-gray leading-relaxed max-w-xl pl-8 border-l border-stone">
                 Human review introduces variance. Our engine eliminates formatting bias, scoring resumes purely on the geometric distribution of semantic keywords and structural integrity.
               </p>
            </div>
            <div>
               <div className="flex items-baseline gap-4 mb-4">
                 <div className="text-sm font-mono font-bold text-onyx">02</div>
                 <h3 className="text-3xl font-light tracking-tight">Semantic Deconstruction</h3>
               </div>
               <p className="text-slate-gray leading-relaxed max-w-xl pl-8 border-l border-stone">
                 Documents are not read; they are parsed into node graphs. Action verbs, quantifiable metrics, and contextual keywords are mapped and evaluated against industry-standard topologies.
               </p>
            </div>
            <div>
               <div className="flex items-baseline gap-4 mb-4">
                 <div className="text-sm font-mono font-bold text-onyx">03</div>
                 <h3 className="text-3xl font-light tracking-tight">Architectural Recomposition</h3>
               </div>
               <p className="text-slate-gray leading-relaxed max-w-xl pl-8 border-l border-stone">
                 Identified liabilities are not just highlighted; they are algorithmically corrected. The resulting document is a precision-engineered artifact designed for maximum ATS resonance.
               </p>
            </div>
          </div>
        </div>
        <div className="md:col-span-4 p-12 lg:p-20 relative flex flex-col items-center justify-center">
            <div className="absolute inset-0 grid-pattern opacity-20"></div>
            <div className="z-10 w-full aspect-square border border-stone-dark flex items-center justify-center bg-white/50 backdrop-blur-sm relative">
                <div className="absolute w-full h-[1px] bg-stone-dark top-1/2"></div>
                <div className="absolute h-full w-[1px] bg-stone-dark left-1/2"></div>
                <div className="w-1/2 h-1/2 bg-onyx flex items-center justify-center p-4 text-center">
                    <span className="text-white label-caps !text-[10px] leading-relaxed">TRUTH<br/>IN<br/>DATA</span>
                </div>
            </div>
            <div className="z-10 mt-12 text-center">
                <div className="label-caps mb-2">Engine Iteration</div>
                <div className="text-xl font-mono text-slate-gray">v2.0-STABLE</div>
            </div>
        </div>
      </div>

      <div className="border-b border-stone grid grid-cols-1 md:grid-cols-2 bg-surface-dim/30">
        <div className="p-12 lg:p-20 border-b md:border-b-0 md:border-r border-stone">
           <div className="label-caps mb-8">Contact Information</div>
           <h3 className="text-3xl font-light tracking-tight mb-8">Direct <span className="italic font-serif">Inquiries</span></h3>
           <p className="text-slate-gray leading-relaxed max-w-xl mb-12 border-l border-stone pl-6">
             For specialized requests, engine integration, or direct support, utilize the following deterministic communication channels.
           </p>
           <div className="space-y-6">
              <div>
                 <div className="text-[10px] uppercase text-slate-gray mb-1">Email Address</div>
                 <a href="mailto:manasranjantripathy1803@gmail.com" className="text-lg md:text-xl hover:text-onyx transition-colors">manasranjantripathy1803@gmail.com</a>
              </div>
              <div>
                 <div className="text-[10px] uppercase text-slate-gray mb-1">Phone Number</div>
                 <a href="tel:+918144833026" className="text-lg md:text-xl hover:text-onyx transition-colors">+91-8144833026</a>
              </div>
           </div>
        </div>
        <div className="p-12 lg:p-20 flex flex-col justify-center items-center relative overflow-hidden bg-background/50">
             <div className="absolute inset-0 grid-pattern opacity-10"></div>
             <div className="w-16 h-16 border border-stone-dark flex items-center justify-center mb-6 z-10 bg-background shadow-sm hover:scale-105 transition-transform duration-500">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             </div>
             <div className="text-center z-10">
                 <div className="label-caps mb-2">Comms Active</div>
                 <div className="text-xs font-mono text-slate-gray">Awaiting Input...</div>
             </div>
        </div>
      </div>
    </div>
  );
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([
    { role: 'model', text: 'System initialized. How may I assist your career optimization?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);
    
    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      history.push({ role: 'user', parts: [{ text: userText }] });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: history,
          systemInstruction: "You are the CareerLens ATS Assistant, a clinical, professional, and slightly robotic AI career advisor. Keep answers concise, geometric, and focused on career optimization."
        })
      });

      if (!response.ok) {
        throw new Error("Chat widget request failed");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'model', text: data.text || "Error processing query." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Systems offline. Retry later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      setMessages([{ role: 'model', text: 'System initialized. How may I assist your career optimization?' }]);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 w-14 h-14 bg-onyx text-background flex items-center justify-center rounded-none shadow-xl hover:scale-105 transition-transform z-50 ${isOpen ? 'hidden' : ''} cursor-pointer`}
      >
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 right-8 w-[380px] h-[540px] bg-background border border-stone shadow-2xl flex flex-col z-50"
          >
            <div className="h-16 border-b border-stone flex items-center justify-between px-6 bg-surface-dim">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-onyx flex items-center justify-center">
                  <Bot size={16} className="text-background" />
                </div>
                <div className="flex flex-col">
                  <span className="label-caps !text-[10px] !text-onyx leading-none">CareerLens Node</span>
                  <span className="text-[10px] font-mono text-green-600">ONLINE</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleClearChat} className="hover:bg-stone p-1.5 transition-colors cursor-pointer text-slate-gray hover:text-red-600" title="Clear Chat">
                  <Trash2 size={16} />
                </button>
                <button onClick={() => setIsOpen(false)} className="hover:bg-stone p-1.5 transition-colors cursor-pointer text-slate-gray hover:text-onyx" title="Close Chat">
                  <X size={18} />
                </button>
              </div>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 text-sm leading-relaxed ${m.role === 'user' ? 'bg-onyx text-background' : 'bg-surface-dim border border-stone text-slate-gray'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-surface-dim border border-stone p-4 flex gap-1.5 items-center h-[52px]">
                    <div className="w-1.5 h-1.5 bg-onyx animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-onyx animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-1.5 h-1.5 bg-onyx animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-stone bg-background flex gap-2">
              <input 
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Query system (e.g. ATS fonts)..."
                className="flex-1 border border-stone bg-background px-4 py-2 text-sm focus:outline-none focus:border-onyx font-mono placeholder:text-slate-gray/50"
              />
              <button 
                onClick={handleSend}
                disabled={isTyping}
                className="w-10 h-10 bg-onyx text-background flex flex-shrink-0 items-center justify-center hover:bg-onyx/90 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const PaywallModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-background border border-stone shadow-2xl p-8 max-w-4xl w-full relative max-h-[90vh] overflow-y-auto"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-surface-dim transition-colors cursor-pointer rounded-full"
          >
            <X size={20} className="text-slate-gray hover:text-onyx" />
          </button>
          
          <div className="text-center mb-12">
            <div className="label-caps mb-4">Upgrade Protocol</div>
            <h2 className="text-4xl lg:text-5xl font-light tracking-tighter mb-4">UNLOCK MAXIMUM <span className="italic font-serif">RESONANCE</span></h2>
            <p className="text-slate-gray max-w-xl mx-auto">
              Our free engine provides fundamental analysis. To completely dominate the ATS and guarantee callbacks, you need full system access.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-stone p-8 flex flex-col justify-between hover:border-stone-dark transition-all">
               <div>
                  <div className="label-caps !text-slate-gray mb-2">Free Pier</div>
                  <div className="text-3xl font-light mb-6">$0</div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-3 text-sm text-slate-gray">
                       <CheckCircle2 size={16} className="text-onyx shrink-0" />
                       Basic grammatical parsing
                    </li>
                    <li className="flex gap-3 text-sm text-slate-gray">
                       <CheckCircle2 size={16} className="text-onyx shrink-0" />
                       General ATS scoring (1 update/mo)
                    </li>
                    <li className="flex gap-3 text-sm text-slate-gray brightness-50">
                       <X size={16} className="text-slate-gray shrink-0" />
                       Deep semantic reconstruction
                    </li>
                  </ul>
               </div>
               <button className="w-full py-3 border border-stone label-caps hover:bg-surface-dim transition-colors cursor-pointer" onClick={onClose}>
                 Current Plan
               </button>
            </div>

            <div className="border-2 border-onyx p-8 flex flex-col justify-between relative bg-surface-dim/30">
               <div className="absolute top-0 right-0 bg-onyx text-background label-caps !text-[10px] px-3 py-1">
                  RECOMMENDED
               </div>
               <div>
                  <div className="label-caps !text-onyx mb-2">Enterprise Node</div>
                  <div className="text-3xl font-light mb-6">$49<span className="text-sm text-slate-gray">/mo</span></div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-3 text-sm">
                       <ShieldCheck size={16} className="text-green-600 shrink-0" />
                       Infinite AI optimization runs
                    </li>
                    <li className="flex gap-3 text-sm">
                       <ShieldCheck size={16} className="text-green-600 shrink-0" />
                       Live recruiter search intent mapping
                    </li>
                    <li className="flex gap-3 text-sm">
                       <ShieldCheck size={16} className="text-green-600 shrink-0" />
                       Automated semantic rewrites
                    </li>
                  </ul>
               </div>
               <button className="w-full py-3 bg-onyx text-background label-caps hover:bg-onyx/90 transition-colors cursor-pointer">
                 Activate Protocol
               </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default function App() {
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [view, setView] = useState<View>('engine');
  const [analyzingFile, setAnalyzingFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [editingItem, setEditingItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const analyzeResume = async (file: File) => {
    setAnalyzingFile(file);
    setIsAnalyzing(true);
    
    try {
      // 1. Read file as base64
      const reader = new FileReader();
      const fileData = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // 2. Setup Prompt
      const systemInstruction = `You are an elite ATS (Applicant Tracking System) Specialist and Executive Career Coach. 
      Analyze the provided resume document and provide a detailed analysis in JSON format.
      The output MUST be a valid JSON object with the following structure:
      {
        "score": number (0-100),
        "summary": "Professional summary of the resume's performance in modern ATS",
        "strengths": ["list of 3-4 structural or content-wise strengths"],
        "weaknesses": ["list of 3-4 specific problems like formatting, font, or keyword issues"],
        "recommendations": ["list of 3-4 strategic advice points"],
        "extractedText": "The extremely detailed full text content of the resume, preserving all information, nicely formatted. Never omit anything."
      }`;

      // 3. Call Backend Proxy
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileData,
          mimeType: file.type || "application/pdf",
          systemInstruction
        })
      });

      if (!response.ok) {
        throw new Error("Analysis failed to complete successfully on the server.");
      }

      const result = await response.json();
      if (result.extractedText) {
        // Clean up markdown wrapping if present
      }
      setAnalysisResult(result);
      
      // Save to history
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substring(7).toUpperCase(),
        fileName: file.name,
        date: new Date().toLocaleDateString('en-GB'),
        result,
        content: result.extractedText || "No text extracted.",
      };
      setHistory(prev => [newHistoryItem, ...prev]);

    } catch (error) {
      console.error("AI Analysis Error:", error);
      setAnalysisResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const viewHistoryItem = (item: HistoryItem) => {
    setAnalyzingFile({ name: item.fileName } as File);
    setAnalysisResult(item.result);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-background selection:bg-onyx selection:text-background">
      <Navbar currentView={view} setView={setView} isDark={isDark} toggleDark={() => setIsDark(!isDark)} onUpgrade={() => setIsPaywallOpen(true)} />
      <PaywallModal isOpen={isPaywallOpen} onClose={() => setIsPaywallOpen(false)} />
      <main>
        <AnimatePresence mode="wait">
          {view === 'engine' && (
            <motion.div 
              key="engine"
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Hero onAnalyze={analyzeResume} />
              <ProcessSection />
              <TechnicalBanner />
            </motion.div>
          )}
          {view === 'insights' && (
            <motion.div 
              key="insights"
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <InsightsView />
            </motion.div>
          )}
          {view === 'resumes' && (
            <motion.div 
              key="resumes"
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <ResumesView history={history} onView={viewHistoryItem} onEdit={setEditingItem} />
            </motion.div>
          )}
          {view === 'about' && (
            <motion.div 
              key="about"
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <AboutView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {analyzingFile && (
          <AnalysisOverlay 
            file={analyzingFile} 
            onClose={() => {
              setAnalyzingFile(null);
              setAnalysisResult(null);
            }} 
            result={analysisResult}
            isAnalyzing={isAnalyzing}
          />
        )}
        {editingItem && (
          <EditResumeOverlay
            item={editingItem}
            onClose={() => setEditingItem(null)}
            onReanalyze={(file) => {
              setEditingItem(null);
              setView('engine');
              analyzeResume(file);
            }}
          />
        )}
      </AnimatePresence>
      
      <footer className="h-20 border-t border-stone bg-surface-dim flex items-center justify-between px-4 md:px-10 max-w-7xl mx-auto border-x border-stone overflow-hidden">
        <div className="flex items-center gap-4 md:gap-12">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="hidden sm:inline label-caps !text-onyx font-mono !text-[9px]">Systems Nominal</span>
          </div>
          <span className="label-caps !text-[9px]">CareerLens © 2026</span>
        </div>
        <div className="flex gap-4 md:gap-8">
          <a href="#" className="label-caps !text-[9px] hover:text-onyx transition-colors">Archive</a>
          <a href="#" className="label-caps !text-[9px] hover:text-onyx transition-colors">Security</a>
          <button onClick={() => setView('about')} className="label-caps !text-[9px] hover:text-onyx transition-colors bg-transparent border-none cursor-pointer p-0">Contact</button>
        </div>
      </footer>
      <ChatWidget />
    </div>
  );
}

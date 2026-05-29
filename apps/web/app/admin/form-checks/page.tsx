"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initialFormChecks = [
  {
    id: "FC-1",
    clientName: "أحمد محمد",
    exercise: "سكوات (Squat)",
    weight: "120 kg",
    date: "منذ ساعتين",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    notes: "حاسس بألم خفيف في أسفل الضهر مع الطلعة.",
    status: "pending",
    previousVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Previous reference for comparison
  },
  {
    id: "FC-2",
    clientName: "حسام نبيل",
    exercise: "ديدليفت (Deadlift)",
    weight: "140 kg",
    date: "منذ 4 ساعات",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    notes: "ده وزني الجديد للـ PR، محتاج رأيك في تقويسة الظهر.",
    status: "pending",
    previousVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: "FC-3",
    clientName: "كريم حسن",
    exercise: "بنش بريس",
    weight: "80 kg",
    date: "أمس",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    notes: "نزولي للبار مش مظبوط حاسس الكتف بيوجعني.",
    status: "reviewed",
    coachReply: "محتاج تضم كوعك شوية لجوّة (Tuck your elbows)، زاوية 45 درجة.",
    previousVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }
];

export default function FormChecksPage() {
  const [formChecks, setFormChecks] = useState(initialFormChecks);
  const [selectedReq, setSelectedReq] = useState<typeof initialFormChecks[0] | null>(initialFormChecks[0]);
  const [coachReply, setCoachReply] = useState("");
  
  /* ── Drawing Board State ── */
  const [isDrawMode, setIsDrawMode] = useState(false);
  const [brushColor, setBrushColor] = useState("#E50914");
  const [brushSize, setBrushSize] = useState(4);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  /* ── Voice Recording State ── */
  const [isRecordMode, setIsRecordMode] = useState(false);
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "completed">("idle");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<any>(null);
  const [hasVoiceReply, setHasVoiceReply] = useState(false);

  /* ── Comparison Mode ── */
  const [isCompareMode, setIsCompareMode] = useState(false);

  const pendingCount = formChecks.filter(r => r.status === "pending").length;

  const handleSendFeedback = (id: string) => {
    setFormChecks(formChecks.map(r => 
      r.id === id 
        ? { 
            ...r, 
            status: "reviewed", 
            coachReply: hasVoiceReply 
              ? `[رد صوتي مسجل 🎙️] ${coachReply || "يرجى الاستماع للتعليق الصوتي المرفق."}` 
              : coachReply 
          } 
        : r
    ));
    setCoachReply("");
    setHasVoiceReply(false);
    setIsRecordMode(false);
    setSelectedReq(null);
  };

  /* ── HTML5 Canvas Drawing Logic ── */
  useEffect(() => {
    if (!isDrawMode || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set correct dimensions matching display
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [isDrawMode, brushColor, brushSize, selectedReq]);

  const startCanvasDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const drawOnCanvas = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopCanvasDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  /* ── Voice Recording Simulation ── */
  const startRecordingVoice = () => {
    setRecordingState("recording");
    setRecordingSeconds(0);
    const interval = setInterval(() => {
      setRecordingSeconds(s => s + 1);
    }, 1000);
    setRecordingInterval(interval);
  };

  const stopRecordingVoice = () => {
    clearInterval(recordingInterval);
    setRecordingState("completed");
    setHasVoiceReply(true);
  };

  const deleteRecordingVoice = () => {
    setRecordingState("idle");
    setRecordingSeconds(0);
    setHasVoiceReply(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-1 flex items-center gap-2">
            مراجعة الأداء وتقييم الحركة <span className="text-2xl">📹</span>
          </h1>
          <p className="text-text-2 text-sm mt-1">صحح زوايا الحركة الحركية، قارن التطور، وأرسل مراجعاتك المكتوبة والصوتية.</p>
        </div>
        <div className="bg-info/10 text-info px-4 py-2 rounded-full font-bold text-sm border border-info/20">
          {pendingCount} طلبات معلقة
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Queue List */}
        <div className="lg:col-span-1 space-y-3 h-[75vh] overflow-y-auto pe-2 custom-scrollbar">
          {formChecks.map((req) => (
            <button
              key={req.id}
              onClick={() => {
                setSelectedReq(req);
                setIsCompareMode(false);
                setIsDrawMode(false);
              }}
              className={cn(
                "w-full text-start p-4 rounded-[var(--radius-lg)] border transition-all cursor-pointer relative",
                selectedReq?.id === req.id 
                  ? "bg-info/5 border-info shadow-[0_0_15px_rgba(59,130,246,0.15)]" 
                  : "bg-surface border-border hover:border-info/40",
                req.status === "pending" ? "border-l-4 border-l-warning" : "opacity-70"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-text-1">{req.clientName}</h3>
                <span className="text-[10px] text-text-3">{req.date}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-info font-medium">{req.exercise}</span>
                <span className="bg-surface-high px-2 py-0.5 rounded text-text-2">{req.weight}</span>
              </div>
              {req.status === "pending" ? (
                <div className="mt-3 text-[10px] text-warning bg-warning/10 px-2 py-1 rounded inline-block">بانتظار المراجعة</div>
              ) : (
                <div className="mt-3 text-[10px] text-success bg-success/10 px-2 py-1 rounded inline-block">تم الرد ✓</div>
              )}
            </button>
          ))}
        </div>

        {/* Video & Feedback Area */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedReq ? (
              <motion.div key={selectedReq.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <Card className="p-6">
                  
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-text-1">{selectedReq.clientName} - {selectedReq.exercise}</h2>
                      <p className="text-text-3 text-xs mt-1">الوزن المسجل: {selectedReq.weight}</p>
                    </div>
                    
                    {/* Controls Bar */}
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant={isCompareMode ? "primary" : "outline"}
                        onClick={() => setIsCompareMode(!isCompareMode)}
                        className="text-xs"
                      >
                        ⚖️ {isCompareMode ? "إيقاف المقارنة" : "مقارنة بالأداء السابق"}
                      </Button>
                      <Button 
                        size="sm" 
                        variant={isDrawMode ? "primary" : "outline"}
                        onClick={() => {
                          setIsDrawMode(!isDrawMode);
                          if (!isDrawMode) {
                            setTimeout(clearCanvas, 50);
                          }
                        }}
                        className="text-xs"
                      >
                        ✏️ {isDrawMode ? "إغلاق لوحة الرسم" : "رسم على الفيديو"}
                      </Button>
                    </div>
                  </div>

                  {/* Client Note */}
                  <div className="mb-4 p-3 bg-surface-high rounded-[var(--radius-md)] border-s-2 border-accent">
                    <p className="text-xs text-text-3 mb-1">ملاحظة العميل:</p>
                    <p className="text-xs text-text-1 font-medium">"{selectedReq.notes}"</p>
                  </div>

                  {/* Drawing Tools (Only in Draw Mode) */}
                  {isDrawMode && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="mb-3 p-3 bg-surface-high/60 border border-accent/20 rounded-lg flex items-center justify-between flex-wrap gap-2 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span>اللون:</span>
                          {["#E50914", "#FF4A4A", "#4ADE80", "#3B82F6"].map(c => (
                            <button
                              key={c}
                              onClick={() => setBrushColor(c)}
                              className={cn(
                                "w-5 h-5 rounded-full border transition-transform",
                                brushColor === c ? "scale-125 border-text-1" : "border-transparent"
                              )}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span>حجم الفرشاة:</span>
                          <input 
                            type="range" 
                            min="2" 
                            max="8" 
                            value={brushSize} 
                            onChange={e => setBrushSize(Number(e.target.value))} 
                            className="w-16 accent-[var(--accent)]" 
                          />
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={clearCanvas} className="text-[10px]">
                        🗑️ مسح لوحة الرسم
                      </Button>
                    </motion.div>
                  )}

                  {/* Video Viewport Wrapper */}
                  <div className={cn(
                    "grid gap-4 mb-6",
                    isCompareMode ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                  )}>
                    {/* Primary Video Container */}
                    <div className="w-full aspect-video bg-black rounded-[var(--radius-lg)] overflow-hidden relative border border-border">
                      <iframe 
                        src={selectedReq.videoUrl} 
                        className="w-full h-full opacity-60 pointer-events-none"
                        title="Video Player"
                        frameBorder="0"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-accent text-bg flex items-center justify-center shadow-lg">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      </div>

                      {/* HTML5 Canvas overlay for drawings */}
                      {isDrawMode && (
                        <canvas
                          ref={canvasRef}
                          onMouseDown={startCanvasDrawing}
                          onMouseMove={drawOnCanvas}
                          onMouseUp={stopCanvasDrawing}
                          onMouseLeave={stopCanvasDrawing}
                          className="absolute inset-0 w-full h-full z-20 cursor-crosshair touch-none"
                        />
                      )}
                      
                      <div className="absolute top-2 start-2 bg-black/75 text-[9px] px-2 py-0.5 rounded text-text-1">
                        الأداء الحالي ({selectedReq.weight})
                      </div>
                    </div>

                    {/* Compare Mode Secondary Video */}
                    {isCompareMode && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full aspect-video bg-black rounded-[var(--radius-lg)] overflow-hidden relative border border-border"
                      >
                        <iframe 
                          src={selectedReq.previousVideoUrl} 
                          className="w-full h-full opacity-60 pointer-events-none"
                          title="Previous Video Player"
                          frameBorder="0"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                          <div className="w-12 h-12 rounded-full bg-info text-white flex items-center justify-center shadow-lg">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                        </div>
                        <div className="absolute top-2 start-2 bg-black/75 text-[9px] px-2 py-0.5 rounded text-text-1">
                          الأداء السابق المرجعي
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Feedback Form & Voice Note */}
                  {selectedReq.status === "pending" ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-text-1">أضف تقييمك للأداء:</label>
                        
                        {/* Record Mode Toggle */}
                        <button 
                          onClick={() => {
                            setIsRecordMode(!isRecordMode);
                            if (isRecordMode) deleteRecordingVoice();
                          }}
                          className={cn(
                            "text-xs px-2.5 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer",
                            isRecordMode ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-surface-high border border-border text-text-2 hover:text-text-1"
                          )}
                        >
                          🎙️ {isRecordMode ? "الرد بكتابة فقط" : "إرسال تعليق صوتي"}
                        </button>
                      </div>

                      {/* Interactive Voice Recorder */}
                      {isRecordMode ? (
                        <div className="p-4 rounded-lg bg-surface-high border border-border space-y-4 text-center">
                          {recordingState === "idle" && (
                            <div className="py-4">
                              <p className="text-xs text-text-2 mb-3">اضغط على الزر للتسجيل وشرح التفاصيل حركياً</p>
                              <button 
                                onClick={startRecordingVoice}
                                className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg animate-pulse"
                              >
                                🎤
                              </button>
                            </div>
                          )}

                          {recordingState === "recording" && (
                            <div className="py-2 space-y-3">
                              <div className="flex items-center justify-center gap-1.5 h-8">
                                {/* Wave animation */}
                                {[0.3, 0.9, 0.4, 0.8, 0.2, 0.7, 0.5, 0.9, 0.3].map((val, idx) => (
                                  <motion.div
                                    key={idx}
                                    className="w-1 bg-red-500 rounded"
                                    animate={{ height: ["12px", `${val * 32}px`, "12px"] }}
                                    transition={{ duration: 0.6, repeat: Infinity, delay: idx * 0.05 }}
                                  />
                                ))}
                              </div>
                              <p className="text-xs font-mono text-red-500 font-bold">
                                جاري تسجيل صوتك.. {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, "0")}
                              </p>
                              <button 
                                onClick={stopRecordingVoice}
                                className="px-4 py-1.5 rounded-full bg-text-1 text-bg text-xs font-semibold"
                              >
                                ⏹️ إنهاء وحفظ
                              </button>
                            </div>
                          )}

                          {recordingState === "completed" && (
                            <div className="py-2 space-y-3">
                              <p className="text-xs text-success font-bold">تم تسجيل التعليق الصوتي بنجاح (المدة: {recordingSeconds} ثانية) 📻</p>
                              <div className="flex justify-center gap-3">
                                <Button size="sm" variant="outline" onClick={deleteRecordingVoice} className="text-xs text-danger hover:bg-danger/10">
                                  🗑️ حذف التسجيل
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <textarea 
                          value={coachReply}
                          onChange={(e) => setCoachReply(e.target.value)}
                          placeholder="مثال: أداؤك ممتاز، بس محتاج تنزل أعمق شوية في السكوات..."
                          className="w-full min-h-[100px] p-3 rounded-[var(--radius-md)] bg-bg border border-border text-sm text-text-1 focus:outline-none focus:border-info"
                        />
                      )}

                      <Button 
                        onClick={() => handleSendFeedback(selectedReq.id)} 
                        disabled={!coachReply.trim() && !hasVoiceReply} 
                        className="w-full bg-info hover:bg-info/90 text-white"
                      >
                        إرسال التقييم للمشترك 🚀
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-[var(--radius-md)] bg-success/10 border border-success/20">
                      <p className="text-xs text-success font-bold mb-1">تقييمك المرسل:</p>
                      <p className="text-sm text-text-1">{selectedReq.coachReply}</p>
                    </div>
                  )}
                </Card>
              </motion.div>
            ) : (
              <div className="h-[75vh] flex flex-col items-center justify-center text-text-3 border-2 border-dashed border-border rounded-[var(--radius-lg)]">
                <span className="text-5xl mb-4">📹</span>
                <p>اختار فيديو من القائمة عشان تراجعه وتقيمه.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

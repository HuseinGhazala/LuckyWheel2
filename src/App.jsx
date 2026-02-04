import React, { useState, useEffect, useRef } from 'react';
import { RotateCw, RefreshCw, ShoppingBag, XCircle, Gift, Sparkles, Loader2, Star, Volume2, VolumeX, User, Mail, Phone, Lock, CheckCircle, AlertCircle, Settings, Plus, Trash2, Save, Edit3, Ticket, List, Copy } from 'lucide-react';

// --- مكون الكونفيتي (Confetti Canvas) ---
const ConfettiEffect = ({ active }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        w: Math.random() * 10 + 5,
        h: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20 - 5,
        gravity: 0.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }

    let animationId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, index) => {
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();

        if (p.y > canvas.height) particles.splice(index, 1);
      });

      if (particles.length > 0) {
        animationId = requestAnimationFrame(render);
      }
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [active]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100]" />;
};

const LuckyWheel = () => {
  const apiKey = ""; 

  // --- إعدادات جوجل شيت ---
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwnA-QJ1XgQA5YT_JcXZjXzp5tivxSrv1gW7ruMHs-0RrhXTkdfBfnFoxgir2G3ks7-1A/exec"; 

  // تعريف الكوبونات الافتراضية
  const initialSegments = [
    { id: 1, text: "خصم 10%", value: "10% OFF", color: "#3B82F6", type: "prize", couponCodes: [], probability: 30 },
    { id: 2, text: "شحن مجاني", value: "FREE SHIP", color: "#10B981", type: "prize", couponCodes: [], probability: 25 },
    { id: 3, text: "حظ أوفر", value: "HARD LUCK", color: "#475569", type: "luck", couponCodes: [], probability: 20 },
    { id: 4, text: "خصم 50%", value: "50% OFF", color: "#8B5CF6", type: "prize", couponCodes: [], probability: 15 },
    { id: 5, text: "خصم 70%", value: "70% OFF", color: "#F59E0B", type: "prize", couponCodes: [], probability: 7 },
    { id: 6, text: "خصم 100%", value: "100% OFF", color: "#EF4444", type: "prize", couponCodes: [], probability: 3 },
  ];

  const [segments, setSegments] = useState(initialSegments);
  const [availableIds, setAvailableIds] = useState(initialSegments.map(s => s.id));
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState(null);
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiContent, setAiContent] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // حالات الإضاءة والصوت
  const [lightIndex, setLightIndex] = useState(0); 
  const [isMuted, setIsMuted] = useState(false);

  // --- حالات تسجيل بيانات العميل ---
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [isRegistered, setIsRegistered] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // --- حالات لوحة التحكم (Dashboard) ---
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardPassword, setDashboardPassword] = useState('');
  const [isDashboardUnlocked, setIsDashboardUnlocked] = useState(false);
  const [tempSegments, setTempSegments] = useState(initialSegments);
  
  // حالة إدارة الكوبونات داخل الداشبورد
  const [editingCouponsId, setEditingCouponsId] = useState(null); 
  const [couponInput, setCouponInput] = useState(''); 

  // مراجع الملفات الصوتية
  const spinAudioRef = useRef(null);
  const winAudioRef = useRef(null);
  const loseAudioRef = useRef(null);

  useEffect(() => {
    spinAudioRef.current = new Audio('https://www.soundjay.com/misc/sounds/drum-roll-01.mp3'); 
    winAudioRef.current = new Audio('https://www.soundjay.com/human/sounds/applause-01.mp3'); 
    loseAudioRef.current = new Audio('https://www.soundjay.com/misc/sounds/fail-trombone-01.mp3');

    if(spinAudioRef.current) spinAudioRef.current.volume = 0.8;
    if(winAudioRef.current) winAudioRef.current.volume = 0.7;
    if(loseAudioRef.current) loseAudioRef.current.volume = 0.6;
  }, []);

  const segmentSize = 360 / segments.length;

  useEffect(() => {
    let interval;
    if (isSpinning) {
      interval = setInterval(() => {
        setLightIndex(prev => (prev + 1) % 2); 
      }, 100);
    } else {
      interval = setInterval(() => {
        setLightIndex(prev => (prev + 1) % 2);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isSpinning]);

  const getWheelCoordinates = (degrees) => {
    const angleInRadians = (degrees - 90) * (Math.PI / 180.0);
    return {
      x: 50 + 50 * Math.cos(angleInRadians),
      y: 50 + 50 * Math.sin(angleInRadians),
    };
  };

  const describeArc = (startAngle, endAngle) => {
    const start = getWheelCoordinates(endAngle);
    const end = getWheelCoordinates(startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", 50, 50,
      "L", start.x, start.y,
      "A", 50, 50, 0, largeArcFlag, 0, end.x, end.y,
      "L", 50, 50
    ].join(" ");
  };

  // دالة اختيار جائزة بناءً على الأوزان (الاحتمالات)
  const selectWeightedSegment = (availableSegmentIds) => {
    const availableSegments = segments.filter(s => availableSegmentIds.includes(s.id));
    
    // حساب مجموع الأوزان
    const totalWeight = availableSegments.reduce((sum, seg) => sum + (seg.probability || 10), 0);
    
    // اختيار رقم عشوائي بين 0 ومجموع الأوزان
    let random = Math.random() * totalWeight;
    
    // البحث عن الجائزة المناسبة بناءً على الوزن
    for (const segment of availableSegments) {
      const weight = segment.probability || 10;
      if (random < weight) {
        return segment.id;
      }
      random -= weight;
    }
    
    // في حالة الخطأ، نعيد الجائزة الأخيرة
    return availableSegments[availableSegments.length - 1].id;
  };

  // دالة Gemini الآن تستخدم فقط إذا لم يكن هناك كوبونات مخزنة مسبقاً
  const generateGeminiContent = async (prizeText, prizeType) => {
    if (prizeType === 'luck') return null;
    setIsLoadingAI(true);
    setAiContent(null);
    try {
      const prompt = `
        You are a creative marketing assistant. A user won "${prizeText}".
        Generate a unique, funny, uppercase coupon code (max 12 chars).
        Write a short, witty congratulatory sentence in Egyptian Arabic (max 10 words).
        Return JSON: { "code": "CODE", "message": "Arabic msg" }
      `;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          }),
        }
      );
      const data = await response.json();
      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (resultText) setAiContent(JSON.parse(resultText));
    } catch (error) {
      console.error("AI Error", error);
      setAiContent({ code: `WIN-${Math.floor(Math.random()*1000)}`, message: "مبروك الفوز! 🎉" });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const spinWheel = (isAutoSpin = false) => {
    const isSystemSpin = typeof isAutoSpin === 'boolean' && isAutoSpin === true;

    if (!isSystemSpin && !isRegistered) {
        setShowRegistrationModal(true);
        return;
    }

    if (isSpinning || availableIds.length === 0) return;
    
    if (!isMuted && spinAudioRef.current) {
        spinAudioRef.current.currentTime = 0;
        spinAudioRef.current.loop = true; 
        spinAudioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }

    setIsSpinning(true);
    setWinner(null);
    setShowModal(false);
    setCopied(false);
    setAiContent(null);
    setShowConfetti(false);

    // استخدام نظام الأوزان لاختيار الجائزة
    const winningId = selectWeightedSegment(availableIds);
    const winningSegment = segments.find(s => s.id === winningId);
    
    // --- منطق سحب الكوبون ---
    let assignedCode = null;
    let assignedMessage = null;

    if (winningSegment.type === 'prize') {
        // 1. التحقق من وجود كوبونات مخزنة
        if (winningSegment.couponCodes && winningSegment.couponCodes.length > 0) {
            assignedCode = winningSegment.couponCodes[0]; // أخذ الكوبون الأول
            assignedMessage = "استخدم هذا الكوبون الآن! 🚀"; 
            
            // تحديث المخزون وحذف الكوبون المستخدم
            const updatedSegments = segments.map(s => {
                if (s.id === winningSegment.id) {
                    return { ...s, couponCodes: s.couponCodes.slice(1) };
                }
                return s;
            });
            setSegments(updatedSegments); // تحديث الحالة
            
            setTempSegments(updatedSegments); 

            setAiContent({ code: assignedCode, message: assignedMessage });
        } else {
            // 2. إذا لم يوجد كوبونات، استخدم Gemini
            generateGeminiContent(winningSegment.text, winningSegment.type);
        }
    }

    const visualIndex = segments.findIndex(s => s.id === winningId);
    
    const segmentCenterAngle = (visualIndex * segmentSize) + (segmentSize / 2);
    const correctionAngle = 360 - segmentCenterAngle;
    const currentMod = rotation % 360;
    const distanceToTarget = (correctionAngle - currentMod + 360) % 360;
    const finalRotation = rotation + (360 * 5) + distanceToTarget;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(winningSegment);
      setShowModal(true);
      
      if (!isMuted) {
          if (spinAudioRef.current) {
              spinAudioRef.current.pause();
              spinAudioRef.current.currentTime = 0;
          }
          
          if (winningSegment.type === 'luck' && loseAudioRef.current) {
               loseAudioRef.current.currentTime = 0;
               loseAudioRef.current.play().catch(e => {});
          } else if (winAudioRef.current) {
               winAudioRef.current.currentTime = 0;
               winAudioRef.current.play().catch(e => {});
               setShowConfetti(true);
               setTimeout(() => setShowConfetti(false), 5000);
          }
      } else {
         if (winningSegment.type === 'prize') {
             setShowConfetti(true);
             setTimeout(() => setShowConfetti(false), 5000);
         }
      }

      if (winningSegment.type === 'prize') setHistory(prev => [...prev, { ...winningSegment, wonCode: assignedCode }]);
      setAvailableIds(prev => prev.filter(id => id !== winningId));
    }, 4500);
  };

  const resetGame = () => {
    setAvailableIds(segments.map(s => s.id));
    setHistory([]);
    setWinner(null);
    setRotation(0);
    setShowModal(false);
    setCopied(false);
    setAiContent(null);
    setShowConfetti(false);
  };

  const handleCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    try {
      if(document.execCommand('copy')) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {}
    document.body.removeChild(textArea);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const handleRegistration = async (e) => {
    e.preventDefault();
    setPhoneError('');

    const phoneRegex = /^\+[1-9]\d{7,14}$/;

    if (!phoneRegex.test(userData.phone)) {
        setPhoneError('يرجى إدخال رقم صحيح يبدأ بكود الدولة (مثال: +201000000000)');
        return;
    }
    
    if (userData.name && userData.email && userData.phone) {
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('name', userData.name);
            formData.append('email', userData.email);
            formData.append('phone', userData.phone);
            formData.append('timestamp', new Date().toISOString());

            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' 
            });

            setIsRegistered(true);
            setShowRegistrationModal(false); 
            
            setTimeout(() => {
                spinWheel(true); 
            }, 500);

        } catch (error) {
            console.error("Error sending data:", error);
            alert("حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى.");
        } finally {
            setIsSubmitting(false);
        }
    }
  };

  // --- منطق لوحة التحكم ---
  const handleOpenDashboard = () => {
      setTempSegments(segments);
      setShowDashboard(true);
  };

  const handleUnlockDashboard = (e) => {
      e.preventDefault();
      if (dashboardPassword === 'admin') {
          setIsDashboardUnlocked(true);
      } else {
          alert('كلمة المرور غير صحيحة');
      }
  };

  const handleSegmentChange = (index, field, value) => {
      const updated = [...tempSegments];
      updated[index] = { ...updated[index], [field]: value };
      setTempSegments(updated);
  };

  const handleAddSegment = () => {
      const newId = tempSegments.length > 0 ? Math.max(...tempSegments.map(s => s.id)) + 1 : 1;
      setTempSegments([...tempSegments, { id: newId, text: "جائزة جديدة", value: "NEW", color: "#3B82F6", type: "prize", couponCodes: [], probability: 10 }]);
  };

  const handleDeleteSegment = (id) => {
      if (tempSegments.length <= 2) {
          alert("يجب أن تحتوي العجلة على قطاعين على الأقل!");
          return;
      }
      setTempSegments(tempSegments.filter(s => s.id !== id));
  };

  const openCouponManager = (id) => {
      const segment = tempSegments.find(s => s.id === id);
      if (segment) {
          setEditingCouponsId(id);
          setCouponInput(segment.couponCodes ? segment.couponCodes.join('\n') : '');
      }
  };

  const saveCoupons = () => {
      const codesArray = couponInput.split('\n').map(c => c.trim()).filter(c => c !== '');
      
      const updated = tempSegments.map(s => {
          if (s.id === editingCouponsId) {
              return { ...s, couponCodes: codesArray };
          }
          return s;
      });
      
      setTempSegments(updated);
      setEditingCouponsId(null);
  };

  const handleSaveDashboard = () => {
      setSegments(tempSegments);
      setAvailableIds(tempSegments.map(s => s.id));
      setHistory([]);
      setShowDashboard(false);
      setRotation(0);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans text-slate-100 overflow-hidden relative" dir="rtl">
      
      <ConfettiEffect active={showConfetti} />

      {/* --- زر الإعدادات (Admin) --- */}
      <button 
        onClick={handleOpenDashboard}
        className="absolute top-4 left-4 z-40 bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
        title="إعدادات العجلة"
      >
        <Settings size={20} />
      </button>

      {/* --- شاشة لوحة التحكم (Dashboard Overlay) --- */}
      {showDashboard && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md animate-fade-in">
              <div className="bg-white text-slate-900 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
                  
                  {/* زر الإغلاق */}
                  <button 
                      onClick={() => setShowDashboard(false)}
                      className="absolute top-4 left-4 p-2 bg-slate-100 rounded-full hover:bg-red-100 text-slate-500 hover:text-red-500 transition-colors z-10"
                  >
                      <XCircle size={24} />
                  </button>

                  {!isDashboardUnlocked ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                          <div className="bg-slate-100 p-4 rounded-full mb-4">
                              <Lock size={48} className="text-slate-400" />
                          </div>
                          <h2 className="text-2xl font-bold mb-2">لوحة التحكم محمية</h2>
                          <p className="text-slate-500 mb-6">أدخل كلمة المرور للمتابعة </p>
                          <form onSubmit={handleUnlockDashboard} className="flex gap-2 w-full max-w-xs">
                              <input 
                                  type="password" 
                                  placeholder="كلمة المرور" 
                                  className="flex-1 px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 outline-none text-center"
                                  value={dashboardPassword}
                                  onChange={(e) => setDashboardPassword(e.target.value)}
                                  autoFocus
                              />
                              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700">دخول</button>
                          </form>
                      </div>
                  ) : (
                      <div className="flex flex-col h-full">
                          <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                              <div>
                                  <h2 className="text-2xl font-black flex items-center gap-2 text-slate-800">
                                      <Edit3 className="text-blue-600" /> إدارة الكوبونات والجوائز
                                  </h2>
                                  <p className="text-sm text-slate-500">قم بتعديل الجوائز وإدخال الكوبونات (يمكنك إدخال حتى 100+ كوبون لكل جائزة)</p>
                                  <div className="mt-2 flex items-center gap-2">
                                      <span className="text-xs font-bold text-slate-600">إجمالي النسب:</span>
                                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                                          tempSegments.reduce((sum, s) => sum + (s.probability || 10), 0) === 100 
                                          ? 'bg-green-100 text-green-700' 
                                          : 'bg-yellow-100 text-yellow-700'
                                      }`}>
                                          {tempSegments.reduce((sum, s) => sum + (s.probability || 10), 0)}%
                                      </span>
                                      {tempSegments.reduce((sum, s) => sum + (s.probability || 10), 0) !== 100 && (
                                          <span className="text-xs text-yellow-600">⚠️ النسب لا تساوي 100%</span>
                                      )}
                                  </div>
                              </div>
                              <button 
                                  onClick={handleSaveDashboard}
                                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                              >
                                  <Save size={18} /> حفظ التغييرات
                              </button>
                          </div>

                          <div className="flex-1 overflow-y-auto p-6 bg-slate-100 relative">
                              {/* --- نافذة تحرير الكوبونات المنبثقة --- */}
                              {editingCouponsId && (
                                  <div className="absolute inset-0 z-20 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                                      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl flex flex-col h-[80%] overflow-hidden animate-bounce-in">
                                          <div className="p-4 border-b flex justify-between items-center bg-blue-50">
                                              <h3 className="font-bold flex items-center gap-2">
                                                  <Ticket className="text-blue-500" /> أدخل أكواد الكوبونات
                                              </h3>
                                              <button onClick={() => setEditingCouponsId(null)} className="text-slate-400 hover:text-red-500"><XCircle /></button>
                                          </div>
                                          <div className="p-4 flex-1 flex flex-col">
                                              <p className="text-sm text-slate-500 mb-2">الصق الأكواد هنا (كود واحد في كل سطر):</p>
                                              <textarea 
                                                  className="flex-1 w-full border-2 border-slate-200 rounded-lg p-3 font-mono text-sm outline-none focus:border-blue-500 resize-none"
                                                  placeholder="CODE1&#10;CODE2&#10;CODE3..."
                                                  value={couponInput}
                                                  onChange={(e) => setCouponInput(e.target.value)}
                                              ></textarea>
                                              <div className="mt-2 text-xs text-right text-slate-400">
                                                  العدد الحالي: {couponInput.split('\n').filter(x=>x.trim()).length}
                                              </div>
                                          </div>
                                          <div className="p-4 border-t bg-slate-50">
                                              <button onClick={saveCoupons} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">حفظ القائمة</button>
                                          </div>
                                      </div>
                                  </div>
                              )}

                              <div className="grid gap-4">
                                  {tempSegments.map((seg, index) => (
                                      <div key={seg.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col lg:flex-row items-start lg:items-center gap-4 animate-fade-in-up">
                                          <div className="bg-slate-100 p-2 rounded-lg font-bold text-slate-400 w-8 h-8 flex items-center justify-center shrink-0">
                                              {index + 1}
                                          </div>
                                          
                                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
                                              <div className="flex flex-col gap-1">
                                                  <label className="text-xs font-bold text-slate-400">اسم الجائزة (عربي)</label>
                                                  <input 
                                                      type="text" 
                                                      value={seg.text} 
                                                      onChange={(e) => handleSegmentChange(index, 'text', e.target.value)}
                                                      className="border border-slate-300 rounded px-2 py-1.5 focus:border-blue-500 outline-none w-full"
                                                  />
                                              </div>
                                              <div className="flex flex-col gap-1">
                                                  <label className="text-xs font-bold text-slate-400">النوع</label>
                                                  <select 
                                                      value={seg.type} 
                                                      onChange={(e) => handleSegmentChange(index, 'type', e.target.value)}
                                                      className="border border-slate-300 rounded px-2 py-1.5 focus:border-blue-500 outline-none bg-white w-full"
                                                  >
                                                      <option value="prize">جائزة (Prize)</option>
                                                      <option value="luck">خسارة (Luck)</option>
                                                  </select>
                                              </div>
                                              <div className="flex flex-col gap-1">
                                                  <label className="text-xs font-bold text-slate-400">اللون</label>
                                                  <div className="flex gap-2 items-center">
                                                      <input 
                                                          type="color" 
                                                          value={seg.color} 
                                                          onChange={(e) => handleSegmentChange(index, 'color', e.target.value)}
                                                          className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                                      />
                                                      <span className="text-xs text-slate-500 font-mono">{seg.color}</span>
                                                  </div>
                                              </div>
                                              <div className="flex flex-col gap-1">
                                                  <label className="text-xs font-bold text-slate-400">القيمة/العرض</label>
                                                  <input 
                                                      type="text" 
                                                      value={seg.value} 
                                                      onChange={(e) => handleSegmentChange(index, 'value', e.target.value)}
                                                      className="border border-slate-300 rounded px-2 py-1.5 focus:border-blue-500 outline-none w-full font-mono text-sm"
                                                      dir="ltr"
                                                  />
                                              </div>
                                              <div className="flex flex-col gap-1">
                                                  <label className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                                      نسبة الظهور (%)
                                                      <span className="text-[10px] text-slate-400 font-normal">
                                                          ({seg.probability || 10})
                                                      </span>
                                                  </label>
                                                  <input 
                                                      type="number" 
                                                      min="0" 
                                                      max="100" 
                                                      step="1"
                                                      value={seg.probability || 10} 
                                                      onChange={(e) => {
                                                          const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                                                          handleSegmentChange(index, 'probability', val);
                                                      }}
                                                      className="border border-slate-300 rounded px-2 py-1.5 focus:border-blue-500 outline-none w-full font-mono text-sm"
                                                      dir="ltr"
                                                  />
                                                  <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                                                      <div 
                                                          className="bg-blue-500 h-1.5 rounded-full transition-all"
                                                          style={{ width: `${Math.min(100, (seg.probability || 10))}%` }}
                                                      ></div>
                                                  </div>
                                              </div>
                                          </div>

                                          <div className="flex items-center gap-2">
                                              <button 
                                                  onClick={() => openCouponManager(seg.id)}
                                                  className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors relative border border-blue-100"
                                                  title="إدارة الكوبونات"
                                              >
                                                  <Ticket size={20} />
                                                  {seg.couponCodes && seg.couponCodes.length > 0 && (
                                                      <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm">
                                                          {seg.couponCodes.length}
                                                      </span>
                                                  )}
                                              </button>

                                              <button 
                                                  onClick={() => handleDeleteSegment(seg.id)}
                                                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors border border-red-100"
                                                  title="حذف"
                                              >
                                                  <Trash2 size={20} />
                                              </button>
                                          </div>
                                      </div>
                                  ))}
                              </div>

                              <button 
                                  onClick={handleAddSegment}
                                  className="mt-6 w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors bg-white hover:bg-blue-50"
                              >
                                  <Plus size={20} /> إضافة جائزة جديدة
                              </button>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* --- شاشة التسجيل (تظهر فقط عند الحاجة) --- */}
      {showRegistrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-fade-in">
           <div className="bg-white text-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-yellow-400 relative overflow-hidden transform animate-bounce-in">
              <button 
                  onClick={() => setShowRegistrationModal(false)}
                  className="absolute top-2 left-2 text-slate-400 hover:text-red-500 transition-colors p-2"
              >
                  <XCircle size={24} />
              </button>

              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500"></div>
              
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg animate-pulse">
                   <Gift size={40} className="text-yellow-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-2">خطوة واحدة للربح! 🎁</h2>
                <p className="text-slate-500">سجل بياناتك لتدور العجلة فوراً</p>
              </div>

              <form onSubmit={handleRegistration} className="space-y-4">
                 <div className="relative">
                    <User className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      placeholder="الاسم بالكامل"
                      required
                      className="w-full pr-10 pl-4 py-3 rounded-xl border-2 border-slate-200 focus:border-yellow-400 focus:ring-0 outline-none transition-all bg-slate-50"
                      value={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      disabled={isSubmitting}
                    />
                 </div>

                 <div className="relative">
                    <Mail className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="email" 
                      placeholder="البريد الإلكتروني"
                      required
                      className="w-full pr-10 pl-4 py-3 rounded-xl border-2 border-slate-200 focus:border-yellow-400 focus:ring-0 outline-none transition-all bg-slate-50"
                      value={userData.email}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                      disabled={isSubmitting}
                    />
                 </div>

                 <div className="relative">
                    <Phone className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="tel" 
                      placeholder="رقم الجوال (+20...)" 
                      required
                      className={`w-full pr-10 pl-4 py-3 rounded-xl border-2 focus:ring-0 outline-none transition-all bg-slate-50 text-left ${phoneError ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-yellow-400'}`}
                      value={userData.phone}
                      onChange={(e) => setUserData({...userData, phone: e.target.value})}
                      disabled={isSubmitting}
                      dir="ltr" 
                    />
                 </div>
                 {phoneError && (
                    <p className="text-red-500 text-xs flex items-center gap-1 mt-1 font-bold">
                        <AlertCircle size={12} /> {phoneError}
                    </p>
                 )}

                 <button 
                   type="submit"
                   disabled={isSubmitting}
                   className={`w-full font-bold py-4 rounded-xl shadow-lg transform transition-all flex items-center justify-center gap-2 text-lg mt-4
                     ${isSubmitting 
                        ? 'bg-slate-400 cursor-wait' 
                        : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 active:scale-95 text-white'
                     }
                   `}
                 >
                    {isSubmitting ? (
                        <> <Loader2 size={20} className="animate-spin" /> جاري الحفظ... </>
                    ) : (
                        <> <Lock size={20} /> سجل والعب الآن </>
                    )}
                 </button>
                 
                 <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
                    <CheckCircle size={12} className="text-green-500" /> بياناتك آمنة ولن يتم مشاركتها.
                 </p>
              </form>
           </div>
        </div>
      )}

      {/* Header */}
      <header className="mb-8 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] mb-2 tracking-wider uppercase" 
            style={{ textShadow: '4px 4px 0px #F59E0B' }}>
          عجلة الحظ
        </h1>
        <div className="flex items-center justify-center gap-4">
             <p className="text-yellow-400 font-bold bg-black/30 px-4 py-1 rounded-full border border-yellow-500/50 inline-flex items-center gap-2">
                <Sparkles size={16} /> جوائز حقيقية ومضمونة
            </p>
            <button 
                onClick={toggleMute}
                className="bg-black/30 p-2 rounded-full border border-slate-600 hover:bg-black/50 transition-colors text-slate-300"
                title={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
            >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
        </div>
      </header>

      <div className={`flex flex-col lg:flex-row items-center gap-12 w-full max-w-6xl relative z-10 transition-all duration-500 ${showRegistrationModal || showDashboard ? 'opacity-40 blur-sm pointer-events-none' : 'opacity-100'}`}>
        
        {/* === Wheel Section === */}
        <div className="relative group perspective-1000 transform hover:scale-[1.02] transition-transform duration-500">
          
          {/* Pointer (Red Triangle) */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 drop-shadow-xl filter">
             <div className="w-14 h-16 bg-red-600 clip-path-pointer shadow-lg relative border-t-4 border-red-800">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-900 rounded-full mt-1"></div>
             </div>
          </div>

          {/* Outer Rim (Background) */}
          <div className="w-[340px] h-[340px] md:w-[420px] md:h-[420px] rounded-full bg-gradient-to-b from-yellow-600 to-yellow-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center relative border-4 border-yellow-900">
             
             {/* The Wheel Itself - Pure SVG */}
             <div 
                className="w-[300px] h-[300px] md:w-[380px] md:h-[380px] rounded-full shadow-inner relative overflow-hidden transition-transform duration-[4500ms] cubic-bezier(0.15, 0, 0.15, 1) z-10 bg-white"
                style={{ 
                  transform: `rotate(${rotation}deg)` 
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Draw Segments */}
                  {segments.map((segment, index) => {
                    const isUsed = !availableIds.includes(segment.id);
                    const startAngle = index * segmentSize;
                    const endAngle = (index + 1) * segmentSize;
                    
                    return (
                      <g key={segment.id}>
                        <path
                          d={describeArc(startAngle, endAngle)}
                          fill={isUsed ? '#cbd5e1' : segment.color}
                          stroke="white"
                          strokeWidth="0.5"
                          style={{
                             filter: isUsed ? 'grayscale(100%)' : 'none',
                             opacity: isUsed ? 0.8 : 1,
                             transition: 'fill 0.3s'
                          }}
                        />
                      </g>
                    );
                  })}
                  
                  {/* Draw Text & Icons Overlay */}
                  {segments.map((segment, index) => {
                     const isUsed = !availableIds.includes(segment.id);
                     const midAngle = (index * segmentSize) + (segmentSize / 2);
                     const rad = (midAngle - 90) * (Math.PI / 180);
                     const tx = 50 + 32 * Math.cos(rad);
                     const ty = 50 + 32 * Math.sin(rad);
                     
                     return (
                        <g 
                            key={`text-${segment.id}`} 
                            transform={`translate(${tx}, ${ty}) rotate(${midAngle + 90})`}
                            style={{ pointerEvents: 'none' }}
                        >
                            <text
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill={isUsed ? '#64748b' : 'white'}
                                fontSize={Math.min(4.5, 30 / segment.text.length + 2)}
                                fontWeight="900"
                                style={{ 
                                    textShadow: isUsed ? 'none' : '0px 1px 2px rgba(0,0,0,0.5)',
                                    fontFamily: 'sans-serif'
                                }}
                            >
                                {segment.value}
                            </text>
                            {!isUsed && (
                                <text
                                    y="7"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="white"
                                    fontSize="4"
                                >
                                    {segment.type === 'luck' ? '✖' : '★'}
                                </text>
                            )}
                        </g>
                     );
                  })}
                </svg>
             </div>

             {/* Center Button (Hub) */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <button
                  onClick={spinWheel}
                  disabled={isSpinning || availableIds.length === 0}
                  className={`
                    w-20 h-20 rounded-full flex items-center justify-center 
                    shadow-[0_5px_0_rgba(0,0,0,0.2),0_10px_20px_rgba(0,0,0,0.4)]
                    border-[6px] border-white transition-all duration-150 transform active:translate-y-1 active:shadow-none
                    ${availableIds.length === 0 
                      ? 'bg-slate-400 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-500 text-white'
                    }
                  `}
                >
                  <span className="font-black text-lg uppercase tracking-wider">
                    {availableIds.length === 0 ? "END" : "SPIN"}
                  </span>
                </button>
             </div>

             {/* Dynamic Lamps (Pegs) */}
             {[...Array(16)].map((_, i) => {
                const angleDeg = (i * (360 / 16)); 
                const angleRad = (angleDeg * Math.PI) / 180;
                const radiusPercent = 47; 
                const left = 50 + radiusPercent * Math.cos(angleRad);
                const top = 50 + radiusPercent * Math.sin(angleRad);
                
                let isActive = false;
                let lampColor = 'bg-white';
                let shadowColor = 'rgba(255,255,255,0.8)';

                if (isSpinning) {
                    if (lightIndex === 0) {
                        isActive = i % 2 === 0;
                        lampColor = isActive ? 'bg-yellow-300' : 'bg-red-500';
                        shadowColor = isActive ? '#FCD34D' : '#EF4444';
                    } else {
                        isActive = i % 2 !== 0;
                        lampColor = isActive ? 'bg-blue-400' : 'bg-green-500';
                        shadowColor = isActive ? '#60A5FA' : '#10B981';
                    }
                } else {
                    isActive = (i + lightIndex) % 2 === 0;
                    lampColor = isActive ? 'bg-white' : 'bg-yellow-200';
                }

                return (
                    <div 
                        key={i}
                        className={`absolute w-3 h-3 md:w-4 md:h-4 rounded-full border border-slate-200 transition-colors duration-200 ${lampColor}`}
                        style={{
                            left: `${left}%`,
                            top: `${top}%`,
                            transform: 'translate(-50%, -50%)',
                            boxShadow: isActive ? `0 0 10px 2px ${shadowColor}` : 'none'
                        }}
                    ></div>
                );
             })}

          </div>
        </div>

        {/* === Dashboard === */}
        <div className="flex-1 w-full max-w-md bg-white text-slate-800 p-6 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] border-4 border-slate-200">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-xl font-black flex items-center gap-2 text-slate-800">
              <ShoppingBag className="text-red-500" />
              الجوائز المكتسبة
            </h2>
            <button 
              onClick={resetGame}
              className={`text-xs flex items-center gap-1 transition-all px-3 py-1.5 rounded-full font-bold uppercase
                ${availableIds.length === 0 ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:text-white hover:bg-red-500'}
              `}
            >
              <RefreshCw size={14} />
              New Game
            </button>
          </div>

          <div className="space-y-3 min-h-[200px] pr-2">
            {history.length === 0 ? (
              <div className="text-center text-slate-400 py-10 flex flex-col items-center border-2 border-dashed border-slate-200 rounded-2xl">
                <RotateCw className="mb-3 opacity-30 animate-spin-slow" size={40} />
                <p className="font-bold">جرب حظك الآن!</p>
              </div>
            ) : (
              history.map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl flex justify-between items-center border border-slate-200 shadow-sm animate-fade-in-up">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm" style={{ backgroundColor: item.color }}>
                      <Gift size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{item.text}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1">
                        كوبون ذكي <Sparkles size={8} className="text-yellow-500"/>
                      </p>
                    </div>
                  </div>
                  <span className="text-green-600 bg-green-100 text-xs px-2 py-1 rounded font-bold">فوز</span>
                </div>
              ))
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
             <div className="flex justify-between text-xs text-slate-400 mb-1 font-bold uppercase">
               <span>المحاولات المتبقية</span>
               <span>{availableIds.length}</span>
             </div>
             <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                <div 
                   className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500 relative"
                   style={{ width: `${(availableIds.length / segments.length) * 100}%` }}
                >
                    <div className="absolute inset-0 bg-white/30 w-full h-full" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* === Winner Modal === */}
      {showModal && winner && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center relative shadow-2xl transform scale-100 transition-all border-8 border-yellow-400">
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <XCircle size={24} />
            </button>
            
            <div 
                className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-xl border-4 border-white text-white" 
                style={{ backgroundColor: winner.color }}
            >
              {winner.type === 'luck' ? '😔' : '🎉'}
            </div>
            
            <h2 className="text-3xl font-black mb-2 text-slate-800">
              {winner.type === 'luck' ? 'يا خسارة!' : 'مبروك عليك!'}
            </h2>
            
            <div className="mb-6">
               {winner.type === 'luck' ? (
                   <p className="text-slate-500 font-medium">حاول مرة تانية، أكيد هتكسب!</p>
               ) : (
                   <div className="w-full">
                       <p className="text-xl font-bold text-slate-800 mb-2">{winner.text}</p>
                       
                       {/* AI Message */}
                       {isLoadingAI ? (
                           <div className="flex items-center justify-center gap-2 text-sm text-blue-600 bg-blue-50 py-2 rounded-lg animate-pulse">
                               <Loader2 className="animate-spin" size={16} /> جاري تجهيز الهدية...
                           </div>
                       ) : aiContent ? (
                           <p className="text-sm text-slate-600 bg-yellow-50 p-2 rounded-lg border border-yellow-200 italic">
                               "{aiContent.message}"
                           </p>
                       ) : null}
                   </div>
               )}
            </div>

            {winner.type === 'prize' && (
              <div 
                className={`p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer relative overflow-hidden group ${copied ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'}`} 
                onClick={() => aiContent ? handleCopy(aiContent.code) : null}
              >
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">اضغط للنسخ</p>
                {isLoadingAI ? (
                    <div className="h-8 w-32 bg-slate-200 mx-auto rounded animate-pulse"></div>
                ) : (
                    <code className="text-2xl font-black tracking-widest text-slate-800">
                        {aiContent ? aiContent.code : "..."}
                    </code>
                )}
                {copied && <div className="absolute inset-0 flex items-center justify-center bg-green-500/90 text-white font-bold">تم النسخ!</div>}
              </div>
            )}

            <button 
              onClick={() => setShowModal(false)}
              className="mt-6 w-full py-4 rounded-xl text-white font-black text-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1 transition-all"
              style={{ backgroundColor: winner.color }}
            >
              {availableIds.length > 0 ? 'لف تاني' : 'انهاء'}
            </button>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        .clip-path-pointer {
            clip-path: polygon(50% 100%, 0 0, 100% 0);
        }
        .perspective-1000 {
            perspective: 1000px;
        }
        .animate-spin-slow {
            animation: spin 3s linear infinite;
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); opacity: 1; }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); }
        }
        .animate-bounce-in {
            animation: bounceIn 0.5s cubic-bezier(0.215, 0.610, 0.355, 1.000);
        }
      `}</style>
    </div>
  );
};

export default LuckyWheel;

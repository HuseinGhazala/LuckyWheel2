import React, { useState, useEffect, useRef } from 'react';
import { 
  RotateCw, RefreshCw, ShoppingBag, XCircle, Gift, Sparkles, Loader2, Star, 
  Volume2, VolumeX, User, Mail, Phone, Lock, CheckCircle, AlertCircle, 
  Settings, Plus, Trash2, Save, Edit3, Ticket, List, Copy, Scale, Hash, 
  Upload, Image as ImageIcon, Share2,
  Database, Link as LinkIcon, ExternalLink, Play, Palette, Smartphone, Monitor,
  CreditCard, ShieldCheck
} from 'lucide-react';
import { 
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaTiktok,
  FaWhatsapp,
  FaGlobe
} from 'react-icons/fa6';
import { FaSnapchatGhost } from 'react-icons/fa';
import { getSettings as getSupabaseSettings, saveSettings as saveSupabaseSettings, saveUserData as saveSupabaseUserData, saveWinData as saveSupabaseWinData } from './lib/supabase';
import ConfettiEffect from './components/ConfettiEffect.jsx';
import Footer from './components/Footer.jsx';
import RegistrationModal from './components/RegistrationModal.jsx';
import WinnerModal from './components/WinnerModal.jsx';
import DashboardPanel from './components/DashboardPanel.jsx';
import Swal from 'sweetalert2';

// إعدادات افتراضية للعربية و RTL
const Toast = Swal.mixin({
  customClass: { popup: 'swal2-rtl', title: 'text-right', htmlContainer: 'text-right' },
  confirmButtonText: 'حسناً'
});

// مكون منفصل ومخزن - لا يعاد عرضه عند تغيير lightIndex أو rotation
const SocialLinksBar = React.memo(({ socialLinks }) => {
  const has = socialLinks?.facebook || socialLinks?.instagram || socialLinks?.twitter || socialLinks?.whatsapp || socialLinks?.snapchat || socialLinks?.website || socialLinks?.tiktok;
  if (!has) return null;
  const SocialIcon = ({ href, icon: Icon, color, label }) => {
    if (!href) return null;
    const link = label === 'WhatsApp' ? `https://wa.me/${href.replace(/\D/g,'')}` : href;
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center  text-white hover:text-slate-900 hover:-translate-y-1 transition-all" aria-label={label} title={label}>
        <Icon size={25} color={color} />
      </a>
    );
  };
  return (
    <div className="mb-8 relative z-30 w-full flex justify-center animate-fade-in-up">
      <div className="backdrop-blur-md px-3 py-3 rounded-[16PX] border shadow-xl" style={{ backgroundColor: 'rgba(24, 156, 215, 1)', borderColor: 'rgba(24, 156, 215, 1)' }}>
        <div className="flex items-center gap-[0.4rem] flex-wrap justify-center">
          <SocialIcon href={socialLinks.facebook} icon={FaFacebookF} color="#ffffff" label="Facebook" />
          <SocialIcon href={socialLinks.instagram} icon={FaInstagram} color="#ffffff" label="Instagram" />
          <SocialIcon href={socialLinks.twitter} icon={FaXTwitter} color="#ffffff" label="Twitter / X" />
          <SocialIcon href={socialLinks.snapchat} icon={FaSnapchatGhost} color="#ffffff" label="Snapchat" />
          <SocialIcon href={socialLinks.whatsapp} icon={FaWhatsapp} color="#ffffff" label="WhatsApp" />
          <SocialIcon href={socialLinks.website} icon={FaGlobe} color="#ffffff" label="Website" />
          <SocialIcon href={socialLinks.tiktok} icon={FaTiktok} color="#ffffff" label="TikTok" />
        </div>
      </div>
    </div>
  );
});

const LuckyWheel = () => {
  const apiKey = ""; 

  // لا يوجد رابط افتراضي - يجب إدخاله من لوحة التحكم 

  // تعريف الكوبونات الافتراضية مع الأوزان (الاحتمالات)
  const initialSegments = [
    { id: 1, text: "خصم 10%", value: "10% OFF", color: "#3B82F6", type: "prize", weight: 50, couponCodes: [] },
    { id: 2, text: "شحن مجاني", value: "FREE SHIP", color: "#10B981", type: "prize", weight: 30, couponCodes: [] },
    { id: 3, text: "حظ أوفر", value: "HARD LUCK", color: "#475569", type: "luck", weight: 100, couponCodes: [] },
    { id: 4, text: "خصم 50%", value: "50% OFF", color: "#8B5CF6", type: "prize", weight: 10, couponCodes: [] },
    { id: 5, text: "خصم 70%", value: "70% OFF", color: "#F59E0B", type: "prize", weight: 5, couponCodes: [] },
    { id: 6, text: "خصم 100%", value: "100% OFF", color: "#EF4444", type: "prize", weight: 1, couponCodes: [] },
  ];

  // دالة لتحميل البيانات من localStorage (fallback)
  const loadSettingsFromStorage = () => {
    try {
      const savedSegments = localStorage.getItem('wheelSegments');
      const savedMaxSpins = localStorage.getItem('maxSpins');
      const savedLogo = localStorage.getItem('storeLogo');
      const savedSocialLinks = localStorage.getItem('socialLinks');
      const savedBackgroundSettings = localStorage.getItem('backgroundSettings');
      const savedWinSound = localStorage.getItem('winSound');
      const savedLoseSound = localStorage.getItem('loseSound');
      const savedFooterSettings = localStorage.getItem('footerSettings');
      const savedEnableDevToolsProtection = localStorage.getItem('enableDevToolsProtection');
      const savedWheelStyle = localStorage.getItem('wheelStyle');
      const savedHeaderBadgeText = localStorage.getItem('headerBadgeText');
      
      return {
        segments: savedSegments ? JSON.parse(savedSegments) : initialSegments,
        maxSpins: savedMaxSpins ? parseInt(savedMaxSpins) : 1,
        logo: savedLogo || null,
        socialLinks: savedSocialLinks ? JSON.parse(savedSocialLinks) : {
          facebook: '',
          instagram: '',
          twitter: '',
          snapchat: '',
          whatsapp: '',
          website: '',
          email: '',
          phone: ''
        },
        backgroundSettings: savedBackgroundSettings ? JSON.parse(savedBackgroundSettings) : {
          type: 'color',
          color: '#ffffff',
          desktopImage: null,
          mobileImage: null
        },
        winSound: savedWinSound || "https://www.soundjay.com/human/sounds/applause-01.mp3",
        loseSound: savedLoseSound || "https://www.soundjay.com/misc/sounds/fail-trombone-01.mp3",
        footerSettings: savedFooterSettings ? JSON.parse(savedFooterSettings) : {
          description: '',
          links: [],
          taxId: '',
          businessPlatformId: ''
        },
        enableDevToolsProtection: savedEnableDevToolsProtection !== null ? savedEnableDevToolsProtection === 'true' : true,
        wheelStyle: 'classic',
        headerBadgeText: savedHeaderBadgeText || ''
      };
    } catch (error) {
      console.error('Error loading settings from storage:', error);
      return null;
    }
  };

  // دالة لجلب البيانات من السحابة (Supabase أو Google Sheets)
  const loadSettingsFromCloud = async () => {
    try {
      // محاولة تحميل من Supabase أولاً
      const useSupabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'YOUR_SUPABASE_URL';
      
      if (useSupabase) {
        console.log('🔄 جاري تحميل البيانات من Supabase...');
        const supabaseSettings = await getSupabaseSettings();
        if (supabaseSettings) {
          console.log('✅ تم تحميل البيانات من Supabase بنجاح!');
          return supabaseSettings;
        }
        console.warn('⚠️ لم يتم العثور على بيانات في Supabase، جاري المحاولة من Google Sheets...');
      }
      
      // إذا فشل Supabase أو لم يكن مفعّل، جرب Google Sheets فقط إذا كان الرابط موجود في Supabase
      const scriptUrl = googleScriptUrl;
      
      if (!scriptUrl || scriptUrl.trim() === '' || !scriptUrl.includes('script.google.com')) {
        console.warn('⚠️ رابط Google Script غير محدد في Supabase، استخدام البيانات المحلية');
        return loadSettingsFromStorage();
      }
      
      const url = `${scriptUrl}?action=getSettings&t=${Date.now()}`;
      console.log('🔄 جاري تحميل البيانات من Google Sheets:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('❌ خطأ في تحليل JSON:', e);
          return loadSettingsFromStorage();
        }
        
        if (data.success && data.settings) {
          console.log('✅ تم تحميل البيانات من Google Sheets بنجاح!');
          return data.settings;
        }
      }
      
    } catch (error) {
      console.error('❌ خطأ في تحميل البيانات من السحابة:', error);
    }
    
    // استخدام localStorage كبديل
    const localData = loadSettingsFromStorage();
    if (localData) {
      console.log('📦 استخدام البيانات المحلية كبديل');
      return localData;
    }
    
    return null;
  };

  // دالة لحفظ البيانات في السحابة (Supabase و Google Sheets معاً)
  const saveSettingsToCloud = async (settings) => {
    let supabaseSaved = false;
    let googleSheetsSaved = false;
    
    try {
      // حفظ في Supabase
      const useSupabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'YOUR_SUPABASE_URL';
      
      if (useSupabase) {
        console.log('💾 جاري حفظ البيانات في Supabase...');
        supabaseSaved = await saveSupabaseSettings(settings);
        if (supabaseSaved) {
          console.log('✅ تم حفظ البيانات في Supabase بنجاح!');
        } else {
          console.warn('⚠️ فشل حفظ البيانات في Supabase');
        }
      }
      
      // حفظ في Google Sheets أيضاً (فقط إذا كان الرابط موجود في Supabase)
      const scriptUrl = googleScriptUrl;
      console.log('🔍 رابط Google Script:', scriptUrl || 'غير محدد');
      
      if (scriptUrl && scriptUrl.trim() !== '' && scriptUrl.includes('script.google.com')) {
        console.log('💾 جاري حفظ البيانات في Google Sheets...');
        console.log('📊 البيانات المرسلة:', JSON.stringify(settings).substring(0, 200));
        
        try {
          const formData = new FormData();
          formData.append('action', 'saveSettings');
          formData.append('settings', JSON.stringify(settings));
          
          const response = await fetch(scriptUrl, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
          });
          
          // مع no-cors لا يمكننا قراءة الـ response، لكن الطلب تم إرساله
          googleSheetsSaved = true;
          console.log('✅ تم إرسال البيانات إلى Google Sheets (no-cors mode)');
          console.log('💡 تحقق من Google Sheet للتأكد من وصول البيانات');
        } catch (error) {
          console.error('❌ فشل حفظ البيانات في Google Sheets:', error);
          console.error('تفاصيل الخطأ:', error.message);
        }
      } else {
        console.warn('⚠️ رابط Google Script غير صحيح أو غير محدد:', scriptUrl);
        console.warn('💡 تأكد من إدخال رابط Google Script في لوحة التحكم');
      }
      
      // إرجاع true إذا تم الحفظ في أي مكان على الأقل
      return supabaseSaved || googleSheetsSaved;
    } catch (error) {
      console.error('❌ خطأ في حفظ البيانات في السحابة:', error);
      return supabaseSaved || googleSheetsSaved;
    }
  };

  // تحميل البيانات من localStorage عند التحميل (fallback)
  const loadedSettings = loadSettingsFromStorage();
  
  // --- States ---
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [segments, setSegments] = useState(loadedSettings?.segments || initialSegments);
  const [availableIds, setAvailableIds] = useState((loadedSettings?.segments || initialSegments).map(s => s.id));
  
  // التحكم في عدد المحاولات والشعار وروابط السوشيال ميديا ورابط السكربت والخلفية
  const [maxSpins, setMaxSpins] = useState(loadedSettings?.maxSpins || 1);
  const [remainingSpins, setRemainingSpins] = useState(loadedSettings?.maxSpins || 1);
  const [storeLogo, setStoreLogo] = useState(loadedSettings?.logo || null);
  
  // إعدادات الخلفية (محدثة لدعم صورتين)
  const [backgroundSettings, setBackgroundSettings] = useState(loadedSettings?.backgroundSettings || {
    type: 'color', // 'color' or 'image'
    color: '#ffffff',
    desktopImage: null,
    mobileImage: null
  });
  
  // --- Audio States (Defaults) ---
  const [winSound, setWinSound] = useState(loadedSettings?.winSound || "https://www.soundjay.com/human/sounds/applause-01.mp3");
  const [loseSound, setLoseSound] = useState(loadedSettings?.loseSound || "https://www.soundjay.com/misc/sounds/fail-trombone-01.mp3");
  
  // استرجاع الرابط من الإعدادات المحملة من Supabase فقط (لا توجد قيمة افتراضية)
  const [googleScriptUrl, setGoogleScriptUrl] = useState(() => {
    return loadedSettings?.googleScriptUrl || '';
  });

  // إعدادات الحماية من Developer Tools
  const [enableDevToolsProtection, setEnableDevToolsProtection] = useState(loadedSettings?.enableDevToolsProtection !== undefined ? loadedSettings.enableDevToolsProtection : true);

  // شكل العجلة
  const [wheelStyle, setWheelStyle] = useState(loadedSettings?.wheelStyle || 'classic');

  const [socialLinks, setSocialLinks] = useState(loadedSettings?.socialLinks || {
    facebook: '',
    instagram: '',
    twitter: '',
    snapchat: '',
    whatsapp: '',
    website: '',
    tiktok: '',
    email: '',
    phone: ''
  });

  // تحديث favicon بناءً على اللوجو المدخل
  useEffect(() => {
    if (storeLogo) {
      let link = document.querySelector("link[rel='icon']") || document.createElement('link');
      link.rel = 'icon';
      link.type = 'image/png';
      link.href = storeLogo;
      if (!link.parentNode) {
        document.head.appendChild(link);
      }
    }
  }, [storeLogo]);

  // إعدادات الفوتر
  const [footerSettings, setFooterSettings] = useState(loadedSettings?.footerSettings || {
    description: '',
    links: [],
    taxId: '',
    businessPlatformId: ''
  });

  // نص الشارة فوق العجلة
  const [headerBadgeText, setHeaderBadgeText] = useState(loadedSettings?.headerBadgeText || '');

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
  
  // حالات مؤقتة للداشبورد (قبل الحفظ)
  const [tempSegments, setTempSegments] = useState(initialSegments);
  const [tempMaxSpins, setTempMaxSpins] = useState(1);
  const [tempLogo, setTempLogo] = useState(null);
  const [tempSocialLinks, setTempSocialLinks] = useState({ ...socialLinks });
  const [tempFooterSettings, setTempFooterSettings] = useState({ ...footerSettings });
  const [tempHeaderBadgeText, setTempHeaderBadgeText] = useState(headerBadgeText);
  const [tempGoogleScriptUrl, setTempGoogleScriptUrl] = useState(googleScriptUrl);
  const [tempWinSound, setTempWinSound] = useState(winSound);
  const [tempLoseSound, setTempLoseSound] = useState(loseSound);
  const [tempBackgroundSettings, setTempBackgroundSettings] = useState(backgroundSettings);
  const [tempEnableDevToolsProtection, setTempEnableDevToolsProtection] = useState(enableDevToolsProtection);
  const [tempWheelStyle, setTempWheelStyle] = useState(wheelStyle);
  
  // حالة إدارة الكوبونات داخل الداشبورد
  const [editingCouponsId, setEditingCouponsId] = useState(null); 
  const [couponInput, setCouponInput] = useState(''); 

  // مراجع الملفات الصوتية
  const spinAudioRef = useRef(null);
  const winAudioRef = useRef(null);
  const loseAudioRef = useRef(null);
  const previewAudioRef = useRef(null); 

  // دالة مساعدة لتشغيل الصوت بأمان
  const safePlay = (audioRef) => {
    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          if (error.name !== 'AbortError') {
            console.log("Audio play blocked/failed", error);
          }
        });
      }
    }
  };

  // حماية من فتح Developer Tools (فقط إذا كان مفعلاً)
  useEffect(() => {
    if (!enableDevToolsProtection) {
      console.log('🔓 حماية Developer Tools معطلة');
      return;
    }

    console.log('🔒 تفعيل حماية Developer Tools');
    
    const preventDevTools = () => {
      // منع اختصارات لوحة المفاتيح
      const handleKeyDown = (e) => {
        // F12
        if (e.keyCode === 123) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && [73, 74, 67].includes(e.keyCode)) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        // Ctrl+S (Save Page)
        if (e.ctrlKey && e.keyCode === 83) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
        // Ctrl+P (Print)
        if (e.ctrlKey && e.keyCode === 80) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      };
      
      // منع النقر بالزر الأيمن
      const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
      
      // منع اختيار النص
      const handleSelectStart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
      
      // منع نسخ/قص النص
      const handleCopy = (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
      
      const handleCut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
      
      // كشف فتح DevTools
      let devtoolsOpen = false;
      const checkDevTools = setInterval(() => {
        const threshold = 160;
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
          if (!devtoolsOpen) {
            devtoolsOpen = true;
            // يمكن إضافة إجراء هنا
          }
        } else {
          devtoolsOpen = false;
        }
      }, 500);
      
      // إضافة Event Listeners
      document.addEventListener('keydown', handleKeyDown, true);
      document.addEventListener('contextmenu', handleContextMenu, true);
      document.addEventListener('selectstart', handleSelectStart, true);
      document.addEventListener('copy', handleCopy, true);
      document.addEventListener('cut', handleCut, true);
      
      // تنظيف عند إلغاء التثبيت
      return () => {
        document.removeEventListener('keydown', handleKeyDown, true);
        document.removeEventListener('contextmenu', handleContextMenu, true);
        document.removeEventListener('selectstart', handleSelectStart, true);
        document.removeEventListener('copy', handleCopy, true);
        document.removeEventListener('cut', handleCut, true);
        clearInterval(checkDevTools);
      };
    };
    
    const cleanup = preventDevTools();
    return cleanup;
  }, [enableDevToolsProtection]);

  useEffect(() => {
    spinAudioRef.current = new Audio('https://www.soundjay.com/misc/sounds/drum-roll-01.mp3'); 
    
    winAudioRef.current = new Audio(winSound); 
    loseAudioRef.current = new Audio(loseSound); 

    if(spinAudioRef.current) spinAudioRef.current.volume = 0.8;
    if(winAudioRef.current) winAudioRef.current.volume = 0.7;
    if(loseAudioRef.current) loseAudioRef.current.volume = 0.6;
  }, []);

  useEffect(() => {
    if(winAudioRef.current) winAudioRef.current.src = winSound;
  }, [winSound]);

  useEffect(() => {
    if(loseAudioRef.current) loseAudioRef.current.src = loseSound;
  }, [loseSound]);

  // تحميل البيانات من السحابة عند تحميل الصفحة
  useEffect(() => {
    const loadCloudSettings = async () => {
      setIsLoadingSettings(true);
      console.log('🚀 بدء تحميل الإعدادات من السحابة...');
      
      try {
        const cloudSettings = await loadSettingsFromCloud();
        
        if (cloudSettings && cloudSettings.segments) {
          console.log('✅ تم تحميل البيانات من السحابة، عدد الجوائز:', cloudSettings.segments.length);
          
          // التأكد من أن الكوبونات المستخدمة محذوفة
          const cleanedSegments = cloudSettings.segments.map(seg => ({
            ...seg,
            couponCodes: seg.couponCodes || [] // التأكد من وجود المصفوفة
          }));
          
          console.log('🔍 التحقق من الكوبونات:');
          cleanedSegments.forEach(seg => {
            if (seg.couponCodes && seg.couponCodes.length > 0) {
              console.log(`  - ${seg.text}: ${seg.couponCodes.length} كوبون متبقي`);
            }
          });
          
          // تحديث جميع الحالات بالبيانات من السحابة
          setSegments(cleanedSegments);
          setAvailableIds(cleanedSegments.map(s => s.id));
          setMaxSpins(cloudSettings.maxSpins || 1);
          setRemainingSpins(cloudSettings.maxSpins || 1);
          setStoreLogo(cloudSettings.logo || null);
          setSocialLinks(cloudSettings.socialLinks || {
            facebook: '',
            instagram: '',
            twitter: '',
            snapchat: '',
            whatsapp: '',
            website: '',
            email: '',
            phone: ''
          });
          const loadedFooterSettings = cloudSettings.footerSettings || {
            description: '',
            links: [],
            taxId: '',
            businessPlatformId: ''
          };
          setFooterSettings(loadedFooterSettings);
          setHeaderBadgeText(cloudSettings.headerBadgeText || '');
          console.log('✅ تم تحميل إعدادات الفوتر من السحابة:', {
            description: loadedFooterSettings.description?.substring(0, 50) + '...',
            linksCount: loadedFooterSettings.links?.length || 0,
            taxId: loadedFooterSettings.taxId
          });
          setBackgroundSettings(cloudSettings.backgroundSettings || {
            type: 'color',
            color: '#ffffff',
            desktopImage: null,
            mobileImage: null
          });
          setWinSound(cloudSettings.winSound || "https://www.soundjay.com/human/sounds/applause-01.mp3");
          setLoseSound(cloudSettings.loseSound || "https://www.soundjay.com/misc/sounds/fail-trombone-01.mp3");
          
          // تحديث رابط Google Script من السحابة فقط
          if (cloudSettings.googleScriptUrl) {
            setGoogleScriptUrl(cloudSettings.googleScriptUrl);
            console.log('✅ تم تحميل رابط Google Script من السحابة:', cloudSettings.googleScriptUrl);
          } else {
            // إذا لم يكن موجوداً في السحابة، امسح أي قيمة محلية
            setGoogleScriptUrl('');
          }
          
          // تحديث إعدادات الحماية من Developer Tools
          if (cloudSettings.enableDevToolsProtection !== undefined) {
            setEnableDevToolsProtection(cloudSettings.enableDevToolsProtection);
            localStorage.setItem('enableDevToolsProtection', cloudSettings.enableDevToolsProtection.toString());
            console.log('✅ تم تحميل إعدادات الحماية من السحابة:', cloudSettings.enableDevToolsProtection ? 'مفعّل' : 'معطّل');
          }
          
          // تحديث شكل العجلة — الديفولت كلاسيكي (خيار الحديث مخفي حالياً)
          setWheelStyle('classic');
          localStorage.setItem('wheelStyle', 'classic');
          console.log('✅ تم تحميل شكل العجلة من السحابة: classic');
          
          // حفظ في localStorage كنسخة احتياطية (باستخدام cleanedSegments)
          localStorage.setItem('wheelSegments', JSON.stringify(cleanedSegments));
          localStorage.setItem('maxSpins', (cloudSettings.maxSpins || 1).toString());
          if (cloudSettings.logo) {
            localStorage.setItem('storeLogo', cloudSettings.logo);
          } else {
            localStorage.removeItem('storeLogo');
          }
          localStorage.setItem('socialLinks', JSON.stringify(cloudSettings.socialLinks || {}));
          localStorage.setItem('footerSettings', JSON.stringify(cloudSettings.footerSettings || {
            description: '',
            links: [],
            taxId: '',
            businessPlatformId: ''
          }));
          localStorage.setItem('headerBadgeText', cloudSettings.headerBadgeText || '');
          localStorage.setItem('backgroundSettings', JSON.stringify(cloudSettings.backgroundSettings || {}));
          localStorage.setItem('winSound', cloudSettings.winSound || "");
          localStorage.setItem('loseSound', cloudSettings.loseSound || "");
          // لا نحفظ googleScriptUrl في localStorage - فقط في Supabase
          
          console.log('✅ تم تحديث جميع الإعدادات من السحابة بنجاح!');
        } else {
          console.warn('⚠️ لم يتم العثور على بيانات في السحابة، استخدام البيانات المحلية');
          // استخدام البيانات المحلية إذا كانت موجودة
          const localData = loadSettingsFromStorage();
          if (localData) {
            setSegments(localData.segments || initialSegments);
            setAvailableIds((localData.segments || initialSegments).map(s => s.id));
            setMaxSpins(localData.maxSpins || 1);
            setRemainingSpins(localData.maxSpins || 1);
            setStoreLogo(localData.logo || null);
            setSocialLinks(localData.socialLinks || {
              facebook: '',
              instagram: '',
              twitter: '',
              snapchat: '',
              whatsapp: '',
              website: '',
              email: '',
              phone: ''
            });
            setFooterSettings(localData.footerSettings || {
              description: '',
              links: [],
              taxId: '',
              businessPlatformId: ''
            });
            setHeaderBadgeText(localData.headerBadgeText || '');
            setBackgroundSettings(localData.backgroundSettings || {
              type: 'color',
              color: '#ffffff',
              desktopImage: null,
              mobileImage: null
            });
            setWinSound(localData.winSound || "https://www.soundjay.com/human/sounds/applause-01.mp3");
            setLoseSound(localData.loseSound || "https://www.soundjay.com/misc/sounds/fail-trombone-01.mp3");
            if (localData.enableDevToolsProtection !== undefined) {
              setEnableDevToolsProtection(localData.enableDevToolsProtection);
            }
            setWheelStyle('classic');
            console.log('📦 تم استخدام البيانات المحلية');
          }
        }
      } catch (error) {
        console.error('❌ خطأ في تحميل الإعدادات:', error);
        // استخدام البيانات المحلية كبديل
        const localData = loadSettingsFromStorage();
        if (localData) {
          setSegments(localData.segments || initialSegments);
          setAvailableIds((localData.segments || initialSegments).map(s => s.id));
          setMaxSpins(localData.maxSpins || 1);
          setRemainingSpins(localData.maxSpins || 1);
          setStoreLogo(localData.logo || null);
          setSocialLinks(localData.socialLinks || {});
          setFooterSettings(localData.footerSettings || {
            description: '',
            links: [],
            taxId: '',
            businessPlatformId: ''
          });
          setHeaderBadgeText(localData.headerBadgeText || '');
          setBackgroundSettings(localData.backgroundSettings || {});
          setWinSound(localData.winSound || "");
          setLoseSound(localData.loseSound || "");
          if (localData.enableDevToolsProtection !== undefined) {
            setEnableDevToolsProtection(localData.enableDevToolsProtection);
          }
          setWheelStyle('classic');
        }
      } finally {
        setIsLoadingSettings(false);
      }
    };
    
    loadCloudSettings();
  }, []); // يتم التحميل مرة واحدة عند تحميل الصفحة

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

    if (isSpinning || availableIds.length === 0 || remainingSpins <= 0) return;
    
    if (!isMuted && spinAudioRef.current) {
        spinAudioRef.current.currentTime = 0;
        spinAudioRef.current.loop = true; 
        safePlay(spinAudioRef);
    }

    setIsSpinning(true);
    setWinner(null);
    setShowModal(false);
    setCopied(false);
    setAiContent(null);
    setShowConfetti(false);

    const availableSegments = segments.filter(s => availableIds.includes(s.id));
    const totalWeight = availableSegments.reduce((sum, item) => sum + (parseInt(item.weight) || 0), 0);
    
    let randomNum = Math.random() * totalWeight;
    let winningSegment = availableSegments[0];

    for (const segment of availableSegments) {
      const weight = parseInt(segment.weight) || 0;
      if (randomNum < weight) {
        winningSegment = segment;
        break;
      }
      randomNum -= weight;
    }
    
    const winningId = winningSegment.id;
    let assignedCode = null;
    let assignedMessage = null;

    if (winningSegment.type === 'prize') {
        if (winningSegment.couponCodes && winningSegment.couponCodes.length > 0) {
            assignedCode = winningSegment.couponCodes[0];
            assignedMessage = "استخدم هذا الكوبون الآن! 🚀"; 
            
            // حذف الكوبون المستخدم من المصفوفة
            const updatedSegments = segments.map(s => {
                if (s.id === winningSegment.id) {
                    // حذف الكوبون الأول فقط (الذي تم استخدامه)
                    const remainingCodes = s.couponCodes.slice(1);
                    console.log(`🗑️ تم حذف الكوبون المستخدم: ${assignedCode}`);
                    console.log(`📊 الكوبونات المتبقية: ${remainingCodes.length}`);
                    return { ...s, couponCodes: remainingCodes };
                }
                return s;
            });
            
            setSegments(updatedSegments); 
            setTempSegments(updatedSegments);
            
            // حفظ التحديثات في السحابة فوراً لضمان عدم تكرار الكوبون
            const settingsToSave = {
                segments: updatedSegments,
                maxSpins: maxSpins,
                logo: storeLogo,
                socialLinks: socialLinks,
                backgroundSettings: backgroundSettings,
                winSound: winSound,
                loseSound: loseSound,
                googleScriptUrl: googleScriptUrl
            };
            
            // حفظ في السحابة (Supabase و Google Sheets)
            saveSettingsToCloud(settingsToSave).then(saved => {
                if (saved) {
                    console.log('✅ تم حفظ التحديثات في السحابة - الكوبون لن يظهر مرة أخرى');
                } else {
                    console.warn('⚠️ فشل حفظ التحديثات في السحابة');
                }
            });
            
            setAiContent({ code: assignedCode, message: assignedMessage });
        } else {
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
      
      setRemainingSpins(prev => Math.max(0, prev - 1));

      if (!isMuted) {
          if (spinAudioRef.current) {
              spinAudioRef.current.pause();
              spinAudioRef.current.currentTime = 0;
          }
          
          if (winningSegment.type === 'luck' && loseAudioRef.current) {
               loseAudioRef.current.currentTime = 0;
               safePlay(loseAudioRef);
          } else if (winAudioRef.current) {
               winAudioRef.current.currentTime = 0;
               safePlay(winAudioRef);
               setShowConfetti(true);
               setTimeout(() => setShowConfetti(false), 5000);
          }
      } else {
         if (winningSegment.type === 'prize') {
             setShowConfetti(true);
             setTimeout(() => setShowConfetti(false), 5000);
         }
      }

      if (winningSegment.type === 'prize') {
        setHistory(prev => [...prev, { ...winningSegment, wonCode: assignedCode }]);
        
        // حفظ بيانات الجائزة الفائزة في Supabase و Google Sheets معاً
        if (isRegistered && userData.name && userData.email && userData.phone) {
          const winData = {
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            prize: winningSegment.text,
            couponCode: assignedCode || aiContent?.code || 'N/A'
          };
          
          // حفظ في Supabase
          const useSupabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'YOUR_SUPABASE_URL';
          
          if (useSupabase) {
            console.log('💾 جاري حفظ بيانات الجائزة في Supabase...');
            saveSupabaseWinData(winData)
              .then(saved => {
                if (saved) console.log('✅ تم حفظ بيانات الجائزة في Supabase');
              })
              .catch(err => console.warn('⚠️ فشل حفظ في Supabase:', err));
          }
          
          // حفظ في Google Sheets أيضاً (فقط إذا كان الرابط موجود)
          const scriptUrl = googleScriptUrl;
          if (scriptUrl && scriptUrl.trim() !== '' && scriptUrl.includes('script.google.com')) {
            console.log('💾 جاري حفظ بيانات الجائزة في Google Sheets...');
            console.log('🔗 الرابط:', scriptUrl);
            console.log('🎁 الجائزة:', winData.prize);
            
            // استخدام URLSearchParams وإرساله كـ string
            const winParams = new URLSearchParams();
            winParams.append('action', 'saveWin');
            winParams.append('name', winData.name || '');
            winParams.append('email', winData.email || '');
            winParams.append('phone', winData.phone || '');
            winParams.append('prize', winData.prize || '');
            winParams.append('couponCode', winData.couponCode || '');
            winParams.append('timestamp', new Date().toISOString());
            
            const winParamsString = winParams.toString();
            console.log('📤 بيانات الجائزة المرسلة:', winParamsString);
            
            // إرسال البيانات مع retry mechanism
            const sendWinToGoogleSheets = async (retries = 3) => {
                for (let i = 0; i < retries; i++) {
                    try {
                        const response = await fetch(scriptUrl, { 
                            method: 'POST', 
                            body: winParamsString,
                            mode: 'no-cors',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                            },
                            redirect: 'follow'
                        });
                        console.log(`✅ محاولة ${i + 1}: تم إرسال بيانات الجائزة إلى Google Sheets`);
                        console.log('💡 تحقق من Google Sheet → Wins');
                        break; // نجحت، توقف عن المحاولات
                    } catch (err) {
                        console.error(`❌ محاولة ${i + 1} فشلت:`, err);
                        if (i === retries - 1) {
                            console.error('❌ فشل حفظ في Google Sheets بعد جميع المحاولات');
                            console.error('تفاصيل:', err.message);
                        } else {
                            // انتظر قليلاً قبل المحاولة التالية
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }
            };
            
            sendWinToGoogleSheets();
          } else {
            console.warn('⚠️ رابط Google Script غير محدد أو غير صحيح');
          }
        }
      }
      setAvailableIds(prev => prev.filter(id => id !== winningId));
    }, 4500);
  };

  const resetGame = () => {
    // ⚠️ مهم: resetGame لا يعيد الكوبونات المستخدمة
    // الكوبونات المستخدمة تبقى محذوفة للأبد
    setAvailableIds(segments.map(s => s.id));
    setHistory([]);
    setWinner(null);
    setRotation(0);
    setShowModal(false);
    setCopied(false);
    setAiContent(null);
    setShowConfetti(false);
    setRemainingSpins(maxSpins);
    
    console.log('🔄 تم إعادة تعيين اللعبة - الكوبونات المستخدمة تبقى محذوفة');
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

  // دالة لإضافة كود الدولة السعودية تلقائياً
  const handlePhoneChange = (value) => {
    // إزالة أي مسافات أو شرطات
    let cleaned = value.replace(/[\s-]/g, '');
    
    // إذا بدأ بـ +966، اتركه كما هو
    if (cleaned.startsWith('+966')) {
      setUserData({...userData, phone: cleaned});
      return;
    }
    
    // إذا بدأ بـ 966 بدون +، أضف +
    if (cleaned.startsWith('966')) {
      setUserData({...userData, phone: '+' + cleaned});
      return;
    }
    
    // إذا بدأ بـ 0، استبدله بـ +966
    if (cleaned.startsWith('0')) {
      cleaned = '+966' + cleaned.substring(1);
      setUserData({...userData, phone: cleaned});
      return;
    }
    
    // إذا كان فارغاً أو يبدأ برقم عادي، أضف +966
    if (cleaned === '' || /^[1-9]/.test(cleaned)) {
      if (cleaned === '') {
        setUserData({...userData, phone: '+966'});
      } else {
        setUserData({...userData, phone: '+966' + cleaned});
      }
      return;
    }
    
    // في أي حالة أخرى، احفظ القيمة كما هي
    setUserData({...userData, phone: cleaned});
  };

  // دالة للتحقق من صحة الرقم السعودي
  const validateSaudiPhone = (phone) => {
    const cleanPhone = phone.replace(/[\s-]/g, '');
    // رقم سعودي صحيح: +966 + 9 أرقام (يبدأ بـ 5)
    const saudiPhoneRegex = /^\+9665[0-9]{8}$/;
    return saudiPhoneRegex.test(cleanPhone);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setPhoneError('');
    
    // التأكد من أن الرقم يحتوي على +966
    let finalPhone = userData.phone.replace(/[\s-]/g, '');
    if (!finalPhone.startsWith('+966')) {
      if (finalPhone.startsWith('966')) {
        finalPhone = '+' + finalPhone;
      } else if (finalPhone.startsWith('0')) {
        finalPhone = '+966' + finalPhone.substring(1);
      } else {
        finalPhone = '+966' + finalPhone;
      }
    }
    
    // التحقق من صحة الرقم السعودي
    if (!validateSaudiPhone(finalPhone)) {
        setPhoneError('يرجى إدخال رقم هاتف سعودي صحيح (يبدأ بـ 05)');
        return;
    }
    
    // تحديث رقم الهاتف بالقيمة الصحيحة
    setUserData({...userData, phone: finalPhone});
    
    if (userData.name && userData.email && finalPhone) {
        setIsSubmitting(true);
        try {
            // حفظ في Supabase و Google Sheets معاً
            const useSupabase = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL !== 'YOUR_SUPABASE_URL';
            
            // حفظ في Supabase
            if (useSupabase) {
                console.log('💾 جاري حفظ بيانات المستخدم في Supabase...');
                saveSupabaseUserData({
                    name: userData.name,
                    email: userData.email,
                    phone: finalPhone
                }).then(saved => {
                    if (saved) console.log('✅ تم حفظ بيانات المستخدم في Supabase');
                }).catch(err => console.warn('⚠️ فشل حفظ في Supabase:', err));
            }
            
            // حفظ في Google Sheets أيضاً (فقط إذا كان الرابط موجود)
            const scriptUrl = googleScriptUrl;
            if (scriptUrl && scriptUrl.trim() !== '' && scriptUrl.includes('script.google.com')) {
                console.log('💾 جاري حفظ بيانات المستخدم في Google Sheets...');
                console.log('🔗 الرابط:', scriptUrl);
                console.log('📝 البيانات:', { name: userData.name, email: userData.email, phone: finalPhone });
                
                // استخدام URLSearchParams وإرساله كـ string
                const params = new URLSearchParams();
                params.append('name', userData.name || '');
                params.append('email', userData.email || '');
                params.append('phone', finalPhone || '');
                params.append('timestamp', new Date().toISOString());
                
                const paramsString = params.toString();
                console.log('📤 البيانات المرسلة:', paramsString);
                
                // إرسال البيانات مع retry mechanism
                const sendToGoogleSheets = async (retries = 3) => {
                    for (let i = 0; i < retries; i++) {
                        try {
                            const response = await fetch(scriptUrl, { 
                                method: 'POST', 
                                body: paramsString,
                                mode: 'no-cors',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                redirect: 'follow'
                            });
                            console.log(`✅ محاولة ${i + 1}: تم إرسال بيانات المستخدم إلى Google Sheets`);
                            console.log('💡 تحقق من Google Sheet → UserData');
                            break; // نجحت، توقف عن المحاولات
                        } catch (err) {
                            console.error(`❌ محاولة ${i + 1} فشلت:`, err);
                            if (i === retries - 1) {
                                console.error('❌ فشل حفظ في Google Sheets بعد جميع المحاولات');
                                console.error('تفاصيل:', err.message);
                            } else {
                                // انتظر قليلاً قبل المحاولة التالية
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            }
                        }
                    }
                };
                
                sendToGoogleSheets();
            } else {
                console.warn('⚠️ رابط Google Script غير محدد أو غير صحيح');
            }
            
            setIsRegistered(true);
            setShowRegistrationModal(false); 
            setTimeout(() => { spinWheel(true); }, 500);
        } catch (error) {
            console.error("Error sending data:", error);
            Toast.fire({ icon: 'error', title: 'خطأ', text: 'حدث خطأ في الاتصال، يرجى التأكد من الإعدادات والمحاولة مرة أخرى.', confirmButtonText: 'حسناً' });
        } finally {
            setIsSubmitting(false);
        }
    }
  };

  // --- منطق لوحة التحكم ---
  const handleOpenDashboard = () => {
      setTempSegments(segments);
      setTempMaxSpins(maxSpins);
      setTempLogo(storeLogo);
      setTempSocialLinks({ ...socialLinks });
      setTempFooterSettings({ ...footerSettings });
      setTempHeaderBadgeText(headerBadgeText);
      // تحميل رابط Google Script من السحابة أولاً
      setTempGoogleScriptUrl(googleScriptUrl);
      setTempWinSound(winSound);
      setTempLoseSound(loseSound);
      setTempBackgroundSettings(backgroundSettings);
      setTempEnableDevToolsProtection(enableDevToolsProtection);
      setTempWheelStyle(wheelStyle);
      setShowDashboard(true);
  };

  const handleUnlockDashboard = (e) => {
      e.preventDefault();
      if (dashboardPassword === 'admin') {
          setIsDashboardUnlocked(true);
      } else {
          Toast.fire({ icon: 'error', title: 'خطأ', text: 'كلمة المرور غير صحيحة', confirmButtonText: 'حسناً' });
      }
  };

  const handleSegmentChange = (index, field, value) => {
      const updated = [...tempSegments];
      updated[index] = { ...updated[index], [field]: value };
      setTempSegments(updated);
  };

  const handleAddSegment = () => {
      const newId = tempSegments.length > 0 ? Math.max(...tempSegments.map(s => s.id)) + 1 : 1;
      setTempSegments([...tempSegments, { id: newId, text: "جائزة جديدة", value: "NEW", color: "#3B82F6", type: "prize", weight: 10, couponCodes: [] }]);
  };

  const handleDeleteSegment = (id) => {
      if (tempSegments.length <= 2) {
          Toast.fire({ icon: 'warning', title: 'تنبيه', text: 'يجب أن تحتوي العجلة على قطاعين على الأقل!', confirmButtonText: 'حسناً' });
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

  const handleLogoUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          if (file.size > 2000000) { 
             Toast.fire({ icon: 'warning', title: 'تنبيه', text: 'حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 2 ميجابايت', confirmButtonText: 'حسناً' });
             return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              setTempLogo(reader.result);
          };
          reader.readAsDataURL(file);
      }
  };

  // --- دالة رفع خلفية (صورة) ---
  const handleBackgroundUpload = (e, deviceType) => {
      const file = e.target.files[0];
      if (file) {
          if (file.size > 3000000) { 
             Toast.fire({ icon: 'warning', title: 'تنبيه', text: 'حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 3 ميجابايت', confirmButtonText: 'حسناً' });
             return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              setTempBackgroundSettings(prev => ({ 
                  ...prev, 
                  [deviceType === 'desktop' ? 'desktopImage' : 'mobileImage']: reader.result 
              }));
          };
          reader.readAsDataURL(file);
      }
  };

  // --- دالة رفع ملف الصوت ---
  const handleAudioUpload = (e, type) => {
      const file = e.target.files[0];
      if (file) {
          if (file.size > 3000000) { 
             Toast.fire({ icon: 'warning', title: 'تنبيه', text: 'حجم الملف الصوتي كبير جداً (الحد الأقصى 3 ميجابايت)', confirmButtonText: 'حسناً' });
             return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
              if (type === 'win') setTempWinSound(reader.result);
              else setTempLoseSound(reader.result);
          };
          reader.readAsDataURL(file);
      }
  };

  // --- دالة معاينة الصوت ---
  const playPreview = (url) => {
      if (!url) {
        Toast.fire({ icon: 'info', title: 'تنبيه', text: 'لا يوجد ملف صوتي للمعاينة.', confirmButtonText: 'حسناً' });
        return;
      }

      if (previewAudioRef.current) {
          previewAudioRef.current.pause();
          previewAudioRef.current.currentTime = 0;
      }
      
      const audio = new Audio(url);
      previewAudioRef.current = audio;
      
      audio.onerror = (e) => {
        console.error("Audio error:", e);
        Toast.fire({ icon: 'error', title: 'خطأ', text: 'تعذر تشغيل الملف الصوتي. يرجى التأكد من الصيغة.', confirmButtonText: 'حسناً' });
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
          playPromise.catch(error => {
              if (error.name !== 'AbortError' && error.name !== 'NotSupportedError') {
                  console.error("Preview play failed", error);
              } else if (error.name === 'NotSupportedError') {
                  Toast.fire({ icon: 'error', title: 'خطأ', text: 'صيغة الملف غير مدعومة في هذا المتصفح.', confirmButtonText: 'حسناً' });
              }
          });
      }
  };

  const handleSaveDashboard = async () => {
      // حفظ في state
      setSegments(tempSegments);
      setMaxSpins(tempMaxSpins);
      setRemainingSpins(tempMaxSpins);
      setStoreLogo(tempLogo);
      setSocialLinks(tempSocialLinks);
      setFooterSettings(tempFooterSettings);
      setHeaderBadgeText(tempHeaderBadgeText);
      
      setGoogleScriptUrl(tempGoogleScriptUrl);
      // لا نحفظ في localStorage - فقط في Supabase

      // حفظ الخلفية
      setBackgroundSettings(tempBackgroundSettings);

      // حفظ الأصوات
      setWinSound(tempWinSound);
      setLoseSound(tempLoseSound);

      // حفظ إعدادات الحماية
      setEnableDevToolsProtection(tempEnableDevToolsProtection);

      // حفظ شكل العجلة
      setWheelStyle(tempWheelStyle);

      // حفظ جميع البيانات في localStorage كنسخة احتياطية
      localStorage.setItem('wheelSegments', JSON.stringify(tempSegments));
      localStorage.setItem('maxSpins', tempMaxSpins.toString());
      if (tempLogo) {
        localStorage.setItem('storeLogo', tempLogo);
      } else {
        localStorage.removeItem('storeLogo');
      }
      localStorage.setItem('socialLinks', JSON.stringify(tempSocialLinks));
      localStorage.setItem('footerSettings', JSON.stringify(tempFooterSettings));
      localStorage.setItem('headerBadgeText', tempHeaderBadgeText);
      localStorage.setItem('backgroundSettings', JSON.stringify(tempBackgroundSettings));
      localStorage.setItem('winSound', tempWinSound);
      localStorage.setItem('loseSound', tempLoseSound);
      localStorage.setItem('enableDevToolsProtection', tempEnableDevToolsProtection.toString());
      localStorage.setItem('wheelStyle', tempWheelStyle);

      // حفظ البيانات في السحابة (Supabase) لجميع المستخدمين
      const settingsToSave = {
        segments: tempSegments,
        maxSpins: tempMaxSpins,
        logo: tempLogo,
        socialLinks: tempSocialLinks,
        footerSettings: tempFooterSettings,
        headerBadgeText: tempHeaderBadgeText,
        backgroundSettings: tempBackgroundSettings,
        winSound: tempWinSound,
        loseSound: tempLoseSound,
        googleScriptUrl: tempGoogleScriptUrl,
        enableDevToolsProtection: tempEnableDevToolsProtection,
        wheelStyle: tempWheelStyle
      };
      
      console.log('💾 جاري حفظ إعدادات الفوتر في السحابة:', {
        description: tempFooterSettings.description?.substring(0, 50) + '...',
        linksCount: tempFooterSettings.links?.length || 0,
        taxId: tempFooterSettings.taxId
      });
      
      const saved = await saveSettingsToCloud(settingsToSave);
      
      setAvailableIds(tempSegments.map(s => s.id));
      setHistory([]);
      setShowDashboard(false);
      setRotation(0);
      
      // إشعار المستخدم أن البيانات تم حفظها
      if (saved) {
        const footerInfo = tempFooterSettings.links?.length > 0 
          ? `\n\n📌 تم حفظ ${tempFooterSettings.links.length} رابط مهم في الفوتر` 
          : '';
        Toast.fire({ icon: 'success', title: 'تم الحفظ!', text: `تم حفظ الإعدادات بنجاح في السحابة! جميع المستخدمين سيرون نفس البيانات.${footerInfo}`, confirmButtonText: 'حسناً' });
      } else {
        Toast.fire({ icon: 'warning', title: 'تنبيه', text: 'تم حفظ الإعدادات محلياً، لكن حدث خطأ في الحفظ السحابي. يرجى المحاولة مرة أخرى.', confirmButtonText: 'حسناً' });
      }
  };

  // مؤشر التحميل أثناء جلب البيانات من السحابة — صورة اللودر ثابتة من public
  const loaderImageUrl = '/image%202.png';
  if (isLoadingSettings) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans text-slate-100 bg-[#ffffff]" dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
        <div className="text-center animate-fade-in">
          <div className="relative inline-block">
            {/* صورة اللودر — خيمة الألعاب */}
            <div className="relative z-10">
              <img 
                src={loaderImageUrl} 
                alt="خيمة الألعاب" 
                className="h-48 md:h-56 w-auto mx-auto object-contain drop-shadow-2xl"
                style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
              />
            </div>
            {/* مؤشر التحميل تحت الصورة */}
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-[#189CD7] rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '1s' }}></div>
                <div className="w-3 h-3 bg-[#189CD7] rounded-full animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '1s' }}></div>
                <div className="w-3 h-3 bg-[#189CD7] rounded-full animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.05);
            }
          }
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-start p-0 font-sans text-slate-100 overflow-y-auto overflow-x-hidden relative transition-all duration-500 main-container" 
      dir="rtl"
      style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
    >
      {/* Background Logic */}
      <style>{`
        * {
          font-family: 'IBM Plex Sans Arabic', sans-serif !important;
        }
        body {
          font-family: 'IBM Plex Sans Arabic', sans-serif !important;
        }
        .main-container {
          background-color: ${backgroundSettings.type === 'color' ? backgroundSettings.color : '#ffffff'};
          background-size: contain;
          background-position: center;
          background-repeat: repeat;
          background-attachment: fixed;
          font-family: 'IBM Plex Sans Arabic', sans-serif !important;
          ${backgroundSettings.type === 'image' && backgroundSettings.desktopImage ? `background-image: url(${backgroundSettings.desktopImage});` : ''}
        }
        
        @media (max-width: 768px) {
          .main-container {
            ${backgroundSettings.type === 'image' && backgroundSettings.mobileImage ? `background-image: url(${backgroundSettings.mobileImage});` : ''}
          }
        }
      `}</style>

      <ConfettiEffect active={showConfetti} />

      <button onClick={handleOpenDashboard} className="absolute top-4 left-4 z-40 bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700" title="إعدادات العجلة">
        <Settings size={20} />
      </button>

      <DashboardPanel
        show={showDashboard}
        onClose={() => setShowDashboard(false)}
        isDashboardUnlocked={isDashboardUnlocked}
        dashboardPassword={dashboardPassword}
        setDashboardPassword={setDashboardPassword}
        onUnlockDashboard={handleUnlockDashboard}
        onSave={handleSaveDashboard}
        tempLogo={tempLogo}
        setTempLogo={setTempLogo}
        onLogoUpload={handleLogoUpload}
        tempMaxSpins={tempMaxSpins}
        setTempMaxSpins={setTempMaxSpins}
        tempWheelStyle={tempWheelStyle}
        setTempWheelStyle={setTempWheelStyle}
        tempBackgroundSettings={tempBackgroundSettings}
        setTempBackgroundSettings={setTempBackgroundSettings}
        onBackgroundUpload={handleBackgroundUpload}
        tempWinSound={tempWinSound}
        tempLoseSound={tempLoseSound}
        onAudioUpload={handleAudioUpload}
        onPlayPreview={playPreview}
        tempGoogleScriptUrl={tempGoogleScriptUrl}
        setTempGoogleScriptUrl={setTempGoogleScriptUrl}
        tempEnableDevToolsProtection={tempEnableDevToolsProtection}
        setTempEnableDevToolsProtection={setTempEnableDevToolsProtection}
        tempSocialLinks={tempSocialLinks}
        setTempSocialLinks={setTempSocialLinks}
        tempFooterSettings={tempFooterSettings}
        setTempFooterSettings={setTempFooterSettings}
        tempHeaderBadgeText={tempHeaderBadgeText}
        setTempHeaderBadgeText={setTempHeaderBadgeText}
        editingCouponsId={editingCouponsId}
        setEditingCouponsId={setEditingCouponsId}
        couponInput={couponInput}
        setCouponInput={setCouponInput}
        onSaveCoupons={saveCoupons}
        tempSegments={tempSegments}
        handleSegmentChange={handleSegmentChange}
        handleAddSegment={handleAddSegment}
        handleDeleteSegment={handleDeleteSegment}
        openCouponManager={openCouponManager}
      />

      <RegistrationModal
        open={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        storeLogo={storeLogo}
        userData={userData}
        onUserDataChange={setUserData}
        isSubmitting={isSubmitting}
        phoneError={phoneError}
        onSubmit={handleRegistration}
        onPhoneChange={handlePhoneChange}
      />

      {/* Main Content Container with Padding for Header */}
      <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-350px)] py-12">
          {/* Header */}
          <header className="mb-8 text-center relative z-10">
        {storeLogo ? (
            <div className=" relative inline-block animate-fade-in">
                <div className="absolute inset-0  blur-2xl opacity-20 rounded-full"></div>
                <img src={storeLogo} alt="Store Logo" className="h-32 md:h-40 object-contain relative z-10 drop-shadow-xl" />
            </div>
        ) : (
             <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] mb-2 tracking-wider uppercase" style={{ textShadow: '4px 4px 0px #F59E0B' }}>عجلة الحظ</h1>
        )}
        
        {(headerBadgeText || '').trim() && (
        <div className="flex items-center justify-center gap-4 mt-2">
             <p className="text-yellow-400 font-bold bg-black/30 px-4 py-1 rounded-full border border-yellow-500/50 inline-flex items-center gap-2"><Sparkles size={16} /> {headerBadgeText}</p>
            <button onClick={toggleMute} className="bg-black/30 p-2 rounded-full border border-slate-600 hover:bg-black/50 transition-colors text-slate-300" title={isMuted ? "تشغيل الصوت" : "كتم الصوت"}>{isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
        </div>
        )}
          <div className="mt-6">
            <SocialLinksBar socialLinks={socialLinks} />
          </div>
      </header>

      <div className={`flex flex-col justify-center lg:flex-row items-center gap-12 w-full max-w-6xl relative z-10 transition-all duration-500 ${showRegistrationModal || showDashboard ? 'opacity-40 blur-sm pointer-events-none' : 'opacity-100'}`}>
        
        {/* === Wheel Section === */}
        {wheelStyle === 'classic' ? (
          <div className="relative group perspective-1000 transform hover:scale-[1.02] transition-transform duration-500">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 drop-shadow-xl filter"><div className="w-14 h-16 bg-red-600 clip-path-pointer shadow-lg relative border-t-4 border-red-800"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-900 rounded-full mt-1"></div></div></div>
            <div className="w-[340px] h-[340px] md:w-[420px] md:h-[420px] rounded-full bg-gradient-to-b from-yellow-600 to-yellow-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center relative border-4 border-yellow-900">
               <div className="w-[300px] h-[300px] md:w-[380px] md:h-[380px] rounded-full shadow-inner relative overflow-hidden transition-transform duration-[4500ms] cubic-bezier(0.15, 0, 0.15, 1) z-10 bg-white" style={{ transform: `rotate(${rotation}deg)` }}>
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {segments.map((segment, index) => {
                      const isUsed = !availableIds.includes(segment.id);
                      const startAngle = index * segmentSize;
                      const endAngle = (index + 1) * segmentSize;
                      return (<g key={segment.id}><path d={describeArc(startAngle, endAngle)} fill={isUsed ? '#cbd5e1' : segment.color} style={{ filter: isUsed ? 'grayscale(100%)' : 'none', opacity: isUsed ? 0.8 : 1, transition: 'fill 0.3s' }} /></g>);
                    })}
                    {segments.map((segment, index) => {
                       const isUsed = !availableIds.includes(segment.id);
                       const midAngle = (index * segmentSize) + (segmentSize / 2);
                       const rad = (midAngle - 90) * (Math.PI / 180);
                       const tx = 50 + 32 * Math.cos(rad);
                       const ty = 50 + 32 * Math.sin(rad);
                       return (<g key={`text-${segment.id}`} transform={`translate(${tx}, ${ty}) rotate(${midAngle + 90})`} style={{ pointerEvents: 'none' }}><text textAnchor="middle" dominantBaseline="middle" fill={isUsed ? '#64748b' : 'white'} fontSize={Math.min(4.5, 30 / segment.text.length + 2)} fontWeight="900" style={{ textShadow: isUsed ? 'none' : '0px 1px 2px rgba(0,0,0,0.5)', fontFamily: 'sans-serif' }}>{segment.value}</text>{!isUsed && (<text y="7" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="4">{segment.type === 'luck' ? '✖' : '★'}</text>)}</g>);
                    })}
                  </svg>
               </div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <button onClick={spinWheel} disabled={isSpinning || availableIds.length === 0 || remainingSpins <= 0} className={`w-20 h-20 rounded-full flex items-center justify-center shadow-[0_5px_0_rgba(0,0,0,0.2),0_10px_20px_rgba(0,0,0,0.4)] border-[6px] border-white transition-all duration-150 transform active:translate-y-1 active:shadow-none ${availableIds.length === 0 || remainingSpins <= 0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500 text-white'}`}><span className="font-black text-lg uppercase tracking-wider">{availableIds.length === 0 ? "END" : (remainingSpins <= 0 ? "تم" : "SPIN")}</span></button>
               </div>
               {[...Array(16)].map((_, i) => {
                  const angleDeg = (i * (360 / 16)); const angleRad = (angleDeg * Math.PI) / 180; const radiusPercent = 47; const left = 50 + radiusPercent * Math.cos(angleRad); const top = 50 + radiusPercent * Math.sin(angleRad);
                  let isActive = false; let lampColor = 'bg-white'; let shadowColor = 'rgba(255,255,255,0.8)';
                  if (isSpinning) { if (lightIndex === 0) { isActive = i % 2 === 0; lampColor = isActive ? 'bg-yellow-300' : 'bg-red-500'; shadowColor = isActive ? '#FCD34D' : '#EF4444'; } else { isActive = i % 2 !== 0; lampColor = isActive ? 'bg-blue-400' : 'bg-green-500'; shadowColor = isActive ? '#60A5FA' : '#10B981'; } } else { isActive = (i + lightIndex) % 2 === 0; lampColor = isActive ? 'bg-white' : 'bg-yellow-200'; }
                  return (<div key={i} className={`absolute w-3 h-3 md:w-4 md:h-4 rounded-full border border-slate-200 transition-colors duration-200 ${lampColor}`} style={{ left: `${left}%`, top: `${top}%`, transform: 'translate(-50%, -50%)', boxShadow: isActive ? `0 0 10px 2px ${shadowColor}` : 'none' }}></div>);
               })}
            </div>
          </div>
        ) : (
          <div className="relative w-[350px] md:w-[467px] aspect-[467/501] mx-auto transform hover:scale-[1.02] transition-transform duration-500">
            
            {/* Spinner Layer (Behind the Frame) */}
            <div 
              className="absolute left-[5.5%] top-[11.8%] w-[89%] aspect-square rounded-full overflow-hidden z-0" 
              style={{ 
                transform: `rotate(${rotation}deg)`, 
                transition: isSpinning ? 'transform 4.5s cubic-bezier(0.15, 0, 0.15, 1)' : 'none'
              }}
            >
               <svg viewBox="0 0 100 100" className="w-full h-full">
                 {segments.map((segment, index) => {
                   const isUsed = !availableIds.includes(segment.id);
                   const startAngle = index * segmentSize;
                   const endAngle = (index + 1) * segmentSize;
                   return (<g key={segment.id}><path d={describeArc(startAngle, endAngle)} fill={isUsed ? '#cbd5e1' : segment.color} style={{ filter: isUsed ? 'grayscale(100%)' : 'none', opacity: isUsed ? 0.8 : 1, transition: 'fill 0.3s' }} /></g>);
                 })}
                 {segments.map((segment, index) => {
                    const isUsed = !availableIds.includes(segment.id);
                    const midAngle = (index * segmentSize) + (segmentSize / 2);
                    const rad = (midAngle - 90) * (Math.PI / 180);
                    const tx = 50 + 32 * Math.cos(rad);
                    const ty = 50 + 32 * Math.sin(rad);
                    return (<g key={`text-${segment.id}`} transform={`translate(${tx}, ${ty}) rotate(${midAngle + 90})`} style={{ pointerEvents: 'none' }}><text textAnchor="middle" dominantBaseline="middle" fill={isUsed ? '#64748b' : 'white'} fontSize={Math.min(4.5, 30 / segment.text.length + 2)} fontWeight="900" style={{ textShadow: isUsed ? 'none' : '0px 1px 2px rgba(0,0,0,0.5)', fontFamily: 'sans-serif' }}>{segment.value}</text>{!isUsed && (<text y="7" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="4">{segment.type === 'luck' ? '✖' : '★'}</text>)}</g>);
                 })}
               </svg>
            </div>

            {/* Frame Layer (Overlay) */}
            <svg className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none drop-shadow-xl" viewBox="0 0 467 501" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_i_27_286)">
                <path d="M464.63 265.863C465.362 393.747 362.285 498.011 234.401 498.743C106.517 499.475 2.25341 396.398 1.52151 268.514C0.789611 140.63 103.867 36.3664 231.751 35.6345C359.634 34.9026 463.898 137.98 464.63 265.863ZM25.1857 268.379C25.8428 383.193 119.451 475.736 234.266 475.079C349.08 474.422 441.623 380.813 440.966 265.999C440.309 151.184 346.7 58.6416 231.886 59.2987C117.071 59.9558 24.5286 153.564 25.1857 268.379Z" fill="#2BD0EE"/>
              </g>
              <g filter="url(#filter1_d_27_286)">
                <path d="M234.171 80.9687L191.344 16.7235L276.259 16.2375L234.171 80.9687Z" fill="#189CD7"/>
              </g>
              <defs>
                <filter id="filter0_i_27_286" x="1.51758" y="35.6306" width="463.116" height="463.116" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feMorphology radius="6.03409" operator="erode" in="SourceAlpha" result="effect1_innerShadow_27_286"/>
                  <feOffset/>
                  <feGaussianBlur stdDeviation="3.01704"/>
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                  <feBlend mode="normal" in2="shape" result="effect1_innerShadow_27_286"/>
                </filter>
                <filter id="filter1_d_27_286" x="185.31" y="10.2033" width="96.9837" height="76.7994" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset/>
                  <feGaussianBlur stdDeviation="3.01704"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                  <feBlend mode="normal" in="BackgroundImageFix" result="effect1_dropShadow_27_286"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_27_286" result="shape"/>
                </filter>
              </defs>
            </svg>

            {/* Spin Button (Centered relative to the wheel circle) */}
            <div className="absolute z-20 top-[53.3%] left-1/2 -translate-x-1/2 -translate-y-1/2">
               <button onClick={spinWheel} disabled={isSpinning || availableIds.length === 0 || remainingSpins <= 0} className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-[0_5px_0_rgba(0,0,0,0.2),0_10px_20px_rgba(0,0,0,0.4)] border-[4px] md:border-[6px] border-white transition-all duration-150 transform active:translate-y-1 active:shadow-none ${availableIds.length === 0 || remainingSpins <= 0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500 text-white'}`}><span className="font-black text-sm md:text-lg uppercase tracking-wider">{availableIds.length === 0 ? "END" : (remainingSpins <= 0 ? "تم" : "SPIN")}</span></button>
            </div>
          </div>
        )}

        {/* === Dashboard === */}
        <div className="flex-1 w-full max-w-md bg-white text-slate-800 p-6 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-[rgba(24, 156, 215, 1)]">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-xl font-black flex items-center gap-2 text-slate-800"><ShoppingBag className="text-red-500" /> الجوائز المكتسبة</h2>
            {/* <button onClick={resetGame} className={`text-xs flex items-center gap-1 transition-all px-3 py-1.5 rounded-full font-bold uppercase ${remainingSpins <= 0 || availableIds.length === 0 ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:text-white hover:bg-red-500'}`}><RefreshCw size={14} /> إعادة اللعبة</button> */}
          </div>

          <div className="space-y-3 min-h-[200px] pr-2">
            {history.length === 0 ? (
              <div className="text-center text-slate-400 py-10 flex flex-col items-center border-2 border-dashed border-slate-200 rounded-2xl"><RotateCw className="mb-3 opacity-30 animate-spin-slow" size={40} /><p className="font-bold">جرب حظك الآن!</p></div>
            ) : (
              history.map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl flex justify-between items-center border border-slate-200 shadow-sm animate-fade-in-up">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm" style={{ backgroundColor: item.color }}><Gift size={18} /></div>
                    <div><p className="font-bold text-slate-800 text-sm">{item.text}</p><p className="text-[10px] text-slate-500 flex items-center gap-1">كوبون ذكي <Sparkles size={8} className="text-yellow-500"/></p></div>
                  </div>
                  <span className="text-green-600 bg-green-100 text-xs px-2 py-1 rounded font-bold">فوز</span>
                </div>
              ))
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
             <div className="flex justify-between text-xs text-slate-400 mb-1 font-bold uppercase">
               <span>عدد المحاولات  المتاحة</span>
               <span className={`text-lg font-black ${remainingSpins === 0 ? 'text-red-500' : 'text-slate-800'}`}>{remainingSpins}</span>
             </div>
             <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500 relative" style={{ width: `${(remainingSpins / maxSpins) * 100}%` }}>
                    <div className="absolute inset-0 bg-white/30 w-full h-full" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem' }}></div>
                </div>
             </div>
          </div>
        </div>
      </div>
      </div>

      <WinnerModal
        show={showModal}
        onClose={() => setShowModal(false)}
        winner={winner}
        aiContent={aiContent}
        isLoadingAI={isLoadingAI}
        onCopy={handleCopy}
        copied={copied}
        remainingSpins={remainingSpins}
        websiteUrl={socialLinks.website}
      />

      <Footer logo={storeLogo} socialLinks={socialLinks} footerSettings={footerSettings} />

      <style>{`.swal2-rtl { direction: rtl; text-align: right; } .swal2-rtl .swal2-title { text-align: right; } .swal2-rtl .swal2-html-container { text-align: right; } .clip-path-pointer { clip-path: polygon(50% 100%, 0 0, 100% 0); } .perspective-1000 { perspective: 1000px; } .animate-spin-slow { animation: spin 3s linear infinite; } @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; } @keyframes bounceIn { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.05); opacity: 1; } 70% { transform: scale(0.9); } 100% { transform: scale(1); } } .animate-bounce-in { animation: bounceIn 0.5s cubic-bezier(0.215, 0.610, 0.355, 1.000); }`}</style>
    </div>
  );
};

export default LuckyWheel;
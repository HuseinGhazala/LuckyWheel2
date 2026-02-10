import React, { useState, useEffect, useRef } from 'react';
import { 
  RotateCw, RefreshCw, ShoppingBag, XCircle, Gift, Sparkles, Loader2, Star, 
  Volume2, VolumeX, User, Mail, Phone, Lock, CheckCircle, AlertCircle, 
  Settings, Plus, Trash2, Save, Edit3, Ticket, List, Copy, Scale, Hash, 
  Upload, Image as ImageIcon, Facebook, Instagram, Twitter, Globe, MessageCircle, Share2,
  Database, Link as LinkIcon, ExternalLink, Music, Play, Palette, Smartphone, Monitor, Ghost,
  CreditCard, ShieldCheck
} from 'lucide-react';
import { getSettings as getSupabaseSettings, saveSettings as saveSupabaseSettings, saveUserData as saveSupabaseUserData, saveWinData as saveSupabaseWinData } from './lib/supabase';

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

// --- مكون الفوتر المطابق للصورة (Pixel Perfect) ---
const Footer = ({ logo, socialLinks, footerSettings }) => {
    const footerDescription = footerSettings?.description || 'مرحبا بكم في خيمة الالعاب .. أسعد مكان يتجول فيه الصغار والكبار متخصص في بيع المنتجات الترفيهية هنا نصنع البهجة';
    const footerLinks = footerSettings?.links || [];
    const taxId = footerSettings?.taxId || '300155258800003';
    
    return (
      <footer className="w-full bg-white text-slate-800 border-t border-slate-100 mt-auto relative z-20 font-sans" dir="rtl">
          {/* Top Section */}
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
                  
                  {/* Col 1: Logo & Description (Right - 4 cols) */}
                  <div className="lg:col-span-4 space-y-4 text-right">
                       <div className="flex justify-start">
                           {logo ? (
                               <img src={logo} alt="Logo" className="h-20 object-contain mb-2" />
                           ) : (
                               <div className="flex flex-col items-center mb-2">
                                   <Gift className="text-cyan-500 w-12 h-12 mb-1" />
                                   <h2 className="text-xl font-bold text-cyan-500">خيمة الألعاب</h2>
                               </div>
                           )}
                       </div>
                       <p className="leading-7 text-slate-700 text-sm font-medium max-w-sm">
                       {footerDescription}
                       </p>
                  </div>
  
                  {/* Col 2: Links (Center Right - 3 cols) - أول 5 روابط */}
                  <div className="lg:col-span-3">
                      <h3 className="font-bold text-cyan-500 mb-5 text-lg">روابط تهمك</h3>
                      <ul className="space-y-2.5 text-sm text-slate-800 font-medium">
                          {footerLinks.length > 0 ? (
                              footerLinks.slice(0, 5).map((link, index) => (
                                  <li key={index}>
                                      <a href={link.url || '#'} target={link.url?.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" className="hover:text-cyan-600 transition-colors block">
                                          {link.label || `رابط ${index + 1}`}
                                      </a>
                                  </li>
                              ))
                          ) : (
                              <>
                                  <li><a href="#" className="hover:text-cyan-600 transition-colors block">المدونة</a></li>
                                  <li><a href="#" className="hover:text-cyan-600 transition-colors block">لصناع المحتوى</a></li>
                                  <li><a href="#" className="hover:text-cyan-600 transition-colors block">سياسة الشحن والتوصيل</a></li>
                                  <li><a href="#" className="hover:text-cyan-600 transition-colors block">الشروط والاحكام</a></li>
                                  <li><a href="#" className="hover:text-cyan-600 transition-colors block">الارجاع والاستبدال والالغاء</a></li>
                              </>
                          )}
                      </ul>
                  </div>
  
                  {/* Col 3: More Links (Center Left - 3 cols) - باقي الروابط */}
                  <div className="lg:col-span-3 lg:pt-[52px]"> {/* Padding to align with the list above */}
                       <ul className="space-y-2.5 text-sm text-slate-800 font-medium">
                          {footerLinks.length > 5 ? (
                              footerLinks.slice(5).map((link, index) => (
                                  <li key={index + 5}>
                                      <a href={link.url || '#'} target={link.url?.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" className="hover:text-cyan-600 transition-colors block">
                                          {link.label || `رابط ${index + 6}`}
                                      </a>
                                  </li>
                              ))
                          ) : null}
                      </ul>
                  </div>
  
                  {/* Col 4: Contact & Tax (Left - 2 cols) */}
                  <div className="lg:col-span-2 flex flex-col items-start lg:items-start gap-8">
                      {/* Customer Service */}
                      <div className="w-full text-right lg:text-right">
                          <h3 className="font-bold text-cyan-500 mb-5 text-lg">خدمة العملاء</h3>
                          <div className="flex gap-5 justify-start items-center">
                               {socialLinks?.whatsapp && (
                                   <a href={`https://wa.me/${socialLinks.whatsapp}`} target="_blank" rel="noreferrer" className="text-slate-900 hover:text-green-500 transition-all"><MessageCircle size={22} strokeWidth={2} /></a>
                               )}
                                <a href="mailto:support@khymatoys.com" className="text-slate-900 hover:text-red-500 transition-all"><Mail size={22} strokeWidth={2} /></a>
                               {socialLinks?.phone && (
                                   <a href={`tel:${socialLinks.phone}`} className="text-slate-900 hover:text-blue-500 transition-all"><Phone size={22} strokeWidth={2} /></a>
                               )}
                          </div>
                      </div>

                      {/* Tax ID */}
                      <div className="w-full text-right lg:text-right mt-2">
                          <h3 className="font-bold text-slate-800 mb-1 text-sm">الرقم الضريبي</h3>
                          <p className="font-mono text-slate-600 text-sm mb-2">{taxId}</p>
                          <div className="w-10 h-10 opacity-80">
                             {/* Placeholder for the small logo under tax ID */}
                             {logo ? <img src={logo} className="w-full h-full object-contain grayscale" alt="Tax Logo" /> : <Gift size={24} className="text-slate-400"/>}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
  
          {/* Bottom Section */}
          <div className="border-t border-slate-100 py-6 bg-white">
              <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col-reverse md:flex-row justify-between items-center gap-6 text-xs font-medium text-slate-500">
                  {/* Business Platform (Left) */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-center md:justify-end">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="33" height="32" viewBox="0 0 33 32" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M27.8907 19.4494C27.7256 19.752 27.3679 19.8895 27.0378 19.7795C26.405 19.5869 25.7998 19.3943 25.1945 19.2293C24.5893 19.0367 23.9565 18.8716 23.3513 18.7341C22.1132 18.4314 20.8752 18.1288 19.6372 17.9087C19.0595 17.7987 18.6468 17.2484 18.7568 16.6432C18.7843 16.5331 18.8119 16.4231 18.8669 16.3131C19.4721 15.2126 20.1324 14.2222 20.8202 13.2593C21.508 12.2964 22.2508 11.361 23.0486 10.4806C23.3237 10.178 23.7914 10.1505 24.0941 10.4256C24.3417 10.6457 24.3967 11.0308 24.2591 11.306C23.7089 12.3514 23.1312 13.3418 22.5259 14.3597L21.6455 15.8454C21.618 15.9004 21.563 15.9829 21.5355 16.0379C22.3608 16.2305 23.1587 16.4781 23.9565 16.7532C24.5893 16.9733 25.222 17.2209 25.8273 17.496C26.4325 17.7712 27.0653 18.0738 27.6431 18.4039C27.9732 18.6515 28.1107 19.0917 27.8907 19.4494Z" fill="#59529F"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M13.42 17.7985C13.3099 17.8535 13.1999 17.881 13.0898 17.9086C11.8518 18.1286 10.6138 18.4038 9.37578 18.7339C8.77052 18.899 8.13776 19.064 7.53251 19.2291C6.92726 19.3942 6.322 19.5868 5.68923 19.7793C5.30407 19.8894 4.8914 19.6693 4.78136 19.2841C4.69882 18.954 4.83637 18.6239 5.11149 18.4313C5.68923 18.1011 6.29449 17.7985 6.89974 17.5234C7.50499 17.2483 8.13776 17.0007 8.77053 16.7806C9.56836 16.5055 10.3662 16.2579 11.1915 16.0653C11.164 16.0103 11.109 15.9277 11.0815 15.8727L10.2011 14.3871C9.59587 13.3967 9.01813 12.3787 8.4679 11.3333C8.27532 10.9757 8.41288 10.5355 8.77053 10.3429C9.07315 10.1778 9.4308 10.2604 9.65089 10.508C10.4487 11.3883 11.1915 12.3237 11.8793 13.2866C12.5671 14.2495 13.2274 15.2399 13.8326 16.3404C14.1353 16.8356 13.9702 17.4959 13.42 17.7985Z" fill="#532D7B"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M21.0679 31.5269C20.7378 31.6369 20.3801 31.5269 20.1875 31.2242C19.7749 30.564 19.3897 29.8762 18.977 29.1884L17.8215 27.1525L16.6661 25.1167C16.5835 24.9516 16.4735 24.8141 16.3909 24.649C16.3084 24.8141 16.1984 24.9516 16.1158 25.1167L14.9604 27.1525L13.7774 29.1884C13.3647 29.8487 12.9795 30.5365 12.5668 31.1967C12.3468 31.5269 11.9066 31.6369 11.5489 31.4168C11.2463 31.2242 11.1363 30.8666 11.2463 30.5365C11.5214 29.7936 11.824 29.0783 12.1542 28.3355C12.4568 27.6202 12.8145 26.9049 13.1446 26.1896C13.5022 25.4743 13.8599 24.759 14.2451 24.0713C14.6302 23.3835 15.0154 22.6682 15.4831 21.9804V21.9529C15.8132 21.4577 16.4735 21.3201 16.9687 21.6503C17.0787 21.7328 17.1888 21.8428 17.2713 21.9529C17.739 22.6682 18.1242 23.356 18.5093 24.0713C18.867 24.7866 19.2521 25.4743 19.5823 26.1896C19.9399 26.9049 20.2701 27.6202 20.5727 28.3355C20.8753 29.0783 21.2055 29.7936 21.5081 30.5365C21.6456 30.9766 21.4531 31.3893 21.0679 31.5269Z" fill="#2A4B8F"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M15.6206 7.26166C15.4555 6.71143 15.373 6.16121 15.318 5.58347C15.2629 5.03324 15.2629 4.483 15.2629 3.90526C15.2905 2.8048 15.373 1.67683 15.6481 0.576374C15.7581 0.163701 16.1433 -0.0839019 16.556 0.026144C16.8311 0.108678 17.0512 0.32877 17.1062 0.576374C17.3813 1.67683 17.4363 2.8048 17.4639 3.90526C17.4639 4.45549 17.4363 5.00572 17.4088 5.58347C17.3538 6.13369 17.2713 6.68392 17.1062 7.26166C16.9962 7.67434 16.556 7.89443 16.1433 7.75687C15.8682 7.70185 15.7031 7.50927 15.6206 7.26166Z" fill="#75348A"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M30.5319 24.4012C30.3118 24.7314 29.8991 24.8964 29.5415 24.7589C28.7436 24.4838 27.9733 24.1811 27.1755 23.9335C26.3776 23.6584 25.5798 23.4383 24.782 23.1907C24.0117 22.9706 23.2413 22.778 22.471 22.613C22.9937 23.5484 23.5164 24.4838 24.0667 25.4467C24.5619 26.2995 25.0296 27.1799 25.4973 28.0878C25.9375 28.9956 26.4052 29.876 26.7628 30.8114C26.9554 31.2516 26.7353 31.7193 26.3226 31.9118C25.9375 32.0769 25.5248 31.9119 25.3047 31.6092L22.0858 26.6847C21.0129 25.034 19.9399 23.3008 19.0596 21.485C18.757 20.8797 19.0046 20.1369 19.6098 19.8068C19.8574 19.6968 20.1325 19.6417 20.3801 19.6968C22.1409 19.9994 23.8466 20.4396 25.5248 21.0448C26.3501 21.3474 27.1755 21.6776 27.9733 22.0627C28.7712 22.4479 29.5415 22.8331 30.3118 23.3008C30.6419 23.4658 30.7795 23.9885 30.5319 24.4012Z" fill="#146CB5"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M13.695 21.4301C12.7871 23.2734 11.7416 25.0066 10.6687 26.6573L7.47736 31.6093C7.22976 31.9945 6.70704 32.1045 6.32188 31.8569C5.96423 31.6368 5.85418 31.1967 5.99174 30.839C6.3769 29.9036 6.81709 28.9957 7.25727 28.0879C7.72497 27.2075 8.19266 26.3271 8.68787 25.4468C9.21058 24.4839 9.76082 23.5485 10.256 22.6131C9.4857 22.8057 8.71538 22.9982 7.94506 23.2183C7.14723 23.4384 6.34939 23.686 5.55155 23.9611C4.75372 24.2087 3.95588 24.5114 3.18556 24.7865C2.74538 24.9516 2.27768 24.7039 2.11261 24.2913C1.97506 23.9061 2.14013 23.4934 2.47027 23.3009C3.21308 22.8332 4.01091 22.448 4.80875 22.0628C5.60658 21.7052 6.43193 21.3475 7.25727 21.0449C8.90796 20.4397 10.6412 19.9995 12.4019 19.6693C13.0622 19.5593 13.7225 19.9995 13.8325 20.6873C13.8325 20.9349 13.805 21.21 13.695 21.4301Z" fill="#2B2E69"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M27.698 25.9695C28.2483 26.2446 28.716 26.5747 29.1837 26.9324C29.6514 27.29 30.064 27.6752 30.4767 28.1154C31.302 28.9407 32.0449 29.8486 32.6501 30.894C32.8427 31.2517 32.7051 31.7194 32.3475 31.9119C32.0999 32.0495 31.7973 32.022 31.5497 31.8569C30.6143 31.1966 29.7614 30.4263 28.9636 29.656C28.5509 29.2708 28.1657 28.8582 27.7806 28.4455C27.3954 28.0053 27.0378 27.5651 26.7351 27.0699C26.515 26.7123 26.6251 26.2446 26.9827 26.0245C27.2028 25.8594 27.478 25.8594 27.698 25.9695Z" fill="#146CB5"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M5.99167 27.0149C5.68904 27.5101 5.3314 27.9778 4.94624 28.3905C4.56108 28.8032 4.17591 29.2159 3.76324 29.6285C2.93789 30.3989 2.11255 31.1692 1.17716 31.8295C0.847017 32.0771 0.379324 31.9945 0.13172 31.6369C-0.0333488 31.3893 -0.0333522 31.0866 0.0766939 30.839C0.654436 29.7661 1.42476 28.8857 2.22259 28.0329C2.63526 27.6202 3.07545 27.235 3.51563 26.8499C3.98333 26.4922 4.45103 26.1621 5.00126 25.887C5.38642 25.6944 5.8266 25.8595 6.01919 26.2171C6.15674 26.5197 6.12923 26.7949 5.99167 27.0149Z" fill="#2B2E69"/>
                          <path fillRule="evenodd" clipRule="evenodd" d="M22.3611 6.49124C21.6458 8.00438 20.848 9.49 20.0227 10.9206C19.1973 12.3787 18.3444 13.8093 17.4366 15.2124C17.189 15.57 16.8038 15.7901 16.3911 15.7901C15.9509 15.7901 15.5658 15.5425 15.3457 15.2124C14.4653 13.7818 13.6125 12.3512 12.7871 10.8931C12.3745 10.1778 11.9618 9.43497 11.5766 8.69216C11.1914 7.94935 10.7788 7.20655 10.4211 6.46374C10.2286 6.05106 10.3936 5.55586 10.8063 5.33576C11.1639 5.14318 11.6041 5.28074 11.8242 5.58337C12.3469 6.24364 12.8146 6.93143 13.3098 7.61922C13.805 8.307 14.2727 8.99479 14.7404 9.68258C15.2907 10.5079 15.8409 11.3608 16.3911 12.2136C16.9414 11.3608 17.4916 10.5079 18.0418 9.68258C18.9772 8.27949 19.9401 6.93143 20.9856 5.61088C21.2607 5.25323 21.7834 5.17069 22.1685 5.47332C22.4162 5.72092 22.4987 6.16111 22.3611 6.49124Z" fill="#75348A"/>
                        </svg>
                    </div>
                    <span className="text-slate-600">موثق في منصة الأعمال</span>
                  </div>

                  {/* Payment Icons (Center) */}
                  <div className="flex items-center gap-2 flex-wrap justify-center w-full md:w-auto">
                    <svg width="525" height="28" viewBox="0 0 525 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="53" height="28" fill="url(#pattern0_38_353)"/>
                      <rect x="63.375" width="21" height="28" fill="url(#pattern1_38_353)"/>
                      <rect x="94.75" width="54" height="28" fill="url(#pattern2_38_353)"/>
                      <rect x="159.125" width="54" height="28" fill="url(#pattern3_38_353)"/>
                      <rect x="223.5" width="54" height="28" fill="url(#pattern4_38_353)"/>
                      <rect x="287.875" width="54" height="28" fill="url(#pattern5_38_353)"/>
                      <rect x="352.25" width="54" height="28" fill="url(#pattern6_38_353)"/>
                      <rect x="416.625" width="45" height="28" fill="url(#pattern7_38_353)"/>
                      <rect x="472" width="53" height="28" fill="url(#pattern8_38_353)"/>
                      <defs>
                          <pattern id="pattern0_38_353" patternContentUnits="objectBoundingBox" width="1" height="1">
                          <use href="#image0_38_353" transform="matrix(0.00562023 0 0 0.0106383 -0.00582096 0)"/>
                          </pattern>
                          <pattern id="pattern1_38_353" patternContentUnits="objectBoundingBox" width="1" height="1">
                          <use href="#image1_38_353" transform="matrix(0.0141844 0 0 0.0106383 -0.790898 0)"/>
                          </pattern>
                          <pattern id="pattern2_38_353" patternContentUnits="objectBoundingBox" width="1" height="1">
                          <use href="#image2_38_353" transform="matrix(0.00555556 0 0 0.0107143 0 -0.00357143)"/>
                          </pattern>
                          <pattern id="pattern3_38_353" patternContentUnits="objectBoundingBox" width="1" height="1">
                          <use href="#image3_38_353" transform="matrix(0.00555556 0 0 0.0107143 0 -0.00357143)"/>
                          </pattern>
                          <pattern id="pattern4_38_353" patternContentUnits="objectBoundingBox" width="1" height="1">
                          <use href="#image4_38_353" transform="matrix(0.00555556 0 0 0.0107143 0 -0.00357143)"/>
                          </pattern>
                          <pattern id="pattern5_38_353" patternContentUnits="objectBoundingBox" width="1" height="1">
                          <use href="#image5_38_353" transform="matrix(0.00555556 0 0 0.0107143 0 -0.00357143)"/>
                          </pattern>
                          <pattern id="pattern6_38_353" patternContentUnits="objectBoundingBox" width="1" height="1">
                          <use href="#image6_38_353" transform="matrix(0.00555556 0 0 0.0107143 0 -0.00357143)"/>
                          </pattern>
                          <pattern id="pattern7_38_353" patternContentUnits="objectBoundingBox" width="1" height="1">
                          <use href="#image7_38_353" transform="matrix(0.00667501 0 0 0.0106383 -0.0978021 0)"/>
                          </pattern>
                          <pattern id="pattern8_38_353" patternContentUnits="objectBoundingBox" width="1" height="1">
                          <use href="#image8_38_353" transform="matrix(0.00562023 0 0 0.0106383 -0.00582096 0)"/>
                          </pattern>
                          <image id="image0_38_353" width="180" height="94" preserveAspectRatio="none" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAABeCAYAAACKEj7WAAAABGdBTUEAALGPC/xhBQAACklpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAAEiJnVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/stRzjPAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAJcEhZcwAACxMAAAsTAQCanBgAACECSURBVHic7Z3ZjyTZdd5/50ZELrV2dff0MsOZHs6QQ3FmOCIpkqJFmhRFwZAhW7Bk2QYkWYAFw5ZsGAbsJ7/5LzAMGzD0YAMGDL9Ith4MWZAXmpBFkJI1BNfZyN6qurqqq2uvyiW2e48fbtzMqKzsnu7pzuJ0MT8gKrJiX7448Z3l3hBVZYopTgvMj/oAppjicWJK6ClOFaaEnuJUYUroKU4VpoSe4lRhSugpThWmhJ7iVGFK6ClOFaaEnuJUYUroKU4VpoSe4lRhSugpThWmhJ7iVCGexEblX/5zUIXCQQlYAxJBYiCxIAU4oB/5eXMK8wIJfroKoCDVEKCAyPA3gHF+GRtV61FbF1DDkRXUQF4i6vjEmXn+6Uc/ym9efg72ulD2oBWBa0LUgjgZ7tv2oDgAK/5cjAVxUAg4Y4hpEEkb9BnQl1FeAC6ALAJz+LMrED1E2QPZQKKrCG/hijXQnNZMjo0ceR8aGUQKZQTOgAWiBJIWOAtlTnVx8ScaV2PAqT9ddWAE4gYkTXA5q2nOPytm+R/aYglH7Yoh1UE2wpZEcACqCBCJsFPkbGcFP3XmDL/z/PP8yuVLtMy97eJ/vn2bf339Ojd6PWajiIU45lh9pyioQdXwxpf+8j239SCYCKF/7ODJ+wqqLwEvgDwHPAUsAG2gib/WJSop0AMOUHcXWEb1GsJVRN5B5Cocv+dTPBimhH7vEOAKwmtEfAb4LPAansgPiGBJZR3he1j7TSzfBN5B2EJ0E2+Cp3hATAn93mBQPo7w60TyCyCXQYOseA9bM5eBc+Tlp3FuC+ENkG+g8nXgHWCHx0hsi1d2pxFTQj88LoL+FUR+BY1+GuHywNI+Gho410DdEsIViuhliL4MsozwXcR9B3gTZPtRduKAPkI6UM8eQUM/KERAhDZwHv8gW4ZXQYAI72Fsi5dYJ4Ipoe8LGTqhSAN4DeHLCL8M/DRIdQvfI5tHm78ZgUggihogL1HoSzgL4n4A8jqq38LZq6huILKLcgfYe5hdzqB80RTcsQm3nKEJtMQ7feK1/ssKV/zRiSpoOD2HgBoVNZqXNDPrLqpyieOENoBRpSicrpeOddQUqDGqIiNnLf46SqHKDvDnD3M+o5gS+r5wPmKAxKCfA/4xol9E9Kyf/whmWQAx1bh6aIxAZCCOKhNoIXfg5CWQK+B+kTLbRswy8BbwZ3gCrAIh7HFvqHBWHP8oTpkn4nftDDvOIKI0/RILCr9h4VfFn3mdpKgIWFVxaK/Q5kFuZ61qqzqb0YshVlV7hetlhRyqjaxKJNZGMnLlQoiki/ItpoR+3AhhwRLKFGwBRH8N0d9C5OeA2fe02WCNRYbETWKIDYhR1IF16tKC9U5KIbhzjUTmYxNRKKg2gSbOLoJ7HuFVkM9DdA3kewivA98Flu93GAaYx/GrcZ+mwu9ms6y5iPPiUGiU6AsWnvPHfPSS1K9R6YTiXYS4A0plzioXvPPLeBsw3E92/y2+O6aEviccuCym6P0MxL9FnPxV5B7Xa1Q6HLG8FYHjyMuJILhVsaq63c/ZyS17aa57vVRv7Xblxk6Hwqn+pWfO6peeO89SI4l87LlikDoD8hQiT4G8ho+wfAp4oxqu4Yl96/jBenZeMJa/0+jTV+Hf57P8wMYgyFNSFguilDye2OFD6PISpoSeJFogn0HMPwH9WXDxMHFTQ+UdDcjrMxLVNEBEMYYyEnKBoii1yHLd72VcP0z1h/s9rh32udnNZLmXsdpJ2d3viaal+cFe1y7MtuwXnjtvGk6EIq/t6wguo1wE/XngLsJ3UL4G/ClwFeiC9KlHStQwJ45/2OyxgeE/ZrModGPoh1TNuNMNPoOIYt6FreGZfldS+wUyHoPzOCX0eDRQfgmRv4uJvogyP3YpETAGosgPIqDqsE6xFtTRc+q2ilJv9jK5fpialU7K7U7KWqfP2kFfDjqpHGYFHeukC96al1bIC/3m5qF+ffPAffKZs3o2juD+3DD4JN8HgPMYXkX56wg/AL4FfBOvu3cGaygk4vj7jQ5fiPvkLun8h7yd/l+bsCRKgp5keM/xGKKJU0Ifg/sgLv8FkL+FsZ9HTHKEuMbULKQ6VBWnupMXbJWlu5unutlP5SDP5dBZdpzV7TTT9bs9Wd3oy3qv4G5p6VkL1gqlCqohugFJeDiMbJVW3tzrStrLHPMzEVHlqr07WghXvCPJp3D2pyjSn0HdVZBl4A6wC5KjyJUoN1diBduY+WrZuPw/bYM+Ptj+MKG8R0T1ins0TAkd4HnyIsJvENm/h8oVIuMDHGEJYyhEyFQ1LUvtF7ndyzJdyzJd7qfc6Kd6Ne3JtbQvm6WVjnPSwVJaC9uFcNcaUoFmBE0DzQa0a/cx/LQKjZjMOTa6KQeHqT4921JiIxT2wcSthg3SwNmPYYuPIVIi0RboTXxkpAsY1ESgWGRuFvfKPKqpIokIrWHU7onAlNABwnlEfoM4+m0wlyDyr39VR1lqXhTudp6zUuS6kmXc6Pe51u/rjX5ft7LM9LJM+kVhus5JTxWVSj1GQCwwEwsL1TZFfHQj/B6goo6p5qelbHdSVrupvuScmijyjqFz43T0/c6NKjoWg17Cp+c/xkBTGwGHE43njZM5nN3ERLbay5TQTxBiEUiSK8y0fo3c/hrKpX5puWtzu1mWbOSZrvV67navx2q/z2aWyWaWsVEUcqcs6FkV1FWDio9wBFliGJjdtoEzeArl4CsCq/GxCC4Vx1Q6vUyWu6keOmWxGUN+/1DzeBzzzCKOhB/9MaqXGKURdDT78aTgx5bQAsQircyWH9zNen+zW6b/4KDbefZunrLS69mVNHUrWSY3s5SrWSa380zyohCsMzjnN2EMRLEv6wyhOhgStD5OFObxZN6txgnDqs9jpBZQpJ+VstxN2Soti+3GhK6GD104laJQcRaJzMO9A943+HEidLg/DaBtxJwHeenqwcHf+L3y5i9f73bOf3//kFtp3+5kGVmem8xayVQlD8kQRAY10oO4VjUEzWp0qIXDEOGTyo1qDLBFZam5910QoVtac62T6lY/1xfnWg9bcvFjh9NO6PPAs8AzwCXgPKKLJGbBIedW8uzCH66tfcw4e36rKFgrSnWqXjqor+uESkIQ0tFmSFTwxelBWRj15DW1IRA6Ylg9H+Gv/BY++lpW82oKBQViQ1+Vtw9TudtJHWfnFBF5Mm3nyeC0EDoBFvEv9YVqfAl4HngBX2zzrJ+mC0TSdCLcKQvu9LpQlp6sUSSYWAgvXB9XPrqnQOCK40eGOolHB6VqdQIsVUecAHeBFChqyw62YShLy/JBxsZeX7lklch4p/DBwnc/dngSCV2nUxvvsV8BPgy8CLyA8CzIJZQ50AZH1aonqVZv7ySBOMwamN1hFV3Y0+i4/nuUuHWuKcN0QSB1A//IxXgJso3PkeXVshrO0gCO3X6u64d97WaFm51rGZwRrJ2KjzF4kgg9A1zGZ8KexRfQPIvKRVTOAWerKrglPNGHGOekDRCNWFM9KhmCPBi1wHXU2zkqQ6s+akTD/0X1u4l/j8wDh3hSB2vt8DtLRFxUsu5SXSsL9yFmEDF4nTJl9CjeH4Qe3pdgs5r4hqVn8cGui8DTwNMoz+At8nPAZVSiY9sbZyXr936cBg5Wt07e8PofR2KkStZaQprbh+IqzW2C5g5k1+E2HN4ax/h3x5nqbAugD3TwxJZqH1izEWXmVlnyQYV42lj/nvjREFowVeWalwKONp60F/FaeBFvjYOMuILKEhChFfUkyIeRbY+zwobjjlpw1uqWuC4h6turD6H4SNWT2JWgFlF/YFZ1GMQNZK4XL1HbfmgLJfg70cK/WxJ8Di/IlULNjhbRZlGoVSWeGuZ74uQJLZzHO2s++qA8Q8EzlPo0CQsIjUr3zgBnUFmgTrF6rHfUEod5owQeddxGna9R3FeiBKesAFtCnLA0M8/zcYNFMezYkutFSqfIoMwqy2x8lwgS1+tA/CgQelDiNnJM6q30QWnZL0uc6ugSU9QwWUIL5xAuIpwDlrDuMhkfQM2zOC5TcgnLRTIuUOBbqBmG/Ur4pjlDB21cwfk4a1uXDWEMD0bgdwseqKv6xHB8uD3Pxxee4pXZszzXaDGHYa/MWU4PudY/ZC3rcKdIWStzOs76RgOB4MaAiSvHT/w5F/j5wTG0YRAOSuv2i8I5VcG3YpqSegwmRegFlHNY+TmsvobyPKrPYfVZHIu4KPJZVh2Gn0r8jTTUSEz1audIAGKsTIgZLy3COoEkY63ug6Ayn2WBqOXZ2SV+/cLz/OriRT4SN4mkemqcpZw7w0qe8lae8kbe43v9Q95ID1jLuvSLnL4qpauKjAYd4TCs7YjE13/Y6mk1wo61upFn1haFkDQEmQajx2EyhFY+iZWXyeR3KPUSIjOgM0eWqTtm4C1RWR1RqIytJyZG5UOdwIHkR49hCDdm2ns4Ke8AFjw9O88vXXyev33uCh81EeRp5RT6E0ok4sXmHE+3Fvi0OvaLlJtplzfSA95KO7yd9/lB3mOjyLy116rYyES+ZYupipjCk2wM+7aUW2lKmud2IUkiTCV9pjiCyRDa8iIlL1PIq4OYKhwNjYX/tT69OqJgSetRh9Gw2Tj5MGqBH4bA47T4kfnOEzqK+ezCBX7zzNP8RNKErA9FWkmJ6iTE1063Bdom4mJzhpeSFh+fWWTF5qwUKTfTDm/2DrmRHnA777PrLLsoBdY7moVCLt6CRwbrnNzNUrmb51yYnfU10z9iQj9wFesJYlKSo8CQIdpHaN8zyhS8+BCsm8UnHQICketOXFhvNGHxKBh9QMY5nGoxolxuzPGz8RyfLhXSHqj1Dp9ztayieofRFtX2BUzMhTjhQqPFp1rz6MwZVuYzvpN1eDvrsVZk3LEFq67Par/DQdrnUCylrcR0kZk7h4fRd3pd+9zSki7Esc9wPmwp6SNC8SpRgESE5D7tsBIjJDI+GDUpTIbQTbdOwWWMKbC0j3nuAUFahGLGhep33fDUyWVHpj8OhLdC/YEJ4bQjfRUpDTF8Ip7ho5mDnV2YbcFMy2canfMEG/epacVbd1VvfQFBuNKc4UJzhs+pI7MlubNs2JTvpId8u33Ad1tdfniYcjdNoXtotg4OzJ8fHJSfuli6hUbjxB3D8EJ1qhgxxCK4d/m0dmwMUi13El/hngyhI3cLJ5cw5PftwCr0+hDj468N7k3mx4WwrZjh2VuG2blA7JAsVwaZvdgIz0YJ55xCp+OlRjkDMzOj7Qqr0J6r7dMdlQhiAKVtYtomqv6H57XFS615PjP7FLeW+qx2u7x1cMibmy1Ws1RW84KdLHO0WideqKSqRAKNyKCqbOU513t95uOYonZugu+pNHfK3cyXFMZGBo1qJ8nryRBadAthg4gdSs4PrPBgfjUOhA7VFsIw2jEJBJsWtLnvF8tn5voMC4SC/JmtfieAE5wKmUARV/q124G8D/0+tFrQbEKjcbzt4aB2ZCR9aUs/BFTVfEtRwlK7ycdnZmBxkZWzGa+fO8+bnUNpGRMtWifk+UnLU3+rjOFMAqUqr+8d0LWWljHktWIpEd9wIrOOdzpdVJW5KCK+T7e7jwuTinL0MeyQuJvk5nmcNI49l0FuxPgUSpMxGbnHekweQZcX+KKgHXxWLuOo9W7i85Xn8FIoUYrcsVKWbDTw0YgSSFPIC+j1PJlbLWi3jxIbRiz2aF4ejmQfNfchOwOI8Fy7zYXZWb5UnjOa58msc2hRyElH7hSvixsmxqry7b1DvrGzx/1yPTORoR1FzMQ+UqsT1h2TIXQhJXCA0WsIPwWcOxLNCLUMgifNEkd7R5vEfapLiQzf7vkOnsz1KItW8/v4gqEuvhzqrKFsKN/t93nb9vnFmTkkSTwBrUJReA2dpp7czeZwiONhq/FAQmsrgo8J1agbPvBiIIKWCK0ogkbDUBTjtfpJQIenUKqSWofV4310qIIRoSFS1X9NnswwKUKXkQX2EH6IYRvRcwPC1PXqGXzJ0WJYbyJHczQEWOIL69fwhA2F9yGaEt4QBf6h26rmtSJ0znH3oM//2tnjk0sRP3e+Ae0I0hJK64ei8OMs80RuNPw4yJFGo4ozV9nCIEeOhOCkFnFR/6AUVcQkWPwJWGch5HbEl8rI8XRB8M2NCAtJzGLjXm3IhodPtQ4iE7FVdUxIcsQlwj7KOxi76z85IEOigCfxM/g2JRHDWuBJnXEg7AG+qL7DyPcXOJpaDy1Lcrw0mTe+eIiCr+4cMNuNON8+x0fONmg2qxVNdY6q3gJnmR+MGZK72YRGZbkbyZDUcHxcR12PTwJVKG7Q2ozx/ua9b8895si7rVc/gkf3FyfkFBoQcoRriNurRwqI8Jr0aYZkHtT/TgghxlwA+3gyh5oPw/jLWE/yZPiGrWcE4piCkq/c3WcmFn4+m+XzcwkfSiJoVCvkVYgONyR4Ufih3x9a7HZ7aLmDJBmNkJwgHCKlItY5cQoqiuP+/XI85sfrkc3ZhBIrAv5cN0G2UPWJ7Aa+7vc8vtI55mgnsJOyzsG5TvGa2DJsw3evO1KPiAiQql93zkAr4mC75L+u73K11+Pbi21eW2zxwlyTD7ViPhAZ/6GesB3rKjlivXywdkjuZnMYIWk2h45kkBZjJcljhjEQCb3SyH5ho04vFQuU4m/PCan1CBlT2/6QmAyhh1m3PrHcosU+sS7RFh8KazPsn2KSMqN+PHVdrDA2df5u64eHL46goaRFyZ/vFnzzIOX8doOfnG/y5YU2nzvT4sXZhNkkoiXqC/IF34VuSLU5B3leETuFZgJJFSUJBA+hP+eOE/xxINRpR37cL53ZT3O6vUKcgRLfweQJEdog8sh8nAyhG4NLUJLINYy5ScOeIVbvZhT413iTo+nsSWGQ4uK9SZtA/HrFnojvh84opXPc6fTZ7aa8s9PjDxZavLbY5hNzDV5uRFxJIi43YxrN6skorK/ViKLquJwndb+KkIyG/qJoGCmBWoTkERAkDkBZQNoX+haXtdTRqk5TUT25rsAeh8s4GUK3BuEKC1wj0msYfhKvrIdVdcEhm/QVG41Bv9f1g+YOiAwkUtUyWzLruJnm3CxKvneY8heNmBeaEZdaDT483+JjZ7wkeS7yssUnktxQijjnY9q2FiWJIt+QN0iTJDkuSewDfk8orBeymdZBlkKvA70uUhoijTGxwVbx1ZPsQelxxNUnVMsRelDBATdwskIZ65GComDtTgKh+4AmXu4cMGwhcj8dPbp+i+EVGySBqpWTCBqVU1c6umnBt3o53xKBOOJSq8end5t8dr7FZ+abvDjb4Ewr4kxkfDQhrt7ttiJonntS++4VjjuSobV66Bn1QVCXMEWVDOp2od8FW6DS9n1TiqmILJOXg3W8bwmdFLV/dI0ivo0mFiXyITyGBUDB+ZokuUPqvYlvYb3HMKFyPy6EAiWD1/5zHC2SGnf9RbzlDucJoI47vZT/3U15fbvLhZkGH5lv8TOLLb600OInZhIajcpi51V2qX5zVYcE7/eH4b8wBKsd9l9fL0wLlrwofPKnX6XsS98mkshgxIiYezXWnDwexx4nFLarF+FojugGPmD21BE9O8nMYB3Bmkb4+Pc+PqkSPoAw7uuCrppf4Ml8Fk/oA+6dABrEsYUjLVkdYC39wtHPCtbzkjc7KW/uJHxjsc3Li21emWvwE+2El5KIZKZRrV+FAPPw8SD1kqS0npTBardax1PtgcQhQlKPi2fZsDIwWGLnmIscbf/mt04lerI60vWYUIF/zewJoGYTcctgznorzVErXc/STQIhQyn4upFzeAt9wDA+Pio9HMMuunyvH8NvkT+IP1bfluAjI3El4K2lKC3fPyz5fj9nbq/Hx2cafHq2xWfPtHhloclCM2I+hgURTCP2/oatdG9RlaoWpSd4XW/XP5ERCG2rrhZCyDDUUA86mFSIot0oTvolpl04FoQT7ex8cJkeFZMhdDZq8mQLcW+j8mGQRUSHhDkJQsPwAUrwtSOKzxju40k9anVDAugsvnOFNsNvxb9XhHM0BhpVhtAqnX7Gn/Uyvr/X5Q93W3yk3ebVKObDrZiXFxq8upQwO+vVGkX1OZ8orqXpCy9JjmjQ2gUNxUOiQ00eCqGMQDO6SrP9J2/J4u1rWftLWcnn53EDWf8kYULFScdCCVsIb4N+AWHxSMH+SSbEHJ68Mb4DsRm8nt7Hy4ugl0N99hm8RAmVgEe+2vceUJckgt+ZOLBQOscejr1OnxsbOd/uCRdMxKWlBi8/1eaVC00+dabBK7MRMhd7chbO15HkNb0uozur9qe1MdXycdJhJvk6jfK/rbnk6/82n9//i7LxoYhS2r6maEpov9VRluoOyHWc6Qyu+KPEhR8FwcImeAvcxpM29AIaKvJCRCSqpj/uOxuIVUVBMJHfV89RppbVA8eqBbo5/2cr5ZXbCZ873+ZTl2Z46VyDS7MRFxNDq1lVXBVV703BJ5EqczSIoVcnYAyI2cDEN2k3X2cm+spbpX71D/oze/8la7b7oEuRDtyKKaEB2vnR/0W7OFkmbR76pvl6NNkRNOxJIOjpsM8gLeColQvHFrKZoQHCJIWlAs54GTATDSamacG3ehlvb6f8/nqPV8+1+OzZBp893+TTZ1tuqdG0sSkgyw2lNZgqR+Eb7TpEFBGLMT2S+BpJ42vE7T+maV7HFAe/l8/n/ypfpIu5cCYqZudEsfrkkRkm1wTr6P/iFInWQKsPrwvHwneBLCd1FetZv9Huv+odvZzEGySce+jKQcUnbIyC81bWWeiqo7uXcvcg5Z1l4Svzif3MC2dXf/nVS9/7wsXzm/R6F+hlT6M6D5rg3CHoLibeJ05uo/YtXPkGYm4RxdcxFKAcYDiQCIxrNsW92+cHJ4lHvvsTcgpHPp3gy0cPUXML6CLqv++hHHUMTwqj5B3n6MmYZSeNcCwWBjpX8A6kVHUgucPmlpV9y8p2Gr1Zus7zL1z80y9ceOpP2D94CjqXcbqAK2NseYi6PaJkn0brNmV2lazoeGliObAJ37QtVtQwHxcYsBG48qRloEeoTH8kTIjQzXFTc1R+iOgqoh/xZoejOvokLXQdP0KTNNh/XeaMol7AFRmYEd+NWFoWe1lv983tnZtbe+f/35nSmhgMqqYK2SlafUtR1R4pahJl20X8m2yWrxUR54wDMM5pw/5otEaCd9MfCZMsHx1FVR/NKiofGUwN4bsGwwq4J1G8PU6E8x+UB1SmetB7lFjaskM7vsqs/vEfra1/z73u9F988JJ9odWw42s7jl9Uh7DpDAdqWKieJHfy4ec6HrnN0qQayY5Dia+P3jmyQD0efVKO4YOiLjuCzn6YstMHQdDxTmq6XodW25AjsoNhG8Mmhk0ct1DdpCErzCbfXu10b/7R6l1++9JZ31fIA+D7NuK/u5iu+o4Iq0dgX+GPgc3a0U0a4WpmwLVH3diEMoVj77gCHYzrH+kaLMz5UVrlsTUZY6bVozLvaQd6ZHRkuwBGM2LJSMhAU4xsYmSZWJYxepNIryFylUxXKOnjUJxCFDGfxEShCdgD4GtFwr8rG/QQZoclddvAfwJ+f+TIJgv/AlKGDfTeMyYkOcZeB0doR10Pf51ELce9ILUBjj9g9ZqT8BbpM0zAvJs8GhC1FnsPseJ6C1Rhl9it0tAVkFugN7F6HSuraLSD0EfoIXQR+uN2FT1kA9QMOKzK02unYfGNzZ5YTChsd8/NbmHYwlgLZZXLrcx1qIYLEiQkMx4H2euEHd1e3erWSRyIHI4nLJvWjktGtlNvyGqqeHJIMaMpIhuI7AIdT1DZQ2QN9Daid4h1k4RNYjZA13G4I8f1GO1lA5gVJa1M42nBhMpH76njDnDFGkW+h+UcVoahu9C7aOhtVBiS+mGIPc7a3ovEtjYEEuvI2I1sw1X2LByXqYcoNJC6h9oemD6iPVy5CSxjohuYaB1hD6P7iGygZhmnW+D02IM1xUNjMoQe1zwoWK+sv0Gnv0I2s4SLDFJ6PnTwQZtZfM1yCx/IedCCoDqRR5t1uZGhbnnrZK6vM7rNqPoR6iHqpZcmhCDdPhG3MPIDev2bOLdMkiyDriCyBVHKsGVivVXlFI8JkyH09v7xaYEcRX+XjFVy81HUtAbk6+HVWyjC9x+x8P8XDN0FGRnqCBYu6N26FQ7Wvt6w4H6WcFRbS32GQsQuEbex2RqF26CZbAC3QNYRNnB2C2u3iaNtRCbVhc4UI5gMoXv3cVYl2kHiVUT7YFsDogTiZXhr3cXbr4t4UtdrMEaCBgOiBiKPyoi6Ba4nce73cAyRobIPekhUdmjZQ1LZxCa3iOU6ebZMWazSnL2FiTcGxzP65aspTgSTIfTsfRI+IluUeh1r+ziWBhGA8KngIAX2GBbfX2bYEXp4WdcJO6qFR8s8j0mHkemDrkGlrqA7wB2QZVTeQd01Gtkys73bFI1N+o0uKjlIeH9MpcP7AJNuJHschm1y+SF96fuWLdUrfPSzFYqXIber3+er6TmePqPkHScdZPDHF/oc9xALYB2VDZBthH3E7SJs4mQVlXX8o7UF7GDcHnGZDaI4g31OrfD7BRPqaGZsqLSapxlRvELU3KYwL+L0ePOn0MK6wEuPter3PMMi/brDN07vCr5qTQdR1j7IPr6cfw+VXUSX8br3DsgW6B7CDqJ3QTZQqYx2SIiIL+/UKYHfr5hQlOM+OWxVUNklYhmjH8fROGY4w/+h9qpbm94eWTZIiOG04BaWiCsReiDrKDdQWUb0BirXcOYGxq0hGtqqjKrtKZ5ATIbQ6f3qCRSQPmKWMbqD49I9FxX8EQZnsc+wb4zxcYNdYBVlBfQ2UbFK4pax8Rp5soPPVB7grXT68Cc2xfsdEyofvV9xs4BoDqwibMEIoUN1mcqguJ2oeuUH/RyjGLZx7OA17g5wC6+414E1VNcRu0Zcrh/5uOUUpxqT+sbKfWYqeOt4DZGd4SSO+1aiOUKGkRzUYrGUsofjFuh1RG8AKyBeRsBeyDP7QaZ698cMk+6scTyEDOUtVG75rqnwD8GgKZR0ifQ2kd5AuE5p1nDsEekewh2QTYbR6jBMte8Uk2r1/a5LOLzW/ROcPkepS4h0iVgHtnGygtF1El0HbqNsIXQwdJBHLzGc4vTiJAv8R5ER6Z+RaAP0A4jZIZJ3UF1GZQ2VXlV3XqJYnsR+qaY4cchJfJloiilOClP3f4pThSmhpzhVmBJ6ilOFKaGnOFWYEnqKU4Upoac4VZgSeopThSmhpzhV+P/w13XkqVF85gAAAABJRU5ErkJggg=="/>
                          <image id="image1_38_353" width="180" height="94" preserveAspectRatio="none" href="data:image/png;base64,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"/>
                          <image id="image2_38_353" width="180" height="94" preserveAspectRatio="none" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAABeCAYAAACKEj7WAAAABGdBTUEAALGPC/xhBQAACklpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAAEiJnVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/stRzjPAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAJcEhZcwAACxMAAAsTAQCanBgAAC4JSURBVHic7Z17uCVFee5/X/e67Pvsuc8wzMBwV+QmIKMYBVQ0ERMkxiTnUXO8EeORJJ7EmBjvRmNQo2JyYqLEC0fFG6goiiIoIhIBuYgKM8AwDHO/7T17Zu+191pd3/mjLl3dq9eAPj45yX7WN09Pd1dV16qufuutt76q7i2qSt/6Nl8s+f9dgL717ddpfUD3bV5ZH9B9m1fWB3Tf5pX1Ad23eWV9QPdtXlkf0H2bV9YHdN/mlfUB3bd5ZX1A921eWR/QfZtX1gd03+aV9QHdt3llfUD3bV5ZH9B9m1fWB3Tf5pX1Ad23eWV9QPdtXlkf0H2bV1arDH347dGJoiR0tE6iHYQMMKBthDaouDA9Xo2ejZrTQNeiukYw46imoIoqoKBuQ0GJwoz9ta50dB+HMPJ84usAieMK6SntpZBtHIa6PRKFu02leE7S81gLYUkeJkkhPA+ruE78ud9sebrDovtzN6ZxmInqtnDs6r4QDhhj8zDkcW7TcGzcOfY5hnCXZ36NqJJhdBfKZlUeVKO3g/4Q5RFVdz9qMafUUAURqKUpZRt/+4e6wqoB/fitCfyRavIy1JxtgxLAuBr0FW26K9oHeHwi+TUhneQXCQ51UbruDJH4wfZIU2V5SumOKYC5Ks2hcq0+71V6e2tVv6Ol88dXhkPevUR1LVGDF1yDtWjSQouoLrf6PIxEabQ7jb2P1Yo+OS+DGEW/DfJJ4POP68Z62K8oORSQS9TUHlRN/hXk7CJbiXso0b58XDIJ/0DEH+Wx5etsOqJrPJjL+UdsWomB/Jru3yyn8flRPH9MoPUI+2VeuC+Bqme+VXnGvU+4pNik7C09BtvjiaeYpvyT+YcEbN1rAHOP9JBA8jwVuRLkXpA/qLiLx2W/CqCPV8PNqsllSLKqG8gUz8PPRN2w5F1vsdvNr/EVFwCrOeSlK32c36GA9tjgCyFdrFyVvvTg1YG0fPyY9ngaQTURHMq00PCq8o7ZVCqTBNWFoNpdpgBw1xi01Cg0Tis+fenaCPCKnGgk+ZwiV4Euepy3GuyXArTCizKVn6kkZ1uNZwGpAZgeWBHA/A10AT1OEwPbboIgBeBLlM5dr+XfjNg4fmgSP524p6iyMlPH5YZDXVd9jNPz1XHdgK9ibqlMWy2Relh5/BBnLVI4VwfeSn0eZVPBtD3iJSprkbGLct+Fq2BIXmiUn4Gu+2WacQ9Am8ImKAqvMJp8EZIUEtcSHZhJUFIgdVn6fbxVgDkGLIkFXJpCo2bBqlHaroaSUOwiXbwRqNXgsBEYqEOm1b9dAHYpPO8XSvXSA9QF5qrqFSgxdimfKiat7CGIEHDonkZ7xkt1Okc4xfOK4lT0OP7Wuoro6rhXnLrNIiwf9Eb7FR2VHylyzuNl3h7pxqJtAZkOvsioXI7kjKykqOT7AsuKkwUlwCqJu6bErOLBm8D4EIwOwnADMl+L3YCrBLYK1FNo1rj9hi3MTXWg6ce9VQDulbcHdfz75ScS9wiHsgp2d5JESmFSla4yr6qGlcfloIyZV0rJ5BCgd+cS52fvNZcNLi6qU1UnSyQHqAawxuflzcVJHOYamwhzRm7sGJ6cuCL5rcoqAW1ohC2jcfQctS9CmgPZsXHOymkodDczJwH41qni0kt8jWPWY5Zw+eV3c+5FX2bHtmlYNEyRyXuAUaP9MQv5wtc2cuarvsOHv7gBjhinyPCSN564Z+gB8i6Q9ZQ3ZTYt1nh3PkSNIQZ66fouCdUjHVSypwVmOa33SuTXDY4OMrhsnKGFo6RpghrNhwOqJALDC0cZWbGIkYWjJOKctWVwVoK5G8AmhPcAenTfqsJMxo0dw5Aa5yU0Vffaw22nlhoBYVb5NggiqdM4ikiCdTomIAZVQSSzlS+CqKBicteP3wSne32YAbH+TFk2TGvTFK96x00A3H7Pbp5/+ip0fxs0b7PhCYjmw2l/PFqDnS1e9493APDI9mkrYfC/WW7WsZ+qAgj+p3zKAgAfY9NyOncupd/Tcph0F7XLO1HqHaIxQcFdVnZ/ShwGapR6vUZ95SL2rd/CA1v3MD40wLEnHkFzaoapPftBYWiwSTo+yi/ueZDNOyc5bOEoTzpxLZ29B5iamiaJ2D9299uGU3b3iYOF4tnfu/zU5BIopHW3lyFj022uaqDPK91GwSoB3SYFFEPyNwaOShAMxrrT1NhCioAaFDd4ix6gSoKoVUaIIUx6EAPQ5BWtBlYt4iOXfj2Uod6oQ5a4IiqKQQKIK4CdGThiIV/+8G3smmgBMDRQh8yzca9RUWQhSXf3m1diCUwhjKgOonSlVFoAYel3Yw+NggT9GfUGXW1PwvUF7dp1nz4sB1mtVqO+fCEfufxbvPtT32HHxAHSNOGPnn06//YXv8fAwjGyAy3SsRH+6iNX84Grf4BxJHLJb63jsosvpNkxzLbmXO45gXXVtrh7F9zkWXFgqPg4QhnV3ZuXOAZ57hzZCxLRa34pQGfUURhW+DsRn7Fv5Z6djWNjDa0KSVDHph6AopaFBWOvC60zCWCU8QY8uJ/3fvLOUIYkiSWKurx9I4nY2TeUoTrsnuVNH78n5GEU2yNIVP7Cw+7V1nuB1T+ZOM7HRx6dLtRVyBFHPTkQCDpaJUpTBrGnrKoyxhYanBbSeaiJCI3Dl/D2f/g877ji+pAiywz/ft1tTE/P8rn3/TH18VE+/PFv8L6rbipk/5Frb2Xx4CBve+VvM7t5J16g2CI7QMaTNQHADi+iXZO3BXaW3E2Yxwkd0n9TNSure9WeGrqOUn+9kiZKiiFFpY6hTkYNIzWXpoaK18R1DDVUam5vz43YdIY6KnWC7nbXoQmsWsyn/u9d7N3fysuQCQHQEmv1/Ljg6lu1gO98ZQPrN+/P81B/iyWvi8Tnh/LIFHW7VKXRKrYuxblBYD4QdOlCOMU8NAJz/oSjfCnGl3+3EFX14F26doeRsaGKeLjyB/ew/s4HoJbyz9f+R2WaD33rVqZ27GNkoEnQz5Jr4lxSOM0sUtxH8V5LG2ycUXde0OQAyQohvbDbtWqtEtAdamSS/qkRC14LyNQdW2B7UGfUMQHM9QB0g0/rwewbQT2AXEmRgQHYOc0HPvOTQhmMA55N55m65sJi92BqPYmacvm3HizmoUIAbNQoCtceCtRdbsOSK1GLgC+CuIpBY4CXwiECsk/b49gDpgD02CoYPJYv2A5uZtte/vKSF3LtB15Do8JtcPemHdBo0Jprd8UBHGzNcvBgi1qtRjyY8+A2DqhGPFjduXMiGPcsjYgDcOQNEdcINAluPRPikz/XHm6OHm679GlKujQGsnEANGJZWB2oc4DXA2DVA1b8ec7oPp29pgHDw0xtmmL9pr2lZ5IC9QBEdWD2rK2xZyWpwbRhz+RcIQtjAK0CrttrOazM3LFe7s3cRaY+1OZuLWZeFTfxkoNbCsONEnMXKymEaRWwe0kTu04Ag9B6aBu/eeHZ/OTTf82KElufeMQKGGxywenHU2VPOfpwVqxZwf6ZOcvO6oGcs24XiCNwGgd2qwCK1wVmd25eoxKuNyTPVGrLq8pULTnS9HzLzmnOtjGoqZE5kHoWNxFzV7N2EfSepdEaWm8w2KxXFC2WFxEzSwpSw4K7ZkFbazA+2izkoAGITtqU86xk5hjs3fIiTLvHs5RV3o+YqSPJESaMCixekh8xY0NF2KE0dDVjaymtH8wbhemfbeLEJx/LPZ99M086cgUAb3jRM3nik49j7oEtvO9//S7rjl9TyHHZghE+fskf0MmU2Uwtk3pWJXWAlQoQp0FW5JMqMXuX3Xp5XHxuND2fCqscFBqtnYm7XIXg2RDBDcxslagoornysULfDgZV8+KCIs7bYQeZ1rMhYiCr0RwYYnS4ycRUrqEVD9qUfBAoDtR+mGBAnEMyrTMy2Cjdh9PhkpKvLIsHSVpxXt5LKazY1YsPc3vtydLxteQeDPU5lAaD8XS9K3tIE4oVAb6rB64od+FeXVgCSsKBDVtYumY511/6x1x987285oKn0dq9n9bEAcaXL+b7l76O93/xRn6+eQdrly3k1ec/lTWHLWPH5p2IpG59pUa/qK595kPBfNCnpX1e0qLbLr6DwnoPVPWk8h1DTz907ej454mBKymKQZyXQcUgmjiPhoIYl9Yeq1owqwdz5KlQNaA1Go1BBgbq5TKAkykBvJFnxFaYgKb2d9M6QwNlQPtb9PJBo+cag7kK1M6tWNCu+XEAskbAczG5V6gHqMvx5bUmSAF+4TgCc3AgSPH37QXR/VgWKuSkhdxdeK3G/k07WL54nNf80fOY3bqX1vQsNBrs2THBguFB3vTqC6GdQZLAxAG2b92D1Oqom4JQjaHqqSyvY3VlC2s2yJ9C+VwqwkrP4CwqrJqhJV1kW4Rzq3kAYsLCee8TlpipIxaWwMIuXQC6ce4cB1JTQxopg80iGK33pIGRunMNOkZXt9ZaFNEUcL1H2mCwBGiJJIY6qFWzcBVrp9HD8ElygKv66i0ytvdkFBf2eImSl8z/r+E/CSUsIDiKL0TFJ+UBklYANjoP5SuBS2o1pg7OoFMztoprKWogqdWsTp7ehahgjJKSkNbqZB3bQxqXswexCnbRv0jJ76yHfAq9znOpFE6fQoVVA5r6YMhOXFEiYIt6GeHajUYs7n3PAfRFUCce6A7YmUlJB+sMlMBoJUcDQ939joG5ORpLxmHJCOyapLNzEqlZCSJpg6GBooa2+tczdBL1LL2qNK9we1juooumeDL0oLXHRQ+EB3IPKVKe/o7i8oZBgZ0LLO07nrgzqbQ4YdxT2UZTNdlhAqO7bh6l3c5YsXAcOx+RsHPPBHNZljfGwM55fhqDWMu1n8uObmmRJ/T3GVVB5eR39aDQD/TcQDB4MaTefUydLArPqJNJA+PAaNM1gscji65X6rQ1heYQgyUwKnU8QxvqZFlK47AV7Ni8n3981zXs2DRJ7bClqLGv6kCdkaFyHk5DB392za0hcZsUB4VKYt8Y6zlALA8o/UDVAlOdmyl4RcIAsDQQjDaJB45eylS0N+v58D1ALHXydEWerjgrt52SjAqAihYgxV6HjoEVK1dw8y8e5ry/vYw3fuJqli1bQi3N3XbxGo3gyfBzGe48q4jzW+Y8G8U0+RZ5TjIqrMdMYc23i3yRVszKga1dmhJD+/iirnbjWXeMO05UoD7A0OBgoQyGmmPoBqAMDA9CY5DzL/4Y96zfyie+cgc//f7bSYdG6bRmSU3KyHDR7WQfSh2/eAqvwwPngGKoRFAV3/VIYqvGc0eZdXvp6UhGCCVWd7paxRGqD4t+u0S4hfNQ4F7SI+++u+RLFO4p0NfWcLMBCi/9x0/x8M493PjT9Zx1/NFcdM46Nm7cQuL4Mb++ewpcxY9tbGiV8KsSgOU76WU9GDoNEyOZmxzJxDJx5hjZHxvPyJRYWcrs3XDXNMjEbTTo0IBkkKGhgUIZYg2daUq69nCu+cKt3LN+KwD3PrCNa75wG3LkKozWQOuMDhUbRSIpiPOLi5+gqeNZ2zK185XHTB679Aruu3iCJdp7f3a8hjtm5fKEjQe534xDoWPqAktHky3xi79+UN6dPj9v1FIGxoYYWLqAgWXjDC4YodmoUZZSxe7eMbMrm3e/dQyMrlzOl753Gw/v3BOuveRjVzIz1WJ4YLDEyknoDbPgxiuybBaxcmBkSbrzKTG5v67KemloV3viRtNRm4+8DCI5c+OOAyuTa+fEa2k8k+ds3VGgPshwiV1zhq7TrNWhnfDeT1xfSHPpFd/nBS99FrVaE7TO2MhwIT5JEgvo4OXwAz0FspJaS1ycZfCuAWQXfUQC1oGhGP8YzBz0a5nVKaUtyd1YN5d+3fsvGkvGYXwYJg+yd8tutu2eIDPKsoUjrFi9jMHDR2DHBFP7DiDR29R+FVxYKORyVoRGTSBTPvjVGwt1vHXvBFfe9GNefv65PLh5e6gCv06jvIV4t5ajq8pKYWW29tZj9WgvQNfwRJ8PoE2oVXFTWRbzjjECWDWAFRevXpLgpIcb5FnvhUJtiKGh4VIZHENTZ2DVUm699sfc8pMNhTQ3/2QDD/7oAY4+dS2YhOHhYh7iGZo66lbv2giDYBc72XPb4MIjVOOO/H26xxFqOe+2y267cJnNqQeoyY+r4gtLSotaGDf8Uu+bFqy7LMtoLhyF5YvYeNcGPnf97Xzntvu4Z8MW9u4/CMDIYJOTj13FReecyiUvOofRtSuZemibW2Lri+61c36uwKIli7nmhv/gll88QNm+fsdPeflznwOkYeGx4qVFtK7axRWljH8m5BCje99VtT2sWkNLPWeooOu8ntbw8MSDOYA69254lSaqqHfnka/Ay8e/BtJBhoZHioWQOkgTSZswMMybPvSFyhv47Hfu4i3nng4TUwwNFlm+Vm+ANN3qwYTEly+MwuO12WnFmNy7Je23JqTM1AU6icVsXPNOcoR6rAA13mUXsbIm0SSK83iE7EtAzzKaKxaDwN+885O8/7PX0+l0j5kOzMxyyz0Pccs9D/Gxr/6Qr1z6J5xw8tHs37DFgdrVgMb9k+1FZGyUT3znlspncOdDD7Nt1z4azQEOzszl1RM2DR6T7rii+RR+hNMb0OWGbq3Hajs7fe31stXU9RBmPSBeD0eaWpzmlQadgtZ2b7843ew1tPeKQIPhMqDTBtAgUys3Tj+pej3B929bDwcyoM7QUDGPWq0OSdONB+zvxQuowqInzT0W3vsRv5WjWgOpoep0t/pBprs2aOfSFLtGno4u3RxpbBNtVdPlhkhn202MjddMqY+PAcKzXn0p7/30dZVgLtv9m3Zw5kvfzfaN2xhbvRyTeZ+081L4RUYqqEJr735ed+FzSZNuIG3atZuNu/Yy2LQ6uuCh0Ggdh6Zk6rSwlvV0fF1a0NjVW/UypMrQrLA+w4Fb0gjIdTJSG0YEbDdAzNwg0L3C5QBcjwaORWBDncGRIhi95GhrjX3bJ3nfh97E71/wjK6y3vnzh5l4ZC80hxkaGiWJKnzP5AxocXVgvgrQgzpf+afkq/uKW4pR7+bzg8WoAcTAjt11IW0JwGUge5B2ufSIgB3FR46ZVARZPM7r3nY5N9xZlGQicNoTjuCZZxzPmU9ay/hYUZIdmGtzwZ9eBvU6gwMD+BnO4rJOC+qdO/dy3rrTufWyv2OoNAlmjLLnwDT1WhPv+oyBZzQezHnwFgd4qqkjzu5BZK+tynpMfduZtZzVfVfr9Y5fIYZTIxJpaIKWxkkPr5uF4rS4uAkWtM7Q0GixDOIYWhocnG4ztG+GK6+8jK3nvoQf3HZvSLd3cor7N+/hrBOOYWh4lOHBJlMH7ZqQW+5+CA5kNJvDzLRa+DUn3mOqkh/nGjqSGuHYSpPwqSxi+ZF3kqF6KnzEXZIjDotXxUWqxfucwxoPX91epiikSxaw7Sfr+edrf1Sov7952fO4+KLf4MhVS6Beg06Hffum+Obt9/NXl17Jln1TANzxwKNcccV1vPTP/5CZ2+6zg3SVguxQgKTOQxu3cMYpJ3HLh97DeW94G3sPHAy/184UFeuxsPrZ3mM+Mom0c0G55SKi6mtt8bHQLUHK1kNy2FaSb7l8iCdTcpdcreDSC+ukiVm7EUmU4oQNWmdwZKxQBpU6uDyoD7B95xSmpVz/tctZs2pZIe22PQcgabJ40WKWL14Ywu/buIXrvn0H6ROOJ+skoey+vHEP5Bnby4ggNWIWjtg4LF/V1E3GeJZOUbUTLBq79eLNSNe5GsknZYptK5cgJo9LEWrNJhx/JD++/5FCfXz1na/iPe97LUcesQKmZjB7JmFqmoVjw/yPVz6fu698GysX5/X92su+wO3fvJXxE49l6drDWbp4IQtHhxkbGmJseJiFYwtYuXgJR61aBa0Opzzn2dz/iY9ywurVIY/BgSHmMshfpO6WFLEciVffZX5CBb/+OQmSxISvDFhW14i9q6zHoDAKLjBLtPPsFFxIkh97LwhumFEYEHbsEEgSy46qdLTG4FAJ0EkdnCQRNUgtZdMju1j7hKP52mf+iVPPeXFIu2+qBZ2UwRWH8cRjj+SBR7aFuP/5lo9y9+knsezJpzDz8w3MzrZIJM2ZOdonYhB17rywajAfOKpndnJvjq+k/H3diEOc/kQ19Ghh4VKo12gfezfcYBCc9zpJYbAJY8N238lgYoo7vnoT7/zst8NPvuFF5/LbF18I9zxgtXRqeS0zipmcQW/fwOIzTuAdL38+F7//c4AdLJ75infymouexXmnPYGjli9l4egINanRyWC61Wb35EG27p5g8849PLR1B0mSkBmr1QebTcZHFjDTNk5m5G3RqHcPuE0j1o8YtzBADHVV4mOxnpPq4aC1Hm67yGld/nCgRsB2w+6QxK41df5oHJABse3LgkDyRUxu7DubpTQGi/quMTDMXGbZU8QgpEi9xsb7HuGUZ57He9/yev76XR8EoDWnoHUYHODsM0/la9/Nu9/tu/dy2m++lo+9/w381vlnM9iowc7dHJyYpNNuB3digmI0QyTFf2FVNFqXEkCduK7PrSB0Dds/Nnvq6iU8PYlegYzqseAJsXWdIPZDOQMNGByAgQFIBFqzHNy5l7t++iA/eWgLP7r/YX68YTMPProj3OvKRWNc+revgLaBJYuoJWKvTdxv+Ac1OMRLnrMuANrbR6/6Lh+96rsAjA0P0azXMEaZnp1jZna2AinWFo2OMjY8RqttyDRxoLVrrauAfChZ4YVemAEtfKAzSttDezw2oHGVETO0GzjYT3VpAeSxhvZuPnGfRxXn/y1Mg6PMmYTGQHFQuGTZYRycNWG1nWVRA0nKno1buOSPX8k/X/45Nm/dTr05CDSY3TXB7zz3Wbzxvf9SyGvrnn08/+Vv4tlPP50XP+8ZnHfmSRx99GoYHoTZFuyfIpuepj03S9bpoJrkTCzeX24Ck9vNrvTDaWeNGFtCGAV2xtgvfWC/D2tdZfW6BW2jbs/bHTg4w+TuCR7c9Qg/37yDOzdt4d7N27lz4xZ27dtf/STtT/Hat36M1vQMmiQkiZCmdp+I2ycJA8MD7NnbOx+A/QenDxkf2+qly1m2cCmP7trjPBq2LME5q0VQQ7eGDtgNVaUlGFO8ogdN95AcMaDL3SP5IKa0xsCzsV2DoC6suIbDSg8T5IagzGUJjcjldsSRR7LmqGOZPNCyDE00qExS9k61OPb4Y3jauqfw+au+xtjYQshq7NhzgOPPOouXXvR8rrjqG133df3Nd3D9zXfQbDY5+8lP5ClPOp7Tn3AUJx29mtVLFzG0cMwyYy2BrAOdNnQ60G7brdO2XX2WYT8iofkW11ciIIkFaOqmu8VpvnYGcx2YaWEOtti5Y5KH90zwwI49rN+2m4d27mXDtl3cv20XkwceP6gAtu/bz79cc9Mvdc2vw8495QwGB4Zpm91WAyv5oLIE5iqGjiVIbF1rqYF82FdN0T29HLkVR9kFTS0Q1vlGq2IkANxPsmSIpg6YWb7QyYF7LhMagyMkSYIxhpNOPpkVq1bz0AMPIlLLNW3QuwlIk4n9BwBYvGQ5rVlDhxoHdk7yvnf8LV++9nqmW9Xd5OzsLDf86E5u+NGdthJqNY5YuYzDly3miJVLWL1sMcsWjrFkdJhFo0MsGB5gweAAI806g/WUukDqenJRxRiDGkM7M7TnOkzPznJwZo6p6RYTB2eYPDjD3qlp9kwdZPvEFFv2TrJtYortE1PsmJxitsdLqP/ZdviScR7dPfFLXbNi0WJedcFFbNq527o2iZgZvwTVH5P3XFRPnnTrZnWrXf045VAKuudquzSm4+I+DFpy3RdALkXWzt10SeS2SwLjgpKoB/QYjUaDVqvFqWesI0kTOpqQkNgGQYpIRpYpa1YdwaOP7uT7N99CrZZy+Jq1TE630aTBth37OPb4Y/jGZz/JuRf94SFv3lun0+HBzVt5cPPWQ6QSBhp1GvUajVpKmiSk/mVTo2TGMNfJaHc6tNodTK9vVf0XtKMOW8abXvZC/uA5z2DlBa9kaqb12BcBx61ew6fe+C4GGkNs3b2dNEnty6zqxFiJpb2mzs1KUQ9j+1KADaeUzg8Ge0jnYL3eWHFHZVb2GUoAciDvClCHCV1J8kFgwR9tF/l3NKU5NEarZSvylNPXsb+FndVTBbGNIGsbli5ewYLFi3jFqy+m1Wpx9lOfyuo1R7N1y2aUOtQSNqx/mHOe+zy+/plP8XuveDUzs8W3wX81U1pzc7Tmfh15/Xps3QlHcckLzqNWS/je3ffx80e2sXNyisnpFjOzc7SzDGOUJBHqacpAo87wYJPxkWFWLl7AE484nHUnHss5p57I+IqlUBvg65e+mfP+7C1kpho6C0dHOWHNkZxz6hm87PwXMD4yzoZHt5CmdYzJRxkmAnNgZnJPcvcipLLoqAA1BVBX+u16SI6kBYzkb0sUge3G8Jao/e+6waKXI+K6FHEDRRuduOMk6GpUmTo4S9IY4i/ffimm02bNMU9k2/YJt6YkA00wnTZHrj2W0eGUl7z05Vx19ZcBOOuspzE0tpD2I1sQ6ggpSIf7f7aB51/wO9x2/Vr+4q1v5bobv1f5gP47WZImrDt2Lc877USec/ITWHfycbBoARjDiy94FkxPw/QMB2fnmOt0mDMZmSqSJKRpSr1eZ6DRYHBoAIYGoTkAcxnTe/az9aGtGBWecfpp3HTZP/Cxr3+bTdt3MdBssmrJElYtXc4xq9Zwwpq1HLZkBSODI2zZtYcHtm4jTRsWzI6dVd0QPoBWwqSK+0s6PiLID4+rEFt2ZbgxWQC1VmNXtOI1o+/unLkfOM4lCT9iM4olSAx0F6b+rQsN5Qgr8IIbzPlr1XlAsow0STj6qFFS4OGN+5lrzVBLBdPJGBsd4djVo9z3wDb+7DUv58bvXhfK+vVrvsu6s9axbctmu3JXFdEMjCHrtDl6zRpSgS9cfRX//rnPcMPNN1fVw39JG2w2OHn14Zxx1BE8/bijWHfsWo484jBYOAatFuybZK49B0mCJEKtniL11HlQEjc4jZ6RKp1MaWcZc5mhnbkvebqhe6ZCu6OsWrqMZr3JdKsDpDTqA6imHGy12Ts1zdR0i1bbYNwEkTGQeUAbJzmMkxxu7Oz/DhEmIkFVP/HqGFz9346KqDvCZ9DegPLD3/n7Fz29XGeVgL5+Z+tbijy3lLR4qn51mItz7C1RM/PuqxzMMaCLQPfgts3QkCAsWrSAlYth9z7lS1d8nHe/9Y3sn9wXivCkk07lezfdzrYtWzGdtvWilDbTyRhs1jlqzRpmpg9y6223ct2NN3Dzf9zKHffcTesQ/tX/TFu9eBHHLV/OcSuWcdKqwzjx8JUct3wpK1YshwUjgFoGPniQdqcT/Mv281tETqf4XKK1TQl+KB6G5IqbkXOLAhQyTSxQ3YxfZoR2x34L06hgTELm9wHEFtDqzo1igW26gRytHgggJgrLfc+4AO8ajmtLwegHLnzv7/5luR57aGi5DQ/oQkZ5t5BrZQhrC8h/P7w65NZ3BDHiZIf18Up4GQAnRUZHh1i+zKZdf+8WPveJq/n8pz7Offfe3VXO3/vDVzI0mjLbVhKp+VUECMbO+mGgltLqKD/bsJFGLeXM05/Kuc94Ngcm9nLfhvX84v5fsPGRTWzeuoXtO3ewb3KS6ZkZWrMtWrOztOZmmZubY7bdptPp0MkyOtljD/jSRGi6Ln6k2WR0YIAFQ0MsGRlh5YIFrBofZ5Xbr12yhCMXL6IxPmYnUxKBuTnLwgdmyCYPYMRVqmBdgNbx4yvV7pP8camKnVkn/6xCALR7NmFFHdGxsccWtGr3Pq06J6xGXzLy4Rr8VsEHHQaGER5tGeIXkStAHJRyrAZKxJsk91JhlQz9rd2d3xDVm0KW6kFbuLQkPyiws9/768NkSjTRYOWGnT1cfWSDwQQefXSaW66/lhuvvZobv/k1Dh44UFVuxsbGueWuR0gl5cD+ScfIRWnjN8K5Isb6kJu1lPGRYRaMDFOr1SDr0GnNMDfbYm62RXu2RXt2lnZ7jk57js7cHO32LO05e551OmTtDsZ00I7NMwVqIjREGKylDNXrDKYpQ2mNoXoDqTcgrVn/tCRgMuuXnp2F2Rloz5GZDOMqruBQcoD1zFBgZcfU/twzsz+2K00lBxwOcA7ERr3kSPJjY78351k4M5a5PTvbsJypVSXIDOPYXE2+SClmZ/tIolFhQLwG5s51dqS3ySlV0MNf+J4Lt5RxUS2sRX6gyl5VFoXKjObkcxde7nuOcVzpKQyf4cXPkNv0ScLCRTV+eP2tfPOLV3DTt65h+6Obq3Io2MWXvIU1a0e59+4d1JLiZwrcPCZ+lVxhlV2SIKrMZoadEwfYtXc/on65jPUv1wRSqVNv1hloQipuaZJAqup80LlUsk/QTbZkmZ2M6XTsrF+7DXNtTCej05rFdA5CJ0MzP/1PvvbFvfbm61WLf20o//aNB7d/xAZIHBMmHhP5uScfy87xIn7/WS3cwqDyOmjPvklpXzxWrAxRYu9GcV61OAcVr5vz96wBY7jvheTT3jm63OsZPxSkC8zQG9Co8H9U9c34LivkWxwkVpkHbNxT2NMkeivc3tiaI1O+9YUbeP3vP6tHbt22dPlhXPznr2fjpjlI6pbRAoj9Y7KA8D4ZuwYj8oO7c7vOxGCMcQulMuZKDC8mX9eRmIj5jUGMkmjm0hgks71AYtx1mSGdy5COW8tixE4ymVxu+TVJYQJLHBPFLqIykA1okg/MrfyICEYdS5tYakjobSsX8hf2DuAB6O5bdBpdV7omZ3yC9IgnUiPpTO4iy+WFhlRlyVE6Vj5syo3dWSWg51RA5P0i+mafHb4Q0U+or/+YmgsAdvtI1+feactI0y1YsHQxK1evYdvm4jLIXvbGd/0rC5cI27ZMU0tTTFjrIfhv3Rn8XxvwTTIePgenYl5SSUjU5MAvMLvbojUdYRofe41l7Cw0FvXgNxmSCUnHPwyx6DN5WcK3A602s6UUgcRVWuxx9WzsQR10tWNnI4Gl/WDd/2GfeEAYnqtGcQWdXNTOZdbWqJaCRveSRStW2UU46l7VLFFoN8DzL7AqwG4k+WKFUgZ6OKc1ETSVSU3knbmgd5VRVBnhZ0zY4orL4+Jr465o25aME884hS/ftYn3fOKLPPVZJedKydY98wJe8uoLWH//LFKrET6EIv6vcvn1uEL+Ron/Ima+xX8Ayfi9FM/zeLd+W6JjojXdaj8E79dVG3VvxqhdU2182TzTab5m2J5Ha6hN9MaLXzcdvaLlvQfx2y4x0GwFBwFdiqs6L16vwfUWs3QJ2GVG14gCtPhl0bC2OYA96h3CPmL+Urj9pG6OKZH6nyRpk6TWqMRH5aDwqxN5O0na+ijKqtBIPILLiPbsHUkjcbQsUbho7rJzBUA7MDyWsmoptDK47cY7uO5Ln+bbV13J3l07w88MDY9y3V1bWLJ0lG2PHKSWeEIzLk/LoolmkSsQvEvQxxcGiW6UEsdLJCsSp5HLcYnJEOPckEYLEkPUkGQZSScjyQySZaRzHSTLQvks8/jHlM+cehlkWVfzF5MTp6mjwWEY+CUEd13+ORBxLjuvm8XhP+pzNO5/rA7OnD42ageJ3suRmaQwSAyDQufmKw8i88FfSXqou58grB03B9wUwzzPq537/n4qtXM8wF787ud0Ybd6ptDnL2Bqcr609WcFHEv5pMK8KBTQoJnL8fZAajB90LB+v1Kvp5xx7uk889mn86q/+jtu+saXuPrTH+ent9/CG9/7cY45ZpR7fzprvxrvu+qwCN/urfiIPh8ouMfmNLbGskOxg0c/4vJiSVwuhvyPcEaNUN01YampR5N7XqpusxVqJLU4NBn5J4FNqBsvmVSLf2xBcVralyvIN88Q4oth78Z/HArI/2ZgpKPjTR3Yo4GcanEAGFi6kqHjgWQSNHQeViU3SliLwaD5sfWghUkUUqHVrNUvDPq1B+4qGforEyXgZbxUOvppYrkRU3aURUGraxzm2dIztpLkkjHEAc4bL4yPJyxfArt2wb233cMJTzqZ9myHrGM/DphP1pQ355zqYmhLG4mbuopZ2rv3EmPyNJ6ljb/ORAO+aCBoLHMnmYHMLriSLHMsbdlaMkPS7oT8c2hkrpEV9bpnaIBQUeKZmsJAURMpuOkCUyOuu8b+2YcI3PaVp1wqZE4qZEZsnGNlz9jepZczdOzSy115dvJFwhJSVPP3CwO6nTqOjqvCAzurUq+nT68n6Q9jeF30tmd2YbeSoQumQMoVmskC0I84+BXaSOE4Yu+iw8Uzoo/zLVjzYUDwjtiQycmMib3K0ECNM55xMhM7Ya5tSBM3sRCudK9HiVddgv8we/FLxXYgaILb3zO7PbYxSTjyzBwWm6vtDdQ30HBzhvyX3d9tVPfHKx1b27mjFFV/727UoVHv4BHqSl5YLyOuRj0AJLqzUBfxc/ODqpyZg+cjegr5YNECUYl0eRRP9Dtd2po8ra+SvN+JBqAlLARGDqRqjz0EwhtBiVwwnaQ/rCLfsj02oMHX9z8B+1E+FTeqqBwFK6iSECYU/9QX1kWo3el9NSSJMDvbYedWmyBJJe+dfErfDTkKcH89kVxSeC+CTa8IuBWABGDnoLZ5++M8Lp7xshXvkKZu9jOeBFDNrwla2QMmL0sAlSbkTd5/gs3Xsu8aPbLVDvzCkD4CTRXLlJ5CDsRIEnhvh+YAdrcZaQYPcC9P8oZCSCaFdMS/U6g/B2pf/hKA3NkkwkWK3tAFsB5W/epsldkb+rSKnAbcaYP8PwobFefxWYgTuq4tekRi7efuO+omCw/SNetYIxbi3UgqD49H2tEW/S3y+OGAEP4yk78u/OWmaGTu3uTW8J2OiAXVN77yjUffgo4/TuMrwrNrScvmOqP8qDw7R3HlB+PTeY8H4sAbhWlU9gBQCKDuqmtXzrjRxMWTOJ4o7+hZ53+t69sqyROBG8Llpa3KHj+g81zvIuHJKrwJ2FusJd+1F+Hbvda1G8jl55IrqHxfBioQJgsIFWEL2VXRIa8czP7vHMaALFdbOQ+Cq81/T9p/XEYCgMvdf0yuGnoUCeAoVELp/rsqqxxWtrghKF1lKeRfcb0vawy03Ip1XL6uukhxo4DiM4rSeEkFGxVepfBc4FBvXFTaLw/ovAx/LylHI/K/gbuKka7o0QixTBRd4VGEf64FUBcAmwPcFyYwUmVF+7RJ6Tqi63w+3SxfYDKF8IF0zffxzFuZ2eJz616TMNnhV6EVuquuRuRLWfwTcIW6rKhYLbF8zMAxSxfBVW15A5Bi7x8Y27OvK99jZFisd1CVm4FXKhwDXP4Yxelpj09D9yqRMIHwQZAPquE0RJ8BnCJwFLAKGFGiD5gWLi2Zk4ZxXLhpgWhk5ELVhVtdLrGbB/vw7YHVyjbGDxRdvlXuxDCqjQFVZmwfnw8QvY6OkJJLAnediP1kr6jtHdStXwjqOeppvAQR3L1Lnq3vkWyURvUnxToLEcW6LxxXAk8KDUIjti8DsTtvG1f4W0VxvnakMwn6KPCganKHYn6AcB9GCiT4q1il265vffvvar+65Ohb3/4LWh/QfZtX1gd03+aV9QHdt3llfUD3bV5ZH9B9m1fWB3Tf5pX1Ad23eWV9QPdtXlkf0H2bV9YHdN/mlfUB3bd5ZX1A921eWR/QfZtX1gd03+aV9QHdt3llfUD3bV5ZH9B9m1fWB3Tf5pX9P9KMxXBLmAwuAAAAAElFTkSuQmCC"/>
                          <image id="image3_38_353" width="180" height="94" preserveAspectRatio="none" href="data:image/png;base64,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"/>
                          <image id="image4_38_353" width="180" height="94" preserveAspectRatio="none" href="data:image/png;base64,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"/>
                          <image id="image5_38_353" width="180" height="94" preserveAspectRatio="none" href="data:image/png;base64,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"/>
                          <image id="image6_38_353" width="180" height="94" preserveAspectRatio="none" href="data:image/png;base64,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"/>
                          <image id="image7_38_353" width="180" height="94" preserveAspectRatio="none" href="data:image/png;base64,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"/>
                          <image id="image8_38_353" width="180" height="94" preserveAspectRatio="none" href="data:image/png;base64,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"/>
                      </defs>
                    </svg>
                  </div>

                  {/* Copyright (Right) */}
                  <div className="text-center md:text-right w-full md:w-auto">
                      الحقوق محفوظة | 2026 خيمة الالعاب khyma toys
                  </div>
              </div>
          </div>
      </footer>
    );
  }

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
          website: ''
        },
        backgroundSettings: savedBackgroundSettings ? JSON.parse(savedBackgroundSettings) : {
          type: 'color',
          color: '#0f172a',
          desktopImage: null,
          mobileImage: null
        },
        winSound: savedWinSound || "https://www.soundjay.com/human/sounds/applause-01.mp3",
        loseSound: savedLoseSound || "https://www.soundjay.com/misc/sounds/fail-trombone-01.mp3",
        footerSettings: savedFooterSettings ? JSON.parse(savedFooterSettings) : {
          description: 'مرحبا بكم في خيمة الالعاب .. أسعد مكان يتجول فيه الصغار والكبار متخصص في بيع المنتجات الترفيهية هنا نصنع البهجة',
          links: [],
          taxId: '300155258800003'
        },
        enableDevToolsProtection: savedEnableDevToolsProtection !== null ? savedEnableDevToolsProtection === 'true' : true,
        wheelStyle: savedWheelStyle || 'classic'
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
    color: '#0f172a',
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
    website: ''
  });

  // إعدادات الفوتر
  const [footerSettings, setFooterSettings] = useState(loadedSettings?.footerSettings || {
    description: 'مرحبا بكم في خيمة الالعاب .. أسعد مكان يتجول فيه الصغار والكبار متخصص في بيع المنتجات الترفيهية هنا نصنع البهجة',
    links: [],
    taxId: '300155258800003'
  });

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
            website: ''
          });
          const loadedFooterSettings = cloudSettings.footerSettings || {
            description: 'مرحبا بكم في خيمة الالعاب .. أسعد مكان يتجول فيه الصغار والكبار متخصص في بيع المنتجات الترفيهية هنا نصنع البهجة',
            links: [],
            taxId: '300155258800003'
          };
          setFooterSettings(loadedFooterSettings);
          console.log('✅ تم تحميل إعدادات الفوتر من السحابة:', {
            description: loadedFooterSettings.description?.substring(0, 50) + '...',
            linksCount: loadedFooterSettings.links?.length || 0,
            taxId: loadedFooterSettings.taxId
          });
          setBackgroundSettings(cloudSettings.backgroundSettings || {
            type: 'color',
            color: '#0f172a',
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
          
          // تحديث شكل العجلة
          if (cloudSettings.wheelStyle) {
            setWheelStyle(cloudSettings.wheelStyle);
            localStorage.setItem('wheelStyle', cloudSettings.wheelStyle);
            console.log('✅ تم تحميل شكل العجلة من السحابة:', cloudSettings.wheelStyle);
          }
          
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
            description: 'مرحبا بكم في خيمة الالعاب .. أسعد مكان يتجول فيه الصغار والكبار متخصص في بيع المنتجات الترفيهية هنا نصنع البهجة',
            links: [],
            taxId: '300155258800003'
          }));
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
              website: ''
            });
            setFooterSettings(localData.footerSettings || {
              description: 'مرحبا بكم في خيمة الالعاب .. أسعد مكان يتجول فيه الصغار والكبار متخصص في بيع المنتجات الترفيهية هنا نصنع البهجة',
              links: [],
              taxId: '300155258800003'
            });
            setBackgroundSettings(localData.backgroundSettings || {
              type: 'color',
              color: '#0f172a',
              desktopImage: null,
              mobileImage: null
            });
            setWinSound(localData.winSound || "https://www.soundjay.com/human/sounds/applause-01.mp3");
            setLoseSound(localData.loseSound || "https://www.soundjay.com/misc/sounds/fail-trombone-01.mp3");
            if (localData.enableDevToolsProtection !== undefined) {
              setEnableDevToolsProtection(localData.enableDevToolsProtection);
            }
            if (localData.wheelStyle) {
              setWheelStyle(localData.wheelStyle);
            }
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
            description: 'مرحبا بكم في خيمة الالعاب .. أسعد مكان يتجول فيه الصغار والكبار متخصص في بيع المنتجات الترفيهية هنا نصنع البهجة',
            links: [],
            taxId: '300155258800003'
          });
          setBackgroundSettings(localData.backgroundSettings || {});
          setWinSound(localData.winSound || "");
          setLoseSound(localData.loseSound || "");
          if (localData.enableDevToolsProtection !== undefined) {
            setEnableDevToolsProtection(localData.enableDevToolsProtection);
          }
          if (localData.wheelStyle) {
            setWheelStyle(localData.wheelStyle);
          }
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
            alert("حدث خطأ في الاتصال، يرجى التأكد من الإعدادات والمحاولة مرة أخرى.");
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
      setTempSegments([...tempSegments, { id: newId, text: "جائزة جديدة", value: "NEW", color: "#3B82F6", type: "prize", weight: 10, couponCodes: [] }]);
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

  const handleLogoUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          if (file.size > 2000000) { 
             alert("حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 2 ميجابايت");
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
             alert("حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 3 ميجابايت");
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
             alert("حجم الملف الصوتي كبير جداً (الحد الأقصى 3 ميجابايت)");
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
        alert("لا يوجد ملف صوتي للمعاينة.");
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
        alert("تعذر تشغيل الملف الصوتي. يرجى التأكد من الصيغة.");
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
          playPromise.catch(error => {
              if (error.name !== 'AbortError' && error.name !== 'NotSupportedError') {
                  console.error("Preview play failed", error);
              } else if (error.name === 'NotSupportedError') {
                  alert("صيغة الملف غير مدعومة في هذا المتصفح.");
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
        alert(`✅ تم حفظ الإعدادات بنجاح في السحابة! جميع المستخدمين سيرون نفس البيانات.${footerInfo}`);
      } else {
        alert('⚠️ تم حفظ الإعدادات محلياً، لكن حدث خطأ في الحفظ السحابي. يرجى المحاولة مرة أخرى.');
      }
  };

  const hasSocialLinks = socialLinks.facebook || socialLinks.instagram || socialLinks.twitter || socialLinks.whatsapp || socialLinks.snapchat || socialLinks.website;

  const SocialIcon = ({ href, icon: Icon, color, label }) => {
    if (!href) return null;
    const link = label === 'WhatsApp' ? `https://wa.me/${href.replace(/\D/g,'')}` : href;
    return (
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        className={`p-2 rounded-full bg-slate-800 text-white hover:bg-white hover:-translate-y-1 transition-all shadow-lg border border-slate-700`}
        style={{ '--hover-color': color }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = color; e.currentTarget.style.borderColor = color; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.borderColor = ''; }}
        title={label}
      >
        <Icon size={20} />
      </a>
    );
  };

  // مؤشر التحميل أثناء جلب البيانات من السحابة
  if (isLoadingSettings) {
    // محاولة جلب اللوجو من localStorage أو من البيانات المحملة
    const loadingLogo = storeLogo || loadedSettings?.logo || localStorage.getItem('storeLogo');
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans text-slate-100 bg-slate-900" dir="rtl" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
        <div className="text-center animate-fade-in">
          {loadingLogo ? (
            <div className="relative inline-block">
              {/* تأثير التوهج */}
              <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-30 rounded-full animate-pulse"></div>
              {/* اللوجو */}
              <div className="relative z-10 animate-bounce">
                <img 
                  src={loadingLogo} 
                  alt="Logo" 
                  className="h-32 md:h-40 w-auto mx-auto object-contain drop-shadow-2xl"
                  style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
                />
              </div>
              {/* مؤشر التحميل تحت اللوجو */}
              <div className="mt-8 flex justify-center">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '1s' }}></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s', animationDuration: '1s' }}></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s', animationDuration: '1s' }}></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Loader2 className="animate-spin mx-auto mb-4 text-blue-500" size={48} />
              <p className="text-xl font-bold text-white">جاري تحميل الإعدادات من السحابة...</p>
              <p className="text-sm text-slate-400 mt-2">يرجى الانتظار</p>
            </div>
          )}
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
          background-color: ${backgroundSettings.type === 'color' ? backgroundSettings.color : '#0f172a'};
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
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

      {/* Overlay for readability if image is set */}
      {backgroundSettings.type === 'image' && (
        <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none"></div>
      )}
      
      <ConfettiEffect active={showConfetti} />

      <button onClick={handleOpenDashboard} className="absolute top-4 left-4 z-40 bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700" title="إعدادات العجلة">
        <Settings size={20} />
      </button>

      {/* --- شاشة لوحة التحكم --- */}
      {showDashboard && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md animate-fade-in">
              <div className="bg-white text-slate-900 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
                  <button onClick={() => setShowDashboard(false)} className="absolute top-4 left-4 p-2 bg-slate-100 rounded-full hover:bg-red-100 text-slate-500 hover:text-red-500 transition-colors z-10"><XCircle size={24} /></button>

                  {!isDashboardUnlocked ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                          <div className="bg-slate-100 p-4 rounded-full mb-4"><Lock size={48} className="text-slate-400" /></div>
                          <h2 className="text-2xl font-bold mb-2">لوحة التحكم محمية</h2>
                          <p className="text-slate-500 mb-6">أدخل كلمة المرور للمتابعة (الافتراضية: admin)</p>
                          <form onSubmit={handleUnlockDashboard} className="flex gap-2 w-full max-w-xs">
                              <input type="password" placeholder="كلمة المرور" className="flex-1 px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-blue-500 outline-none text-center" value={dashboardPassword} onChange={(e) => setDashboardPassword(e.target.value)} autoFocus />
                              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700">دخول</button>
                          </form>
                      </div>
                  ) : (
                      <div className="flex flex-col h-full">
                          <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                              <div>
                                  <h2 className="text-2xl font-black flex items-center gap-2 text-slate-800"><Edit3 className="text-blue-600" /> إعدادات العجلة</h2>
                                  <p className="text-sm text-slate-500">التحكم الكامل في مظهر ووظائف العجلة</p>
                              </div>
                              <button onClick={handleSaveDashboard} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105"><Save size={18} /> حفظ التغييرات</button>
                          </div>

                          <div className="flex-1 overflow-y-auto p-6 bg-slate-100 relative">
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                  {/* --- إعدادات الشعار --- */}
                                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                      <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><ImageIcon className="text-purple-600" /> شعار المتجر</h3>
                                      <div className="flex items-center gap-4">
                                          <div className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center overflow-hidden relative">
                                              {tempLogo ? (
                                                  <img src={tempLogo} alt="Preview" className="w-full h-full object-contain" />
                                              ) : (
                                                  <span className="text-slate-400 text-xs text-center p-1">لا يوجد شعار</span>
                                              )}
                                              {tempLogo && (
                                                  <button onClick={() => setTempLogo(null)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"><XCircle size={12} /></button>
                                              )}
                                          </div>
                                          <div className="flex-1">
                                              <label className="block w-full cursor-pointer bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold py-2 px-4 rounded-lg text-center border border-purple-200 transition-colors mb-2">
                                                  <Upload className="inline-block w-4 h-4 ml-2" /> رفع صورة (Logo)
                                                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                                              </label>
                                              <p className="text-xs text-slate-500">ينصح باستخدام صورة بخلفية شفافة (PNG) حجم أقل من 2MB.</p>
                                          </div>
                                      </div>
                                  </div>

                                  {/* --- إعدادات المحاولات --- */}
                                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                      <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><Hash className="text-blue-600" /> عدد المحاولات</h3>
                                      <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                          <p className="flex-1 text-sm text-slate-600">حدد عدد المرات التي يمكن للمستخدم فيها تدوير العجلة.</p>
                                          <input 
                                              type="number" 
                                              min="1" 
                                              max="100"
                                              value={tempMaxSpins}
                                              onChange={(e) => setTempMaxSpins(parseInt(e.target.value) || 1)}
                                              className="w-20 px-3 py-2 border-2 border-blue-200 rounded-lg text-center font-bold text-lg outline-none focus:border-blue-500 bg-white"
                                          />
                                      </div>
                                  </div>

                                  {/* --- شكل العجلة --- */}
                                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 md:col-span-2">
                                      <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><RotateCw className="text-purple-600" /> شكل العجلة</h3>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <button
                                              onClick={() => setTempWheelStyle('classic')}
                                              className={`p-4 rounded-xl border-2 transition-all ${
                                                  tempWheelStyle === 'classic'
                                                      ? 'border-purple-500 bg-purple-50'
                                                      : 'border-slate-200 hover:border-purple-300'
                                              }`}
                                          >
                                              <div className="text-center">
                                                  <div className="w-24 h-24 mx-auto mb-2 rounded-full bg-gradient-to-b from-yellow-600 to-yellow-800 border-4 border-yellow-900 flex items-center justify-center">
                                                      <div className="w-20 h-20 rounded-full bg-white"></div>
                                                  </div>
                                                  <p className="font-bold text-slate-800">كلاسيكي</p>
                                                  <p className="text-xs text-slate-500 mt-1">الشكل التقليدي</p>
                                              </div>
                                          </button>
                                          <button
                                              onClick={() => setTempWheelStyle('modern')}
                                              className={`p-4 rounded-xl border-2 transition-all ${
                                                  tempWheelStyle === 'modern'
                                                      ? 'border-purple-500 bg-purple-50'
                                                      : 'border-slate-200 hover:border-purple-300'
                                              }`}
                                          >
                                              <div className="text-center">
                                                  <div className="w-24 h-24 mx-auto mb-2 relative">
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 467 501" fill="none" className="w-full h-full">
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
                                                  </div>
                                                  <p className="font-bold text-slate-800">حديث</p>
                                                  <p className="text-xs text-slate-500 mt-1">شكل عصري مع مؤشر</p>
                                              </div>
                                          </button>
                                      </div>
                                  </div>
                              </div>

                              {/* --- إعدادات الخلفية --- */}
                              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                                  <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><Palette className="text-purple-500" /> مظهر الخلفية</h3>
                                  <div className="flex gap-4 mb-4">
                                      <button 
                                          onClick={() => setTempBackgroundSettings({...tempBackgroundSettings, type: 'color'})}
                                          className={`flex-1 py-2 rounded-lg border-2 font-bold transition-all ${tempBackgroundSettings.type === 'color' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                      >
                                          لون ثابت
                                      </button>
                                      <button 
                                          onClick={() => setTempBackgroundSettings({...tempBackgroundSettings, type: 'image'})}
                                          className={`flex-1 py-2 rounded-lg border-2 font-bold transition-all ${tempBackgroundSettings.type === 'image' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                                      >
                                          صورة
                                      </button>
                                  </div>

                                  {tempBackgroundSettings.type === 'color' ? (
                                      <div className="flex items-center gap-4">
                                          <input 
                                              type="color" 
                                              value={tempBackgroundSettings.color}
                                              onChange={(e) => setTempBackgroundSettings({...tempBackgroundSettings, color: e.target.value})}
                                              className="w-16 h-16 rounded-lg cursor-pointer border-2 border-slate-200 p-1"
                                          />
                                          <div className="text-sm text-slate-500">
                                              اختر لون الخلفية المناسب لتصميمك.
                                          </div>
                                      </div>
                                  ) : (
                                      <div className="space-y-6">
                                          {/* صورة الديسك توب */}
                                          <div className="space-y-2">
                                              <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                                                  <Monitor size={16} /> خلفية الكمبيوتر (Desktop)
                                              </div>
                                              {tempBackgroundSettings.desktopImage && (
                                                  <div className="w-full h-24 rounded-lg overflow-hidden border-2 border-slate-200 relative mb-2">
                                                      <img src={tempBackgroundSettings.desktopImage} alt="Desktop BG" className="w-full h-full object-cover" />
                                                  </div>
                                              )}
                                              <label className="block w-full cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-3 px-4 rounded-lg text-center border border-slate-200 transition-colors flex items-center justify-center gap-2">
                                                  <Upload size={16} /> رفع صورة
                                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBackgroundUpload(e, 'desktop')} />
                                              </label>
                                          </div>

                                          {/* صورة الموبايل */}
                                          <div className="space-y-2">
                                              <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                                                  <Smartphone size={16} /> خلفية الهاتف (Mobile)
                                              </div>
                                              {tempBackgroundSettings.mobileImage && (
                                                  <div className="w-full h-24 rounded-lg overflow-hidden border-2 border-slate-200 relative mb-2">
                                                      <img src={tempBackgroundSettings.mobileImage} alt="Mobile BG" className="w-full h-full object-cover" />
                                                  </div>
                                              )}
                                              <label className="block w-full cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-3 px-4 rounded-lg text-center border border-slate-200 transition-colors flex items-center justify-center gap-2">
                                                  <Upload size={16} /> رفع صورة
                                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBackgroundUpload(e, 'mobile')} />
                                              </label>
                                          </div>
                                          <p className="text-xs text-slate-400 text-center">سيتم التبديل تلقائياً حسب حجم الشاشة.</p>
                                      </div>
                                  )}
                              </div>

                              {/* --- إعدادات الأصوات --- */}
                              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                                  <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><Music className="text-orange-500" /> المؤثرات الصوتية</h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      
                                      {/* صوت الفوز */}
                                      <div className="space-y-3">
                                          <label className="text-sm font-bold text-slate-600">صوت الفوز</label>
                                          <div className="flex gap-2 items-center">
                                              <button onClick={() => playPreview(tempWinSound)} className="flex-1 p-3 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600 flex items-center justify-center gap-2 transition-colors">
                                                  <Play size={16} /> معاينة الصوت الحالي
                                              </button>
                                              <label className="flex-1 cursor-pointer bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold py-3 px-4 rounded-lg text-center border border-orange-200 transition-colors flex items-center justify-center gap-2">
                                                  <Upload size={16} /> رفع ملف جديد
                                                  <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleAudioUpload(e, 'win')} />
                                              </label>
                                          </div>
                                      </div>

                                      {/* صوت الخسارة */}
                                      <div className="space-y-3">
                                          <label className="text-sm font-bold text-slate-600">صوت الخسارة</label>
                                          <div className="flex gap-2 items-center">
                                              <button onClick={() => playPreview(tempLoseSound)} className="flex-1 p-3 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600 flex items-center justify-center gap-2 transition-colors">
                                                  <Play size={16} /> معاينة الصوت الحالي
                                              </button>
                                              <label className="flex-1 cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-3 px-4 rounded-lg text-center border border-slate-200 transition-colors flex items-center justify-center gap-2">
                                                  <Upload size={16} /> رفع ملف جديد
                                                  <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleAudioUpload(e, 'lose')} />
                                              </label>
                                          </div>
                                      </div>

                                  </div>
                              </div>
                              
                              {/* --- إعدادات ربط البيانات --- */}
                              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 relative overflow-hidden">
                                  <div className="absolute top-0 right-0 w-2 h-full bg-green-500"></div>
                                  <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><Database className="text-green-600" /> ربط البيانات (Google Sheet)</h3>
                                  <div className="flex items-start gap-4 flex-col md:flex-row">
                                      <div className="p-3 bg-green-50 rounded-lg text-green-600"><LinkIcon size={24} /></div>
                                      <div className="flex-1 w-full">
                                          <label className="block text-sm font-bold text-slate-700 mb-2">رابط نشر التطبيق (Deployment URL)</label>
                                          <input 
                                              type="text" 
                                              value={tempGoogleScriptUrl}
                                              onChange={(e) => setTempGoogleScriptUrl(e.target.value)}
                                              placeholder="https://script.google.com/macros/s/AKfycb..."
                                              className="w-full p-3 border-2 border-slate-200 rounded-lg text-sm font-mono text-slate-600 focus:border-green-500 outline-none bg-slate-50 mb-2"
                                          />
                                          {tempGoogleScriptUrl && tempGoogleScriptUrl.includes('script.google.com') ? (
                                              <p className="text-xs text-green-600 flex items-center gap-1">
                                                  <CheckCircle size={12} /> رابط صحيح! سيتم استخدامه لتحميل وحفظ البيانات.
                                              </p>
                                          ) : (
                                              <p className="text-xs text-yellow-600 flex items-center gap-1">
                                                  <AlertCircle size={12} /> أدخل رابط Google Script الصحيح من Deploy → Web app URL
                                              </p>
                                          )}
                                          <p className="text-xs text-slate-500 mt-1">
                                              ⚠️ مهم: تأكد من أن "Who has access" = "Anyone" عند النشر
                                          </p>
                                      </div>
                                      
                                      {/* إعدادات الحماية من Developer Tools */}
                                      <div className="p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
                                          <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center gap-2">
                                                  <Lock className="text-slate-600" size={18} />
                                                  <label className="font-bold text-slate-700">حماية من فتح Developer Tools</label>
                                              </div>
                                              <label className="relative inline-flex items-center cursor-pointer">
                                                  <input 
                                                      type="checkbox" 
                                                      checked={tempEnableDevToolsProtection}
                                                      onChange={(e) => setTempEnableDevToolsProtection(e.target.checked)}
                                                      className="sr-only peer"
                                                  />
                                                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                              </label>
                                          </div>
                                          <p className="text-xs text-slate-500 mt-2">
                                              {tempEnableDevToolsProtection ? (
                                                  <span className="text-green-600">✅ الحماية مفعّلة - سيتم منع فتح Developer Tools</span>
                                              ) : (
                                                  <span className="text-orange-600">⚠️ الحماية معطّلة - يمكن فتح Developer Tools</span>
                                              )}
                                          </p>
                                      </div>
                                  </div>
                              </div>

                              {/* --- إعدادات السوشيال ميديا --- */}
                              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                                  <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><Share2 className="text-pink-500" /> روابط التواصل الاجتماعي</h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div className="flex items-center gap-2">
                                          <Facebook className="text-blue-600" />
                                          <input type="text" placeholder="رابط الفيسبوك" className="flex-1 p-2 border rounded-lg text-sm" value={tempSocialLinks.facebook} onChange={e => setTempSocialLinks({...tempSocialLinks, facebook: e.target.value})} />
                                      </div>
                                      <div className="flex items-center gap-2">
                                          <Instagram className="text-pink-600" />
                                          <input type="text" placeholder="رابط انستجرام" className="flex-1 p-2 border rounded-lg text-sm" value={tempSocialLinks.instagram} onChange={e => setTempSocialLinks({...tempSocialLinks, instagram: e.target.value})} />
                                      </div>
                                      <div className="flex items-center gap-2">
                                          <Twitter className="text-sky-500" />
                                          <input type="text" placeholder="رابط تويتر/X" className="flex-1 p-2 border rounded-lg text-sm" value={tempSocialLinks.twitter} onChange={e => setTempSocialLinks({...tempSocialLinks, twitter: e.target.value})} />
                                      </div>
                                      {/* حقل سناب شات الجديد */}
                                      <div className="flex items-center gap-2">
                                          <Ghost className="text-yellow-400" />
                                          <input type="text" placeholder="رابط سناب شات" className="flex-1 p-2 border rounded-lg text-sm" value={tempSocialLinks.snapchat} onChange={e => setTempSocialLinks({...tempSocialLinks, snapchat: e.target.value})} />
                                      </div>
                                      <div className="flex items-center gap-2">
                                          <MessageCircle className="text-green-500" />
                                          <input type="text" placeholder="رقم واتساب (مع كود الدولة)" className="flex-1 p-2 border rounded-lg text-sm" value={tempSocialLinks.whatsapp} onChange={e => setTempSocialLinks({...tempSocialLinks, whatsapp: e.target.value})} />
                                      </div>
                                      <div className="flex items-center gap-2 md:col-span-2">
                                          <Globe className="text-slate-500" />
                                          <input type="text" placeholder="رابط الموقع الإلكتروني" className="flex-1 p-2 border rounded-lg text-sm" value={tempSocialLinks.website} onChange={e => setTempSocialLinks({...tempSocialLinks, website: e.target.value})} />
                                      </div>
                                  </div>
                              </div>

                              {/* --- إعدادات الفوتر --- */}
                              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
                                  <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><LinkIcon className="text-cyan-500" /> إعدادات الفوتر</h3>
                                  
                                  {/* وصف الفوتر */}
                                  <div className="mb-6">
                                      <label className="block text-sm font-bold text-slate-700 mb-2">النص تحت اللوجو</label>
                                      <textarea 
                                          value={tempFooterSettings.description || ''}
                                          onChange={(e) => setTempFooterSettings({...tempFooterSettings, description: e.target.value})}
                                          placeholder="أدخل النص الذي سيظهر تحت اللوجو في الفوتر"
                                          className="w-full p-3 border-2 border-slate-200 rounded-lg text-sm focus:border-cyan-500 outline-none resize-none h-24"
                                          dir="rtl"
                                      />
                                  </div>

                                  {/* الرقم الضريبي */}
                                  <div className="mb-6">
                                      <label className="block text-sm font-bold text-slate-700 mb-2">الرقم الضريبي</label>
                                      <input 
                                          type="text" 
                                          value={tempFooterSettings.taxId || ''}
                                          onChange={(e) => setTempFooterSettings({...tempFooterSettings, taxId: e.target.value})}
                                          placeholder="300155258800003"
                                          className="w-full p-3 border-2 border-slate-200 rounded-lg text-sm font-mono focus:border-cyan-500 outline-none"
                                          dir="ltr"
                                      />
                                  </div>

                                  {/* روابط الفوتر */}
                                  <div>
                                      <div className="flex justify-between items-center mb-3">
                                          <label className="block text-sm font-bold text-slate-700">روابط تهمك</label>
                                          <button 
                                              onClick={() => setTempFooterSettings({
                                                  ...tempFooterSettings, 
                                                  links: [...(tempFooterSettings.links || []), { label: '', url: '' }]
                                              })}
                                              className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1"
                                          >
                                              <Plus size={14} /> إضافة رابط
                                          </button>
                                      </div>
                                      
                                      <div className="space-y-3">
                                          {(tempFooterSettings.links || []).map((link, index) => (
                                              <div key={index} className="flex gap-2 items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                                                  <div className="flex-1 grid grid-cols-2 gap-2">
                                                      <input 
                                                          type="text" 
                                                          value={link.label || ''}
                                                          onChange={(e) => {
                                                              const newLinks = [...(tempFooterSettings.links || [])];
                                                              newLinks[index] = {...newLinks[index], label: e.target.value};
                                                              setTempFooterSettings({...tempFooterSettings, links: newLinks});
                                                          }}
                                                          placeholder="اسم الرابط (مثال: المدونة)"
                                                          className="p-2 border border-slate-300 rounded text-sm focus:border-cyan-500 outline-none"
                                                          dir="rtl"
                                                      />
                                                      <input 
                                                          type="text" 
                                                          value={link.url || ''}
                                                          onChange={(e) => {
                                                              const newLinks = [...(tempFooterSettings.links || [])];
                                                              newLinks[index] = {...newLinks[index], url: e.target.value};
                                                              setTempFooterSettings({...tempFooterSettings, links: newLinks});
                                                          }}
                                                          placeholder="الرابط (مثال: https://example.com)"
                                                          className="p-2 border border-slate-300 rounded text-sm font-mono focus:border-cyan-500 outline-none"
                                                          dir="ltr"
                                                      />
                                                  </div>
                                                  <button 
                                                      onClick={() => {
                                                          const newLinks = (tempFooterSettings.links || []).filter((_, i) => i !== index);
                                                          setTempFooterSettings({...tempFooterSettings, links: newLinks});
                                                      }}
                                                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                                      title="حذف"
                                                  >
                                                      <Trash2 size={18} />
                                                  </button>
                                              </div>
                                          ))}
                                          
                                          {(!tempFooterSettings.links || tempFooterSettings.links.length === 0) && (
                                              <p className="text-sm text-slate-400 text-center py-4 border-2 border-dashed border-slate-200 rounded-lg">
                                                  لا توجد روابط. اضغط على "إضافة رابط" لإضافة رابط جديد.
                                              </p>
                                          )}
                                      </div>
                                  </div>
                              </div>

                              <hr className="border-slate-200 mb-8" />

                              {editingCouponsId && (
                                  <div className="absolute inset-0 z-20 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                                      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl flex flex-col h-[80%] overflow-hidden animate-bounce-in">
                                          <div className="p-4 border-b flex justify-between items-center bg-blue-50">
                                              <h3 className="font-bold flex items-center gap-2"><Ticket className="text-blue-500" /> أدخل أكواد الكوبونات</h3>
                                              <button onClick={() => setEditingCouponsId(null)} className="text-slate-400 hover:text-red-500"><XCircle /></button>
                                          </div>
                                          <div className="p-4 flex-1 flex flex-col">
                                              <p className="text-sm text-slate-500 mb-2">الصق الأكواد هنا (كود واحد في كل سطر):</p>
                                              <textarea className="flex-1 w-full border-2 border-slate-200 rounded-lg p-3 font-mono text-sm outline-none focus:border-blue-500 resize-none" placeholder="CODE1&#10;CODE2&#10;CODE3..." value={couponInput} onChange={(e) => setCouponInput(e.target.value)}></textarea>
                                              <div className="mt-2 text-xs text-right text-slate-400">العدد الحالي: {couponInput.split('\n').filter(x=>x.trim()).length}</div>
                                          </div>
                                          <div className="p-4 border-t bg-slate-50">
                                              <button onClick={saveCoupons} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">حفظ القائمة</button>
                                          </div>
                                      </div>
                                  </div>
                              )}

                              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><List className="text-slate-500" /> قائمة الجوائز</h3>
                              <div className="grid gap-4">
                                  {tempSegments.map((seg, index) => (
                                      <div key={seg.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col lg:flex-row items-start lg:items-center gap-4 animate-fade-in-up">
                                          <div className="bg-slate-100 p-2 rounded-lg font-bold text-slate-400 w-8 h-8 flex items-center justify-center shrink-0">{index + 1}</div>
                                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
                                              <div className="flex flex-col gap-1"><label className="text-xs font-bold text-slate-400">اسم الجائزة (عربي)</label><input type="text" value={seg.text} onChange={(e) => handleSegmentChange(index, 'text', e.target.value)} className="border border-slate-300 rounded px-2 py-1.5 focus:border-blue-500 outline-none w-full" /></div>
                                              <div className="flex flex-col gap-1"><label className="text-xs font-bold text-slate-400">النوع</label><select value={seg.type} onChange={(e) => handleSegmentChange(index, 'type', e.target.value)} className="border border-slate-300 rounded px-2 py-1.5 focus:border-blue-500 outline-none bg-white w-full"><option value="prize">جائزة (Prize)</option><option value="luck">خسارة (Luck)</option></select></div>
                                              <div className="flex flex-col gap-1"><label className="text-xs font-bold text-slate-400">اللون</label><div className="flex gap-2 items-center"><input type="color" value={seg.color} onChange={(e) => handleSegmentChange(index, 'color', e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0 p-0" /><span className="text-xs text-slate-500 font-mono">{seg.color}</span></div></div>
                                              <div className="flex flex-col gap-1"><label className="text-xs font-bold text-slate-400">القيمة/العرض</label><input type="text" value={seg.value} onChange={(e) => handleSegmentChange(index, 'value', e.target.value)} className="border border-slate-300 rounded px-2 py-1.5 focus:border-blue-500 outline-none w-full font-mono text-sm" dir="ltr" /></div>
                                              <div className="flex flex-col gap-1 relative"><label className="text-xs font-bold text-slate-400 flex items-center gap-1"><Scale size={12} /> الوزن</label><input type="number" min="0" value={seg.weight || 0} onChange={(e) => handleSegmentChange(index, 'weight', parseInt(e.target.value) || 0)} className="border border-slate-300 rounded px-2 py-1.5 focus:border-blue-500 outline-none w-full font-mono text-center" /></div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                              <button onClick={() => openCouponManager(seg.id)} className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors relative border border-blue-100" title="إدارة الكوبونات"><Ticket size={20} />{seg.couponCodes && seg.couponCodes.length > 0 && (<span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm">{seg.couponCodes.length}</span>)}</button>
                                              <button onClick={() => handleDeleteSegment(seg.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors border border-red-100" title="حذف"><Trash2 size={20} /></button>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                              <button onClick={handleAddSegment} className="mt-6 w-full py-3 border-2 border-dashed border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-500 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors bg-white hover:bg-blue-50"><Plus size={20} /> إضافة جائزة جديدة</button>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )}

      {showRegistrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-fade-in">
           <div className="bg-white text-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-yellow-400 relative overflow-hidden transform animate-bounce-in">
              <button onClick={() => setShowRegistrationModal(false)} className="absolute top-2 left-2 text-slate-400 hover:text-red-500 transition-colors p-2"><XCircle size={24} /></button>
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500"></div>
              <div className="text-center mb-8">
                {storeLogo ? (
                    <img src={storeLogo} alt="Logo" className="w-24 h-24 mx-auto mb-4 object-contain animate-pulse drop-shadow-lg" />
                ) : (
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg animate-pulse"><Gift size={40} className="text-yellow-600" /></div>
                )}
                <h2 className="text-3xl font-black text-slate-800 mb-2">خطوة واحدة للربح! 🎁</h2>
                <p className="text-slate-500">سجل بياناتك لتدور العجلة فوراً</p>
              </div>
              <form onSubmit={handleRegistration} className="space-y-4">
                 <div className="relative"><User className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" size={20} /><input type="text" placeholder="الاسم بالكامل" required className="w-full pr-10 pl-4 py-3 rounded-xl border-2 border-slate-200 focus:border-yellow-400 focus:ring-0 outline-none transition-all bg-slate-50" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} disabled={isSubmitting} /></div>
                 <div className="relative"><Mail className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" size={20} /><input type="email" placeholder="البريد الإلكتروني" required className="w-full pr-10 pl-4 py-3 rounded-xl border-2 border-slate-200 focus:border-yellow-400 focus:ring-0 outline-none transition-all bg-slate-50" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} disabled={isSubmitting} /></div>
                 <div className="relative">
                   <Phone className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" size={20} />
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium z-10">🇸🇦 +966</div>
                   <input 
                     type="tel" 
                     placeholder="5xxxxxxxx" 
                     required 
                     className={`w-full pr-10 pl-16 py-3 rounded-xl border-2 focus:ring-0 outline-none transition-all bg-slate-50 text-left ${phoneError ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-yellow-400'}`} 
                     value={userData.phone.replace('+966', '')} 
                     onChange={(e) => handlePhoneChange(e.target.value)} 
                     onFocus={(e) => {
                       if (!userData.phone || userData.phone === '+966') {
                         e.target.value = '';
                       }
                     }}
                     disabled={isSubmitting} 
                     dir="ltr" 
                   />
                 </div>
                 {phoneError && (<p className="text-red-500 text-xs flex items-center gap-1 mt-1 font-bold"><AlertCircle size={12} /> {phoneError}</p>)}
                 <button type="submit" disabled={isSubmitting} className={`w-full font-bold py-4 rounded-xl shadow-lg transform transition-all flex items-center justify-center gap-2 text-lg mt-4 ${isSubmitting ? 'bg-slate-400 cursor-wait' : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 active:scale-95 text-white'}`}>{isSubmitting ? (<><Loader2 size={20} className="animate-spin" /> جاري الحفظ... </>) : (<><Lock size={20} /> سجل والعب الآن </>)}</button>
                 <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1"><CheckCircle size={12} className="text-green-500" /> بياناتك آمنة ولن يتم مشاركتها.</p>
              </form>
           </div>
        </div>
      )}

      {/* Main Content Container with Padding for Header */}
      <div className="w-full flex flex-col items-center justify-center min-h-[calc(100vh-350px)] py-12">
          {/* Header */}
          <header className="mb-8 text-center relative z-10">
        {storeLogo ? (
            <div className="mb-6 relative inline-block animate-fade-in">
                <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 rounded-full"></div>
                <img src={storeLogo} alt="Store Logo" className="h-24 md:h-32 object-contain relative z-10 drop-shadow-xl" />
            </div>
        ) : (
             <h1 className="text-4xl md:text-6xl font-black text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] mb-2 tracking-wider uppercase" style={{ textShadow: '4px 4px 0px #F59E0B' }}>عجلة الحظ</h1>
        )}
        
        <div className="flex items-center justify-center gap-4 mt-2">
             <p className="text-yellow-400 font-bold bg-black/30 px-4 py-1 rounded-full border border-yellow-500/50 inline-flex items-center gap-2"><Sparkles size={16} /> جوائز حقيقية ومضمونة</p>
            <button onClick={toggleMute} className="bg-black/30 p-2 rounded-full border border-slate-600 hover:bg-black/50 transition-colors text-slate-300" title={isMuted ? "تشغيل الصوت" : "كتم الصوت"}>{isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
        </div>
      </header>

      {/* --- أيقونات التواصل الاجتماعي (موبايل وديسكتوب - فوق العجلة) --- */}
      {hasSocialLinks && (
          <div className="mb-8 relative z-30 w-full flex justify-center animate-fade-in-up">
              <div className="bg-slate-800/90 backdrop-blur-md px-3 py-3 rounded-[16PX] border border-slate-700 shadow-xl">
                  <div className="flex items-center gap-[0.25rem] flex-wrap justify-center">
                      <SocialIcon href={socialLinks.facebook} icon={Facebook} color="#1877F2" label="Facebook" />
                      <SocialIcon href={socialLinks.instagram} icon={Instagram} color="#E4405F" label="Instagram" />
                      <SocialIcon href={socialLinks.twitter} icon={Twitter} color="#1DA1F2" label="Twitter" />
                      <SocialIcon href={socialLinks.snapchat} icon={Ghost} color="#FFFC00" label="Snapchat" />
                      <SocialIcon href={socialLinks.whatsapp} icon={MessageCircle} color="#25D366" label="WhatsApp" />
                      <SocialIcon href={socialLinks.website} icon={Globe} color="#64748b" label="Website" />
                  </div>
              </div>
          </div>
      )}

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
                      return (<g key={segment.id}><path d={describeArc(startAngle, endAngle)} fill={isUsed ? '#cbd5e1' : segment.color} stroke="white" strokeWidth="0.5" style={{ filter: isUsed ? 'grayscale(100%)' : 'none', opacity: isUsed ? 0.8 : 1, transition: 'fill 0.3s' }} /></g>);
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
                   return (<g key={segment.id}><path d={describeArc(startAngle, endAngle)} fill={isUsed ? '#cbd5e1' : segment.color} stroke="white" strokeWidth="0.5" style={{ filter: isUsed ? 'grayscale(100%)' : 'none', opacity: isUsed ? 0.8 : 1, transition: 'fill 0.3s' }} /></g>);
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
        <div className="flex-1 w-full max-w-md bg-white text-slate-800 p-6 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] border-4 border-slate-200">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-xl font-black flex items-center gap-2 text-slate-800"><ShoppingBag className="text-red-500" /> الجوائز المكتسبة</h2>
            <button onClick={resetGame} className={`text-xs flex items-center gap-1 transition-all px-3 py-1.5 rounded-full font-bold uppercase ${remainingSpins <= 0 || availableIds.length === 0 ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:text-white hover:bg-red-500'}`}><RefreshCw size={14} /> إعادة اللعبة</button>
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
               <span>المحاولات المتبقية</span>
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

      {/* === Winner Modal === */}
      {showModal && winner && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center relative shadow-2xl transform scale-100 transition-all border-8 border-yellow-400">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"><XCircle size={24} /></button>
            <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-xl border-4 border-white text-white" style={{ backgroundColor: winner.color }}>{winner.type === 'luck' ? '😔' : '🎉'}</div>
            <h2 className="text-3xl font-black mb-2 text-slate-800">{winner.type === 'luck' ? 'يا خسارة!' : 'مبروك عليك!'}</h2>
            <div className="mb-6">
               {winner.type === 'luck' ? ( <p className="text-slate-500 font-medium">حاول مرة تانية، أكيد هتكسب!</p> ) : (
                   <div className="w-full">
                       <p className="text-xl font-bold text-slate-800 mb-2">{winner.text}</p>
                       {isLoadingAI ? ( <div className="flex items-center justify-center gap-2 text-sm text-blue-600 bg-blue-50 py-2 rounded-lg animate-pulse"><Loader2 className="animate-spin" size={16} /> جاري تجهيز الهدية...</div> ) : aiContent ? ( <p className="text-sm text-slate-600 bg-yellow-50 p-2 rounded-lg border border-yellow-200 italic">"{aiContent.message}"</p> ) : null}
                   </div>
               )}
            </div>
            {winner.type === 'prize' && ( 
              <>
                <div className={`p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer relative overflow-hidden group ${copied ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-slate-400 bg-slate-50'}`} onClick={() => aiContent ? handleCopy(aiContent.code) : null}>
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">اضغط للنسخ</p>
                  {isLoadingAI ? ( <div className="h-8 w-32 bg-slate-200 mx-auto rounded animate-pulse"></div> ) : ( <code className="text-2xl font-black tracking-widest text-slate-800">{aiContent ? aiContent.code : "..."}</code> )}
                  {copied && <div className="absolute inset-0 flex items-center justify-center bg-green-500/90 text-white font-bold">تم النسخ!</div>}
                </div>
                
                {/* زر الذهاب للمتجر - يظهر فقط إذا تم إعداد الرابط */}
                {socialLinks.website && (
                  <a 
                    href={socialLinks.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-3 w-full py-3 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 animate-fade-in-up"
                  >
                    <ExternalLink size={18} /> تسوق الآن واستخدم الكوبون
                  </a>
                )}
              </>
            )}
            <button onClick={() => setShowModal(false)} className="mt-4 w-full py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all">{remainingSpins > 0 ? 'لف تاني' : 'انهاء اللعبة'}</button>
          </div>
        </div>
      )}

      <Footer logo={storeLogo} socialLinks={socialLinks} footerSettings={footerSettings} />

      <style>{`.clip-path-pointer { clip-path: polygon(50% 100%, 0 0, 100% 0); } .perspective-1000 { perspective: 1000px; } .animate-spin-slow { animation: spin 3s linear infinite; } @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; } @keyframes bounceIn { 0% { transform: scale(0.3); opacity: 0; } 50% { transform: scale(1.05); opacity: 1; } 70% { transform: scale(0.9); } 100% { transform: scale(1); } } .animate-bounce-in { animation: bounceIn 0.5s cubic-bezier(0.215, 0.610, 0.355, 1.000); }`}</style>
    </div>
  );
};

export default LuckyWheel;
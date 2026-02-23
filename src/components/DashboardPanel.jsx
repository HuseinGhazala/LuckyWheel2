import React from 'react';
import { XCircle, Lock, Edit3, Save, Plus, Trash2, Upload, Hash, RotateCw, Palette, Monitor, Smartphone, Music, Play, Database, Link as LinkIcon, CheckCircle, AlertCircle, Share2, Facebook, Instagram, Twitter, Ghost, MessageCircle, Globe, Mail, Phone, List, Ticket, Scale, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function DashboardPanel(props) {
  const {
    show, onClose, isDashboardUnlocked, dashboardPassword, setDashboardPassword, onUnlockDashboard, onSave,
    tempLogo, setTempLogo, onLogoUpload, tempMaxSpins, setTempMaxSpins, tempWheelStyle, setTempWheelStyle,
    tempBackgroundSettings, setTempBackgroundSettings, onBackgroundUpload, tempWinSound, tempLoseSound, onAudioUpload, onPlayPreview,
    tempGoogleScriptUrl, setTempGoogleScriptUrl, tempEnableDevToolsProtection, setTempEnableDevToolsProtection,
    tempSocialLinks, setTempSocialLinks, tempFooterSettings, setTempFooterSettings,
    tempHeaderBadgeText, setTempHeaderBadgeText,
    editingCouponsId, setEditingCouponsId, couponInput, setCouponInput, onSaveCoupons,
    tempSegments, handleSegmentChange, handleAddSegment, handleDeleteSegment, openCouponManager
  } = props;
  if (!show) return null;
  return (          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#ffffff]/95 backdrop-blur-md animate-fade-in">
              <div className="bg-white text-slate-900 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
                  <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-slate-100 rounded-full hover:bg-red-100 text-slate-500 hover:text-red-500 transition-colors z-10"><XCircle size={24} /></button>

                  {!isDashboardUnlocked ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                          <div className="bg-slate-100 p-4 rounded-full mb-4"><Lock size={48} className="text-slate-400" /></div>
                          <h2 className="text-2xl font-bold mb-2">لوحة التحكم محمية</h2>
                          <p className="text-slate-500 mb-6">أدخل كلمة المرور للمتابعة </p>
                          <form onSubmit={onUnlockDashboard} className="flex gap-2 w-full max-w-xs">
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
                              <button onClick={onSave} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform hover:scale-105"><Save size={18} /> حفظ التغييرات</button>
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
                                                  <input type="file" accept="image/*" className="hidden" onChange={onLogoUpload} />
                                              </label>
                                              <p className="text-xs text-slate-500">ينصح باستخدام صورة بخلفية شفافة (PNG) حجم أقل من 2MB.</p>
                                          </div>
                                      </div>
                                  </div>

                                  {/* --- نص الشارة فوق العجلة --- */}
                                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                                      <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4"><Sparkles className="text-amber-500" /> نص الشارة فوق العجلة</h3>
                                      <input 
                                          type="text" 
                                          value={tempHeaderBadgeText || ''}
                                          onChange={(e) => setTempHeaderBadgeText(e.target.value)}
                                          placeholder="جوائز حقيقية ومضمونة"
                                          className="w-full p-3 border-2 border-slate-200 rounded-lg text-sm focus:border-amber-500 outline-none"
                                          dir="rtl"
                                      />
                                      <p className="text-xs text-slate-500 mt-1">النص الذي يظهر بجانب أيقونة المكافأة فوق العجلة</p>
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
                                              className={`hidden p-4 rounded-xl border-2 transition-all ${
                                                  tempWheelStyle === 'modern'
                                                      ? 'border-purple-500 bg-purple-50'
                                                      : 'border-slate-200 hover:border-purple-300'
                                              }`}
                                              aria-hidden
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
                                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => onBackgroundUpload(e, 'desktop')} />
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
                                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => onBackgroundUpload(e, 'mobile')} />
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
                                              <button onClick={() => onPlayPreview(tempWinSound)} className="flex-1 p-3 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600 flex items-center justify-center gap-2 transition-colors">
                                                  <Play size={16} /> معاينة الصوت الحالي
                                              </button>
                                              <label className="flex-1 cursor-pointer bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold py-3 px-4 rounded-lg text-center border border-orange-200 transition-colors flex items-center justify-center gap-2">
                                                  <Upload size={16} /> رفع ملف جديد
                                                  <input type="file" accept="audio/*" className="hidden" onChange={(e) => onAudioUpload(e, 'win')} />
                                              </label>
                                          </div>
                                      </div>

                                      {/* صوت الخسارة */}
                                      <div className="space-y-3">
                                          <label className="text-sm font-bold text-slate-600">صوت الخسارة</label>
                                          <div className="flex gap-2 items-center">
                                              <button onClick={() => onPlayPreview(tempLoseSound)} className="flex-1 p-3 bg-slate-100 rounded-lg hover:bg-slate-200 text-slate-600 flex items-center justify-center gap-2 transition-colors">
                                                  <Play size={16} /> معاينة الصوت الحالي
                                              </button>
                                              <label className="flex-1 cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-3 px-4 rounded-lg text-center border border-slate-200 transition-colors flex items-center justify-center gap-2">
                                                  <Upload size={16} /> رفع ملف جديد
                                                  <input type="file" accept="audio/*" className="hidden" onChange={(e) => onAudioUpload(e, 'lose')} />
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
                                      {/* حقل سناب شات */}
                                      <div className="flex items-center gap-2">
                                          <Ghost className="text-yellow-400" />
                                          <input type="text" placeholder="رابط سناب شات" className="flex-1 p-2 border rounded-lg text-sm" value={tempSocialLinks.snapchat} onChange={e => setTempSocialLinks({...tempSocialLinks, snapchat: e.target.value})} />
                                      </div>
                                      {/* حقل تيك توك */}
                                      <div className="flex items-center gap-2">
                                          <Music className="text-black" />
                                          <input
                                              type="text"
                                              placeholder="رابط تيك توك"
                                              className="flex-1 p-2 border rounded-lg text-sm"
                                              value={tempSocialLinks.tiktok || ''}
                                              onChange={e => setTempSocialLinks({ ...tempSocialLinks, tiktok: e.target.value })}
                                          />
                                      </div>
                                      <div className="flex items-center gap-2">
                                          <MessageCircle className="text-green-500" />
                                          <input type="text" placeholder="رقم واتساب (مع كود الدولة)" className="flex-1 p-2 border rounded-lg text-sm" value={tempSocialLinks.whatsapp} onChange={e => setTempSocialLinks({...tempSocialLinks, whatsapp: e.target.value})} />
                                      </div>
                                      <div className="flex items-center gap-2 md:col-span-2">
                                          <Globe className="text-slate-500" />
                                          <input type="text" placeholder="رابط الموقع الإلكتروني" className="flex-1 p-2 border rounded-lg text-sm" value={tempSocialLinks.website} onChange={e => setTempSocialLinks({...tempSocialLinks, website: e.target.value})} />
                                      </div>
                                      <div className="flex items-center gap-2">
                                          <Mail className="text-red-500" />
                                          <input type="email" placeholder="البريد الإلكتروني (خدمة العملاء في الفوتر)" className="flex-1 p-2 border rounded-lg text-sm" value={tempSocialLinks.email || ''} onChange={e => setTempSocialLinks({...tempSocialLinks, email: e.target.value})} />
                                      </div>
                                      <div className="flex items-center gap-2">
                                          <Phone className="text-blue-500" />
                                          <input type="text" placeholder="رقم الهاتف (خدمة العملاء في الفوتر)" className="flex-1 p-2 border rounded-lg text-sm" value={tempSocialLinks.phone || ''} onChange={e => setTempSocialLinks({...tempSocialLinks, phone: e.target.value})} />
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
                                          placeholder="أدخل الرقم الضريبي"
                                          className="w-full p-3 border-2 border-slate-200 rounded-lg text-sm font-mono focus:border-cyan-500 outline-none"
                                          dir="ltr"
                                      />
                                  </div>

                                  <div className="mb-6">
                                      <label className="block text-sm font-bold text-slate-700 mb-2">رقم منصة الأعمال</label>
                                      <input 
                                          type="text" 
                                          value={tempFooterSettings.businessPlatformId || ''}
                                          onChange={(e) => setTempFooterSettings({...tempFooterSettings, businessPlatformId: e.target.value})}
                                          placeholder="أدخل الرقم لعرض لوجو منصة الأعمال وجملة موثق في منصة الأعمال"
                                          className="w-full p-3 border-2 border-slate-200 rounded-lg text-sm font-mono focus:border-cyan-500 outline-none"
                                          dir="ltr"
                                      />
                                      <p className="text-xs text-slate-500 mt-1">إذا تركت الحقل فارغاً لن يظهر لوجو منصة الأعمال ولا جملة &quot;موثق في منصة الأعمال&quot; في الفوتر</p>
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
                                  <div className="absolute inset-0 z-20 bg-[#ffffff]/50 backdrop-blur-sm flex items-center justify-center p-4">
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
                                              <button onClick={onSaveCoupons} className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">حفظ القائمة</button>
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
                                              <div className="flex flex-col gap-1 relative"><label className="text-xs font-bold text-slate-400 flex items-center gap-1"><Scale size={12} /> الوزن</label><input type="number" min="0" step="0.1" value={seg.weight ?? ''} onChange={(e) => handleSegmentChange(index, 'weight', parseFloat(e.target.value) || 0)} className="border border-slate-300 rounded px-2 py-1.5 focus:border-blue-500 outline-none w-full font-mono text-center" placeholder="مثال: 10 أو 2.5" /></div>
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

  );
}
import React from 'react';
import { XCircle, Gift, User, Mail, Phone, Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function RegistrationModal({
  open,
  onClose,
  storeLogo,
  userData,
  onUserDataChange,
  isSubmitting,
  phoneError,
  onSubmit,
  onPhoneChange
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-white text-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl  relative overflow-hidden transform animate-bounce-in">
        <button onClick={onClose} className="absolute top-2 left-2 text-slate-400 hover:text-red-500 transition-colors p-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M13 1L1 13M1 1L13 13" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        {/* <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500"></div> */}
        <div className="text-center mb-8">
          {storeLogo ? (
            <img src={storeLogo} alt="Logo" className="w-24 h-24 mx-auto mb-4 object-contain animate-pulse drop-shadow-lg" />
          ) : (
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg animate-pulse">
              <Gift size={40} className="text-yellow-600" />
            </div>
          )}
          <h2 className="text-3xl font-black text-slate-800 mb-2">خطوة واحدة للربح! <span>🎁</span></h2>
          <p className="text-slate-500">سجل بياناتك لتدور العجلة فوراً</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="الاسم بالكامل"
              required
              className="w-full pr-10 pl-4 py-3 rounded-xl border-2 border-slate-200 focus:border-yellow-400 focus:ring-0 outline-none transition-all bg-slate-50"
              value={userData.name}
              onChange={(e) => onUserDataChange({ ...userData, name: e.target.value })}
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
              onChange={(e) => onUserDataChange({ ...userData, email: e.target.value })}
              disabled={isSubmitting}
            />
          </div>
          <div className="relative">
            <Phone className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400" size={20} />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium z-10">+966</div>
            <input
              type="tel"
              placeholder="5xxxxxxxx"
              required
              className={`w-full pr-10 pl-16 py-3 rounded-xl border-2 focus:ring-0 outline-none transition-all bg-slate-50 text-left ${phoneError ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-yellow-400'}`}
              value={userData.phone.replace('+966', '')}
              onChange={(e) => onPhoneChange(e.target.value)}
              onFocus={(e) => {
                if (!userData.phone || userData.phone === '+966') {
                  e.target.value = '';
                }
              }}
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
            className={`w-full font-bold py-4 rounded-xl shadow-lg transform transition-all flex items-center justify-center gap-2 text-lg mt-4 ${isSubmitting ? 'bg-slate-400 cursor-wait' : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 active:scale-95 text-white'}`}
          >
            {isSubmitting ? (
              <><Loader2 size={20} className="animate-spin" /> جاري الحفظ... </>
            ) : (
              <><Lock size={20} /> سجل والعب الآن </>
            )}
          </button>
          <p className="text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1">
            <CheckCircle size={12} className="text-green-500" /> بياناتك آمنة ولن يتم مشاركتها.
          </p>
        </form>
      </div>
    </div>
  );
}

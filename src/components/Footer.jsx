import React from 'react';
import { Gift, MessageCircle, Mail, Phone } from 'lucide-react';

// --- مكون الفوتر المطابق للصورة (Pixel Perfect) ---
const Footer = ({ logo, socialLinks, footerSettings }) => {
  const footerDescription = footerSettings?.description || '';
  const footerLinks = footerSettings?.links || [];
  const taxId = footerSettings?.taxId || '';
  const businessPlatformId = (footerSettings?.businessPlatformId || '').trim();
  
  return (
    <footer className="w-full bg-white text-slate-800 border-t border-slate-100 mt-auto relative z-20 font-sans" dir="rtl">
        {/* Top Section */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
                
                {/* Col 1: Logo & Description (Right - 4 cols) */}
                <div className="lg:col-span-4 space-y-4 text-right">
                     <div className="flex justify-center">
                         {logo ? (
                             <img src={logo} alt="Logo" className="h-20 object-contain mb-2" />
                         ) : (
                             <div className="flex flex-col items-center mb-2">
                                 <Gift className="text-cyan-500 w-12 h-12 mb-1" />
                                 <h2 className="text-xl font-bold text-cyan-500">خيمة الألعاب</h2>
                             </div>
                         )}
                     </div>
                    <p className="text-black text-center text-[18px] font-medium leading-normal max-w-sm">
                        {footerDescription}
                    </p>
                </div>

                {/* روابط تهمك - عمودين حتى على الموبايل لتقليل الارتفاع */}
                {footerLinks.length > 0 && (
                  <div className="lg:col-span-6 flex flex-col items-center lg:items-start">
                    <h3 className="font-bold text-[#2BD0EE] mb-5 text-[20px] leading-normal text-center lg:text-right">روابط تهمك</h3>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full">
                      {/* أول 5 روابط في العمود الأيمن */}
                      <ul className="space-y-2.5 text-sm text-slate-800 font-medium text-right">
                        {footerLinks.slice(0, 5).map((link, index) => (
                          <li key={index}>
                            <a
                              href={link.url || '#'}
                              target={link.url?.startsWith('http') ? '_blank' : '_self'}
                              rel="noopener noreferrer"
                              className="block text-black text-[18px] font-medium leading-normal hover:text-cyan-600 transition-colors"
                            >
                              {link.label || `رابط ${index + 1}`}
                            </a>
                          </li>
                        ))}
                      </ul>
                      {/* باقي الروابط في العمود الأيسر */}
                      <ul className="space-y-2.5 text-sm text-slate-800 font-medium text-right">
                        {footerLinks.length > 5 &&
                          footerLinks.slice(5).map((link, index) => (
                            <li key={index + 5}>
                              <a
                                href={link.url || '#'}
                                target={link.url?.startsWith('http') ? '_blank' : '_self'}
                                rel="noopener noreferrer"
                                className="block text-black text-[18px] font-medium leading-normal hover:text-cyan-600 transition-colors"
                              >
                                {link.label || `رابط ${index + 6}`}
                              </a>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Col 4: Contact & Tax (Left - 2 cols) */}
                <div className="lg:col-span-2 flex flex-col items-start lg:items-start gap-8">
                    {/* خدمة العملاء - تظهر فقط إذا وُجدت وسيلة تواصل واحدة على الأقل */}
                    {(socialLinks?.whatsapp?.trim() || socialLinks?.phone?.trim() || socialLinks?.email?.trim()) && (
                    <div className="w-full text-center lg:text-right">
                       <h3 className="text-[#2BD0EE] text-center lg:text-right text-[20px] font-bold leading-normal mb-5">خدمة العملاء</h3>
                        <div className="flex gap-5 items-center justify-center lg:justify-start">
                             {socialLinks?.whatsapp?.trim() && (
                                 <a href={`https://wa.me/${socialLinks.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="text-slate-900 hover:text-green-500 transition-all"><MessageCircle size={22} strokeWidth={2} /></a>
                             )}
                             {socialLinks?.email?.trim() && (
                                 <a href={`mailto:${socialLinks.email.trim()}`} className="text-slate-900 hover:text-red-500 transition-all"><Mail size={22} strokeWidth={2} /></a>
                             )}
                             {socialLinks?.phone?.trim() && (
                                 <a href={`tel:${socialLinks.phone.trim()}`} className="text-slate-900 hover:text-blue-500 transition-all"><Phone size={22} strokeWidth={2} /></a>
                             )}  
                        </div>
                    </div>
                    )}

                    {/* Tax ID - يظهر فقط إذا تم إدخال الرقم الضريبي */}
                    {taxId.trim() && (
                    <div className="w-full text-right lg:text-right mt-2">
                        <h3 className="text-black text-right text-[18px] font-medium leading-normal mb-1">الرقم الضريبي</h3>
                        <p className="text-black text-right text-[18px] font-medium leading-normal mb-2">{taxId}</p>
                        <div className="w-10 h-10 opacity-80 hidden">
                           {/* Placeholder for the small logo under tax ID - مخفي حالياً */}
                           {logo ? <img src={logo} className="w-full h-full object-contain grayscale" alt="Tax Logo" /> : <Gift size={24} className="text-slate-400"/>}
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-100 py-6 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium text-slate-500">
                {/* منصة الأعمال - يظهر فقط إذا تم إدخال الرقم من لوحة التحكم */}
                {businessPlatformId && (
                <a href={`https://eauthenticate.saudibusiness.gov.sa/certificate-details/${encodeURIComponent(businessPlatformId.trim())}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end hover:opacity-90 transition-opacity order-1 md:order-1">
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
                  <span className="text-black text-center text-[16px] md:text-[20px] font-medium leading-normal">موثق في منصة الأعمال</span>
                </a>
                )}

                {/* وسائل الدفع - من ملف SVG */}
                <div className="flex items-center justify-center order-2 md:order-2 w-full md:w-auto">
                    <img src="/payment-methods.svg" alt="وسائل الدفع" className="h-8 md:h-[1.7rem] w-auto object-contain" />
                </div>
            {/* Copyright */}
                <p className="text-black text-center text-[14px] md:text-[20px] font-medium leading-normal w-full md:w-auto order-3 md:order-3">
                    الحقوق محفوظة | 2026 خيمة الألعاب khyma toys
                </p>


            </div>
        </div>
    </footer>
  );
};

export default Footer;


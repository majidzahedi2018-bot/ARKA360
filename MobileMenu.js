// src/components/shop/MobileMenu.js
// کل محتوای این فایل را با کد زیر جایگزین کنید تا ظاهر بسیار حرفه‌ای و شبیه اپلیکیشن‌های بومی پیدا کند:

function MobileMenu({ isOpen, onClose, user, activeTab, changeTab, openOverlay, hasPermission, savedInvoices }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[150] flex animate-fadeIn md:hidden" dir="rtl">
            {/* لایه تاریک پس‌زمینه */}
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs" onClick={onClose}></div>
            
            {/* پنل کشویی از سمت راست */}
            <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 mr-auto">
                
                {/* هدر منوی موبایل */}
                <div className="p-5 bg-gradient-to-br from-indigo-600 to-purple-700 text-white shrink-0">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-black text-sm">منوی مدیریت فروشگاه</h3>
                        <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-95 transition">
                            <Icons.X size={18} />
                        </button>
                    </div>
                    <div className="bg-white/10 px-3 py-2 rounded-2xl">
                        <p className="text-white font-bold text-xs truncate">{user?.name || 'فروشگاه'}</p>
                        <p className="text-indigo-200 text-[10px] mt-0.5">{user?.shop_type || 'صنف عمومی'}</p>
                    </div>
                </div>
                
                {/* لیست گزینه‌های منو با اسکرول */}
                <div className="flex-1 overflow-y-auto p-3 space-y-1.5 arka-scrollbar text-xs">
                    {!user?.parent_shop_id && (
                        <button 
                            onClick={() => { changeTab('staff'); onClose(); }}
                            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 text-slate-700 font-bold transition"
                        >
                            <span className="text-base">👥</span>
                            <span>مدیریت همکاران و صندوق‌داران</span>
                        </button>
                    )}

                    <button 
                        onClick={() => { openOverlay('saved_invoices'); onClose(); }}
                        className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-50 text-emerald-700 font-bold transition"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-base">📄</span>
                            <span>فاکتورهای اسکن شده</span>
                        </div>
                        <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                            {savedInvoices.filter(i => i.status === 'pending').length}
                        </span>
                    </button>

                    {!user?.parent_shop_id && (
                        <button 
                            onClick={() => { changeTab('reports'); onClose(); }}
                            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 text-slate-700 font-bold transition"
                        >
                            <span className="text-base">📈</span>
                            <span>گزارشات و نمودارها</span>
                        </button>
                    )}

                    <button 
                        onClick={() => { openOverlay('purchase_list'); onClose(); }}
                        className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 text-slate-700 font-bold transition"
                    >
                        <span className="text-base">📋</span>
                        <span>لیست سفارش خرید انبار</span>
                    </button>

                    {!user?.parent_shop_id && (
                        <button 
                            onClick={() => { openOverlay('suppliers_list'); onClose(); }}
                            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 text-slate-700 font-bold transition"
                        >
                            <span className="text-base">🚚</span>
                            <span>دفتر تفصیلی تأمین‌کنندگان</span>
                        </button>
                    )}

                    {!user?.parent_shop_id && (
                        <button 
                            onClick={() => { openOverlay('cheques_list'); onClose(); }}
                            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 text-slate-700 font-bold transition"
                        >
                            <span className="text-base">🧾</span>
                            <span>مدیریت چک‌های صیادی</span>
                        </button>
                    )}

                    <button 
                        onClick={() => { openOverlay('warehouse_dash'); onClose(); }}
                        className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 text-slate-700 font-bold transition"
                    >
                        <span className="text-base">📦</span>
                        <span>مدیریت انبارداری چندگانه</span>
                    </button>

                    {!user?.parent_shop_id && (
                        <button 
                            onClick={() => { openOverlay('tax_config'); onClose(); }}
                            className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 text-slate-700 font-bold transition"
                        >
                            <span className="text-base">⚖️</span>
                            <span>تنظیمات سامانه مؤدیان دارایی</span>
                        </button>
                    )}
                    <button 
                        onClick={() => {
                            onClose();
                            if (typeof window.openRemoteModal === 'function') {
                                window.openRemoteModal();
                            }
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-2xl bg-purple-50 text-purple-700 font-bold transition"
                    >
                        <span className="text-base">💻</span>
                        <span>کنترل از راه دور (AnyDesk)</span>
                    </button>
                </div>

                <div className="p-3 border-t border-slate-100 bg-slate-50 shrink-0 text-center">
                    <p className="text-[10px] text-slate-400 font-bold">نسخه {window.APP_CONFIG?.VERSION || "1.0.68"}</p>
                </div>
            </div>
        </div>
    );
}

window.MobileMenu = MobileMenu;
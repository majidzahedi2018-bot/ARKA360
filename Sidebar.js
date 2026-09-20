// src/components/shop/Sidebar.js

function Sidebar({ activeTab, setActiveTab, changeTab, parkedInvoicesCount = 4, lowStockCount = 0, onLogout, user, openOverlay }) {

 const [parkedCount, setParkedCount] = React.useState(0);

    React.useEffect(() => {
        const updateParkedCount = () => {
            try {
                const parked = JSON.parse(localStorage.getItem('arka_parked_invoices') || '[]');
                setParkedCount(parked.length);
            } catch(e) { setParkedCount(0); }
        };
        updateParkedCount();
        window.addEventListener('parked-invoices-updated', updateParkedCount);
        return () => window.removeEventListener('parked-invoices-updated', updateParkedCount);
    }, []);

    const handleTabSelect = (tabId) => {
        if (changeTab) changeTab(tabId);
        else if (setActiveTab) setActiveTab(tabId);
    };

    // استیت‌های باز و بسته بودن منوهای آبشاری (آکاردئون)
    const [isPosOpen, setIsPosOpen] = React.useState(true);
    const [isInventoryOpen, setIsInventoryOpen] = React.useState(false);
    const [isTreasuryOpen, setIsTreasuryOpen] = React.useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

      const [isRemoteModalOpen, setIsRemoteModalOpen] = React.useState(false);
    const [remoteCode, setRemoteCode] = React.useState('');
    const [inputCode, setInputCode] = React.useState('');

    // بررسی اینکه آیا کاربر مدیر اصلی است یا همکار
    const isOwner = !user?.parent_shop_id;

    // زیرمجموعه‌های صندوق فروش (POS)
    const posSubItems = [
        { id: 'pos', title: 'ثبت فروش (صندوق)', icon: '🛒' },
        { id: 'sales', title: 'فاکتورهای فروش', icon: '📄' },
        { id: 'proforma', title: 'پیش‌فاکتور', icon: '📜' },
        { id: 'parked', title: 'فاکتورهای پارک‌شده', icon: '📑', badge: parkedCount },
        { id: 'returns', title: 'مرجوعی فروش', icon: '🔄' },
    ];

    // زیرمجموعه‌های انبار و کالا
    const inventorySubItems = [
        { id: 'inventory', title: 'کالاها و انبار', icon: '📦' },
        { id: 'purchase_list', title: 'سفارش خرید (کسری)', icon: '📋', overlay: 'purchase_list' },
        { id: 'warehouse_dash', title: 'انبارداری چندگانه', icon: '🏢', overlay: 'warehouse_dash', badge: lowStockCount },
        { id: 'suppliers_list', title: 'تأمین‌کنندگان', icon: '🚚', overlay: 'suppliers_list' },
    ];

    // زیرمجموعه‌های خزانه‌داری (چک‌ها و مالی)
    const treasurySubItems = [
        { id: 'cheques_list', title: 'چک‌های صیادی', icon: '🧾', overlay: 'cheques_list' },
        { id: 'expenses', title: 'هزینه‌های جاری', icon: '💸' },
        { id: 'customers', title: 'مشتریان و بدهکاران', icon: '👥' },
    ];

    // زیرمجموعه‌های تنظیمات و امکانات پیشرفته (مختص مدیر)
    const settingsSubItems = [
        { id: 'tax_config', title: 'سامانه مؤدیان دارایی', icon: '⚖️', overlay: 'tax_config' },
        { id: 'pos_config', title: 'کارتخوان بانکی (PC-POS)', icon: '🔌', overlay: 'pos_config' },
        { id: 'sms_config', title: 'درگاه پیامک و باشگاه', icon: '💬', overlay: 'sms_config' },
    ];

    const isPosActive = posSubItems.some(sub => sub.id === activeTab);
    const isInventoryActive = inventorySubItems.some(sub => sub.id === activeTab);
    const isTreasuryActive = treasurySubItems.some(sub => sub.id === activeTab);

    const [isSyncActive, setIsSyncActive] = React.useState(() => {
        return localStorage.getItem('arka_realtime_sync') === 'true';
    });

    const toggleRealtimeSync = () => {
        const nextState = !isSyncActive;
        setIsSyncActive(nextState);
        localStorage.setItem('arka_realtime_sync', nextState ? 'true' : 'false');
        window.dispatchEvent(new CustomEvent('arka-sync-toggle', { detail: { active: nextState } }));
        window.AppHelpers?.showToast?.(
            nextState ? "⚡ همگام‌سازی لحظه‌ای فعال شد" : "⏸️ همگام‌سازی لحظه‌ای متوقف شد",
            nextState ? "success" : "info"
        );
    };

    return (
        <aside className="hidden md:flex w-60 bg-slate-900 border-l border-slate-800 flex-col justify-between shrink-0 select-none h-screen text-slate-300 z-30 sticky top-0 font-sans shadow-xl" dir="rtl">
            <div>
                {/* لوگو و برند اصلی آرکا ۳۶۰ */}
                <div className="p-4 flex items-center justify-between border-b border-slate-800/80 mb-2 bg-slate-950/40">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-600/30">
                            A
                        </div>
                        <div>
                            <h2 className="font-black text-xs text-white tracking-tight">ARKA 360</h2>
                            <span className="text-[9px] text-indigo-400 font-bold block">سیستم مدیریت هوشمند</span>
                        </div>
                    </div>
                </div>

                {/* منوی اصلی با اسکرول نرم */}
                <div className="px-2.5 space-y-1.5 overflow-y-auto max-h-[calc(100vh-130px)] arka-scrollbar">

                    {/* ۱. بخش داشبورد اصلی (خانه) */}
                    <button
                        onClick={() => handleTabSelect('home')}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all ${
                            activeTab === 'home'
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-black'
                                : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                        }`}
                    >
                        <span className="text-sm">🏠</span>
                        <span className="truncate">داشبورد مدیریت</span>
                    </button>

                    {/* ۲. آکاردئون صندوق فروش (POS) */}
                    <div className="rounded-xl overflow-hidden bg-slate-900/50 border border-slate-800/60">
                        <button
                            onClick={() => setIsPosOpen(!isPosOpen)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 text-[11px] font-bold transition-all ${
                                isPosActive ? 'text-indigo-400 font-black' : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="text-sm">🛒</span>
                                <span className="truncate">صندوق فروش (POS)</span>
                            </div>
                            <span className={`text-[9px] text-slate-400 transition-transform duration-200 ${isPosOpen ? 'rotate-180' : ''}`}>
                                ▼
                            </span>
                        </button>

                        {isPosOpen && (
                            <div className="mr-2.5 pr-2 my-1 border-r-2 border-indigo-500/40 space-y-1">
                                {posSubItems.map((sub) => {
                                    const isSubActive = activeTab === sub.id;
                                    return (
                                        <button
                                            key={sub.id}
                                            onClick={() => handleTabSelect(sub.id)}
                                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                                isSubActive
                                                    ? 'bg-indigo-600 text-white shadow-xs font-black'
                                                    : 'hover:bg-slate-800/70 text-slate-400 hover:text-slate-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs">{sub.icon}</span>
                                                <span className="truncate">{sub.title}</span>
                                            </div>
                                            {sub.badge > 0 && (
                                                <span className="w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[8px] font-black flex items-center justify-center animate-pulse">
                                                    {sub.badge}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* ۳. آکاردئون انبارداری و کالاها */}
                    <div className="rounded-xl overflow-hidden bg-slate-900/50 border border-slate-800/60">
                        <button
                            onClick={() => setIsInventoryOpen(!isInventoryOpen)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 text-[11px] font-bold transition-all ${
                                isInventoryActive ? 'text-indigo-400 font-black' : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="text-sm">📦</span>
                                <span className="truncate">انبارداری و کالاها</span>
                            </div>
                            <span className={`text-[9px] text-slate-400 transition-transform duration-200 ${isInventoryOpen ? 'rotate-180' : ''}`}>
                                ▼
                            </span>
                        </button>

                        {isInventoryOpen && (
                            <div className="mr-2.5 pr-2 my-1 border-r-2 border-emerald-500/40 space-y-1">
                                {inventorySubItems.map((sub) => {
                                    const isSubActive = activeTab === sub.id;
                                    return (
                                        <button
                                            key={sub.id}
                                            onClick={() => {
                                                if (sub.overlay && typeof openOverlay === 'function') {
                                                    openOverlay(sub.overlay);
                                                } else {
                                                    handleTabSelect(sub.id);
                                                }
                                            }}
                                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                                isSubActive
                                                    ? 'bg-emerald-600 text-white shadow-xs font-black'
                                                    : 'hover:bg-slate-800/70 text-slate-400 hover:text-slate-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs">{sub.icon}</span>
                                                <span className="truncate">{sub.title}</span>
                                            </div>
                                            {sub.badge > 0 && (
                                                <span className="w-3.5 h-3.5 bg-amber-500 text-white rounded-full text-[8px] font-black flex items-center justify-center">
                                                    {sub.badge}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* ۴. آکاردئون خزانه‌داری و مالی */}
                    <div className="rounded-xl overflow-hidden bg-slate-900/50 border border-slate-800/60">
                        <button
                            onClick={() => setIsTreasuryOpen(!isTreasuryOpen)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 text-[11px] font-bold transition-all ${
                                isTreasuryActive ? 'text-indigo-400 font-black' : 'text-slate-300 hover:text-white'
                            }`}
                        >
                            <div className="flex items-center gap-2.5">
                                <span className="text-sm">💰</span>
                                <span className="truncate">خزانه‌داری و مالی</span>
                            </div>
                            <span className={`text-[9px] text-slate-400 transition-transform duration-200 ${isTreasuryOpen ? 'rotate-180' : ''}`}>
                                ▼
                            </span>
                        </button>

                        {isTreasuryOpen && (
                            <div className="mr-2.5 pr-2 my-1 border-r-2 border-amber-500/40 space-y-1">
                                {treasurySubItems.map((sub) => {
                                    const isSubActive = activeTab === sub.id;
                                    return (
                                        <button
                                            key={sub.id}
                                            onClick={() => {
                                                if (sub.overlay && typeof openOverlay === 'function') {
                                                    openOverlay(sub.overlay);
                                                } else {
                                                    handleTabSelect(sub.id);
                                                }
                                            }}
                                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                                isSubActive
                                                    ? 'bg-amber-600 text-white shadow-xs font-black'
                                                    : 'hover:bg-slate-800/70 text-slate-400 hover:text-slate-200'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs">{sub.icon}</span>
                                                <span className="truncate">{sub.title}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* ۵. بخش حسابداری پیشرفته (فقط مدیر اصلی) */}
                    {isOwner && (
                        <button
                            onClick={() => handleTabSelect('accounting')}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all ${
                                activeTab === 'accounting'
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-black'
                                    : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                            }`}
                        >
                            <span className="text-sm">⚖️</span>
                            <span className="truncate">حسابداری و ترازنامه</span>
                        </button>
                    )}

                    {/* ۶. گزارشات کلان */}
                    {isOwner && (
                        <button
                            onClick={() => handleTabSelect('reports')}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all ${
                                activeTab === 'reports'
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-black'
                                    : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                            }`}
                        >
                            <span className="text-sm">📊</span>
                            <span className="truncate">گزارشات و نمودارها</span>
                        </button>
                    )}

                    {/* ۷. مدیریت همکاران */}
                    {isOwner && (
                        <button
                            onClick={() => handleTabSelect('staff')}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all ${
                                activeTab === 'staff'
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-black'
                                    : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                            }`}
                        >
                            <span className="text-sm">👥</span>
                            <span className="truncate">مدیریت همکاران</span>
                        </button>
                    )}

                    <button
                        onClick={async () => {
                            setIsRemoteModalOpen(true);
                            try {
                                const shopId = localStorage.getItem('shop_user_id');
                                const res = await window.httpClient.post('remote_sync.php', { shop_id: shopId, action: 'create_session' });
                                if (res?.status === 'success') {
                                    setRemoteCode(res.session_code);
                                }
                            } catch(e) {
                                console.error('REMOTE SESSION ERROR:', e);
                                window.AppHelpers?.showToast?.("خطا در ایجاد کد همگام‌سازی", "error");
                            }
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all hover:bg-slate-800/80 text-purple-400 hover:text-purple-300 bg-purple-500/10 border border-purple-500/30"
                    >
                        <span className="text-sm">🔗</span>
                        <span className="truncate">اتصال همزمان دو دستگاه</span>
                    </button>

                    {/* ۸. آکاردئون تنظیمات و امکانات تخصصی */}
                    {isOwner && (
                        <div className="rounded-xl overflow-hidden bg-slate-900/50 border border-slate-800/60">
                            <button
                                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                className="w-full flex items-center justify-between px-3 py-2.5 text-[11px] font-bold text-slate-300 hover:text-white transition-all"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="text-sm">⚙️</span>
                                    <span className="truncate">تنظیمات و درگاه‌ها</span>
                                </div>
                                <span className={`text-[9px] text-slate-400 transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : ''}`}>
                                    ▼
                                </span>
                            </button>

                            {isSettingsOpen && (
                                <div className="mr-2.5 pr-2 my-1 border-r-2 border-purple-500/40 space-y-1">
                                    {settingsSubItems.map((sub) => (
                                        <button
                                            key={sub.id}
                                            onClick={() => {
                                                if (sub.overlay && typeof openOverlay === 'function') {
                                                    openOverlay(sub.overlay);
                                                }
                                            }}
                                            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10px] font-bold hover:bg-slate-800/70 text-slate-400 hover:text-slate-200 transition-all text-right"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs">{sub.icon}</span>
                                                <span className="truncate">{sub.title}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>

            {/* فوتر پایین سایدبار: دکمه همگام‌سازی + اطلاعات نسخه + خروج */}
            <div className="p-3 border-t border-slate-800/80 bg-slate-950/20 space-y-2">
                
                {/* ⚡ دکمه همگام‌سازی آنی با ظاهر حرفه‌ای SaaS */}
                <button
                    onClick={toggleRealtimeSync}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[11px] font-bold transition-all border shadow-sm ${
                        isSyncActive 
                            ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/50 text-emerald-300' 
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                    }`}
                >
                    <div className="flex items-center gap-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${isSyncActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`}></span>
                        <span className="font-black">همگام‌سازی دو دستگاه</span>
                    </div>
                    <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded-lg ${isSyncActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>
                        {isSyncActive ? 'فعال (LIVE)' : 'غیرفعال'}
                    </span>
                </button>

                <div className="px-2 py-1 text-[9px] text-slate-500 font-mono text-center">
                    نسخه {window.APP_CONFIG?.VERSION || "1.0.16"}
                </div>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                >
                    <span className="text-sm">🚪</span>
                    <span>خروج از حساب</span>
                </button>
            </div>

            {isRemoteModalOpen && (
                <div className="fixed inset-0 z-[250] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" dir="rtl">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 text-white space-y-5 shadow-2xl relative">
                        <button 
                            onClick={() => setIsRemoteModalOpen(false)}
                            className="absolute top-4 left-4 text-slate-400 hover:text-white font-bold"
                        >✕</button>

                        <div className="text-center space-y-1">
                            <span className="text-3xl block mb-2">💻📱</span>
                            <h3 className="font-black text-sm text-indigo-400">اتصال ریموت بین دو دستگاه</h3>
                            <p className="text-[10px] text-slate-400">کنترل همزمان و آینه‌ای صندوق فروش</p>
                        </div>

                        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center space-y-2">
                            <span className="text-[10px] text-slate-400 block">کد این دستگاه (میزبان):</span>
                            <div className="text-2xl font-black font-mono tracking-widest text-emerald-400">
                                {remoteCode || 'در حال تولید...'}
                            </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-800">
                            <span className="text-[10px] text-slate-400 block">وارد کردن کد دستگاه مقابل (مهمان):</span>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    maxLength="6"
                                    placeholder="کد ۶ رقمی..."
                                    value={inputCode}
                                    onChange={e => setInputCode(e.target.value)}
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-center font-mono font-bold text-xs text-white outline-none focus:border-indigo-500"
                                />
                                <button 
                                    onClick={async () => {
                                        if (inputCode.length < 6) {
                                            window.AppHelpers?.showToast?.("کد باید ۶ رقمی باشد", "error");
                                            return;
                                        }
                                        try {
                                            const shopId = localStorage.getItem('shop_user_id');
                                            const res = await window.httpClient.post('remote_sync.php', { shop_id: shopId, action: 'connect_session', session_code: inputCode });
                                            if (res?.status === 'success') {
                                                localStorage.setItem('arka_remote_session_code', inputCode);
                                                localStorage.setItem('arka_realtime_sync', 'true');
                                                window.dispatchEvent(new CustomEvent('arka-sync-toggle', { detail: { active: true } }));
                                                
                                                window.AppHelpers?.showToast?.("✓ اتصال ریموت با موفقیت بین گوشی و کامپیوتر برقرار شد", "success");
                                                setIsRemoteModalOpen(false);
                                            } else {
                                                window.AppHelpers?.showToast?.(res.message || "کد نامعتبر است", "error");
                                            }
                                        } catch(e) {
                                            window.AppHelpers?.showToast?.("خطا در اتصال", "error");
                                        }
                                    }}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-black transition"
                                >
                                    اتصال
                                </button>
                            </div>
                        </div>

                        <button 
                            onClick={() => setIsRemoteModalOpen(false)}
                            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-xs font-bold transition"
                        >
                            بستن پنل
                        </button>
                    </div>
                </div>
            )}
        </aside>
    );
}

window.Sidebar = Sidebar;
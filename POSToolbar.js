// src/components/shop/pos/POSToolbar.js — فاز ۸: میانبرها + کنترل نمایش و تم
// ✨ موبایل: فقط ۳ میانبر اصلی + دکمه «⋯» برای بقیه (پنجره پایین‌کش) — تبلت/دسکتاپ: همه میانبرها

const POS_TOOLBAR_SHORTCUTS = [
    { key: 'F8', label: 'چاپ فاکتور', color: 'text-blue-700 bg-blue-50/80 border-blue-200 hover:bg-blue-100' },
    { key: 'F7', label: 'مرجوعی', color: 'text-emerald-700 bg-emerald-50/80 border-emerald-200 hover:bg-emerald-100' },
    { key: 'F2', label: 'فاکتورکال', color: 'text-purple-700 bg-purple-50/80 border-purple-200 hover:bg-purple-100' },
    { key: 'F4', label: 'انتخاب مشتری', color: 'text-emerald-700 bg-emerald-50/80 border-emerald-200 hover:bg-emerald-100' },
    { key: 'F6', label: 'تخفیف', color: 'text-rose-700 bg-rose-50/80 border-rose-200 hover:bg-rose-100' },
    { key: 'F3', label: 'راهنما', color: 'text-amber-700 bg-amber-50/80 border-amber-200 hover:bg-amber-100' },
    { key: 'F9', label: 'جستجوی کالا', color: 'text-blue-700 bg-blue-50/80 border-blue-200 hover:bg-blue-100' }
];

function POSToolbar({ user, onClose, theme = 'light', onToggleTheme, onOpenCustomerDisplay }) {
    const [showAllShortcuts, setShowAllShortcuts] = React.useState(false);

    const shortcutChip = (shortcut) => (
        <button key={shortcut.key} type="button"
            className={`px-3 py-1.5 rounded-xl border font-black text-[11px] flex items-center gap-1.5 transition active:scale-95 shadow-sm shrink-0 ${shortcut.color}`}>
            <span className="bg-white px-1.5 py-0.5 rounded text-[9px] font-mono border border-current/20 shadow-sm">{shortcut.key}</span>
            <span className="whitespace-nowrap">{shortcut.label}</span>
        </button>
    );

    return (
        <div className="flex flex-col shrink-0 select-none bg-white border-b border-slate-200" dir="rtl">
            <div className="px-2 sm:px-4 py-2 flex items-center justify-between bg-slate-50/90 border-b border-slate-200 gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 overflow-x-auto scrollbar-none">
                    <span className="text-slate-400 font-black text-[11px] ml-1 hidden lg:inline shrink-0">میانبرها: </span>

                    {/* 📱 موبایل: ۳ میانبر اصلی + دکمه «بیشتر» */}
                    <div className="flex items-center gap-1.5 sm:hidden">
                        {POS_TOOLBAR_SHORTCUTS.slice(0, 3).map(shortcutChip)}
                        <button type="button" onClick={() => setShowAllShortcuts(true)}
                            title="همه میانبرها"
                            className="w-10 h-10 shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl flex items-center justify-center text-lg font-black transition active:scale-95">
                            ⋯
                        </button>
                    </div>

                    {/* 🖥️ تبلت/دسکتاپ: همه میانبرها */}
                    <div className="hidden sm:flex items-center gap-2 shrink-0">
                        {POS_TOOLBAR_SHORTCUTS.map(shortcutChip)}
                    </div>
                </div>

                {/* 🎛️ کنترل‌های نمایش و تم (لمسی ۴۴px) */}
                <div className="flex items-center gap-2 shrink-0">
                    <button type="button" onClick={onOpenCustomerDisplay} title="نمایشگر مشتری"
                        className="w-11 h-11 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl flex items-center justify-center text-lg transition active:scale-95">
                        🖥️
                    </button>
                    <button type="button" onClick={onToggleTheme} title="حالت شب / روز"
                        className="w-11 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl flex items-center justify-center text-lg transition active:scale-95">
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                </div>
            </div>

            {/* 📱 پنجره پایین‌کش: همه میانبرها */}
            {showAllShortcuts && (
                <div className="fixed inset-0 z-[280] bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fadeIn"
                    onClick={() => setShowAllShortcuts(false)}>
                    <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-4 shadow-2xl animate-fadeIn"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-black text-sm text-slate-800">همه میانبرها</h3>
                            <button type="button" onClick={() => setShowAllShortcuts(false)}
                                className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center font-bold transition active:scale-95">
                                ✕
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 max-h-[55vh] overflow-y-auto arka-scrollbar pb-1">
                            {POS_TOOLBAR_SHORTCUTS.map(s => (
                                <button key={s.key} type="button"
                                    className={`px-3 py-2.5 rounded-xl border font-black text-xs flex items-center gap-2 transition active:scale-95 shadow-sm ${s.color}`}>
                                    <span className="bg-white px-1.5 py-0.5 rounded text-[10px] font-mono border border-current/20">{s.key}</span>
                                    <span>{s.label}</span>
                                </button>
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold mt-3 text-center">میانبرها با کلیدهای F2 تا F9 روی صفحه‌کلید فعال هستند.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
window.POSToolbar = POSToolbar;
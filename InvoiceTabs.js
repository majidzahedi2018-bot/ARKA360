// src/components/shop/pos/InvoiceTabs.js — فاز ۸ / گام ۸-۵: فقط تب‌های فاکتور
// 💡 میانبرهای کیبورد فقط در POSToolbar نمایش داده می‌شوند (جلوگیری از دوبلیکیت)
function InvoiceTabs({ tabs, activeTabId, onSwitchTab, onAddTab, onCloseTab }) {
    return (
        <div className="bg-slate-100 px-3 py-1.5 flex items-center justify-between shrink-0 select-none border-b border-slate-200" dir="rtl">
            {/* تب‌های کرومی فاکتور + دکمه فاکتور جدید */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
                {tabs.map((tab, index) => {
                    const isActive = tab.id === activeTabId;
                    return (
                        <div
                            key={tab.id}
                            onClick={() => onSwitchTab(tab.id)}
                            className={`px-3 py-1.5 rounded-t-xl flex items-center gap-2 cursor-pointer shrink-0 transition-all border-t-2 ${
                                isActive
                                    ? 'chrome-tab-active font-black'
                                    : 'chrome-tab-inactive font-bold'
                            }`}
                        >
                            <span className="text-[10px]">📑</span>
                            <span className="text-[11px] leading-tight">{tab.name || `فاکتور ${index + 1}`}</span>
                            {tabs.length > 1 && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onCloseTab(tab.id); }}
                                    className="w-3.5 h-3.5 rounded-full bg-slate-300 hover:bg-rose-500 hover:text-white text-slate-600 flex items-center justify-center text-[8px] font-black transition"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    );
                })}
                <button
                    onClick={onAddTab}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 transition shadow-xs active:scale-95 shrink-0"
                >
                    <span>+ فاکتور جدید</span>
                </button>
            </div>
        </div>
    );
}
window.InvoiceTabs = InvoiceTabs;
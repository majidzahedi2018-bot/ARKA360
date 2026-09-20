// src/components/shop/pos/POSLayout.js — فاز ۸: پشتیبانی تم با data-theme
function POSLayout({ children, theme = 'light' }) {
    return (
        <div data-theme={theme}
            className="pos-root flex-1 flex flex-col h-full w-full overflow-hidden animate-fadeIn font-sans select-none bg-slate-100 relative" dir="rtl">
            {children}
        </div>
    );
}
window.POSLayout = POSLayout;
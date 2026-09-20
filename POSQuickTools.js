// src/components/shop/pos/POSQuickTools.js

function POSQuickTools({ onNewProduct, onNewCustomer, onCalculator, onScale, onBarcodeScanner }) {
    return (
        <div className="flex flex-col gap-2 shrink-0 select-none z-10 py-1">
            <button 
                onClick={onNewProduct}
                className="bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 p-2.5 rounded-2xl shadow-2xs flex items-center gap-2 text-[11px] font-black transition active:scale-95"
            >
                <span className="w-6 h-6 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xs">📦</span>
                <span className="hidden xl:inline">کالای جدید +</span>
            </button>

            <button 
                onClick={onNewCustomer}
                className="bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 p-2.5 rounded-2xl shadow-2xs flex items-center gap-2 text-[11px] font-black transition active:scale-95"
            >
                <span className="w-6 h-6 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xs">👤</span>
                <span className="hidden xl:inline">مشتری جدید +</span>
            </button>

            <button 
                onClick={onCalculator}
                className="bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 p-2.5 rounded-2xl shadow-2xs flex items-center gap-2 text-[11px] font-black transition active:scale-95"
            >
                <span className="w-6 h-6 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xs">🧮</span>
                <span className="hidden xl:inline">ماشین حساب</span>
            </button>

            <button 
                onClick={onScale}
                className="bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 p-2.5 rounded-2xl shadow-2xs flex items-center gap-2 text-[11px] font-black transition active:scale-95"
            >
                <span className="w-6 h-6 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xs">⚖️</span>
                <span className="hidden xl:inline">ترازو</span>
            </button>

            <button 
                onClick={onBarcodeScanner}
                className="bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-700 p-2.5 rounded-2xl shadow-2xs flex items-center gap-2 text-[11px] font-black transition active:scale-95"
            >
                <span className="w-6 h-6 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xs">📶</span>
                <span className="hidden xl:inline">اسکن بارکد</span>
            </button>

            <button className="w-9 h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center font-black shadow-lg shadow-indigo-600/30 hover:scale-105 transition mx-auto mt-2">
                ⋮
            </button>
        </div>
    );
}

window.POSQuickTools = POSQuickTools;
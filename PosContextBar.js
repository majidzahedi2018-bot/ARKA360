// src/components/shop/pos/PosContextBar.js — فاز ۸ / زیرگام ۸-۳-۲: ردیف زمینه فشرده
function PosContextBar({
    selectedCustomer,
    customers = [],
    setSelectedCustomerId,
    lastAddedProduct,
    formatPrice
}) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [isCustomerOpen, setIsCustomerOpen] = React.useState(false);
    const [customerSearch, setCustomerSearch] = React.useState('');
    const listRef = React.useRef(null);

    const product = lastAddedProduct || null;
    const sellPrice = Number(product?.price || 0);
    const buyPrice = Number(product?.buy_price > 0 ? product.buy_price : sellPrice * 0.7);
    const margin = Math.max(0, sellPrice - buyPrice);
    const debt = Number(selectedCustomer?.total_debt || 0);

    const filteredCustomers = React.useMemo(() => {
        const term = customerSearch.trim();
        if (!term) return customers.slice(0, 8);
        return customers.filter(c => (c.name || '').includes(term) || (c.phone || '').includes(term)).slice(0, 8);
    }, [customers, customerSearch]);

    // بستن لیست مشتری با کلیک بیرون
    React.useEffect(() => {
        const onDown = (e) => {
            if (listRef.current && !listRef.current.contains(e.target)) setIsCustomerOpen(false);
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, []);

    return (
        <div className="shrink-0 select-none" dir="rtl">
            <div className="bg-white border border-slate-200/95 rounded-2xl p-1.5 shadow-2xs flex items-center gap-1.5 relative">
                {/* ── انتخابگر فشرده مشتری ── */}
                <div className="relative shrink-0" ref={listRef}>
                    <button
                        type="button"
                        onClick={() => setIsCustomerOpen(!isCustomerOpen)}
                        className={`h-9 px-2.5 rounded-xl border flex items-center gap-1.5 text-[11px] font-black transition active:scale-95 ${
                            selectedCustomer ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                        title="انتخاب مشتری فاکتور"
                    >
                        <span>👤</span>
                        <span className="max-w-[110px] truncate">{selectedCustomer ? selectedCustomer.name : 'مشتری متفرقه'}</span>
                        {debt > 0 && (
                            <span className="bg-rose-100 text-rose-600 text-[9px] px-1.5 py-0.5 rounded-md font-black">
                                بدهی {formatPrice(debt)}
                            </span>
                        )}
                        <span className="text-[8px] text-slate-400">▼</span>
                    </button>
                    {isCustomerOpen && (
                        <div className="absolute top-10 right-0 z-50 w-64 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
                            <div className="p-1.5 border-b border-slate-100">
                                <input
                                    type="text"
                                    value={customerSearch}
                                    onChange={e => setCustomerSearch(e.target.value)}
                                    placeholder="جستجوی نام / شماره مشتری..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] font-bold outline-none focus:border-indigo-500"
                                />
                            </div>
                            <div className="max-h-44 overflow-y-auto arka-scrollbar">
                                <button
                                    type="button"
                                    onClick={() => { setSelectedCustomerId(''); setIsCustomerOpen(false); setCustomerSearch(''); }}
                                    className="w-full p-2 text-right text-[11px] font-bold text-slate-600 hover:bg-slate-50"
                                >
                                    ○ مشتری متفرقه (نقدی)
                                </button>
                                {filteredCustomers.map(c => (
                                    <button
                                        key={c.id}
                                        type="button"
                                        onClick={() => { setSelectedCustomerId(c.id); setIsCustomerOpen(false); setCustomerSearch(''); }}
                                        className="w-full p-2 text-right flex justify-between items-center gap-2 text-[11px] font-bold text-slate-700 hover:bg-indigo-50"
                                    >
                                        <span className="truncate">{c.name}</span>
                                        <span className="text-[9px] text-slate-400 font-mono shrink-0">{c.phone || ''}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <span className="w-px h-6 bg-slate-200 shrink-0"></span>

                {/* ── چیپ فشرده کالا + جزئیات تاشو ── */}
                {product ? (
                    <>
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
    {(() => {
        const imgUrl = product.image ? (product.image.startsWith('http') ? product.image : (window.APP_CONFIG?.API_BASE_URL || '') + product.image) : null;
        return imgUrl ? (
            <img src={imgUrl} alt={product.name} loading="lazy" decoding="async"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.insertAdjacentHTML('afterbegin', '<span class="w-10 h-10 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-base shrink-0">📦</span>'); }}
                className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-xl object-contain shrink-0" />
        ) : (
            <span className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-base shrink-0">📦</span>
        );
    })()}
    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md shrink-0 ${product.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                {product.stock > 0 ? `موجودی ${product.stock} ${product.unit || 'عدد'}` : 'ناموجود'}
                            </span>
                            <span className="text-[11px] font-black text-slate-800 truncate">{product.name}</span>
                            <span className="text-[10px] font-black text-emerald-600 shrink-0">{formatPrice(sellPrice)} ریال</span>
                            {isExpanded && (
                                <>
                                    <span className="text-[9px] text-slate-400 font-bold shrink-0">فی: {formatPrice(buyPrice)}</span>
                                    <span className="text-[9px] text-emerald-600 font-bold shrink-0">حاشیه: {formatPrice(margin)}</span>
                                    <span className="text-[9px] text-slate-400 font-mono shrink-0">BC: {product.barcode || '---'}</span>
                                </>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="h-9 w-9 shrink-0 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center text-[10px] font-black text-slate-500 transition active:scale-95"
                            title="جزئیات کالا"
                        >
                            {isExpanded ? '▲' : '▼'}
                        </button>
                    </>
                ) : (
                    <span className="text-[10px] text-slate-400 font-bold flex-1">هنوز کالایی انتخاب نشده...</span>
                )}
            </div>
        </div>
    );
}
window.PosContextBar = PosContextBar;
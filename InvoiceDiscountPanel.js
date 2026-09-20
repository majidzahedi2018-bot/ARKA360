// src/components/shop/pos/InvoiceDiscountPanel.js

function InvoiceDiscountPanel({ total, onDiscountChange }) {
    const [discountType, setDiscountType] = React.useState('percent'); // 'percent' | 'amount'
    const [percentValue, setPercentValue] = React.useState(0);
    const [amountValue, setAmountValue] = React.useState(0);

    const formatPrice = (num) => Number(num || 0).toLocaleString('en-US');

    const computedDiscount = discountType === 'percent'
        ? Math.round((total * Number(percentValue || 0)) / 100)
        : Number(amountValue || 0);

    React.useEffect(() => {
        onDiscountChange?.(computedDiscount);
    }, [computedDiscount]);

    return (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs select-none space-y-2" dir="rtl">
            <h4 className="font-black text-slate-800 text-xs border-b border-slate-100 pb-2 flex items-center gap-2">
                <span>🏷️</span> تخفیف فاکتور
            </h4>

            <div className="grid grid-cols-2 gap-1.5">
                <button
                    type="button"
                    onClick={() => setDiscountType('amount')}
                    className={`py-1.5 rounded-xl text-[11px] font-black border transition-all ${
                        discountType === 'amount'
                            ? 'bg-blue-50 text-blue-700 border-blue-400'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                >
                    مبلغی
                </button>
                <button
                    type="button"
                    onClick={() => setDiscountType('percent')}
                    className={`py-1.5 rounded-xl text-[11px] font-black border transition-all ${
                        discountType === 'percent'
                            ? 'bg-blue-50 text-blue-700 border-blue-400'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                >
                    درصدی
                </button>
            </div>

            {discountType === 'percent' ? (
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                    <span className="text-xs font-bold text-slate-500">٪</span>
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={percentValue}
                        onChange={e => setPercentValue(e.target.value)}
                        className="bg-transparent text-left font-black text-sm text-slate-800 outline-none w-20"
                    />
                </div>
            ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">مبلغ تخفیف:</span>
                    <input
                        type="text"
                        value={formatPrice(amountValue)}
                        onChange={e => {
                            const val = e.target.value.replace(/,/g, '');
                            if (!isNaN(val)) setAmountValue(Number(val));
                        }}
                        className="w-full bg-transparent text-left font-black text-sm text-slate-800 outline-none"
                    />
                </div>
            )}

            <div className="flex justify-between items-center text-[11px] font-bold text-rose-500 px-1 pt-1">
                <span>مبلغ تخفیف اعمال‌شده:</span>
                <span className="font-mono">{formatPrice(computedDiscount)} ریال</span>
            </div>
        </div>
    );
}

window.InvoiceDiscountPanel = InvoiceDiscountPanel;
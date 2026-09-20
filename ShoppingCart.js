// src/components/shop/pos/ShoppingCart.js — نسخه فشرده استاندارد (ردیف ۴۶px)
// ✨ نسخه موبایل: جدول ۸ ستونه → لیست کارتی (فقط زیر md) — دسکتاپ دست نخورده
function ShoppingCart({
    cart,
    incrementQty,
    decrementQty,
    removeFromCart
}) {
    const formatPrice = (num) => Number(num || 0).toLocaleString('en-US');
    const makeThumb = (item, sizeCls) => {
        const imgUrl = item.image ? (item.image.startsWith('http') ? item.image : (window.APP_CONFIG?.API_BASE_URL || '') + item.image) : null;
        if (!imgUrl) {
            return <span className={`${sizeCls} bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-sm shrink-0`}>📦</span>;
        }
        return (
            <img src={imgUrl} alt={item.name} loading="lazy" decoding="async"
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; }}
                className={`${sizeCls} bg-slate-50 border border-slate-100 rounded-lg object-contain shrink-0`} />
        );
    };

    const emptyState = (
        <div className="py-10 text-center text-slate-400 font-bold">
            <div className="text-3xl mb-2 opacity-50">🛒</div>
            سبد خرید خالی است. کالا را اسکن کنید یا از کادر جستجو اضافه نمایید.
        </div>
    );

    return (
        <div className="flex-1 flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 select-none min-h-0 relative" dir="rtl">
            {/* 📱 موبایل/تبلت: لیست کارتی بدون اسکرول افقی */}
            <div className="flex-1 min-h-0 overflow-y-auto arka-scrollbar bg-white md:hidden">
                {cart.length === 0 ? (
                    emptyState
                ) : (
                    <div className="divide-y divide-slate-100">
                        {cart.map((item, index) => {
                            const rowTotal = Number(item.price) * item.qty;
                            return (
                                <div key={item.id} className="p-3 bg-white">
                                    {/* ردیف بالا: تصویر + نام + حذف */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                            {makeThumb(item, "w-12 h-12")}
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-black text-slate-900 text-xs leading-5 line-clamp-2">{item.name}</h4>
                                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                                    <span className="text-[9px] font-mono text-slate-400 font-bold">کد: {item.code || item.id}</span>
                                                    <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold">{item.unit || 'عدد'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFromCart(item.id)}
                                            className="w-9 h-9 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl inline-flex items-center justify-center transition font-bold shrink-0"
                                            title="حذف ردیف"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    {/* ردیف پایین: قیمت واحد + تعداد + جمع ردیف */}
                                    <div className="flex items-center justify-between gap-2 mt-2.5 pr-0.5">
                                        <div className="text-right shrink-0">
                                            <span className="text-[9px] text-slate-400 font-bold block">قیمت واحد</span>
                                            <span className="font-mono text-[11px] font-bold text-slate-700 block">{formatPrice(item.price)}</span>
                                        </div>
                                        <div className="inline-flex items-center justify-center gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1 shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => decrementQty(item.id)}
                                                className="w-9 h-9 bg-white hover:bg-rose-50 text-rose-600 font-black rounded-lg flex items-center justify-center text-lg shadow-sm active:scale-90 transition cursor-pointer"
                                                title="کاهش تعداد"
                                            >−</button>
                                            <span className="font-mono text-sm font-black w-9 text-center text-slate-900">{item.qty}</span>
                                            <button
                                                type="button"
                                                onClick={() => incrementQty(item.id)}
                                                className="w-9 h-9 bg-white hover:bg-indigo-50 text-indigo-600 font-black rounded-lg flex items-center justify-center text-lg shadow-sm active:scale-90 transition cursor-pointer"
                                                title="افزایش تعداد"
                                            >+</button>
                                        </div>
                                        <div className="text-left shrink-0">
                                            <span className="text-[9px] text-slate-400 font-bold block">جمع ردیف</span>
                                            <span className="font-mono font-black text-emerald-600 text-sm block">{formatPrice(rowTotal)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 🖥️ دسکتاپ: جدول استاندارد (بدون تغییر) */}
            <div className="hidden md:flex flex-1 min-h-0 overflow-x-auto overflow-y-auto arka-scrollbar bg-white">
                <table className="w-full text-right border-collapse min-w-[700px]">
                    <thead>
                        <tr className="bg-slate-100 text-slate-600 text-[11px] font-black border-b border-slate-200 sticky top-0 z-10">
                            <th className="p-2 text-center w-10">ردیف</th>
                            <th className="p-2 w-20">کد کالا</th>
                            <th className="p-2">شرح کالا یا خدمات</th>
                            <th className="p-2 w-16 text-center">واحد</th>
                            <th className="p-2 w-28 text-center">تعداد / مقدار</th>
                            <th className="p-2 w-28 text-center">قیمت واحد (ریال)</th>
                            <th className="p-2 w-32 text-center">مبلغ کل ردیف (ریال)</th>
                            <th className="p-2 text-center w-10">حذف</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                        {cart.length === 0 ? (
                            <tr>
                                <td colSpan="8">{emptyState}</td>
                            </tr>
                        ) : (
                            cart.map((item, index) => {
                                const rowTotal = Number(item.price) * item.qty;
                                return (
                                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-1.5 text-center font-mono text-slate-400 font-bold">{index + 1}</td>
                                        <td className="p-1.5 font-mono text-slate-600 font-bold">{item.code || item.id}</td>
                                        <td className="p-1.5">
    <div className="flex items-center gap-2">
        {makeThumb(item, "w-8 h-8")}
        <span className="font-black text-slate-900 truncate">{item.name}</span>
    </div>
</td>
                                        <td className="p-1.5 text-center text-slate-600 font-bold">{item.unit || 'عدد'}</td>
                                        <td className="p-1.5 text-center">
                                            {/* stepper فشرده: دکمه ۳۲px */}
                                            <div className="inline-flex items-center justify-center gap-1 bg-slate-100 border border-slate-200 rounded-lg p-0.5 shadow-2xs">
                                                <button 
                                                    type="button"
                                                    onClick={() => decrementQty(item.id)} 
                                                    className="w-8 h-8 bg-white hover:bg-rose-50 text-rose-600 font-black rounded-md flex items-center justify-center text-base shadow-sm active:scale-90 transition cursor-pointer"
                                                    title="کاهش تعداد"
                                                >
                                                    -
                                                </button>
                                                <span className="font-mono text-[11px] font-black w-7 text-center text-slate-900">{item.qty}</span>
                                                <button 
                                                    type="button"
                                                    onClick={() => incrementQty(item.id)} 
                                                    className="w-8 h-8 bg-white hover:bg-indigo-50 text-indigo-600 font-black rounded-md flex items-center justify-center text-base shadow-sm active:scale-90 transition cursor-pointer"
                                                    title="افزایش تعداد"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-1.5 text-center font-mono text-slate-700 font-bold">{formatPrice(item.price)}</td>
                                        <td className="p-1.5 text-center font-mono font-black text-emerald-600 text-sm">{formatPrice(rowTotal)}</td>
                                        <td className="p-1.5 text-center">
                                            <button 
                                                type="button"
                                                onClick={() => removeFromCart(item.id)} 
                                                className="w-8 h-8 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-md inline-flex items-center justify-center transition font-bold" 
                                                title="حذف ردیف"
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            {/* محو شدگی کف = نشانه وجود ردیف‌های بیشتر */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-white to-transparent"></div>
        </div>
    );
}
window.ShoppingCart = ShoppingCart;
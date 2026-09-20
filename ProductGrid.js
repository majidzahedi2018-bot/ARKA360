// src/components/shop/pos/ProductGrid.js

function ProductGrid({ 
    displayProducts, 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    cart, 
    addToCart, 
    formatNumber 
}) {
    const getCategoryIcon = (cat) => {
        switch(cat) {
            case 'all': return '🎛️';
            case 'نوشیدنی': return '🥤';
            case 'خوراکی': return '🍿';
            case 'بهداشتی': return '🧴';
            case 'لبنیات': return '🥛';
            case 'خانه داری': return '🥕';
            case 'میوه و سبزی': return '🥬';
            default: return '📦';
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden h-full p-3 gap-2.5">
            {/* دسته‌بندی‌ها */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100 shrink-0">
                <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-2xl text-xs font-bold border border-slate-200 flex items-center gap-1.5 shrink-0">
                    <span>همه دسته‌ها</span>
                    <span className="text-[10px]">∨</span>
                </button>

                <div className="h-5 w-[1px] bg-slate-200 mx-1 shrink-0"></div>

                {categories.map(cat => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-2xl text-xs font-bold shrink-0 border transition flex items-center gap-1.5 ${
                            selectedCategory === cat 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                        <span>{getCategoryIcon(cat)}</span>
                        <span>{cat === 'all' ? 'همه کالاها' : cat}</span>
                    </button>
                ))}
            </div>

            {/* گرید کالاها (ثابت ۴ ستونه با فاصله‌های استاندارد جهت نمایش حداقل ۲ ردیف کامل) */}
            <div className="flex-1 overflow-y-auto grid grid-cols-2 lg:grid-cols-4 gap-2.5 p-1 arka-scrollbar">
                {displayProducts.map(p => {
                    const inCart = cart.find(item => item.id === p.id);
                    return (
                        <window.ProductCard 
                            key={p.id}
                            product={p}
                            inCart={inCart}
                            onAddToCart={addToCart}
                            formatNumber={formatNumber}
                        />
                    );
                })}
            </div>

            {/* دکمه‌های پایین (موبایل: ۳ ستونه با متن کامل / دسکتاپ: ۶ ستونه) */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 pt-1.5 border-t border-slate-100 shrink-0 text-xs font-bold">
                <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 min-h-[48px] rounded-2xl transition flex flex-col md:flex-row items-center justify-center gap-1 md:gap-1.5 shadow-2xs active:scale-95">
                    <span>🕒</span>
                    <span className="whitespace-nowrap text-[11px] leading-none">تاریخچه</span>
                </button>
                <button className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 min-h-[48px] rounded-2xl transition flex flex-col md:flex-row items-center justify-center gap-1 md:gap-1.5 shadow-2xs active:scale-95">
                    <span>🧮</span>
                    <span className="whitespace-nowrap text-[11px] leading-none">محاسبه سریع</span>
                </button>
                <button className="bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 min-h-[48px] rounded-2xl transition flex flex-col md:flex-row items-center justify-center gap-1 md:gap-1.5 shadow-2xs active:scale-95">
                    <span>📶</span>
                    <span className="whitespace-nowrap text-[11px] leading-none">بارکد خوان</span>
                </button>
                <button className="bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 min-h-[48px] rounded-2xl transition flex flex-col md:flex-row items-center justify-center gap-1 md:gap-1.5 shadow-2xs active:scale-95">
                    <span>🔍</span>
                    <span className="whitespace-nowrap text-[11px] leading-none">جستجو</span>
                </button>
                <button className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 min-h-[48px] rounded-2xl transition flex flex-col md:flex-row items-center justify-center gap-1 md:gap-1.5 shadow-2xs active:scale-95">
                    <span>👤+</span>
                    <span className="whitespace-nowrap text-[11px] leading-none">مشتری جدید</span>
                </button>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white min-h-[48px] rounded-2xl transition flex flex-col md:flex-row items-center justify-center gap-1 md:gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95">
                    <span>📦+</span>
                    <span className="whitespace-nowrap text-[11px] leading-none">کالای جدید</span>
                </button>
            </div>
        </div>
    );
}

window.ProductGrid = ProductGrid;
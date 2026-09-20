// src/components/shop/pos/ProductCard.js

function ProductCard({ product, inCart, onAddToCart }) {
    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;
    const imageUrl = product.image ? (product.image.startsWith('http') ? product.image : (window.APP_CONFIG?.API_BASE_URL || '') + product.image) : null;
    const [isFavorite, setIsFavorite] = React.useState(product.isFavorite || false);

    const formatPrice = (num) => Number(num || 0).toLocaleString('en-US');

    return (
        <div 
            onClick={() => !isOutOfStock && onAddToCart(product)}
            className={`rounded-2xl p-2.5 flex flex-col justify-between transition-all duration-150 cursor-pointer select-none relative group ${
                isOutOfStock 
                    ? 'opacity-50 bg-slate-50 border border-slate-200 cursor-not-allowed' 
                    : inCart 
                        ? 'pos-card-selected' 
                        : 'pos-card-normal'
            }`}
        >
            {/* هدر کارت: ستاره و نشانگر موجودی */}
            <div className="flex items-center justify-between mb-1">
                <button 
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsFavorite(!isFavorite);
                    }}
                    className={`text-sm transition ${isFavorite ? 'text-amber-400 scale-110' : 'text-slate-300 hover:text-amber-400'}`}
                >
                    ★
                </button>

                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg ${
                    isOutOfStock 
                        ? 'bg-rose-100 text-rose-700' 
                        : isLowStock 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-emerald-100 text-emerald-800'
                }`}>
                    {isOutOfStock ? 'ناموجود' : isLowStock ? 'کم موجود' : 'موجودی'}
                </span>
            </div>

            {/* تصویر محصول با پس‌زمینه سفید یکدست و نمایش طبیعی عمودی/افقی */}
            <div className="w-full h-20 flex items-center justify-center p-0.5 mb-1.5 transition-transform group-hover:scale-[1.04]">
                {imageUrl ? (
                    <img src={imageUrl} alt={product.name} loading="lazy" decoding="async"
     onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.innerHTML = '<span class="text-3xl text-slate-300">📦</span>'; }}
     className="max-w-full max-h-full object-contain drop-shadow-2xs" />
                ) : (
                    <span className="text-3xl text-slate-300">📦</span>
                )}
            </div>

            {/* عنوان کالا دو خطی فشرده */}
            <div className="space-y-0.5 mb-1.5 text-center">
                <h4 className="pos-product-title line-clamp-2 min-h-[2rem] flex items-center justify-center text-[11px]">
                    {product.name}
                </h4>
                <span className="text-[9px] text-slate-400 font-bold block">
                    کد: {product.barcode || product.id}
                </span>
            </div>

            {/* قیمت و دکمه + شکیل ۳۲x۳۲ */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-1.5 mt-auto">
                <div className="text-right">
                    <span className="pos-price-text block">
                        {formatPrice(product.price)}
                    </span>
                    <span className="text-[8px] text-slate-400 font-bold block -mt-1">ریال</span>
                </div>

                <button 
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isOutOfStock) onAddToCart(product);
                    }}
                    disabled={isOutOfStock}
                    className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center font-bold text-base transition shadow-sm active:scale-90 disabled:opacity-40 shrink-0"
                >
                    +
                </button>
            </div>
        </div>
    );
}

window.ProductCard = ProductCard;
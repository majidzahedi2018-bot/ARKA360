// src/components/shop/SaleForm.js
function SaleForm({ products, customers, onSave, onClose, initialCart, initialCustomerId, proformaId }) {
    const searchContainerRef = React.useRef(null);
    
    // ✅ فراخوانی هوک مدیریت منطق صندوق فروشگاهی
    const {
        tabs, activeTabId, setActiveTabId, activeTab, cart, selectedCustomerId, selectedCustomer,
        paymentType, setPaymentType,
        productSearch, setProductSearch, selectedIndex, setSelectedIndex,
        hoveredProduct, setHoveredProduct, lastAddedProduct,
        selectedCategory, setSelectedCategory,
        isCameraScannerOpen, setIsCameraScannerOpen, cameraError,
        isSubmitting, taxRate, videoRef, invoiceDiscount, setInvoiceDiscount,
        categories, displayProducts, grossTotal, discountAmount, netAmount, 
        taxAmount, finalPayable,
        addToCart, decrementQty, incrementQty, removeFromCart,
        handleAddTab, handleCloseTab, setSelectedCustomerId, handleSubmit,
        updateCartAndBroadcast, startCameraScanner, stopCameraScanner
 } = window.usePOSState({ products, customers, onSave, onClose, initialCart, initialCustomerId, proformaId });

// 🎨 فاز ۸: حالت شب POS + نمایشگر مشتری
const [posTheme, setPosTheme] = React.useState(localStorage.getItem('arka_pos_theme') || 'light');
const [isCustomerDisplayOpen, setIsCustomerDisplayOpen] = React.useState(false);
const togglePosTheme = () => {
    const next = posTheme === 'dark' ? 'light' : 'dark';
    setPosTheme(next);
    localStorage.setItem('arka_pos_theme', next);
};
    
    // توابع فرمت‌دهی محلی
    const formatQty = (qty, step) => step < 1 ? qty.toFixed(2).replace(/.00$/, '') : qty.toString();
    const formatNumber = (num) => Number(num || 0).toLocaleString('fa-IR');
    
    // بستن سرچ با کلیک بیرون
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setProductSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    return (
        <window.POSLayout onClose={onClose} theme={posTheme}>
            {/* 🎛️ فاز ۸: نوار ابزار با کنترل تم و نمایشگر مشتری */}
            <window.POSToolbar
                theme={posTheme}
                onToggleTheme={togglePosTheme}
                onOpenCustomerDisplay={() => setIsCustomerDisplayOpen(true)}
            />
            {/* ۲. تب‌های کرومی فاکتور */}
            <window.InvoiceTabs 
                tabs={tabs}
                activeTabId={activeTabId}
                onSwitchTab={setActiveTabId}
                onAddTab={handleAddTab}
                onCloseTab={handleCloseTab}
            />
            
            {/* 🔴 دو ردیف عمودی بالایی: مشتری (بالا) سپس اطلاعات کالا (پایین) */}
            <div className="px-2 pt-1.5 flex flex-col gap-2 shrink-0" dir="rtl">
                            {/* 🧭 فاز ۸ / ۸-۳-۲: ردیف زمینه فشرده (جایگزین دو ردیف مشتری + کالا) */}
            <window.PosContextBar
                selectedCustomer={selectedCustomer}
                customers={customers}
                setSelectedCustomerId={setSelectedCustomerId}
                lastAddedProduct={hoveredProduct || lastAddedProduct || products[0]}
                formatPrice={(num) => Number(num || 0).toLocaleString('en-US')}
            />
                {/* ردیف ۳: جستجوی سریع کالا */}
                <div ref={searchContainerRef} className="bg-white border border-slate-200/95 rounded-2xl p-2 shadow-2xs flex flex-wrap md:flex-nowrap items-center gap-1.5 relative">
                    {/* دکمه میکروفون صوتی هوشمند */}
                    <window.VoiceSearch 
                        productList={products}
                        onItemsDetected={(detectedItems) => {
                            if (detectedItems && detectedItems.length > 0) {
                                detectedItems.forEach(aiItem => {
                                    const foundProd = products.find(p => p.id === aiItem.id || p.name.includes(aiItem.name));
                                    if (foundProd) {
                                        for (let i = 0; i < (aiItem.qty || 1); i++) {
                                            addToCart(foundProd);
                                        }
                                    }
                                });
                                window.AppHelpers?.showToast?.(`✅ ${detectedItems.length} قلم کالا با صوت ثبت شد`, "success");
                            }
                        }}
                    />
                    <select className="order-2 md:order-none bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 h-10 md:h-auto text-[11px] font-bold text-slate-700 outline-none shrink-0">
                        <option>عدد</option>
                        <option>کارتن</option>
                    </select>
                    {/* اینپوت جستجوی هوشمند با قابلیت ناوبری و اسکرول هوشمند خودکار */}
                    <div className="order-1 basis-full md:order-none md:basis-0 md:flex-1 min-w-0 relative">
                        <input 
                            type="text" 
                            value={productSearch}
                            onChange={e => {
                                setProductSearch(e.target.value);
                                setSelectedIndex(0);
                                if(displayProducts.length > 0) setHoveredProduct(displayProducts[0]);
                            }}
                            onKeyDown={e => {
                                if (displayProducts.length === 0) return;
                                if (e.key === 'ArrowDown') {
                                    e.preventDefault();
                                    const nextIdx = selectedIndex < displayProducts.length - 1 ? selectedIndex + 1 : 0;
                                    setSelectedIndex(nextIdx);
                                    setHoveredProduct(displayProducts[nextIdx]);
                                } else if (e.key === 'ArrowUp') {
                                    e.preventDefault();
                                    const prevIdx = selectedIndex > 0 ? selectedIndex - 1 : displayProducts.length - 1;
                                    setSelectedIndex(prevIdx);
                                    setHoveredProduct(displayProducts[prevIdx]);
                                } else if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const targetProduct = displayProducts[selectedIndex] || displayProducts[0];
                                    if (targetProduct) {
                                        addToCart(targetProduct);
                                        setProductSearch('');
                                        setSelectedIndex(0);
                                    }
                                }
                            }}
                            placeholder="نام کالا را بنویسید (با ↕ حرکت کنید و Enter بزنید)..."
                            className="w-full bg-slate-100/80 border border-slate-200 rounded-lg px-3 py-1.5 h-10 md:h-auto text-xs font-bold outline-none focus:border-indigo-600 focus:bg-white"
                        />
                        {/* لیست کشویی نتایج جستجو */}
                        {productSearch.trim().length > 0 && displayProducts.length > 0 && (
                            <div className="absolute top-10 right-0 left-0 z-50 bg-white border border-slate-200 rounded-xl shadow-xl max-h-48 overflow-y-auto arka-scrollbar">
                                {displayProducts.map((p, idx) => {
                                    const isSelected = idx === selectedIndex;
                                    return (
                                        <div 
                                            key={p.id}
                                            ref={node => {
                                                if (isSelected && node) {
                                                    node.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                                }
                                            }}
                                            onMouseEnter={() => {
                                                setSelectedIndex(idx);
                                                setHoveredProduct(p);
                                            }}
                                            onClick={() => {
                                                addToCart(p);
                                                setProductSearch('');
                                                setSelectedIndex(0);
                                            }}
                                            className={`p-2.5 cursor-pointer flex justify-between items-center border-b border-slate-50 text-xs transition ${
                                                isSelected ? 'bg-indigo-600 text-white font-black' : 'hover:bg-indigo-50 text-slate-800'
                                            }`}
                                        >
                                            <span className={isSelected ? 'text-white' : 'font-bold text-slate-800'}>{p.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={isSelected ? 'text-indigo-100 font-black' : 'text-emerald-600 font-black'}>
                                                    {Number(p.price).toLocaleString()} ریال
                                                </span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${isSelected ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                    موجودی: {p.stock}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <button 
                        type="button"
                        onClick={startCameraScanner}
                        className="order-3 md:order-none bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 w-10 h-10 md:w-8 md:h-8 rounded-lg flex items-center justify-center shrink-0"
                        title="اسکن بارکد"
                    >
                        ⌗
                    </button>
                    <input 
                        type="text" 
                        placeholder="بارکد..."
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                const barcodeVal = e.target.value.trim();
                                const found = products.find(p => p.barcode === barcodeVal || String(p.id) === barcodeVal);
                                if (found) {
                                    addToCart(found);
                                    e.target.value = '';
                                } else {
                                    window.AppHelpers?.showToast?.("کالایی با این بارکد یافت نشد", "error");
                                }
                            }
                        }}
                        className="order-4 md:order-none flex-1 min-w-0 md:flex-none md:w-32 h-10 md:h-auto bg-slate-100/80 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold outline-none font-mono"
                    />
                </div>
            </div>
            
                             <div className="flex-1 flex flex-col overflow-hidden min-h-0 p-2 gap-2 bg-slate-100">
            {/* سبد: تنها ناحیه انعطاف‌پذیر با اسکرول داخلی (R1/R4) */}
            <div className="flex-1 min-h-[220px] md:min-h-0 flex flex-col overflow-hidden">
                    <window.ShoppingCart
                        cart={cart}
                        selectedCustomerId={selectedCustomerId}
                        setSelectedCustomerId={setSelectedCustomerId}
                        incrementQty={incrementQty}
                        decrementQty={decrementQty}
                        removeFromCart={removeFromCart}
                        formatNumber={formatNumber}
                        formatQty={formatQty}
                        selectedCustomer={selectedCustomer}
                    />
                </div>
                            {/* 🧭 فاز ۸ / ۸-۳-۱: نوار اقدام چسبان جایگزین ردیف سه‌پنلی */}
            <window.PosActionBar
                cart={cart}
                grossTotal={grossTotal}
                discountAmount={discountAmount}
                taxRate={taxRate}
                taxAmount={taxAmount}
                finalPayable={finalPayable}
                onDiscountChange={setInvoiceDiscount}
                onSubmitSale={(isProforma, method) => handleSubmit(isProforma, method)}
                onSubmitProforma={(isProforma, method) => handleSubmit(isProforma, method)}
                isSubmitting={isSubmitting}
                onClearCart={() => updateCartAndBroadcast([])}
            />
            </div>
            
            {/* 📍 فاز ۸: نوار وضعیت پایین صندوق */}
            <window.POSFooter />
            {/* 🖥️ فاز ۸: نمایشگر مشتری */}
            <window.CustomerDisplay
                open={isCustomerDisplayOpen}
                onClose={() => setIsCustomerDisplayOpen(false)}
                cart={cart}
                finalPayable={finalPayable}
            />
            {/* مودال اسکن بارکد */}
            {isCameraScannerOpen && (
                <div className="fixed inset-0 z-[260] bg-slate-950 flex flex-col justify-between text-white animate-fadeIn">
                    <div className="p-4 bg-slate-900 flex justify-between items-center border-b border-slate-800">
                        <h3 className="text-xs font-black">اسکنر بارکد کالا</h3>
                        <button type="button" onClick={stopCameraScanner} className="w-7 h-7 bg-slate-800 rounded-full flex items-center justify-center text-xs">✕</button>
                    </div>
                    <div className="flex-1 relative flex items-center justify-center bg-black">
                        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover opacity-80" muted playsInline />
                        <div className="relative w-64 h-36 border-4 border-dashed border-indigo-500 rounded-2xl flex items-center justify-center">
                            <div className="absolute inset-x-4 h-0.5 bg-rose-500 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            )}
        </window.POSLayout>
    );
}
window.SaleForm = SaleForm;
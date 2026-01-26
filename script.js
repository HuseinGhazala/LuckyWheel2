// الكوبونات المتاحة
let coupons = [
    { id: 1, name: 'خصم 10%', color: '#ff6b6b', probability: 1 },
    { id: 2, name: 'شحن مجاني', color: '#4ecdc4', probability: 1 },
    { id: 3, name: 'خصم 50%', color: '#45b7d1', probability: 1 },
    { id: 4, name: 'خصم 70%', color: '#f9ca24', probability: 1 },
    { id: 5, name: 'خصم 100%', color: '#6c5ce7', probability: 1 },
    { id: 6, name: 'حظ أوفر', color: '#95a5a6', probability: 1 }
];

let usedCoupons = [];
let isSpinning = false;
let currentRotation = 0;

const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const availableCouponsDiv = document.getElementById('availableCoupons');
const usedCouponsDiv = document.getElementById('usedCoupons');
const resultSection = document.getElementById('resultSection');
const resultTitle = document.getElementById('resultTitle');
const resultMessage = document.getElementById('resultMessage');

// تهيئة العجلة
function initWheel() {
    drawWheel();
    updateCouponsDisplay();
    updateUsedCouponsDisplay();
}

// رسم العجلة
function drawWheel() {
    const availableCoupons = coupons.filter(c => !usedCoupons.includes(c.id));
    
    if (availableCoupons.length === 0) {
        // لا توجد كوبونات متاحة
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#95a5a6';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('لا توجد كوبونات', canvas.width / 2, canvas.height / 2);
        return;
    }

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;
    const anglePerCoupon = (Math.PI * 2) / availableCoupons.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // رسم القطاعات
    availableCoupons.forEach((coupon, index) => {
        const startAngle = index * anglePerCoupon;
        const endAngle = (index + 1) * anglePerCoupon;

        // رسم القطاع
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = coupon.color;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();

        // رسم النص
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerCoupon / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.fillText(coupon.name, radius * 0.7, 5);
        ctx.restore();
    });
}

// تحديث عرض الكوبونات المتاحة
function updateCouponsDisplay() {
    const availableCoupons = coupons.filter(c => !usedCoupons.includes(c.id));
    
    if (availableCoupons.length === 0) {
        availableCouponsDiv.innerHTML = '<p class="empty-message">لا توجد كوبونات متاحة</p>';
        spinButton.classList.add('disabled');
        return;
    }

    availableCouponsDiv.innerHTML = availableCoupons.map(coupon => 
        `<span class="coupon-badge">${coupon.name}</span>`
    ).join('');
}

// تحديث عرض الكوبونات المستخدمة
function updateUsedCouponsDisplay() {
    if (usedCoupons.length === 0) {
        usedCouponsDiv.innerHTML = '<p class="empty-message">لم يتم استخدام أي كوبونات بعد</p>';
        return;
    }

    const used = coupons.filter(c => usedCoupons.includes(c.id));
    usedCouponsDiv.innerHTML = used.map(coupon => 
        `<span class="coupon-badge used">${coupon.name}</span>`
    ).join('');
}

// تدوير العجلة
function spinWheel() {
    if (isSpinning) return;
    
    const availableCoupons = coupons.filter(c => !usedCoupons.includes(c.id));
    if (availableCoupons.length === 0) {
        alert('لا توجد كوبونات متاحة للدوران!');
        return;
    }

    isSpinning = true;
    spinButton.classList.add('disabled');

    // اختيار كوبون عشوائي
    const randomIndex = Math.floor(Math.random() * availableCoupons.length);
    const selectedCoupon = availableCoupons[randomIndex];
    
    // حساب الزاوية المطلوبة للدوران
    const anglePerCoupon = (Math.PI * 2) / availableCoupons.length;
    const targetAngle = randomIndex * anglePerCoupon + anglePerCoupon / 2;
    
    // الدوران الكامل (5 دورات كاملة + الزاوية المطلوبة)
    const totalRotation = currentRotation + (Math.PI * 2 * 5) + (Math.PI * 2 - targetAngle);
    
    // تطبيق الدوران
    canvas.style.transform = `rotate(${totalRotation}rad)`;
    currentRotation = totalRotation % (Math.PI * 2);

    // الانتظار حتى ينتهي الدوران
    setTimeout(() => {
        // إضافة الكوبون إلى المستخدمة
        usedCoupons.push(selectedCoupon.id);
        
        // إعادة رسم العجلة
        drawWheel();
        updateCouponsDisplay();
        updateUsedCouponsDisplay();
        
        // عرض النتيجة
        showResult(selectedCoupon);
        
        isSpinning = false;
        spinButton.classList.remove('disabled');
    }, 3000);
}

// عرض النتيجة
function showResult(coupon) {
    if (coupon.name === 'حظ أوفر') {
        resultTitle.textContent = '😔 حظ أوفر المرة القادمة';
        resultMessage.textContent = 'لم تحصل على كوبون خصم هذه المرة، جرب مرة أخرى!';
    } else {
        resultTitle.textContent = '🎉 مبروك!';
        resultMessage.textContent = `لقد حصلت على: ${coupon.name}`;
    }
    
    resultSection.style.display = 'flex';
}

// إغلاق النتيجة
function closeResult() {
    resultSection.style.display = 'none';
}

// إضافة مستمع الحدث للزر
spinButton.addEventListener('click', spinWheel);

// تهيئة العجلة عند تحميل الصفحة
initWheel();

// ── FOUC Prevention: apply dark mode before first paint ──────────────────
(function () {
    try {
        // Try active user first
        var u = localStorage.getItem('smart_finance_currentUser');
        if (u) {
            var user = JSON.parse(u);
            var pk = 'smart_finance_prefs_' + (user.email || '');
            var prefs = JSON.parse(localStorage.getItem(pk) || '{}');
            if (prefs.darkMode) document.documentElement.classList.add('dark-mode-pending');
        }
    } catch (e) { }
})();
// ─────────────────────────────────────────────────────────────────────────

// ข้อมูลตัวอย่างสำหรับ Guest
const GUEST_DATA = {
    name: 'ผู้เยี่ยมชม (กดเพื่อเข้าสู่ระบบ)',
    finance: {
        balance: 124160,
        expenseToday: 840,
        incomeMonth: 25000,
        expenseMonth: 840,
        transactions: [
            { id: 1, type: 'expense', category: 'อาหาร', iconHtml: '<i class="fa-solid fa-burger"></i>', name: 'อาหาร (ตัวอย่าง)', amount: 150, date: new Date().toISOString() },
            { id: 2, type: 'expense', category: 'ค่าเดินทาง', iconHtml: '<i class="fa-solid fa-car"></i>', name: 'ค่าเดินทาง (ตัวอย่าง)', amount: 135, date: new Date().toISOString() },
            { id: 3, type: 'expense', category: 'ค่าน้ำ/ค่าไฟ', iconHtml: '<i class="fa-solid fa-faucet-drip"></i>', name: 'ค่าน้ำ/ค่าไฟ (ตัวอย่าง)', amount: 555, date: new Date().toISOString() },
            { id: 4, type: 'income', category: 'เงินเดือน', iconHtml: '<i class="fa-solid fa-sack-dollar"></i>', name: 'เงินเดือน (ตัวอย่าง)', amount: 25000, date: new Date().toISOString() }
        ],
        budgets: [
            { id: 'food', label: 'อาหาร', icon: 'fa-burger', limit: 5000, spent: 150 },
            { id: 'transport', label: 'ค่าเดินทาง', icon: 'fa-car', limit: 2000, spent: 135 },
            { id: 'utilities', label: 'ค่าน้ำ/ค่าไฟ', icon: 'fa-faucet-drip', limit: 3000, spent: 555 },
            { id: 'shopping', label: 'ช้อปปิ้ง', icon: 'fa-bag-shopping', limit: 4000, spent: 0 },
            { id: 'others', label: 'อื่นๆ', icon: 'fa-list-ul', limit: 6000, spent: 0 }
        ]
    }
};

// ฟังก์ชันช่วยดึงข้อมูล (ถ้าล็อกอินใช้ข้อมูล User / ถ้ายังไม่ล็อกอินใช้ข้อมูล Guest)
function getCurrentUserOrGuest() {
    const user = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    return user || GUEST_DATA;
}

// อัปเดตฟังก์ชัน loadGuestData ให้เรียกใช้ GUEST_DATA
function loadGuestData() {
    loadUserData(GUEST_DATA);
}

// ตรวจสอบว่าเข้าสู่ระบบหรือยัง หากยังไม่เข้าจะแจ้งเตือนและพาไปหน้า Auth
function requireAuth(actionName = 'ใช้งานฟังก์ชันนี้') {
    const currentUser = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!currentUser || !currentUser.email) {
        showToast(`กรุณาเข้าสู่ระบบก่อน${actionName}`, 'error');
        navigateTo('screen-auth');
        return false;
    }
    return true;
}

// โหลดข้อมูลตัวอย่างสำหรับผู้เยี่ยมชม (Guest)
function loadGuestData() {
    const guestUser = {
        name: 'ผู้เยี่ยมชม (กดเพื่อเข้าสู่ระบบ)',
        finance: {
            balance: 124160,
            expenseToday: 840,
            incomeMonth: 25000,
            expenseMonth: 840,
            transactions: [
                { id: 1, type: 'expense', category: 'อาหาร', iconHtml: '<i class="fa-solid fa-burger"></i>', name: 'อาหาร (ตัวอย่าง)', amount: 150, date: new Date().toISOString() },
                { id: 2, type: 'expense', category: 'ค่าเดินทาง', iconHtml: '<i class="fa-solid fa-car"></i>', name: 'ค่าเดินทาง (ตัวอย่าง)', amount: 135, date: new Date().toISOString() },
                { id: 3, type: 'expense', category: 'ค่าน้ำ/ค่าไฟ', iconHtml: '<i class="fa-solid fa-faucet-drip"></i>', name: 'ค่าน้ำ/ค่าไฟ (ตัวอย่าง)', amount: 555, date: new Date().toISOString() },
                { id: 4, type: 'income', category: 'เงินเดือน', iconHtml: '<i class="fa-solid fa-sack-dollar"></i>', name: 'เงินเดือน (ตัวอย่าง)', amount: 25000, date: new Date().toISOString() }
            ],
            budgets: [
                { id: 'food', label: 'อาหาร', icon: 'fa-burger', limit: 5000, spent: 150 },
                { id: 'transport', label: 'ค่าเดินทาง', icon: 'fa-car', limit: 2000, spent: 135 },
                { id: 'utilities', label: 'ค่าน้ำ/ค่าไฟ', icon: 'fa-faucet-drip', limit: 3000, spent: 555 },
                { id: 'shopping', label: 'ช้อปปิ้ง', icon: 'fa-bag-shopping', limit: 4000, spent: 0 },
                { id: 'others', label: 'อื่นๆ', icon: 'fa-list-ul', limit: 6000, spent: 0 }
            ]
        }
    };
    loadUserData(guestUser);
}

// จัดการการคลิกโปรไฟล์/ตั้งค่าของผู้เยี่ยมชม
function handleProfileClick() {
    const currentUser = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!currentUser || !currentUser.email) {
        navigateTo('screen-auth');
    } else {
        openSettingsModal();
    }
}

// ตัวจัดการปุ่มกดเพิ่ม/แก้ไขรายการสำหรับ Guest
function handleAddTxClick() {
    if (requireAuth('เพิ่มรายการธุรกรรม')) {
        openModal('modal-add');
    }
}

function handleEditBudgetClick() {
    if (requireAuth('แก้ไขงบประมาณ')) {
        openModal('modal-budget');
    }
}

// Navigation logic
function navigateTo(screenId, navItemElement = null) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));

    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
    }

    const bottomNav = document.getElementById('bottom-nav');
    if (bottomNav) {
        // 🟢 เพิ่ม screen-pin-unlock ไม่ให้แสดงแถบเมนูด้านล่างเมื่อติดหน้า PIN
        if (screenId === 'screen-auth' || screenId === 'screen-pin-unlock') {
            bottomNav.style.display = 'none';
        } else {
            bottomNav.style.display = 'flex';
            if (navItemElement) {
                document.querySelectorAll('#bottom-nav .nav-item').forEach(item => item.classList.remove('active'));
                navItemElement.classList.add('active');
            } else {
                updateNavActiveState(screenId);
            }
        }
    }

    if (screenId === 'screen-transactions' && typeof renderTransactionList === 'function') {
        renderTransactionList();
    }
    if (screenId === 'screen-reports' && typeof renderReportData === 'function') {
        renderReportData();
    }
}

function updateNavActiveState(screenId) {
    const navItems = document.querySelectorAll('#bottom-nav .nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        const onClickAttr = item.getAttribute('onclick');
        if (onClickAttr && onClickAttr.includes(screenId)) {
            item.classList.add('active');
        }
    });
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');
    const tabs = document.querySelectorAll('.auth-tab');

    tabs.forEach(t => t.classList.remove('active'));

    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        tabs[0].classList.add('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        tabs[1].classList.add('active');
    }
}

function showToast(msg, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    toast.innerHTML = `<i class="fa-solid ${iconClass} toast-icon"></i> <span>${msg}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-hiding');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3000);
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

function togglePassword(inputId, icon) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateRealTimeDate();
    checkPinLockOnStart();

    // 1. ปุ่มสลับประเภท รายรับ/รายจ่าย ใน Modal บันทึกรายการ
    const segmentBtns = document.querySelectorAll('.tx-type-btn');
    segmentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            segmentBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // 2. ปุ่มเลือกหมวดหมู่ ใน Modal บันทึกรายการ
    const catItems = document.querySelectorAll('.cat-grid .cat-item');
    catItems.forEach(item => {
        item.addEventListener('click', () => {
            const siblings = item.parentElement.querySelectorAll('.cat-item');
            siblings.forEach(s => s.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // 3. ปุ่มกรอง ทั้งหมด / รายรับ / รายจ่าย ในหน้ารายการ (แก้ไขจุดนี้)
    const txFilterTags = document.querySelectorAll('#screen-transactions .filter-tab');
    txFilterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            txFilterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            renderTransactionList(); // สั่งให้แสดงผลรายการใหม่ตามฟิลเตอร์
        });
    });

    // 4. ช่องค้นหารายการธุรกรรม
    const searchInput = document.querySelector('#screen-transactions .search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderTransactionList();
        });
    }

    // 5. เตรียมข้อมูลการเข้าใช้งาน (User หรือ Guest)
    if (!localStorage.getItem('smart_finance_users')) {
        localStorage.setItem('smart_finance_users', JSON.stringify([]));
    }

    const currentUserSaved = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (currentUserSaved && currentUserSaved.email) {
        const users = JSON.parse(localStorage.getItem('smart_finance_users')) || [];
        const latestUser = users.find(u => u.email === currentUserSaved.email) || currentUserSaved;
        localStorage.setItem('smart_finance_currentUser', JSON.stringify(latestUser));
        loadUserData(latestUser);
    } else {
        // หากยังไม่ล็อกอิน ให้โหลดข้อมูล Guest และพาไปหน้าหลัก
        loadGuestData();
    }

    const isLocked = checkPinLockOnStart();
    if (!isLocked) {
        navigateTo('screen-home');
    }
});

function handleLogin() {
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');
    if (!emailInput || !passInput) return;

    const email = emailInput.value.trim().toLowerCase();
    const password = passInput.value;

    if (!email || !password) {
        showToast('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('smart_finance_users')) || [];
    const user = users.find(u => u.email === email);

    if (!user || user.password !== password) {
        showToast('อีเมลหรือรหัสผ่านไม่ถูกต้อง', 'error');
        return;
    }

    localStorage.setItem('smart_finance_currentUser', JSON.stringify(user));
    emailInput.value = '';
    passInput.value = '';

    showToast('เข้าสู่ระบบสำเร็จ');
    loadUserData(user);
    restoreUserPrefs(user);
    navigateTo('screen-home');
}

function handleRegister() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;

    // เพิ่มการดึงค่าจากฟิลด์ใหม่
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const terms = document.getElementById('reg-terms').checked;

    // เช็คว่ากรอกข้อมูลครบหรือไม่
    if (!name || !email || !password || !confirmPassword) {
        showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
        return;
    }

    // เช็คความยาวรหัสผ่าน
    if (password.length < 6) {
        showToast('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', 'error');
        return;
    }

    // เช็คว่ารหัสผ่านตรงกันหรือไม่
    if (password !== confirmPassword) {
        showToast('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน', 'error');
        return;
    }

    // เช็คว่ากดยอมรับเงื่อนไขหรือไม่
    if (!terms) {
        showToast('กรุณายอมรับข้อตกลงการใช้งานและนโยบายความเป็นส่วนตัว', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('smart_finance_users')) || [];
    if (users.find(u => u.email === email)) {
        showToast('อีเมลนี้ถูกใช้งานแล้ว กรุณาเข้าสู่ระบบ', 'error');
        return;
    }

    const newUser = {
        name, email, password,
        finance: {
            balance: 0, expenseToday: 0, incomeMonth: 0, expenseMonth: 0, transactions: [],
            budgets: [
                { id: 'food', label: 'อาหาร', icon: 'fa-burger', limit: 5000, spent: 0 },
                { id: 'transport', label: 'ค่าเดินทาง', icon: 'fa-car', limit: 2000, spent: 0 },
                { id: 'utilities', label: 'ค่าน้ำ/ค่าไฟ', icon: 'fa-faucet-drip', limit: 3000, spent: 0 },
                { id: 'shopping', label: 'ช้อปปิ้ง', icon: 'fa-bag-shopping', limit: 4000, spent: 0 },
                { id: 'others', label: 'อื่นๆ', icon: 'fa-list-ul', limit: 6000, spent: 0 }
            ]
        }
    };

    users.push(newUser);
    localStorage.setItem('smart_finance_users', JSON.stringify(users));
    localStorage.setItem('smart_finance_currentUser', JSON.stringify(newUser));
    showToast('สมัครสมาชิกสำเร็จ!');

    // เคลียร์ค่าฟอร์มทั้งหมดหลังสมัครเสร็จ
    document.getElementById('reg-name').value = '';
    document.getElementById('reg-email').value = '';
    document.getElementById('reg-password').value = '';
    document.getElementById('reg-confirm-password').value = '';
    document.getElementById('reg-terms').checked = false;

    loadUserData(newUser);
    restoreUserPrefs(newUser);
    navigateTo('screen-home');
}

function handleLogout() {
    localStorage.removeItem('smart_finance_currentUser');
    closeModal('modal-profile');
    navigateTo('screen-auth');
    showToast('ออกจากระบบสำเร็จ');
}

// ฟังก์ชันจัดรูปแบบวันที่ให้แสดงเป็น วัน เดือน ปี (เช่น 27 ก.ย. 69)
function formatTxDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const thaiMonthsShort = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const dateNum = d.getDate();
    const monthStr = thaiMonthsShort[d.getMonth()];
    const yearShort = (d.getFullYear() + 543).toString().slice(-2);
    return `${dateNum} ${monthStr} ${yearShort}`;
}

function formatMoney(amount) {
    return Number(amount).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ฿';
}

function updateUserName(name) {
    document.querySelectorAll('.user-name-display').forEach(el => el.textContent = name);
    const settingNameInput = document.getElementById('settings-name');
    if (settingNameInput) settingNameInput.value = name;
}

function loadUserData(user) {
    updateUserName(user.name);

    if (!user.finance) user.finance = { balance: 0, expenseToday: 0, incomeMonth: 0, expenseMonth: 0, transactions: [], budgets: [] };
    const f = user.finance;

    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();
    const curDate = now.getDate();

    let expToday = 0; let incMonth = 0; let expMonth = 0;

    f.transactions.forEach(tx => {
        const d = new Date(tx.date);
        if (d.getMonth() === curMonth && d.getFullYear() === curYear) {
            if (tx.type === 'income') incMonth += Number(tx.amount);
            else {
                expMonth += Number(tx.amount);
                if (d.getDate() === curDate) expToday += Number(tx.amount);
            }
        }
    });

    f.expenseToday = expToday; f.incomeMonth = incMonth; f.expenseMonth = expMonth;

    const balanceAmount = document.querySelector('.balance-amount');
    if (balanceAmount) {
        const prefs = JSON.parse(localStorage.getItem('smart_finance_prefs_' + (user.email || ''))) || {};
        if (prefs.hideBalance) {
            balanceAmount.textContent = '••••••';
        } else {
            balanceAmount.textContent = formatMoney(f.balance);
        }
    }
    const todayExpVal = document.querySelector('.today-expense .val');
    if (todayExpVal) todayExpVal.textContent = formatMoney(f.expenseToday);

    const txItemsHome = document.querySelectorAll('#home-tx-list .tx-item');
    txItemsHome.forEach(el => el.remove());
    const homeTxList = document.getElementById('home-tx-list');

    if (!f.transactions || f.transactions.length === 0) {
        if (homeTxList) homeTxList.innerHTML = `<div class="tx-item" style="justify-content:center;"><span class="text-muted">ไม่มีรายการล่าสุด</span></div>`;
    } else {
        let homeHTML = '';
        f.transactions.slice(0, 4).forEach(tx => {
            const amountClass = tx.type === 'income' ? 'income' : 'expense';
            const sign = tx.type === 'income' ? '+' : '-';
            homeHTML += `
            <div class="tx-item">
                <div class="tx-left">
                    <div class="tx-icon">${tx.iconHtml}</div>
                    <div>
                        <span class="tx-title" style="display:block;">${tx.name}</span>
                        <span class="body3 text-muted">${tx.category}</span>
                    </div>
                </div>
                <span class="tx-amount ${amountClass}">${sign}${formatMoney(tx.amount)}</span>
            </div>`;
        });
        if (homeTxList) homeTxList.innerHTML = homeHTML;
    }

    renderBudgets(f);
    if (typeof renderTransactionList === 'function') renderTransactionList();
    if (typeof renderReportData === 'function') renderReportData();
    if (typeof restoreUserPrefs === 'function') restoreUserPrefs(user);

    if (!f.transactions || f.transactions.length === 0) {
        if (homeTxList) homeTxList.innerHTML = `<div class="tx-item" style="justify-content:center;"><span class="text-muted">ไม่มีรายการล่าสุด</span></div>`;
    } else {
        let homeHTML = '';
        f.transactions.slice(0, 4).forEach(tx => {
            const amountClass = tx.type === 'income' ? 'income' : 'expense';
            const sign = tx.type === 'income' ? '+' : '-';
            homeHTML += `
            <div class="tx-item">
                <div class="tx-left">
                    <div class="tx-icon">${tx.iconHtml}</div>
                    <div>
                        <span class="tx-title" style="display:block;">${tx.name}</span>
                        <!-- เพิ่มวันที่ต่อท้ายหมวดหมู่ตรงนี้ -->
                        <span class="body3 text-muted">${tx.category} • ${formatTxDate(tx.date)}</span>
                    </div>
                </div>
                <span class="tx-amount ${amountClass}">${sign}${formatMoney(tx.amount)}</span>
            </div>`;
        });
        if (homeTxList) homeTxList.innerHTML = homeHTML;
    }
}

function renderBudgets(finance) {
    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();

    finance.budgets.forEach(b => b.spent = 0);
    finance.transactions.forEach(tx => {
        const d = new Date(tx.date);
        if (tx.type === 'expense' && d.getMonth() === curMonth && d.getFullYear() === curYear) {
            let budgetId = 'others';
            if (tx.category.includes('อาหาร')) budgetId = 'food';
            else if (tx.category.includes('เดินทาง')) budgetId = 'transport';
            else if (tx.category.includes('น้ำ') || tx.category.includes('ไฟ')) budgetId = 'utilities';
            else if (tx.category.includes('ช้อปปิ้ง')) budgetId = 'shopping';
            const b = finance.budgets.find(item => item.id === budgetId);
            if (b) b.spent += Number(tx.amount);
        }
    });

    let totalSpent = 0, totalLimit = 0;
    finance.budgets.forEach(b => { totalSpent += Number(b.spent); totalLimit += Number(b.limit); });
    let overallPercent = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;
    if (overallPercent > 100) overallPercent = 100;

    const budgetSummary = document.querySelector('.budget-summary');
    if (budgetSummary) {
        budgetSummary.innerHTML = `
            <div class="flex justify-between items-center mb-1">
                <span class="body2">การใช้งานเฉลี่ยรวมเดือนนี้</span>
                <span class="body1">${overallPercent.toFixed(1)}%</span>
            </div>
            <div class="progress-bg mb-1"><div class="progress-fill" style="width: ${overallPercent}%;"></div></div>
            <div class="flex justify-between text-muted body3">
                <span>จ่ายจริง: ${formatMoney(totalSpent)}</span>
                <span>เป้าหมายรวม: ${formatMoney(totalLimit)}</span>
            </div>
        `;
    }

    const budgetList = document.querySelector('.budget-list');
    if (budgetList) {
        let catsHTML = '';
        finance.budgets.forEach(b => {
            let p = b.limit > 0 ? (b.spent / b.limit) * 100 : 0;
            let barP = p > 100 ? 100 : p;
            catsHTML += `
                <div class="budget-item">
                    <div class="budget-item-header">
                        <span class="flex items-center gap-2"><i class="fa-solid ${b.icon}"></i> ${b.label}</span>
                        <span class="text-muted" style="text-align: right;">${Number(b.spent).toLocaleString()} / ${Number(b.limit).toLocaleString()} ฿<br>${p.toFixed(0)}%</span>
                    </div>
                    <div class="progress-bg"><div class="progress-fill" style="width: ${barP}%;"></div></div>
                </div>
            `;
        });
        budgetList.innerHTML = catsHTML;
    }

    const modalInputs = document.querySelectorAll('#modal-budget input[type="number"]');
    if (modalInputs.length >= 5) {
        finance.budgets.forEach((b, i) => { if (modalInputs[i]) modalInputs[i].value = b.limit; });
    }
}

function saveBudgetSettings() {
    const currentUser = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!currentUser || !currentUser.finance) return;

    const modalInputs = document.querySelectorAll('#modal-budget input[type="number"]');
    currentUser.finance.budgets.forEach((b, i) => {
        if (modalInputs[i]) {
            const val = parseFloat(modalInputs[i].value);
            b.limit = isNaN(val) ? 0 : val;
        }
    });

    localStorage.setItem('smart_finance_currentUser', JSON.stringify(currentUser));
    updateUsersArray(currentUser);
    closeModal('modal-budget');
    loadUserData(currentUser);
    showToast('อัปเดตเป้าหมายงบประมาณสำเร็จ');
}

function updateUsersArray(user) {
    const users = JSON.parse(localStorage.getItem('smart_finance_users')) || [];
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
        users[userIndex] = user;
        localStorage.setItem('smart_finance_users', JSON.stringify(users));
    }
}

function saveProfile() {
    const newName = document.getElementById('settings-name').value.trim();
    const balanceInput = document.getElementById('settings-initial-balance');
    const newBalance = balanceInput ? parseFloat(balanceInput.value) : null;

    if (!newName) {
        showToast('กรุณาระบุชื่อแสดงผล', 'error');
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (currentUser) {
        currentUser.name = newName;
        if (newBalance !== null && !isNaN(newBalance)) {
            if (!currentUser.finance) currentUser.finance = {};
            currentUser.finance.balance = newBalance;
        }
        updateUsersArray(currentUser);
        localStorage.setItem('smart_finance_currentUser', JSON.stringify(currentUser));
        loadUserData(currentUser);
    }
    showToast('บันทึกข้อมูลโปรไฟล์สำเร็จ ✓');
}

// ---- Load all settings data into modal when opened ----
function openSettingsModal() {
    const user = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!user) return;

    const nameInput = document.getElementById('settings-name');
    const emailRo = document.getElementById('settings-email-ro');
    const emailDisp = document.getElementById('settings-email-display');
    const balInput = document.getElementById('settings-initial-balance');

    if (nameInput) nameInput.value = user.name || '';
    if (emailRo) emailRo.value = user.email || '';
    if (emailDisp) emailDisp.textContent = user.email || '';
    if (balInput && user.finance) balInput.value = user.finance.balance || 0;

    // Load saved toggle states
    const prefs = JSON.parse(localStorage.getItem('smart_finance_prefs_' + (user.email || ''))) || {};

    const setToggle = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.checked = !!val;
    };
    setToggle('toggle-auto-calc', prefs.autoCalc !== false);
    setToggle('toggle-daily-alert', !!prefs.dailyAlert);
    setToggle('toggle-budget-warn', prefs.budgetWarn !== false);
    setToggle('toggle-dark-mode', !!prefs.darkMode);
    setToggle('toggle-hide-balance', !!prefs.hideBalance);

    // 🟢 เพิ่มบรรทัดนี้ เพื่อให้ปุ่มสวิตช์แสดงสถานะ เปิด/ปิด ตามจริง
    setToggle('toggle-app-lock', !!prefs.appLock);

    openModal('modal-profile');
}

// ---- Save a toggle preference ----
function saveToggleSetting(key, value) {
    const user = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!user) return;
    const prefKey = 'smart_finance_prefs_' + (user.email || '');
    const prefs = JSON.parse(localStorage.getItem(prefKey)) || {};
    prefs[key] = value;
    localStorage.setItem(prefKey, JSON.stringify(prefs));
}

// ---- Dark Mode ----
function toggleDarkMode(enabled) {
    document.body.classList.toggle('dark-mode', enabled);
    saveToggleSetting('darkMode', enabled);
    // Sync the toggle checkbox if visible
    const toggleEl = document.getElementById('toggle-dark-mode');
    if (toggleEl) toggleEl.checked = enabled;
    showToast(enabled ? 'เปิด Dark Mode แล้ว 🌙' : 'ปิด Dark Mode แล้ว ☀️');
}

// ---- Hide Balance ----
function toggleHideBalance(enabled) {
    saveToggleSetting('hideBalance', enabled);
    const currentUser = getCurrentUserOrGuest();
    if (currentUser) {
        loadUserData(currentUser); // อัปเดตการแสดงผลยอดเงินทันทีที่กดสวิตช์
    }
    showToast(enabled ? 'ซ่อนยอดเงินแล้ว 🔒' : 'แสดงยอดเงินแล้ว 👁️');
}

// ฟังก์ชันเมื่อกดสลับสวิตช์ "ซ่อนยอดเงิน"
function handleHideBalanceToggle(enabled) {
    const user = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!user || !user.email) return;

    const prefKey = 'smart_finance_prefs_' + user.email;
    const prefs = JSON.parse(localStorage.getItem(prefKey)) || {};

    prefs.hideBalance = enabled;
    localStorage.setItem(prefKey, JSON.stringify(prefs));

    // เรียกอัปเดตการแสดงผลยอดเงินทันที
    updateBalanceDisplay();
}

// ฟังก์ชันอัปเดตการแสดงผลยอดเงิน (แสดงตัวเลข หรือ ซ่อนด้วย ••••••)
function updateBalanceDisplay() {
    const user = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!user || !user.email) return;

    const prefKey = 'smart_finance_prefs_' + user.email;
    const prefs = JSON.parse(localStorage.getItem(prefKey)) || {};
    const isHidden = prefs.hideBalance || false;

    // ค้นหา Element แสดงยอดเงินคงเหลือบนหน้าหลัก (แก้ id ให้ตรงกับ HTML ของคุณ)
    const balanceElement = document.getElementById('total-balance-display') || document.querySelector('.balance-amount');

    if (balanceElement) {
        if (isHidden) {
            balanceElement.textContent = '••••••';
        } else {
            // คำนวณหรือดึงยอดเงินจริงมาแสดง
            const currentBalance = calculateCurrentBalance(); // แทนด้วยฟังก์ชันคำนวณเงินของคุณ
            balanceElement.innerHTML = `${currentBalance.toLocaleString('th-TH', { minimumFractionDigits: 2 })} <span class="currency">฿</span>`;
        }
    }
}

// ---- Change Password ----
function openChangePasswordModal() {
    closeModal('modal-profile');
    document.getElementById('cp-current').value = '';
    document.getElementById('cp-new').value = '';
    document.getElementById('cp-confirm').value = '';
    openModal('modal-change-password');
}

function handleChangePassword() {
    const current = document.getElementById('cp-current').value;
    const newPw = document.getElementById('cp-new').value;
    const confirm = document.getElementById('cp-confirm').value;

    if (!current || !newPw || !confirm) {
        showToast('กรุณากรอกข้อมูลให้ครบ', 'error'); return;
    }
    if (newPw.length < 6) {
        showToast('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร', 'error'); return;
    }
    if (newPw !== confirm) {
        showToast('รหัสผ่านยืนยันไม่ตรงกัน', 'error'); return;
    }

    const currentUser = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!currentUser || currentUser.password !== current) {
        showToast('รหัสผ่านปัจจุบันไม่ถูกต้อง', 'error'); return;
    }

    currentUser.password = newPw;
    updateUsersArray(currentUser);
    localStorage.setItem('smart_finance_currentUser', JSON.stringify(currentUser));
    closeModal('modal-change-password');
    showToast('เปลี่ยนรหัสผ่านสำเร็จ ✓');
}

// ---- Export CSV ----
function exportTransactionsCSV() {
    const user = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!user || !user.finance || !user.finance.transactions || user.finance.transactions.length === 0) {
        showToast('ไม่มีรายการที่จะ Export', 'error'); return;
    }

    const headers = ['วันที่', 'ประเภท', 'หมวดหมู่', 'ชื่อรายการ', 'จำนวนเงิน (฿)'];
    const rows = user.finance.transactions.map(tx => [
        new Date(tx.date).toLocaleDateString('th-TH'),
        tx.type === 'income' ? 'รายรับ' : 'รายจ่าย',
        tx.category || '',
        tx.name || '',
        Number(tx.amount).toFixed(2)
    ]);

    const csvContent = '\uFEFF' + [headers, ...rows]
        .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-finance-${user.name || 'export'}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Export CSV สำเร็จ ✓');
}

// ---- Clear All Data ----
function confirmClearData() {
    openModal('modal-clear-confirm');
}

function executeClearData() {
    const currentUser = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (currentUser && currentUser.finance) {
        currentUser.finance.transactions = [];
        currentUser.finance.balance = 0;
        currentUser.finance.expenseToday = 0;
        currentUser.finance.incomeMonth = 0;
        currentUser.finance.expenseMonth = 0;
        currentUser.finance.budgets.forEach(b => b.spent = 0);
        updateUsersArray(currentUser);
        localStorage.setItem('smart_finance_currentUser', JSON.stringify(currentUser));
        loadUserData(currentUser);
    }
    closeModal('modal-clear-confirm');
    closeModal('modal-profile');
    showToast('ล้างรายการธุรกรรมทั้งหมดแล้ว');
}

// ---- Settings & Profile helpers ----
function openBudgetModalFromSettings() {
    closeModal('modal-profile');
    openModal('modal-budget');
}

function handleSwitchAccount() {
    localStorage.removeItem('smart_finance_currentUser');
    closeModal('modal-profile');
    navigateTo('screen-auth');
    showToast('สลับบัญชีเรียบร้อย');
}

// ---- Restore preferences on login ----
function restoreUserPrefs(user) {
    const prefs = JSON.parse(localStorage.getItem('smart_finance_prefs_' + (user.email || ''))) || {};
    // Apply dark mode
    document.body.classList.toggle('dark-mode', !!prefs.darkMode);
    const toggleEl = document.getElementById('toggle-dark-mode');
    if (toggleEl) toggleEl.checked = !!prefs.darkMode;

    // ซิงค์ปุ่มสวิตช์เปิด/ปิด ให้เปิดค้างไว้ตามจริง
    const hideToggle = document.getElementById('toggle-hide-balance');
    if (hideToggle) hideToggle.checked = !!prefs.hideBalance;
}

function updateRealTimeDate() {
    const today = new Date();
    const thaiMonthsShort = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];


    const d = today.getDate();
    const m = today.getMonth();
    const yShort = (today.getFullYear() + 543).toString().slice(-2);

    const fullStr = `${d} ${document.getElementById('report-date-label') ? document.getElementById('report-date-label').textContent.split(' ')[0] || thaiMonthsShort[m] : thaiMonthsShort[m]} ${yShort}`; // rough logic for string

    document.querySelectorAll('.body3[style*="margin-left: 24px"]').forEach(el => el.textContent = `${d} ${thaiMonthsShort[m]} ${yShort}`); // Using short month for simplicity like image 1 "2 ก.ค. 69"

    const dateBadges = document.querySelectorAll('.date-badge');
    dateBadges.forEach(b => {
        if (!b.textContent.includes('รายการ') && !b.textContent.includes('2569')) {
            b.textContent = `${thaiMonthsShort[m]} ${yShort}`;
        }
    });
}

function switchTxType(type, element) {
    const btns = document.querySelectorAll('.tx-type-btn');
    btns.forEach(b => b.classList.remove('active'));
    element.classList.add('active');

    const expenseGrid = document.getElementById('cat-grid-expense');
    const incomeGrid = document.getElementById('cat-grid-income');

    if (type === 'expense') {
        if (expenseGrid) expenseGrid.style.display = 'grid';
        if (incomeGrid) incomeGrid.style.display = 'none';
    } else {
        if (expenseGrid) expenseGrid.style.display = 'none';
        if (incomeGrid) incomeGrid.style.display = 'grid';
    }
}

function saveNewTransaction() {
    const typeBtn = document.querySelector('.tx-type-btn.active');
    const type = typeBtn.textContent.trim() === 'รายรับ' ? 'income' : 'expense';

    const activeGrid = type === 'income' ? document.getElementById('cat-grid-income') : document.getElementById('cat-grid-expense');
    const catBtn = activeGrid ? activeGrid.querySelector('.cat-item.active') : null;
    const catIconHtml = catBtn ? catBtn.querySelector('i').outerHTML : '<i class="fa-solid fa-list-ul"></i>';
    const catName = catBtn ? catBtn.textContent.trim() : 'อื่นๆ';

    const nameInput = document.querySelector('#modal-add .input-flat[type="text"]');
    const amountInput = document.querySelector('#modal-add .input-flat[type="number"]');

    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value);

    if (!name) {
        showToast('กรุณาระบุชื่อรายการ', 'error');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        showToast('กรุณาระบุจำนวนเงินที่มากกว่า 0', 'error');
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!currentUser) return;
    const f = currentUser.finance;

    const newTx = {
        id: Date.now(), type, category: catName, iconHtml: catIconHtml, name, amount, date: new Date().toISOString()
    };

    if (type === 'income') f.balance += amount; else f.balance -= amount;
    f.transactions.unshift(newTx);

    updateUsersArray(currentUser);
    localStorage.setItem('smart_finance_currentUser', JSON.stringify(currentUser));

    nameInput.value = ''; amountInput.value = '0.00';
    closeModal('modal-add');
    loadUserData(currentUser);
    showToast('บันทึกรายการสำเร็จ');
}

let transactionToDelete = null;

function deleteTransaction(id) {
    if (!requireAuth('ลบรายการ')) return;
    transactionToDelete = id;
    openModal('modal-confirm-delete');
}

function confirmDelete() {
    if (transactionToDelete === null) return;
    const id = transactionToDelete;

    const currentUser = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!currentUser) {
        closeModal('modal-confirm-delete');
        return;
    }
    const f = currentUser.finance;

    const txIndex = f.transactions.findIndex(t => t.id === id);
    if (txIndex === -1) {
        closeModal('modal-confirm-delete');
        return;
    }
    const tx = f.transactions[txIndex];

    if (tx.type === 'income') f.balance -= tx.amount; else f.balance += tx.amount;
    f.transactions.splice(txIndex, 1);

    updateUsersArray(currentUser);
    localStorage.setItem('smart_finance_currentUser', JSON.stringify(currentUser));
    loadUserData(currentUser);
    closeModal('modal-confirm-delete');
    showToast('ลบรายการสำเร็จ');
    transactionToDelete = null;
}

function renderTransactionList() {
    // ดึงข้อมูล User หรือ Guest แทนการอ่านเฉพาะ localStorage
    const currentUser = getCurrentUserOrGuest();
    if (!currentUser || !currentUser.finance) return;

    const activeFilterTag = document.querySelector('#screen-transactions .filter-tab.active');
    const filterType = activeFilterTag ? activeFilterTag.textContent.trim() : 'ทั้งหมด';
    const searchInput = document.querySelector('#screen-transactions .search-bar input');
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';

    const filteredTx = currentUser.finance.transactions.filter(tx => {
        let matchType = filterType === 'รายรับ' ? tx.type === 'income' : (filterType === 'รายจ่าย' ? tx.type === 'expense' : true);
        let matchSearch = keyword ? (tx.name.toLowerCase().includes(keyword) || tx.category.toLowerCase().includes(keyword)) : true;
        return matchType && matchSearch;
    });

    const txBadge = document.querySelector('#screen-transactions .date-badge');
    if (txBadge) txBadge.textContent = `${filteredTx.length} รายการ`;

    const listContainer = document.querySelector('#screen-transactions .tx-list');
    if (!listContainer) return;

    if (filteredTx.length === 0) {
        listContainer.innerHTML = `<div class="tx-item" style="justify-content:center;"><span class="text-muted">ไม่พบรายการ</span></div>`;
    } else {
        listContainer.innerHTML = filteredTx.map(tx => {
            const amountClass = tx.type === 'income' ? 'income' : 'expense';
            const sign = tx.type === 'income' ? '+' : '-';
            return `
            <div class="tx-item">
                <div class="tx-left">
                    <div class="tx-icon">${tx.iconHtml}</div>
                    <div>
                        <span class="tx-title" style="display:block;">${tx.name}</span>
                        <span class="body3 text-muted">${tx.category}</span>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="tx-amount ${amountClass}">${sign}${formatMoney(tx.amount)}</span>
                    <button class="tx-delete" onclick="deleteTransaction(${tx.id})"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>`;
        }).join('');
    }

    if (filteredTx.length === 0) {
        listContainer.innerHTML = `<div class="tx-item" style="justify-content:center;"><span class="text-muted">ไม่พบรายการ</span></div>`;
    } else {
        listContainer.innerHTML = filteredTx.map(tx => {
            const amountClass = tx.type === 'income' ? 'income' : 'expense';
            const sign = tx.type === 'income' ? '+' : '-';
            return `
            <div class="tx-item">
                <div class="tx-left">
                    <div class="tx-icon">${tx.iconHtml}</div>
                    <div>
                        <span class="tx-title" style="display:block;">${tx.name}</span>
                        <!-- เพิ่มวันที่ต่อท้ายหมวดหมู่ตรงนี้ -->
                        <span class="body3 text-muted">${tx.category} • ${formatTxDate(tx.date)}</span>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="tx-amount ${amountClass}">${sign}${formatMoney(tx.amount)}</span>
                    <button class="tx-delete" onclick="deleteTransaction(${tx.id})"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>`;
        }).join('');
    }
}

let currentReportMonth = new Date().getMonth();
let currentReportYear = new Date().getFullYear();

function selectReportMonth(element, labelStr) {
    const selector = document.getElementById('report-month-selector');
    if (selector) {
        selector.querySelectorAll('.month-pill').forEach(pill => pill.classList.remove('active'));
    }
    element.classList.add('active');

    const displayLabel = document.getElementById('selected-report-month');
    if (displayLabel) displayLabel.textContent = labelStr;

    const thaiMonthsShort = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const parts = labelStr.split(' ');
    const mIndex = thaiMonthsShort.indexOf(parts[0]);
    if (mIndex !== -1) {
        currentReportMonth = mIndex;
    }

    renderReportData();
}

function renderReportData() {
    const currentUser = getCurrentUserOrGuest();
    if (!currentUser || !currentUser.finance) return;

    const selectedMonth = currentReportMonth;
    const selectedYear = currentReportYear;

    const thaiMonthsShort = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const thaiMonthsFull = [
        "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const thaiYearShort = (selectedYear + 543).toString().slice(-2);
    const thaiYearFull = selectedYear + 543;

    // 1. อัปเดตข้อความป้ายแสดงเดือนด้านบนขวา (เช่น ก.ย. 69)
    const displayLabel = document.getElementById('selected-report-month');
    if (displayLabel) {
        displayLabel.textContent = `${thaiMonthsShort[selectedMonth]} ${thaiYearShort}`;
    }

    // 2. อัปเดตปุ่มแท็บเลือกเดือน (Active Pill) ให้ตรงกับเดือนปัจจุบัน
    const selector = document.getElementById('report-month-selector');
    if (selector) {
        const pills = selector.querySelectorAll('.month-pill');
        pills.forEach((pill, idx) => {
            if (idx === selectedMonth) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });
    }

    // 3. อัปเดตป้ายชื่อเดือนเต็มในการ์ดกราฟโดนัท (เช่น กันยายน 2569)
    const donutBadge = document.querySelector('.donut-card .date-badge');
    if (donutBadge) {
        donutBadge.textContent = `${thaiMonthsFull[selectedMonth]} ${thaiYearFull}`;
    }

    const monthTx = currentUser.finance.transactions.filter(tx => {
        const d = new Date(tx.date);
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });

    let totalInc = 0, totalExp = 0;
    const catTotals = { 'อาหาร': 0, 'ค่าเดินทาง': 0, 'ค่าน้ำ/ค่าไฟ': 0, 'ช้อปปิ้ง': 0, 'อื่นๆ': 0 };

    monthTx.forEach(tx => {
        if (tx.type === 'income') totalInc += tx.amount;
        else {
            totalExp += tx.amount;
            if (tx.category.includes('อาหาร')) catTotals['อาหาร'] += tx.amount;
            else if (tx.category.includes('เดินทาง')) catTotals['ค่าเดินทาง'] += tx.amount;
            else if (tx.category.includes('น้ำ') || tx.category.includes('ไฟ')) catTotals['ค่าน้ำ/ค่าไฟ'] += tx.amount;
            else if (tx.category.includes('ช้อปปิ้ง')) catTotals['ช้อปปิ้ง'] += tx.amount;
            else catTotals['อื่นๆ'] += tx.amount;
        }
    });

    const statCards = document.querySelectorAll('.stat-card .body1');
    if (statCards.length >= 2) {
        statCards[0].textContent = '+' + formatMoney(totalInc);
        statCards[1].textContent = '-' + formatMoney(totalExp);
    }

    const donutChart = document.querySelector('.donut-chart');
    const legendGrid = document.querySelector('.legend-grid');
    const colors = { 'อาหาร': '#FF9800', 'ค่าน้ำ/ค่าไฟ': '#00BCD4', 'ค่าเดินทาง': '#4CAF50', 'ช้อปปิ้ง': '#9C27B0', 'อื่นๆ': '#ccc' };

    if (totalExp === 0) {
        if (donutChart) donutChart.style.background = 'var(--border-color)';
        if (legendGrid) legendGrid.innerHTML = '<div class="text-muted">ไม่มีข้อมูล</div>';
    } else {
        let stops = [], curr = 0, legendHtml = '';
        for (const [cat, amt] of Object.entries(catTotals)) {
            const p = (amt / totalExp) * 100;
            if (p > 0) {
                stops.push(`${colors[cat]} ${curr}% ${curr + p}%`);
                curr += p;
            }
            legendHtml += `<div class="legend-item"><span class="flex items-center"><span class="legend-dot" style="background: ${colors[cat]};"></span> ${cat}</span> <span>${p.toFixed(1)}%</span></div>`;
        }
        if (donutChart) donutChart.style.background = `conic-gradient(${stops.join(', ')})`;
        if (legendGrid) legendGrid.innerHTML = legendHtml;
    }
}

// ---- Forgot Password Logic ----
let generatedOTP = null;
let resetUserEmail = null;

// เปิด Modal ลืมรหัสผ่าน
function openForgotPasswordModal() {
    document.getElementById('forgot-email').value = '';
    document.getElementById('forgot-otp').value = '';
    document.getElementById('forgot-new-password').value = '';
    document.getElementById('forgot-confirm-password').value = '';

    document.getElementById('forgot-step-1').style.display = 'block';
    document.getElementById('forgot-step-2').style.display = 'none';
    openModal('modal-forgot-password');
}

// ตรวจสอบอีเมลและสุ่มส่งรหัส OTP
function handleSendResetOTP() {
    const email = document.getElementById('forgot-email').value.trim().toLowerCase();
    if (!email) {
        showToast('กรุณากรอกอีเมล', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('smart_finance_users')) || [];
    const user = users.find(u => u.email === email);

    if (!user) {
        showToast('ไม่พบอีเมลนี้ในระบบ', 'error');
        return;
    }

    // สุ่มรหัส OTP 6 หลัก
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    resetUserEmail = email;

    document.getElementById('mock-otp-display').textContent = generatedOTP;
    document.getElementById('forgot-step-1').style.display = 'none';
    document.getElementById('forgot-step-2').style.display = 'block';
    showToast(`ส่งรหัส OTP ไปยังอีเมลแล้ว (OTP: ${generatedOTP})`);
}

// บันทึกรหัสผ่านใหม่ลง LocalStorage
function handleResetPassword() {
    const otp = document.getElementById('forgot-otp').value.trim();
    const newPassword = document.getElementById('forgot-new-password').value;
    const confirmPassword = document.getElementById('forgot-confirm-password').value;

    if (!otp || !newPassword || !confirmPassword) {
        showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
        return;
    }

    if (otp !== generatedOTP) {
        showToast('รหัส OTP ไม่ถูกต้อง', 'error');
        return;
    }

    if (newPassword.length < 6) {
        showToast('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน', 'error');
        return;
    }

    // อัปเดตรหัสผ่านใหม่ในบัญชีผู้ใช้
    const users = JSON.parse(localStorage.getItem('smart_finance_users')) || [];
    const userIndex = users.findIndex(u => u.email === resetUserEmail);

    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('smart_finance_users', JSON.stringify(users));

        closeModal('modal-forgot-password');
        showToast('เปลี่ยนรหัสผ่านสำเร็จ! กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่');

        // เติมอีเมลในหน้า Login ให้เพื่อความสะดวกของผู้ใช้
        document.getElementById('login-email').value = resetUserEmail;
        document.getElementById('login-password').value = '';
    } else {
        showToast('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง', 'error');
    }
}

// ============================================================
// ฟังก์ชันการทำงานเพิ่มเติมของหน้าตั้งค่า (SETTINGS EXTENSIONS)
// ============================================================

// 1. เปลี่ยนสกุลเงินหลัก
function changeCurrency(currencyCode) {
    saveToggleSetting('currency', currencyCode);
    updateCurrencySymbol(currencyCode);
    showToast(`เปลี่ยนสกุลเงินเป็น ${currencyCode} เรียบร้อยแล้ว`);
}

function updateCurrencySymbol(currencyCode) {
    const symbols = { 'THB': '฿', 'USD': '$', 'JPY': '¥', 'EUR': '€' };
    const symbol = symbols[currencyCode] || '฿';
    const symbolEl = document.getElementById('settings-currency-symbol');
    if (symbolEl) symbolEl.textContent = symbol;
}

// 2. ระบบนำเข้าข้อมูลสำรอง (Import JSON Data)
function importDataJSON() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';

    fileInput.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                const currentUser = JSON.parse(localStorage.getItem('smart_finance_currentUser'));

                if (!currentUser) {
                    showToast('กรุณาล็อกอินก่อนนำเข้าข้อมูล', 'error');
                    return;
                }

                if (Array.isArray(importedData)) {
                    currentUser.finance.transactions = importedData;
                } else if (importedData.transactions && Array.isArray(importedData.transactions)) {
                    currentUser.finance.transactions = importedData.transactions;
                    if (typeof importedData.balance === 'number') {
                        currentUser.finance.balance = importedData.balance;
                    }
                } else {
                    showToast('รูปแบบไฟล์ JSON ไม่ถูกต้อง', 'error');
                    return;
                }

                updateUsersArray(currentUser);
                localStorage.setItem('smart_finance_currentUser', JSON.stringify(currentUser));
                loadUserData(currentUser);

                showToast('นำเข้าข้อมูลธุรกรรมสำเร็จ ✓');
            } catch (err) {
                showToast('เกิดข้อผิดพลาดในการอ่านไฟล์ JSON', 'error');
            }
        };
        reader.readAsText(file);
    };

    fileInput.click();
}

// 3. เปลี่ยนรูปภาพอวตารโปรไฟล์
function triggerAvatarUpload() {
    const input = document.getElementById('settings-avatar-input');
    if (input) input.click();
}

function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const avatarIcon = document.getElementById('settings-avatar-icon');
        if (avatarIcon) {
            avatarIcon.className = '';
            avatarIcon.style.backgroundImage = `url('${e.target.result}')`;
            avatarIcon.style.backgroundSize = 'cover';
            avatarIcon.style.backgroundPosition = 'center';
            avatarIcon.style.width = '48px';
            avatarIcon.style.height = '48px';
            avatarIcon.style.borderRadius = '50%';
            avatarIcon.style.display = 'inline-block';
        }
        showToast('อัปเดตรูปโปรไฟล์สำเร็จแล้ว');
    };
    reader.readAsDataURL(file);
}

// ============================================================
// ฟังก์ชันเปิด/ปิด และสลับแท็บ ข้อตกลงและนโยบายความเป็นส่วนตัว
// ============================================================

function openTermsModal(type = 'terms') {
    switchTermsTab(type);
    openModal('modal-terms');
}

function switchTermsTab(type) {
    const btnTerms = document.getElementById('tab-btn-terms');
    const btnPrivacy = document.getElementById('tab-btn-privacy');
    const contentTerms = document.getElementById('content-terms');
    const contentPrivacy = document.getElementById('content-privacy');
    const title = document.getElementById('terms-modal-title');

    if (type === 'terms') {
        if (btnTerms) btnTerms.classList.add('active');
        if (btnPrivacy) btnPrivacy.classList.remove('active');
        if (contentTerms) contentTerms.style.display = 'block';
        if (contentPrivacy) contentPrivacy.style.display = 'none';
        if (title) title.textContent = 'ข้อตกลงการใช้งาน';
    } else {
        if (btnPrivacy) btnPrivacy.classList.add('active');
        if (btnTerms) btnTerms.classList.remove('active');
        if (contentTerms) contentTerms.style.display = 'none';
        if (contentPrivacy) contentPrivacy.style.display = 'block';
        if (title) title.textContent = 'นโยบายความเป็นส่วนตัว';
    }
}

// ============================================================
// ระบบปลดล็อคด้วย PIN และแบบฟอร์มส่งข้อเสนอแนะ
// ============================================================

// 1. จัดการการเปิด/ปิดสวิตช์ ล็อคแอปด้วย PIN
function handleAppLockToggle(enabled) {
    const user = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!user) return;

    if (enabled) {
        openModal('modal-pin-setup');
    } else {
        saveToggleSetting('appLock', false);
        localStorage.removeItem('smart_finance_pin_' + (user.email || ''));
        showToast('ยกเลิกล็อคแอปด้วย PIN เรียบร้อย');
    }
}

function cancelPinSetup() {
    closeModal('modal-pin-setup');
    const toggleEl = document.getElementById('toggle-app-lock');
    if (toggleEl) toggleEl.checked = false;
}

// 2. บันทึกรหัส PIN ใหม่
function savePinCode() {
    const p1 = document.getElementById('pin-input-1').value.trim();
    const p2 = document.getElementById('pin-input-2').value.trim();

    if (p1.length !== 4 || isNaN(p1)) {
        showToast('กรุณากรอกรหัส PIN เป็นตัวเลข 4 หลัก', 'error');
        return;
    }
    if (p1 !== p2) {
        showToast('รหัส PIN ไม่ตรงกัน กรุณากรอกใหม่', 'error');
        return;
    }

    const user = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (user) {
        localStorage.setItem('smart_finance_pin_' + (user.email || ''), p1);
        saveToggleSetting('appLock', true);
        showToast('ตั้งรหัส PIN สำเร็จแล้ว ✓');
        closeModal('modal-pin-setup');
        document.getElementById('pin-input-1').value = '';
        document.getElementById('pin-input-2').value = '';
    }
}

// 3. ตรวจสอบรหัส PIN เมื่อเข้าแอป
function checkPinLockOnStart() {
    const user = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!user || !user.email) return;

    const prefs = JSON.parse(localStorage.getItem('smart_finance_prefs_' + user.email)) || {};
    const pin = localStorage.getItem('smart_finance_pin_' + user.email);

    if (prefs.appLock && pin) {
        openModal('screen-pin-unlock');
    }
}

// 4. ตรวจสอบการป้อนรหัสเพื่อปลดล็อค
function verifyPinCode() {
    const inputPin = document.getElementById('unlock-pin-input').value.trim();
    const user = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!user) return;

    const savedPin = localStorage.getItem('smart_finance_pin_' + user.email);
    if (inputPin === savedPin) {
        closeModal('screen-pin-unlock');
        document.getElementById('unlock-pin-input').value = '';
        showToast('ปลดล็อคสำเร็จ!');
    } else {
        showToast('รหัส PIN ไม่ถูกต้อง', 'error');
    }
}

// 5. ระบบส่งข้อเสนอแนะ / แจ้งปัญหา
function openFeedbackModal() {
    closeModal('modal-profile');
    document.getElementById('feedback-text').value = '';
    openModal('modal-feedback');
}

async function submitFeedback() {
    const text = document.getElementById('feedback-text').value.trim();
    if (!text) {
        showToast('กรุณากรอกข้อความก่อนส่ง', 'error');
        return;
    }

    // 🟢 1. นำ Access Key ที่ได้จากเว็บ Web3Forms มาวางตรงนี้
    const accessKey = '23c227c3-9e80-45f1-b234-fbcc56af338f';

    // 2. ดึงข้อมูลชื่อและอีเมลของผู้ใช้ที่ล็อกอินอยู่อัตโนมัติ
    const user = JSON.parse(localStorage.getItem('smart_finance_currentUser')) || {};
    const userName = user.name || 'ผู้ใช้งานทั่วไป';
    const userEmail = user.email || 'no-email@example.com';

    showToast('กำลังส่งข้อเสนอแนะ...', 'success');

    try {
        // 3. ยิงข้อมูลส่งเข้าอีเมล
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                access_key: accessKey,
                subject: `[Smart Finance] ข้อเสนอแนะจากคุณ ${userName}`,
                from_name: userName,
                replyto: userEmail,
                message: `มีข้อเสนอแนะ/แจ้งปัญหาใหม่:\n\n"${text}"\n\n------------------------\nผู้ส่ง: ${userName}\nอีเมลติดต่อกลับ: ${userEmail}`
            })
        });

        const result = await response.json();

        if (result.success) {
            closeModal('modal-feedback');
            document.getElementById('feedback-text').value = '';
            showToast('ส่งข้อเสนอแนะเข้าอีเมลเรียบร้อยแล้ว ขอบคุณครับ!');
        } else {
            showToast('ส่งไม่สำเร็จ: ' + result.message, 'error');
        }
    } catch (error) {
        showToast('ไม่สามารถส่งข้อความได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต', 'error');
    }
}

// ---- ระบบจัดการการล็อคแอปด้วย PIN ----

// 1. ตัวจัดการสวิตช์ เปิด/ปิด ล็อคแอป
function handleAppLockToggle(enabled) {
    const user = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!user) {
        showToast('กรุณาเข้าสู่ระบบก่อนเปิดใช้งาน', 'error');
        document.getElementById('toggle-app-lock').checked = false;
        return;
    }

    const prefKey = 'smart_finance_prefs_' + (user.email || '');
    const prefs = JSON.parse(localStorage.getItem(prefKey)) || {};

    if (enabled) {
        if (!prefs.pinCode) {
            // หากยังไม่มีรหัส PIN ให้เปิด Modal ตั้งรหัส PIN
            openModal('modal-pin-setup');
            document.getElementById('toggle-app-lock').checked = false;
        } else {
            // หากมีรหัสอยู่แล้ว ให้เปิดใช้งานทันที
            prefs.appLock = true;
            localStorage.setItem(prefKey, JSON.stringify(prefs));
            showToast('เปิดใช้งานล็อคแอปด้วย PIN แล้ว 🔒');
        }
    } else {
        // ปิดการใช้งาน
        prefs.appLock = false;
        localStorage.setItem(prefKey, JSON.stringify(prefs));
        showToast('ปิดใช้งานล็อคแอปด้วย PIN แล้ว');
    }
}

// 2. ปิด Modal ตั้งรหัส PIN
function closePinModal() {
    closeModal('modal-pin-setup');
    document.getElementById('pin-input-1').value = '';
    document.getElementById('pin-input-2').value = '';
}

// 3. บันทึกรหัส PIN ใหม่
function savePinCode() {
    const pin1 = document.getElementById('pin-input-1').value.trim();
    const pin2 = document.getElementById('pin-input-2').value.trim();

    if (pin1.length !== 4 || !/^\d{4}$/.test(pin1)) {
        showToast('กรุณากรอกรหัส PIN เป็นตัวเลข 4 หลัก', 'error');
        return;
    }

    if (pin1 !== pin2) {
        showToast('รหัส PIN ทั้งสองช่องไม่ตรงกัน', 'error');
        return;
    }

    const user = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!user) return;

    const prefKey = 'smart_finance_prefs_' + (user.email || '');
    const prefs = JSON.parse(localStorage.getItem(prefKey)) || {};

    prefs.pinCode = pin1;
    prefs.appLock = true;
    localStorage.setItem(prefKey, JSON.stringify(prefs));

    // เปิดสวิตช์ในหน้าตั้งค่าให้เปิดใช้งานทันที
    const toggle = document.getElementById('toggle-app-lock');
    if (toggle) toggle.checked = true;

    closePinModal();
    showToast('ตั้งรหัส PIN และเปิดใช้งานเรียบร้อย 🔒');
}

// 4. ตรวจสอบว่าต้องล็อคแอปเมื่อเปิดหน้าเว็บหรือไม่
function checkPinLockOnStart() {
    const currentUser = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!currentUser || !currentUser.email) return;

    const prefKey = 'smart_finance_prefs_' + (currentUser.email || '');
    const prefs = JSON.parse(localStorage.getItem(prefKey)) || {};

    if (prefs.appLock && prefs.pinCode) {
        navigateTo('screen-pin-unlock');
    }
}

// 5. ปลดล็อกด้วย PIN
function unlockWithPin() {
    const inputPin = document.getElementById('pin-unlock-input').value.trim();
    const currentUser = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!currentUser) return;

    const prefKey = 'smart_finance_prefs_' + (currentUser.email || '');
    const prefs = JSON.parse(localStorage.getItem(prefKey)) || {};

    if (inputPin === prefs.pinCode) {
        showToast('ปลดล็อกสำเร็จ!');
        document.getElementById('pin-unlock-input').value = '';
        navigateTo('screen-home');
    } else {
        showToast('รหัส PIN ไม่ถูกต้อง', 'error');
        document.getElementById('pin-unlock-input').value = '';
    }
}
// ============================================================
// ระบบจัดการการล็อคแอปด้วย PIN (SINGLE UNIFIED VERSION)
// ============================================================

// 1. สลับสวิตช์ เปิด/ปิด ล็อคแอป
function handleAppLockToggle(enabled) {
    const user = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!user || !user.email) {
        showToast('กรุณาเข้าสู่ระบบก่อนเปิดใช้งาน', 'error');
        const toggle = document.getElementById('toggle-app-lock');
        if (toggle) toggle.checked = false;
        return;
    }

    const prefKey = 'smart_finance_prefs_' + user.email;
    const prefs = JSON.parse(localStorage.getItem(prefKey)) || {};

    if (enabled) {
        if (!prefs.pinCode) {
            // ยังไม่มี PIN ให้เปิดหน้าตั้งรหัส
            openModal('modal-pin-setup');
            const toggle = document.getElementById('toggle-app-lock');
            if (toggle) toggle.checked = false;
        } else {
            // มี PIN แล้ว ให้เปิดใช้งาน
            prefs.appLock = true;
            localStorage.setItem(prefKey, JSON.stringify(prefs));
            showToast('เปิดใช้งานล็อคแอปด้วย PIN แล้ว 🔒');
        }
    } else {
        // ปิดใช้งาน
        prefs.appLock = false;
        localStorage.setItem(prefKey, JSON.stringify(prefs));
        showToast('ปิดใช้งานล็อคแอปด้วย PIN แล้ว');
    }
}

// 2. ปิด Modal ตั้งรหัส PIN
function closePinModal() {
    closeModal('modal-pin-setup');
    document.getElementById('pin-input-1').value = '';
    document.getElementById('pin-input-2').value = '';
}

// 3. บันทึกรหัส PIN ใหม่
function savePinCode() {
    const pin1 = document.getElementById('pin-input-1').value.trim();
    const pin2 = document.getElementById('pin-input-2').value.trim();

    if (pin1.length !== 4 || !/^\d{4}$/.test(pin1)) {
        showToast('กรุณากรอกรหัส PIN เป็นตัวเลข 4 หลัก', 'error');
        return;
    }

    if (pin1 !== pin2) {
        showToast('รหัส PIN ทั้งสองช่องไม่ตรงกัน', 'error');
        return;
    }

    const user = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!user || !user.email) return;

    const prefKey = 'smart_finance_prefs_' + user.email;
    const prefs = JSON.parse(localStorage.getItem(prefKey)) || {};

    prefs.pinCode = pin1;
    prefs.appLock = true;
    localStorage.setItem(prefKey, JSON.stringify(prefs));

    const toggle = document.getElementById('toggle-app-lock');
    if (toggle) toggle.checked = true;

    closePinModal();
    showToast('ตั้งรหัส PIN และเปิดใช้งานเรียบร้อย 🔒');
}

// 4. ตรวจสอบสถานะ PIN เมื่อเริ่มแอป / รีเฟรชหน้าเว็บ
function checkPinLockOnStart() {
    const currentUser = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!currentUser || !currentUser.email) return false;

    const prefKey = 'smart_finance_prefs_' + currentUser.email;
    const prefs = JSON.parse(localStorage.getItem(prefKey)) || {};

    if (prefs.appLock && prefs.pinCode) {
        navigateTo('screen-pin-unlock');
        return true; // มีการล็อค PIN อยู่
    }
    return false;
}

// 5. ปลดล็อกด้วย PIN
function unlockWithPin() {
    const inputPin = document.getElementById('pin-unlock-input').value.trim();
    const currentUser = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!currentUser || !currentUser.email) return;

    const prefKey = 'smart_finance_prefs_' + currentUser.email;
    const prefs = JSON.parse(localStorage.getItem(prefKey)) || {};

    if (inputPin === prefs.pinCode) {
        showToast('ปลดล็อกสำเร็จ!');
        document.getElementById('pin-unlock-input').value = '';
        navigateTo('screen-home');
    } else {
        showToast('รหัส PIN ไม่ถูกต้อง', 'error');
        document.getElementById('pin-unlock-input').value = '';
    }
}

// ซ่อนหน้า Splash / Loading Screen หลังโหลดทรัพยากรเสร็จ
window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
        setTimeout(() => {
            splash.classList.add('fade-out');
            setTimeout(() => {
                splash.style.display = 'none';
            }, 500); // รอให้เล่นแอนิเมชัน Fade-Out จนจบ
        }, 1200); // แสดงหน้าโหลดเป็นเวลา 1.2 วินาที (ปรับเปลี่ยนเวลาได้ตามต้องการ)
    }
});
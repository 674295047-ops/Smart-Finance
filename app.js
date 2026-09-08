// Navigation logic
function navigateTo(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
    }

    // Handle bottom navigation visibility
    const mainNav = document.getElementById('main-nav');
    if (screenId === 'screen-auth') {
        mainNav.style.display = 'none';
    } else {
        mainNav.style.display = 'flex';
        updateNavActiveState(screenId);
    }
}

function updateNavActiveState(screenId) {
    const navItems = document.querySelectorAll('.side-nav .nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        // Map screen to nav item (simple way based on onclick attribute)
        if (item.getAttribute('onclick').includes(screenId)) {
            item.classList.add('active');
        }
    });
}

// Auth Tabs logic
function switchAuthTab(tab) {
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');
    const tabs = document.querySelectorAll('.auth-container .tab');

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

// Modal logic
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Segment control logic in Add Modal
document.addEventListener('DOMContentLoaded', () => {
    const segmentBtns = document.querySelectorAll('.segment-control .segment-btn');
    segmentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            segmentBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    const catItems = document.querySelectorAll('.category-grid .cat-item');
    catItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from sibling items
            const siblings = item.parentElement.querySelectorAll('.cat-item');
            siblings.forEach(s => s.classList.remove('active'));
            item.classList.add('active');
        });
    });
});
// ==========================================
// Safe Navigation & Login Fix
// ==========================================

// 1. ฟังก์ชันเปลี่ยนหน้า (เพิ่มตัวป้องกัน Error กรณีค้นหาปุ่มไม่พบ)
// ==========================================
// Navigation logic
// ==========================================
function navigateTo(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));

    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
    }

    const mainNav = document.getElementById('main-nav');
    if (mainNav) {
        if (screenId === 'screen-auth') {
            mainNav.style.display = 'none';
        } else {
            mainNav.style.display = 'flex';
            updateNavActiveState(screenId);
        }
    }

    // สลับมาหน้าต่างๆ ให้โหลดข้อมูลล่าสุด
    if (screenId === 'screen-transactions' && typeof renderTransactionList === 'function') {
        renderTransactionList();
    }
    if (screenId === 'screen-reports' && typeof renderReportData === 'function') {
        renderReportData();
    }
}

function updateNavActiveState(screenId) {
    const navItems = document.querySelectorAll('.side-nav .nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        const onClickAttr = item.getAttribute('onclick');
        if (onClickAttr && onClickAttr.includes(screenId)) {
            item.classList.add('active');
        }
    });
}

// ==========================================
// Auth Tabs & Modals
// ==========================================
function switchAuthTab(tab) {
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');
    const tabs = document.querySelectorAll('.auth-container .tab');

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

// ==========================================
// Authentication Logic
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    updateRealTimeDate();

    // Segment & Category Control ใน Modal Add
    const segmentBtns = document.querySelectorAll('.segment-control .segment-btn');
    segmentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            segmentBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    const catItems = document.querySelectorAll('.category-grid .cat-item');
    catItems.forEach(item => {
        item.addEventListener('click', () => {
            const siblings = item.parentElement.querySelectorAll('.cat-item');
            siblings.forEach(s => s.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // 1. ตรวจสอบการสร้าง DB เบื้องต้น
    if (!localStorage.getItem('smart_finance_users')) {
        localStorage.setItem('smart_finance_users', JSON.stringify([]));
    }

    // 2. ดึงผู้ใช้ปัจจุบัน
    const currentUserSaved = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (currentUserSaved && currentUserSaved.email) {
        const users = JSON.parse(localStorage.getItem('smart_finance_users')) || [];
        const latestUser = users.find(u => u.email === currentUserSaved.email) || currentUserSaved;
        localStorage.setItem('smart_finance_currentUser', JSON.stringify(latestUser));
        loadUserData(latestUser);
        navigateTo('screen-home');
    } else {
        navigateTo('screen-auth');
    }
});

function handleLogin() {
    const emailInput = document.getElementById('login-email');
    const passInput = document.getElementById('login-password');
    if (!emailInput || !passInput) return;

    const email = emailInput.value.trim().toLowerCase();
    const password = passInput.value;

    if (!email || !password) {
        alert('กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน');
        return;
    }

    const users = JSON.parse(localStorage.getItem('smart_finance_users')) || [];
    const user = users.find(u => u.email === email);

    if (!user) {
        alert('ไม่พบบัญชีผู้ใช้นี้ กรุณาสมัครสมาชิกก่อน');
        return;
    }
    if (user.password !== password) {
        alert('รหัสผ่านไม่ถูกต้อง');
        return;
    }

    localStorage.setItem('smart_finance_currentUser', JSON.stringify(user));
    emailInput.value = '';
    passInput.value = '';

    loadUserData(user);
    navigateTo('screen-home');
}

function handleRegister() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;

    if (!name || !email || !password) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }
    if (password.length < 6) {
        alert('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
        return;
    }

    const users = JSON.parse(localStorage.getItem('smart_finance_users')) || [];
    if (users.find(u => u.email === email)) {
        alert('อีเมลนี้ถูกใช้งานแล้ว กรุณาเข้าสู่ระบบ');
        return;
    }

    const newUser = {
        name,
        email,
        password,
        finance: {
            balance: 0,
            expenseToday: 0,
            incomeMonth: 0,
            expenseMonth: 0,
            transactions: [],
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

    alert('สมัครสมาชิกสำเร็จ!');
    document.getElementById('reg-name').value = '';
    document.getElementById('reg-email').value = '';
    document.getElementById('reg-password').value = '';

    loadUserData(newUser);
    navigateTo('screen-home');
}

function handleLogout() {
    localStorage.removeItem('smart_finance_currentUser');
    closeModal('modal-profile');
    navigateTo('screen-auth');
}

function formatMoney(amount) {
    return Number(amount).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ฿';
}

function updateUserName(name) {
    document.querySelectorAll('.user-name-display').forEach(el => el.textContent = name);
    const settingNameInput = document.getElementById('settings-name');
    if (settingNameInput) settingNameInput.value = name;
}

// ==========================================
// โหลดข้อมูลผู้ใช้
// ==========================================
function loadUserData(user) {
    updateUserName(user.name);

    if (!user.finance) {
        user.finance = { balance: 0, expenseToday: 0, incomeMonth: 0, expenseMonth: 0, transactions: [] };
    }
    if (!user.finance.budgets) {
        user.finance.budgets = [
            { id: 'food', label: 'อาหาร', icon: 'fa-burger', limit: 5000, spent: 0 },
            { id: 'transport', label: 'ค่าเดินทาง', icon: 'fa-car', limit: 2000, spent: 0 },
            { id: 'utilities', label: 'ค่าน้ำ/ค่าไฟ', icon: 'fa-faucet-drip', limit: 3000, spent: 0 },
            { id: 'shopping', label: 'ช้อปปิ้ง', icon: 'fa-bag-shopping', limit: 4000, spent: 0 },
            { id: 'others', label: 'อื่นๆ', icon: 'fa-list-ul', limit: 6000, spent: 0 }
        ];
    }

    const f = user.finance;

    // คำนวณสรุปยอดวันนี้และเดือนนี้จาก Transactions
    const now = new Date();
    const curMonth = now.getMonth();
    const curYear = now.getFullYear();
    const curDate = now.getDate();

    let expToday = 0;
    let incMonth = 0;
    let expMonth = 0;

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

    f.expenseToday = expToday;
    f.incomeMonth = incMonth;
    f.expenseMonth = expMonth;

    // แสดงผลบนหน้าจอ Home
    const balanceAmount = document.querySelector('.balance-amount');
    if (balanceAmount) balanceAmount.textContent = formatMoney(f.balance);

    const balanceTodayEls = document.querySelectorAll('.balance-today span:last-child');
    balanceTodayEls.forEach(el => el.textContent = formatMoney(f.expenseToday));

    // วาดรายการ Home (4 รายการล่าสุด)
    const txItemsHome = document.querySelectorAll('#screen-home .tx-item');
    txItemsHome.forEach(el => el.remove());

    const homeHeader = document.querySelector('#screen-home .transaction-list-header');

    if (!f.transactions || f.transactions.length === 0) {
        if (homeHeader) {
            homeHeader.insertAdjacentHTML('afterend', `<div class="tx-item" style="justify-content:center; color:var(--text-muted); padding: 20px 0;">ยังไม่มีรายการในระบบ</div>`);
        }
    } else {
        let homeHTML = '';
        f.transactions.slice(0, 4).forEach((tx) => {
            const amountClass = tx.type === 'income' ? 'income' : 'expense';
            const sign = tx.type === 'income' ? '+' : '-';
            homeHTML += `
            <div class="tx-item">
                <div class="tx-left">
                    <div class="tx-icon">${tx.iconHtml}</div>
                    <div>
                        <span class="body2" style="display:block;">${tx.name}</span>
                        <span class="body3 text-muted">${tx.category}</span>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="tx-amount ${amountClass}">${sign}${formatMoney(tx.amount)}</span>
                </div>
            </div>`;
        });
        if (homeHeader) homeHeader.insertAdjacentHTML('afterend', homeHTML);
    }

    // วาดข้อมูลงบประมาณ
    renderBudgets(f);

    // รีเฟรชหน้ารายการและรายงาน
    if (typeof renderTransactionList === 'function') renderTransactionList();
    if (typeof renderReportData === 'function') renderReportData();
}

// ==========================================
// การจัดการงบประมาณ (Budget)
// ==========================================
function renderBudgets(finance) {
    const budgetContainers = document.querySelectorAll('#screen-budget .main-content > div[style*="padding: 16px"]');

    // คำนวณค่า spent ใหม่ของแต่ละหมวดจากรายการใช้จ่ายเดือนปัจจุบัน
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
            else if (tx.category.includes('น้ำ/ไฟ')) budgetId = 'utilities';
            else if (tx.category.includes('ช้อปปิ้ง')) budgetId = 'shopping';

            const b = finance.budgets.find(item => item.id === budgetId);
            if (b) b.spent += Number(tx.amount);
        }
    });

    let totalBudgetSpent = 0;
    let totalBudgetLimit = 0;
    finance.budgets.forEach(b => {
        totalBudgetSpent += Number(b.spent);
        totalBudgetLimit += Number(b.limit);
    });

    let overallPercent = totalBudgetLimit > 0 ? (totalBudgetSpent / totalBudgetLimit) * 100 : 0;
    if (overallPercent > 100) overallPercent = 100;

    if (budgetContainers[0]) {
        budgetContainers[0].innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <span class="body2" style="font-weight: 700;">การใช้จ่ายเฉลี่ยรวมเดือนนี้</span>
                <span class="body1">${overallPercent.toFixed(1)}%</span>
            </div>
            <div class="budget-bar-bg mb-1">
                <div class="budget-bar-fill" style="width: ${overallPercent}%;"></div>
            </div>
            <div class="flex justify-between">
                <span class="body3 text-muted">จ่ายจริง: ${formatMoney(totalBudgetSpent)}</span>
                <span class="body3 text-muted">เป้าหมายรวม: ${formatMoney(totalBudgetLimit)}</span>
            </div>
        `;
    }

    if (budgetContainers[1]) {
        let catsHTML = '';
        finance.budgets.forEach(b => {
            let p = b.limit > 0 ? (b.spent / b.limit) * 100 : 0;
            let barP = p > 100 ? 100 : p;
            catsHTML += `
                <div class="budget-bar-container">
                    <div class="budget-bar-header">
                        <span class="flex items-center gap-2"><i class="fa-solid ${b.icon}"></i> ${b.label}</span>
                        <span>${Number(b.spent).toLocaleString()} / ${Number(b.limit).toLocaleString()} ฿ <br><span style="float:right">${p.toFixed(0)}%</span></span>
                    </div>
                    <div class="budget-bar-bg">
                        <div class="budget-bar-fill" style="width: ${barP}%;"></div>
                    </div>
                </div>
            `;
        });
        budgetContainers[1].innerHTML = catsHTML;
    }

    const modalInputs = document.querySelectorAll('#modal-budget input[type="number"]');
    if (modalInputs.length >= 5) {
        finance.budgets.forEach((b, index) => {
            if (modalInputs[index]) modalInputs[index].value = b.limit;
        });
    }
}

function saveBudgetSettings() {
    const currentUser = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!currentUser || !currentUser.finance) return;

    const modalInputs = document.querySelectorAll('#modal-budget input[type="number"]');
    currentUser.finance.budgets.forEach((b, index) => {
        if (modalInputs[index]) {
            const val = parseFloat(modalInputs[index].value);
            b.limit = isNaN(val) ? 0 : val;
        }
    });

    localStorage.setItem('smart_finance_currentUser', JSON.stringify(currentUser));
    const users = JSON.parse(localStorage.getItem('smart_finance_users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex].finance = currentUser.finance;
        localStorage.setItem('smart_finance_users', JSON.stringify(users));
    }

    closeModal('modal-budget');
    loadUserData(currentUser);
}

function saveProfile() {
    const newName = document.getElementById('settings-name').value.trim();
    if (newName === '') {
        alert('กรุณาระบุชื่อแสดงผล');
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (currentUser) {
        currentUser.name = newName;
        const users = JSON.parse(localStorage.getItem('smart_finance_users')) || [];
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1) {
            users[userIndex].name = newName;
            localStorage.setItem('smart_finance_users', JSON.stringify(users));
        }
        localStorage.setItem('smart_finance_currentUser', JSON.stringify(currentUser));
    }

    updateUserName(newName);
    alert('บันทึกการเปลี่ยนแปลงสำเร็จ');
    closeModal('modal-profile');
}

// ==========================================
// Real-time Date
// ==========================================
function updateRealTimeDate() {
    const today = new Date();
    const thaiMonthsFull = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const thaiMonthsShort = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

    const d = today.getDate();
    const m = today.getMonth();
    const yFull = today.getFullYear() + 543;
    const yShort = yFull.toString().slice(-2);

    const dateFullString = `${d} ${thaiMonthsFull[m]} ${yShort}`;
    const monthShortString = `${thaiMonthsShort[m]} ${yShort}`;

    document.querySelectorAll('.user-profile-btn + .body3.mt-2').forEach(el => el.textContent = dateFullString);

    const balanceBadge = document.querySelector('.balance-card .badge');
    if (balanceBadge) balanceBadge.textContent = monthShortString;
}

// ==========================================
// Transaction Save/Delete
// ==========================================
function saveNewTransaction() {
    const typeBtn = document.querySelector('#modal-add .segment-btn.active');
    const isIncome = typeBtn && typeBtn.textContent.trim() === 'รายรับ';
    const type = isIncome ? 'income' : 'expense';

    const activeGrid = isIncome ? document.getElementById('cat-grid-income') : document.getElementById('cat-grid-expense');
    const catBtn = activeGrid ? activeGrid.querySelector('.cat-item.active') : null;

    const catIconHtml = catBtn ? catBtn.querySelector('i').outerHTML : '<i class="fa-solid fa-list-ul"></i>';
    const catName = catBtn ? catBtn.innerText.trim() : 'อื่นๆ';

    const nameInput = document.querySelector('#modal-add input[type="text"]');
    const amountInput = document.querySelector('#modal-add input[type="number"]');

    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value);

    if (!name) { alert('กรุณาระบุชื่อรายการ'); return; }
    if (isNaN(amount) || amount <= 0) { alert('กรุณาระบุจำนวนเงินที่มากกว่า 0'); return; }

    const currentUser = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!currentUser) return;
    const f = currentUser.finance;

    const newTx = {
        id: Date.now(),
        type: type,
        category: catName,
        iconHtml: catIconHtml,
        name: name,
        amount: amount,
        date: new Date().toISOString()
    };

    if (type === 'income') {
        f.balance += amount;
    } else {
        f.balance -= amount;
    }

    f.transactions.unshift(newTx);

    localStorage.setItem('smart_finance_currentUser', JSON.stringify(currentUser));
    const users = JSON.parse(localStorage.getItem('smart_finance_users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex].finance = f;
        localStorage.setItem('smart_finance_users', JSON.stringify(users));
    }

    nameInput.value = '';
    amountInput.value = '0.00';
    closeModal('modal-add');
    loadUserData(currentUser);
}

function deleteTransaction(id) {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?')) return;

    const currentUser = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!currentUser) return;
    const f = currentUser.finance;

    const txIndex = f.transactions.findIndex(t => t.id === id);
    if (txIndex === -1) return;
    const tx = f.transactions[txIndex];

    if (tx.type === 'income') {
        f.balance -= tx.amount;
    } else {
        f.balance += tx.amount;
    }

    f.transactions.splice(txIndex, 1);

    localStorage.setItem('smart_finance_currentUser', JSON.stringify(currentUser));
    const users = JSON.parse(localStorage.getItem('smart_finance_users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    if (userIndex !== -1) {
        users[userIndex].finance = f;
        localStorage.setItem('smart_finance_users', JSON.stringify(users));
    }

    loadUserData(currentUser);
}

function renderTransactionList() {
    const currentUser = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!currentUser || !currentUser.finance) return;

    const f = currentUser.finance;
    const txScreen = document.getElementById('screen-transactions');
    if (!txScreen) return;
    txScreen.querySelectorAll('.tx-item').forEach(el => el.remove());

    const activeFilterTag = document.querySelector('#screen-transactions .filter-tag.active');
    const filterType = activeFilterTag ? activeFilterTag.textContent.trim() : 'ทั้งหมด';

    const searchInput = document.querySelector('#screen-transactions .search-bar input');
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';

    const filteredTx = f.transactions.filter(tx => {
        let matchesType = true;
        if (filterType === 'รายรับ') matchesType = (tx.type === 'income');
        if (filterType === 'รายจ่าย') matchesType = (tx.type === 'expense');

        let matchesSearch = true;
        if (keyword) {
            matchesSearch = tx.name.toLowerCase().includes(keyword) ||
                tx.category.toLowerCase().includes(keyword);
        }
        return matchesType && matchesSearch;
    });

    const txBadge = document.querySelector('#screen-transactions .transaction-list-header .badge');
    if (txBadge) txBadge.textContent = `${filteredTx.length} รายการ`;

    const filterTags = document.querySelector('#screen-transactions .filter-tags');
    if (!filterTags) return;

    if (filteredTx.length === 0) {
        filterTags.insertAdjacentHTML('afterend', `<div class="tx-item" style="justify-content:center; color:var(--text-muted); padding: 20px 0;">ไม่พบรายการที่ตรงกัน</div>`);
    } else {
        let txHTML = '';
        filteredTx.forEach((tx) => {
            const amountClass = tx.type === 'income' ? 'income' : 'expense';
            const sign = tx.type === 'income' ? '+' : '-';

            txHTML += `
            <div class="tx-item">
                <div class="tx-left">
                    <div class="tx-icon">${tx.iconHtml}</div>
                    <div>
                        <span class="body2" style="display:block;">${tx.name}</span>
                        <span class="body3 text-muted">${tx.category}</span>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="tx-amount ${amountClass}">${sign}${formatMoney(tx.amount)}</span>
                    <i class="fa-solid fa-trash" style="font-size: 12px; color: var(--danger); cursor:pointer;" onclick="deleteTransaction(${tx.id})"></i>
                </div>
            </div>`;
        });
        filterTags.insertAdjacentHTML('afterend', txHTML);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const txFilterTags = document.querySelectorAll('#screen-transactions .filter-tag');
    txFilterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            txFilterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            renderTransactionList();
        });
    });

    const searchInput = document.querySelector('#screen-transactions .search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            renderTransactionList();
        });
    }
});

function switchTxType(type) {
    const segmentBtns = document.querySelectorAll('#modal-add .segment-btn');
    const expenseGrid = document.getElementById('cat-grid-expense');
    const incomeGrid = document.getElementById('cat-grid-income');

    if (type === 'expense') {
        segmentBtns[0].classList.add('active');
        segmentBtns[1].classList.remove('active');
        if (expenseGrid) expenseGrid.style.display = 'grid';
        if (incomeGrid) incomeGrid.style.display = 'none';
    } else {
        segmentBtns[0].classList.remove('active');
        segmentBtns[1].classList.add('active');
        if (expenseGrid) expenseGrid.style.display = 'none';
        if (incomeGrid) incomeGrid.style.display = 'grid';
    }
}

// ==========================================
// Reports & Donut Chart Navigation
// ==========================================
let currentReportDate = new Date();

// ฟังก์ชันสำหรับกดเปลี่ยนเดือนทีละ -1 หรือ +1 เดือน
function changeReportMonth(offset) {
    currentReportDate.setMonth(currentReportDate.getMonth() + offset);
    renderReportData();
}

function setReportMonth(year, month) {
    currentReportDate = new Date(year, month, 1);
    renderReportData();
}

function renderReportData() {
    const currentUser = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!currentUser || !currentUser.finance) return;

    const thaiMonthsFull = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const thaiMonthsShort = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

    const selectedMonth = currentReportDate.getMonth();
    const selectedYear = currentReportDate.getFullYear();
    const selectedYearBE = selectedYear + 543;

    // 1. อัปเดตส่วนแสดงผลวันที่และป้ายส่วนหัว
    const reportDateLabel = document.getElementById('report-date-label');
    if (reportDateLabel) reportDateLabel.textContent = `${thaiMonthsFull[selectedMonth]} ${selectedYearBE}`;

    const chartBadge = document.querySelector('#screen-reports .chart-container .badge');
    if (chartBadge) chartBadge.textContent = `${thaiMonthsFull[selectedMonth]} ${selectedYearBE}`;

    // 2. แสดงปุ่มสลับเดือน (แสดงย้อนหลัง 2 เดือน, เดือนปัจจุบัน, อนาคต 1 เดือน)
    const filterContainer = document.getElementById('report-month-filter');
    if (filterContainer) {
        let tagsHTML = '';
        for (let i = -2; i <= 1; i++) {
            const targetDate = new Date(selectedYear, selectedMonth + i, 1);
            const mIdx = targetDate.getMonth();
            const yBE = (targetDate.getFullYear() + 543).toString().slice(-2);
            const isActive = (i === 0) ? 'active' : '';

            tagsHTML += `<div class="filter-tag ${isActive}" style="flex:1; text-align:center; cursor:pointer;" onclick="setReportMonth(${targetDate.getFullYear()}, ${mIdx})">${thaiMonthsShort[mIdx]} ${yBE}</div>`;
        }
        filterContainer.innerHTML = tagsHTML;
    }

    // 3. กรองรายการของเดือนที่เลือก
    const monthTransactions = currentUser.finance.transactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getMonth() === selectedMonth && txDate.getFullYear() === selectedYear;
    });

    // 4. สรุปยอด รายรับ / รายจ่าย / แยกหมวด
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals = {
        'อาหาร': 0,
        'ค่าเดินทาง': 0,
        'ค่าน้ำ/ค่าไฟ': 0,
        'ช้อปปิ้ง': 0,
        'อื่นๆ': 0
    };

    monthTransactions.forEach(tx => {
        if (tx.type === 'income') {
            totalIncome += Number(tx.amount);
        } else {
            totalExpense += Number(tx.amount);
            if (tx.category.includes('อาหาร')) categoryTotals['อาหาร'] += Number(tx.amount);
            else if (tx.category.includes('เดินทาง')) categoryTotals['ค่าเดินทาง'] += Number(tx.amount);
            else if (tx.category.includes('น้ำ/ไฟ')) categoryTotals['ค่าน้ำ/ค่าไฟ'] += Number(tx.amount);
            else if (tx.category.includes('ช้อปปิ้ง')) categoryTotals['ช้อปปิ้ง'] += Number(tx.amount);
            else categoryTotals['อื่นๆ'] += Number(tx.amount);
        }
    });

    const incomeEl = document.querySelector('#screen-reports .body1[style*="color: var(--success)"]');
    if (incomeEl) incomeEl.textContent = "+" + formatMoney(totalIncome);

    const expenseEl = document.querySelector('#screen-reports .body1[style*="color: var(--danger)"]');
    if (expenseEl) expenseEl.textContent = "-" + formatMoney(totalExpense);

    // 5. วาด Donut Chart และ Legend รายละเอียด
    const donutChart = document.querySelector('#screen-reports .donut-chart');
    const chartLegend = document.querySelector('#screen-reports .chart-legend');

    const colors = {
        'อาหาร': '#FF9800',
        'ค่าเดินทาง': '#03A9F4',
        'ค่าน้ำ/ค่าไฟ': '#00BCD4',
        'ช้อปปิ้ง': '#9C27B0',
        'อื่นๆ': '#3F51B5'
    };

    if (totalExpense === 0) {
        if (donutChart) donutChart.style.background = '#e0e0e0';
        if (chartLegend) {
            chartLegend.innerHTML = `<div style="grid-column: span 2; text-align:center; color: var(--text-muted); padding: 10px 0;">ไม่มีรายการใช้จ่ายในเดือนนี้</div>`;
        }
    } else {
        let gradientStops = [];
        let currentPercent = 0;
        let legendHTML = '';

        for (const [cat, amount] of Object.entries(categoryTotals)) {
            const percent = (amount / totalExpense) * 100;
            const startP = currentPercent;
            currentPercent += percent;

            if (percent > 0) {
                gradientStops.push(`${colors[cat]} ${startP.toFixed(1)}% ${currentPercent.toFixed(1)}%`);
            }

            legendHTML += `
                <div class="legend-item">
                    <span class="body3"><span class="legend-color" style="background:${colors[cat]};"></span> ${cat}</span>
                    <span class="body3">${percent.toFixed(1)}% (${Number(amount).toLocaleString()} ฿)</span>
                </div>
            `;
        }

        if (donutChart) donutChart.style.background = `conic-gradient(${gradientStops.join(', ')})`;
        if (chartLegend) chartLegend.innerHTML = legendHTML;
    }
}
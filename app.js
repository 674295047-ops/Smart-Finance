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
        if (screenId === 'screen-auth') {
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

    const segmentBtns = document.querySelectorAll('.tx-type-btn');
    segmentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            segmentBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    const catItems = document.querySelectorAll('.cat-grid .cat-item');
    catItems.forEach(item => {
        item.addEventListener('click', () => {
            const siblings = item.parentElement.querySelectorAll('.cat-item');
            siblings.forEach(s => s.classList.remove('active'));
            item.classList.add('active');
        });
    });

    if (!localStorage.getItem('smart_finance_users')) {
        localStorage.setItem('smart_finance_users', JSON.stringify([]));
    }

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

    // Transaction Filters
    const txFilterTags = document.querySelectorAll('#screen-transactions .filter-tab');
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
    navigateTo('screen-home');
}

function handleRegister() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;

    if (!name || !email || !password) {
        showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
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
    showToast('ออกจากระบบสำเร็จ');
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
    if (balanceAmount) balanceAmount.textContent = formatMoney(f.balance);
    const todayExpVal = document.querySelector('.today-expense .val');
    if (todayExpVal) todayExpVal.textContent = formatMoney(f.expenseToday);

    const txItemsHome = document.querySelectorAll('#home-tx-list .tx-item');
    txItemsHome.forEach(el => el.remove());
    const homeTxList = document.getElementById('home-tx-list');

    if (!f.transactions || f.transactions.length === 0) {
        if (homeTxList) homeTxList.innerHTML = `<div class="tx-item" style="justify-content:center; color:var(--text-muted);">ไม่มีรายการล่าสุด</div>`;
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
            else if (tx.category.includes('น้ำ/ไฟ')) budgetId = 'utilities';
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
    if (!newName) {
        showToast('กรุณาระบุชื่อแสดงผล', 'error');
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (currentUser) {
        currentUser.name = newName;
        updateUsersArray(currentUser);
        localStorage.setItem('smart_finance_currentUser', JSON.stringify(currentUser));
    }
    updateUserName(newName);
    showToast('บันทึกการเปลี่ยนแปลงสำเร็จ');
    closeModal('modal-profile');
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
    const currentUser = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!currentUser) return;
    
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
        listContainer.innerHTML = `<div class="tx-item" style="justify-content:center; color:var(--text-muted);">ไม่พบรายการ</div>`;
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
    const currentUser = JSON.parse(localStorage.getItem('smart_finance_currentUser'));
    if (!currentUser) return;
    
    const selectedMonth = currentReportMonth;
    const selectedYear = currentReportYear;

    const monthTx = currentUser.finance.transactions.filter(tx => {
        const d = new Date(tx.date);
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });

    let totalInc = 0, totalExp = 0;
    const catTotals = { 'อาหาร':0, 'ค่าเดินทาง':0, 'ค่าน้ำ/ค่าไฟ':0, 'ช้อปปิ้ง':0, 'อื่นๆ':0 };

    monthTx.forEach(tx => {
        if (tx.type === 'income') totalInc += tx.amount;
        else {
            totalExp += tx.amount;
            if (tx.category.includes('อาหาร')) catTotals['อาหาร'] += tx.amount;
            else if (tx.category.includes('เดินทาง')) catTotals['ค่าเดินทาง'] += tx.amount;
            else if (tx.category.includes('น้ำ/ไฟ')) catTotals['ค่าน้ำ/ค่าไฟ'] += tx.amount;
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
        if (donutChart) donutChart.style.background = '#e0e0e0';
        if (legendGrid) legendGrid.innerHTML = '<div style="color:var(--text-muted)">ไม่มีข้อมูล</div>';
    } else {
        let stops = [], curr = 0, legendHtml = '';
        for (const [cat, amt] of Object.entries(catTotals)) {
            const p = (amt/totalExp) * 100;
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
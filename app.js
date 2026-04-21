//**
// * Zen Register - Cash Register Application
// * Philosophy: Smooth interactions like water flowing over stones
//**

// ============================================
// State Management - The Garden's Current State
// ============================================
const state = {
    items: [],
    selectedItemIndex: null,
    currentInput: '',
    quantityMode: false,
    discountMode: false,
    taxRate: 0.08,
    sessionStart: new Date(),
    quantity: 1,
    discount: 0,
    editingProductCode: null,
    tempInventory: {},
    
    // Day management
    dayStarted: false,
    dayStartTime: null,
    startingCash: 0,
    startingInventory: {},
    receivedInventory: {},   // units received from vendor orders during the day
    transactions: [],
    cashSales: 0,
    cardSales: 0,
    appDate: null    // 'YYYY-MM-DD' business date; advances on EOD
};

// Sample product database - In production, this would come from a backend
const productDatabase = {
    '001': { name: 'Green Tea', price: 3.50, stock: 50 },
    '002': { name: 'Matcha Latte', price: 5.00, stock: 30 },
    '003': { name: 'Rice Bowl', price: 8.50, stock: 25 },
    '004': { name: 'Miso Soup', price: 4.00, stock: 40 },
    '005': { name: 'Sushi Roll', price: 12.00, stock: 20 },
    '006': { name: 'Edamame', price: 4.50, stock: 35 },
    '007': { name: 'Sake', price: 15.00, stock: 15 },
    '008': { name: 'Ramen', price: 11.00, stock: 30 },
    '009': { name: 'Gyoza', price: 6.50, stock: 45 },
    '010': { name: 'Tempura', price: 9.00, stock: 28 }
};

// ============================================
// LocalStorage Persistence - The Garden's Memory
// ============================================
const STORAGE_KEYS = {
    products: 'zenRegister_products',
    dayState: 'zenRegister_dayState',
    appDate: 'zenRegister_appDate'
};


// ============================================
// App Date – Business date decoupled from wall clock
// ============================================
function realDateStr() {
    const d = new Date();
    return d.getFullYear() + '-' +
           String(d.getMonth() + 1).padStart(2, '0') + '-' +
           String(d.getDate()).padStart(2, '0');
}
function getAppDateStr() {
    return state.appDate || realDateStr();
}
function getAppDateObj() {
    const parts = getAppDateStr().split('-');
    return new Date(+parts[0], +parts[1] - 1, +parts[2]);
}
function advanceAppDate() {
    const d = getAppDateObj();
    d.setDate(d.getDate() + 1);
    state.appDate = d.getFullYear() + '-' +
                    String(d.getMonth() + 1).padStart(2, '0') + '-' +
                    String(d.getDate()).padStart(2, '0');
    localStorage.setItem(STORAGE_KEYS.appDate, state.appDate);
}

function saveToStorage() {
    try {
        localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(productDatabase));
        if (state.appDate) localStorage.setItem(STORAGE_KEYS.appDate, state.appDate);
        localStorage.setItem(STORAGE_KEYS.dayState, JSON.stringify({
            dayStarted: state.dayStarted,
            dayStartTime: state.dayStartTime,
            startingCash: state.startingCash,
            startingInventory: state.startingInventory,
            receivedInventory: state.receivedInventory,
            transactions: state.transactions,
            cashSales: state.cashSales,
            cardSales: state.cardSales
        }));
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }
}

function loadFromStorage() {
    try {
        const savedProducts = localStorage.getItem(STORAGE_KEYS.products);
        if (savedProducts) {
            const parsed = JSON.parse(savedProducts);
            Object.keys(productDatabase).forEach(k => delete productDatabase[k]);
            Object.assign(productDatabase, parsed);
        }
        const savedAppDate = localStorage.getItem(STORAGE_KEYS.appDate);
        if (savedAppDate) state.appDate = savedAppDate;
        const savedDayState = localStorage.getItem(STORAGE_KEYS.dayState);
        if (savedDayState) {
            const parsed = JSON.parse(savedDayState);
            Object.assign(state, parsed);
            if (!state.receivedInventory) state.receivedInventory = {};
            if (state.dayStartTime) state.dayStartTime = new Date(state.dayStartTime);
        }
    } catch (e) {
        console.warn('Could not load from localStorage:', e);
    }
}

function restoreUIState() {
    if (state.dayStarted) {
        elements.btnStartDay.disabled = true;
        elements.btnEndDay.disabled = false;
        elements.btnAuditTill.disabled = false;
        elements.btnInventory.disabled = false;
    } else {
        elements.btnStartDay.disabled = false;
        elements.btnEndDay.disabled = true;
        elements.btnAuditTill.disabled = true;
        elements.btnInventory.disabled = true;
    }
}

// ============================================
// DOM Elements - Gathering the Stones
// ============================================
const elements = {
    productInput: document.getElementById('productInput'),
    btnScan: document.getElementById('btnScan'),
    itemsList: document.getElementById('itemsList'),
    subtotalAmount: document.getElementById('subtotalAmount'),
    taxAmount: document.getElementById('taxAmount'),
    totalAmount: document.getElementById('totalAmount'),
    sessionTime: document.getElementById('sessionTime'),
    sessionDate: document.getElementById('sessionDate'),
    
    // Number pad
    numButtons: document.querySelectorAll('.num-btn'),
    
    // Action buttons
    btnClear: document.getElementById('btnClear'),
    btnVoid: document.getElementById('btnVoid'),
    btnQuantity: document.getElementById('btnQuantity'),
    btnDiscount: document.getElementById('btnDiscount'),
    
    // Payment buttons
    btnCash: document.getElementById('btnCash'),
    btnCard: document.getElementById('btnCard'),
    discoDisplay: document.getElementById('disco_display_percent'),
    discoAmount: document.getElementById('discoAmount'),
    discoRow: document.getElementById('discoRow'),
    
    // Payment modal
    paymentModal: document.getElementById('paymentModal'),
    paymentTitle: document.getElementById('paymentTitle'),
    paymentDue: document.getElementById('paymentDue'),
    amountTendered: document.getElementById('amountTendered'),
    changeAmount: document.getElementById('changeAmount'),
    changeDisplay: document.getElementById('changeDisplay'),
    modalClose: document.getElementById('modalClose'),
    btnCancelPayment: document.getElementById('btnCancelPayment'),
    btnCompletePayment: document.getElementById('btnCompletePayment'),
    
    // Receipt modal
    receiptModal: document.getElementById('receiptModal'),
    receiptContent: document.getElementById('receiptContent'),
    receiptClose: document.getElementById('receiptClose'),
    btnPrintReceipt: document.getElementById('btnPrintReceipt'),
    btnNewTransaction: document.getElementById('btnNewTransaction'),
    
    // Inventory modal
    btnInventory: document.getElementById('btnInventory'),
    inventoryModal: document.getElementById('inventoryModal'),
    inventoryClose: document.getElementById('inventoryClose'),
    btnCloseInventory: document.getElementById('btnCloseInventory'),
    inventoryTableBody: document.getElementById('inventoryTableBody'),
    btnAddProduct: document.getElementById('btnAddProduct'),
    btnUploadInvoice: document.getElementById('btnUploadInvoice'),
    invoiceFile: document.getElementById('invoiceFile'),
    
    // Edit product modal
    editProductModal: document.getElementById('editProductModal'),
    editProductTitle: document.getElementById('editProductTitle'),
    editProductClose: document.getElementById('editProductClose'),
    productCode: document.getElementById('productCode'),
    productName: document.getElementById('productName'),
    productPrice: document.getElementById('productPrice'),
    productStock: document.getElementById('productStock'),
    btnCancelEdit: document.getElementById('btnCancelEdit'),
    btnSaveProduct: document.getElementById('btnSaveProduct'),
    
    // Day management
    btnStartDay: document.getElementById('btnStartDay'),
    btnEndDay: document.getElementById('btnEndDay'),
    btnAuditTill: document.getElementById('btnAuditTill'),
    
    // Start day modal
    startDayModal: document.getElementById('startDayModal'),
    startDayClose: document.getElementById('startDayClose'),
    inventorySummary: document.getElementById('inventorySummary'),
    cash20: document.getElementById('cash20'),
    cash10: document.getElementById('cash10'),
    cash5: document.getElementById('cash5'),
    cash1: document.getElementById('cash1'),
    cash025: document.getElementById('cash025'),
    cash010: document.getElementById('cash010'),
    cash005: document.getElementById('cash005'),
    cash001: document.getElementById('cash001'),
    total20: document.getElementById('total20'),
    total10: document.getElementById('total10'),
    total5: document.getElementById('total5'),
    total1: document.getElementById('total1'),
    total025: document.getElementById('total025'),
    total010: document.getElementById('total010'),
    total005: document.getElementById('total005'),
    total001: document.getElementById('total001'),
    totalStartingCash: document.getElementById('totalStartingCash'),
    btnCancelStartDay: document.getElementById('btnCancelStartDay'),
    btnConfirmStartDay: document.getElementById('btnConfirmStartDay'),
    btnAdjustInventoryFromStart: document.getElementById('btnAdjustInventoryFromStart'),
    btnUploadInvoiceFromStart: document.getElementById('btnUploadInvoiceFromStart'),
    invoiceFileStartDay: document.getElementById('invoiceFileStartDay'),
    
    // Audit till modal
    auditTillModal: document.getElementById('auditTillModal'),
    auditTillClose: document.getElementById('auditTillClose'),
    btnCloseAudit: document.getElementById('btnCloseAudit'),
    
    // End day modal
    endDayModal: document.getElementById('endDayModal'),
    endDayClose: document.getElementById('endDayClose'),
    btnCancelEndDay: document.getElementById('btnCancelEndDay'),
    btnConfirmEndDay: document.getElementById('btnConfirmEndDay')
};

// ============================================
// Initialization - Setting the Garden
// ============================================
function init() {
    loadFromStorage();
    restoreUIState();
    updateDateTime();
    setInterval(updateDateTime, 1000);
    attachEventListeners();
    updateDisplay();
}

// ============================================
// Time Display - The Flowing River
// ============================================
function updateDateTime() {
    const now = new Date();
    
    // Update time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    elements.sessionTime.textContent = `${hours}:${minutes}`;
    
    // Update date
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    elements.sessionDate.textContent = now.toLocaleDateString('en-US', options);
}

// ============================================
// Event Listeners - Responding to Touch
// ============================================
function attachEventListeners() {
    // Product entry
    elements.btnScan.addEventListener('click', addProduct);
    elements.productInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addProduct();
    });
    
    // Number pad
    elements.numButtons.forEach(btn => {
        btn.addEventListener('click', () => handleNumberInput(btn.dataset.value));
    });
    
    // Action buttons
    elements.btnClear.addEventListener('click', clearTransaction);
    elements.btnVoid.addEventListener('click', voidSelectedItem);
    elements.btnQuantity.addEventListener('click', toggleQuantityMode);
    elements.btnDiscount.addEventListener('click', toggleDiscountMode);
    
    // Payment buttons
    elements.btnCash.addEventListener('click', () => openPaymentModal('cash'));
    elements.btnCard.addEventListener('click', () => openPaymentModal('card'));
    
    // Payment modal
    elements.modalClose.addEventListener('click', closePaymentModal);
    elements.btnCancelPayment.addEventListener('click', closePaymentModal);
    elements.btnCompletePayment.addEventListener('click', completePayment);
    elements.amountTendered.addEventListener('input', calculateChange);
    
    // Receipt modal
    elements.receiptClose.addEventListener('click', closeReceiptModal);
    elements.btnPrintReceipt.addEventListener('click', printReceipt);
    elements.btnNewTransaction.addEventListener('click', () => {
        closeReceiptModal();
        clearTransaction();
    });
    
    // Inventory modal
    elements.btnInventory.addEventListener('click', openInventoryModal);
    elements.inventoryClose.addEventListener('click', closeInventoryModal);
    elements.btnCloseInventory.addEventListener('click', closeInventoryModal);
    elements.btnAddProduct.addEventListener('click', () => openEditProductModal());
    elements.btnUploadInvoice.addEventListener('click', () => elements.invoiceFile.click());
    elements.invoiceFile.addEventListener('change', (e) => handleInvoiceUpload(e, false));
    
    // Edit product modal
    elements.editProductClose.addEventListener('click', closeEditProductModal);
    elements.btnCancelEdit.addEventListener('click', closeEditProductModal);
    elements.btnSaveProduct.addEventListener('click', saveProduct);
    
    // Day management
    elements.btnStartDay.addEventListener('click', openStartDayModal);
    elements.btnEndDay.addEventListener('click', openEndDayModal);
    elements.btnAuditTill.addEventListener('click', openAuditTillModal);
    
    // Start day modal
    elements.startDayClose.addEventListener('click', closeStartDayModal);
    elements.btnCancelStartDay.addEventListener('click', closeStartDayModal);
    elements.btnConfirmStartDay.addEventListener('click', confirmStartDay);
    elements.btnAdjustInventoryFromStart.addEventListener('click', () => {
        closeStartDayModal();
        openInventoryModal();
    });
    elements.btnUploadInvoiceFromStart.addEventListener('click', () => elements.invoiceFileStartDay.click());
    elements.invoiceFileStartDay.addEventListener('change', (e) => handleInvoiceUpload(e, true));
    
    // Cash input calculations
    const cashInputs = [
        { input: elements.cash20, total: elements.total20, value: 20 },
        { input: elements.cash10, total: elements.total10, value: 10 },
        { input: elements.cash5, total: elements.total5, value: 5 },
        { input: elements.cash1, total: elements.total1, value: 1 },
        { input: elements.cash025, total: elements.total025, value: 0.25 },
        { input: elements.cash010, total: elements.total010, value: 0.10 },
        { input: elements.cash005, total: elements.total005, value: 0.05 },
        { input: elements.cash001, total: elements.total001, value: 0.01 }
    ];
    
    cashInputs.forEach(item => {
        item.input.addEventListener('input', () => updateCashTotal(item.input, item.total, item.value));
    });
    
    // Audit till modal
    elements.auditTillClose.addEventListener('click', closeAuditTillModal);
    elements.btnCloseAudit.addEventListener('click', closeAuditTillModal);
    
    // End day modal
    elements.endDayClose.addEventListener('click', closeEndDayModal);
    elements.btnCancelEndDay.addEventListener('click', closeEndDayModal);
    elements.btnConfirmEndDay.addEventListener('click', confirmEndDay);
    
    // Close modals on background click
    elements.paymentModal.addEventListener('click', (e) => {
        if (e.target === elements.paymentModal) closePaymentModal();
    });
    elements.receiptModal.addEventListener('click', (e) => {
        if (e.target === elements.receiptModal) closeReceiptModal();
    });
    elements.inventoryModal.addEventListener('click', (e) => {
        if (e.target === elements.inventoryModal) closeInventoryModal();
    });
    elements.editProductModal.addEventListener('click', (e) => {
        if (e.target === elements.editProductModal) closeEditProductModal();
    });
    elements.startDayModal.addEventListener('click', (e) => {
        if (e.target === elements.startDayModal) closeStartDayModal();
    });
    elements.auditTillModal.addEventListener('click', (e) => {
        if (e.target === elements.auditTillModal) closeAuditTillModal();
    });
    elements.endDayModal.addEventListener('click', (e) => {
        if (e.target === elements.endDayModal) closeEndDayModal();
    });
}

// ============================================
// Product Management - Adding to the Garden
// ============================================
function addProduct() {
    const input = elements.productInput.value.trim();
    if (!input) return;
    
    const product = productDatabase[input];
    if (!product) {
        showNotification('Product not found', 'error');
        elements.productInput.value = '';
        return;
    }
    
    // Check stock availability
    if (state.dayStarted && product.stock < state.quantity) {
        showNotification(`Insufficient stock. Only ${product.stock} available`, 'error');
        elements.productInput.value = '';
        return;
    }
    
    // Check if product already exists in cart
    const existingIndex = state.items.findIndex(item => item.code === input);
    
    if (existingIndex !== -1) {
        const totalQuantity = state.items[existingIndex].quantity + state.quantity;
        if (state.dayStarted && product.stock < totalQuantity) {
            showNotification(`Insufficient stock. Only ${product.stock} available`, 'error');
            elements.productInput.value = '';
            return;
        }
        state.items[existingIndex].quantity += state.quantity;
    } else {
        state.items.push({
            code: input,
            name: product.name,
            price: product.price,
            quantity: state.quantity
        });
    }
    elements.productInput.value = '';
    elements.productInput.focus();
    updateDisplay();
    state.quantity = 1;
}

// ============================================
// Number Pad - Manual Entry
// ============================================
function handleNumberInput(value) {
    if (state.quantityMode) {
        state.currentInput += value;
        elements.productInput.value = state.currentInput;
    } else if (state.discountMode) {
        state.currentInput += value;
        elements.productInput.value = state.currentInput + '%';
    } else {
        elements.productInput.value += value;
    }
}

// ============================================
// Action Handlers - Garden Maintenance
// ============================================
function clearTransaction() {
    if (state.items.length === 0) return;
    
    if (confirm('Clear all items from this transaction?')) {
        state.items = [];
        state.selectedItemIndex = null;
        state.currentInput = '';
        state.quantityMode = false;
        state.discountMode = false;
        state.discount = 0;
        elements.discoRow.classList.remove('show-flex');
        elements.discoRow.classList.add('hide');
        elements.discoDisplay.textContent = 0;
        elements.discoAmount.textContent = '$0.00';
        updateDisplay();
    }
}

function voidSelectedItem() {
    if (state.selectedItemIndex === null) {
        showNotification('Please select an item to void', 'warning');
        return;
    }
    
    state.items.splice(state.selectedItemIndex, 1);
    state.selectedItemIndex = null;
    updateDisplay();
}

function toggleQuantityMode() {
    state.quantityMode = !state.quantityMode;
    state.discountMode = false;
    state.currentInput = '';
    
    if (state.quantityMode) {
        elements.btnQuantity.style.background = 'var(--color-accent)';
        elements.btnQuantity.style.color = 'white';
        elements.productInput.placeholder = 'Enter quantity...';
        elements.productInput.focus();
    } else {
        const parsed = parseInt(elements.productInput.value.trim(), 10);
        state.quantity = (parsed > 0) ? parsed : 1;
        elements.productInput.value = '';
        elements.btnQuantity.style.background = '';
        elements.btnQuantity.style.color = '';
        elements.productInput.placeholder = 'Scan or enter product...';
        elements.productInput.focus();
    }
}

function countDecimalPlaces(number) {
    const numberString = number.toString();
    const decimalIndex = numberString.indexOf('.');
    if (decimalIndex === -1) {
        return 0;
    }
    return numberString.length - decimalIndex - 1;
}

function toggleDiscountMode() {
    state.discountMode = !state.discountMode;
    state.quantityMode = false;
    state.currentInput = '';
    
    if (state.discountMode) {
        elements.btnDiscount.style.background = 'var(--color-warning)';
        elements.btnDiscount.style.color = 'white';
        elements.productInput.placeholder = 'Enter discount %...';
        elements.productInput.focus();
    } else {
        const discountPercent = parseFloat(elements.productInput.value.trim()) || 0;
        state.discount = discountPercent / 100;
        elements.discoDisplay.textContent = discountPercent;
        elements.discoAmount.textContent = formatCurrency(roundCurrency(calculateSubtotal() * state.discount));
        updateTotals();
        elements.discoRow.classList.remove('hide');
        elements.discoRow.classList.add('show-flex');
        elements.productInput.value = '';
        elements.btnDiscount.style.background = '';
        elements.btnDiscount.style.color = '';
        elements.productInput.placeholder = 'Scan or enter product...';
        elements.productInput.focus();
    }
}

// ============================================
// Display Updates - Reflecting the Garden
// ============================================
function updateDisplay() {
    updateItemsList();
    updateTotals();
}

function updateItemsList() {
    if (state.items.length === 0) {
        elements.itemsList.innerHTML = `
            <li class="empty-state">
                <p>Begin by scanning or entering a product</p>
            </li>
        `;
        return;
    }
    
    elements.itemsList.innerHTML = state.items.map((item, index) => `
        <li class="item-row ${index === state.selectedItemIndex ? 'selected' : ''}" 
            onclick="selectItem(${index})">
            <span class="item-name">${item.name}</span>
            <span class="item-quantity">×${item.quantity}</span>
            <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        </li>
    `).join('');
}

function selectItem(index) {
    state.selectedItemIndex = state.selectedItemIndex === index ? null : index;
    updateDisplay();
}

function updateTotals() {
    const subtotal = calculateSubtotal();
    const tax = roundCurrency(subtotal * state.taxRate);
    const total = calculateTotal();
    elements.totalAmount.textContent = formatCurrency(total);
    elements.subtotalAmount.textContent = formatCurrency(subtotal);
    elements.taxAmount.textContent = formatCurrency(tax);
}

function calculateSubtotal() {
    return roundCurrency(
        state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    );
}

// Single source of truth for the transaction total
function calculateTotal() {
    const subtotal = calculateSubtotal();
    const tax = roundCurrency(subtotal * state.taxRate);
    const discount = (state.discount > 0 && state.discount < 1)
        ? roundCurrency(subtotal * state.discount)
        : 0;
    return roundCurrency(subtotal + tax - discount);
}

// Round to two decimal places to avoid floating-point drift
function roundCurrency(amount) {
    return Math.round(amount * 100) / 100;
}

// ============================================
// Payment Processing - The Exchange
// ============================================
function openPaymentModal(type) {
    if (state.items.length === 0) {
        showNotification('No items in transaction', 'warning');
        return;
    }
    elements.paymentDue.textContent = formatCurrency(calculateTotal());
    elements.paymentTitle.textContent = type === 'cash' ? 'Cash Payment' : 'Card Payment';
    elements.amountTendered.value = '';
    elements.changeAmount.textContent = '$0.00';
    
    if (type === 'card') {
        elements.amountTendered.parentElement.style.display = 'none';
        elements.changeDisplay.style.display = 'none';
    } else {
        elements.amountTendered.parentElement.style.display = 'block';
        elements.changeDisplay.style.display = 'flex';
        elements.amountTendered.focus();
    }
    
    elements.paymentModal.classList.add('active');
    elements.paymentModal.dataset.type = type;
}

function closePaymentModal() {
    elements.paymentModal.classList.remove('active');
}

function calculateChange() {
    const total = calculateTotal();
    const tendered = parseFloat(elements.amountTendered.value) || 0;
    const change = roundCurrency(tendered - total);
    
    elements.changeAmount.textContent = formatCurrency(Math.max(0, change));
    
    if (change >= 0) {
        elements.changeDisplay.style.background = 'var(--color-success)';
    } else {
        elements.changeDisplay.style.background = 'var(--color-error)';
    }
}

function completePayment() {
    const paymentType = elements.paymentModal.dataset.type;
    const total = calculateTotal();
    
    if (paymentType === 'cash') {
        const tendered = parseFloat(elements.amountTendered.value) || 0;
        if (tendered < total) {
            showNotification('Insufficient payment', 'error');
            return;
        }
    }
    
    // Record transaction if day is started
    if (state.dayStarted) {
        recordTransaction(paymentType, total);
        updateInventoryFromSale();
        saveToStorage();
    }
    
    closePaymentModal();
    generateReceipt(paymentType);
    showReceiptModal();
}

function recordTransaction(paymentType, total) {
    const transaction = {
        timestamp: new Date(),
        type: paymentType,
        amount: total,
        items: JSON.parse(JSON.stringify(state.items))
    };
    
    state.transactions.push(transaction);
    
    if (paymentType === 'cash') {
        state.cashSales = roundCurrency(state.cashSales + total);
    } else {
        state.cardSales = roundCurrency(state.cardSales + total);
    }
}

function updateInventoryFromSale() {
    state.items.forEach(item => {
        if (productDatabase[item.code]) {
            productDatabase[item.code].stock -= item.quantity;
        }
    });
}

// ============================================
// Receipt Generation - The Record
// ============================================
function generateReceipt(paymentType) {
    const now = new Date();
    const subtotal = calculateSubtotal();
    const tax = roundCurrency(subtotal * state.taxRate);
    const disc = (state.discount > 0) ? roundCurrency(subtotal * state.discount) : 0;
    const disc_perc = state.discount > 0 ? (state.discount * 100).toFixed(0) : 0;
    const total = calculateTotal();
    const taxRateLabel = (state.taxRate * 100).toFixed(0);
    
    const receiptHTML = `
        <div class="receipt-header">
            <div class="receipt-title">ZEN REGISTER</div>
            <div>${getAppDateObj().toLocaleDateString()} ${now.toLocaleTimeString()}</div>
        </div>
        
        <div class="receipt-items">
            ${state.items.map(item => `
                <div class="receipt-item">
                    <span>${item.name} x${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="receipt-totals">
            <div class="receipt-total-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="receipt-total-row">
                <span>Tax (8%):</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            ${state.discount > 0 ? `
                <div class="receipt-total-row">
                    <span>Discount (${disc_perc}%):</span>
                    <span>-$${disc.toFixed(2)}</span>
                </div>
            ` : ''}  
            <div class="receipt-total-row grand-total">
                <span>TOTAL:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <div class="receipt-total-row">
                <span>Payment:</span>
                <span>${paymentType.toUpperCase()}</span>
            </div>
            ${paymentType === 'cash' ? `
                <div class="receipt-total-row">
                    <span>Tendered:</span>
                    <span>$${parseFloat(elements.amountTendered.value).toFixed(2)}</span>
                </div>
                <div class="receipt-total-row">
                    <span>Change:</span>
                    <span>${elements.changeAmount.textContent}</span>
                </div>
            ` : ''}
        </div>
        
        <div class="receipt-footer">
            <div>Thank you for your visit</div>
            <div>Please come again</div>
        </div>
    `;
    
    elements.receiptContent.innerHTML = receiptHTML;
    // Save to daily paperwork record
    if (typeof PW !== 'undefined') {
        PW.saveReceipt(receiptHTML, paymentType, total, now);
    }
    elements.discoRow.classList.remove('show-flex');
    elements.discoRow.classList.add('hide');
    elements.discoDisplay.textContent = 0;
    elements.discoAmount.textContent = '$0.00'
    state.discount = 0;
}

function showReceiptModal() {
    elements.receiptModal.classList.add('active');
}

function closeReceiptModal() {
    elements.receiptModal.classList.remove('active');
}

function printReceipt() {
    window.print();
}

// ============================================
// Inventory Management - Garden Catalog
// ============================================
function openInventoryModal() {
    // Create a copy of the current inventory to work with
    state.tempInventory = JSON.parse(JSON.stringify(productDatabase));
    populateInventoryTable();
    elements.inventoryModal.classList.add('active');
}

function closeInventoryModal() {
    Object.keys(productDatabase).forEach(key => delete productDatabase[key]);
    Object.assign(productDatabase, state.tempInventory);
    state.tempInventory = {};
    saveToStorage();
    elements.inventoryModal.classList.remove('active');
    showNotification('Inventory updated', 'success');
}

function populateInventoryTable() {
    const tbody = elements.inventoryTableBody;
    const sortedCodes = Object.keys(state.tempInventory).sort();
    
    if (sortedCodes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: var(--space-xl); color: var(--color-text-light);">
                    No products in inventory. Click "Add Product" to get started.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = sortedCodes.map(code => {
        const product = state.tempInventory[code];
        return `
            <tr>
                <td>${code}</td>
                <td>${product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>
                    <div class="inventory-actions-cell">
                        <button class="btn-icon btn-edit" onclick="editProduct('${code}')">Edit</button>
                        <button class="btn-icon btn-delete" onclick="deleteProduct('${code}')">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function openEditProductModal(code = null) {
    state.editingProductCode = code;
    
    if (code) {
        // Editing existing product
        elements.editProductTitle.textContent = 'Edit Product';
        const product = state.tempInventory[code];
        elements.productCode.value = code;
        elements.productCode.disabled = true; // Can't change code when editing
        elements.productName.value = product.name;
        elements.productPrice.value = product.price;
        elements.productStock.value = product.stock || 0;
    } else {
        // Adding new product
        elements.editProductTitle.textContent = 'Add Product';
        elements.productCode.value = '';
        elements.productCode.disabled = false;
        elements.productName.value = '';
        elements.productPrice.value = '';
        elements.productStock.value = '0';
    }
    
    elements.editProductModal.classList.add('active');
    setTimeout(() => {
        if (code) {
            elements.productName.focus();
        } else {
            elements.productCode.focus();
        }
    }, 100);
}

function closeEditProductModal() {
    elements.editProductModal.classList.remove('active');
    state.editingProductCode = null;
}

function saveProduct() {
    const code = elements.productCode.value.trim();
    const name = elements.productName.value.trim();
    const price = parseFloat(elements.productPrice.value);
    const stock = parseInt(elements.productStock.value) || 0;
    
    // Validation
    if (!code) {
        showNotification('Product code is required', 'error');
        elements.productCode.focus();
        return;
    }
    
    if (!name) {
        showNotification('Product name is required', 'error');
        elements.productName.focus();
        return;
    }
    
    if (isNaN(price) || price <= 0) {
        showNotification('Please enter a valid price', 'error');
        elements.productPrice.focus();
        return;
    }
    
    if (stock < 0) {
        showNotification('Stock cannot be negative', 'error');
        elements.productStock.focus();
        return;
    }
    
    // Check if code already exists when adding new product
    if (!state.editingProductCode && state.tempInventory[code]) {
        showNotification('Product code already exists', 'error');
        elements.productCode.focus();
        return;
    }
    
    // Save to temp inventory
    state.tempInventory[code] = { name, price, stock };
    
    closeEditProductModal();
    populateInventoryTable();
    showNotification(state.editingProductCode ? 'Product updated' : 'Product added', 'success');
}

function editProduct(code) {
    openEditProductModal(code);
}

function deleteProduct(code) {
    if (confirm(`Delete product "${state.tempInventory[code].name}"?`)) {
        delete state.tempInventory[code];
        populateInventoryTable();
        showNotification('Product deleted', 'success');
    }
}

// ============================================
// Invoice Upload - CSV Import
// ============================================
async function handleInvoiceUpload(event, fromStartDay) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Reset the file input
    event.target.value = '';
    
    if (!file.name.endsWith('.csv')) {
        showNotification('Please upload a CSV file', 'error');
        return;
    }
    
    try {
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
            showNotification('CSV file is empty or invalid', 'error');
            return;
        }
        
        // Parse header
        const header = lines[0].toLowerCase().split(',').map(h => h.trim());
        const codeIndex = header.indexOf('code');
        const nameIndex = header.indexOf('name');
        const priceIndex = header.indexOf('price');
        const stockIndex = header.indexOf('stock');
        
        // Validate header
        if (codeIndex === -1 || nameIndex === -1 || priceIndex === -1 || stockIndex === -1) {
            showNotification('CSV must have columns: code, name, price, stock', 'error');
            return;
        }
        
        // Parse products
        const newInventory = {};
        let successCount = 0;
        let errorCount = 0;
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = line.split(',').map(v => v.trim());
            
            const code = values[codeIndex];
            const name = values[nameIndex];
            const price = parseFloat(values[priceIndex]);
            const stock = parseInt(values[stockIndex]);
            console.log(`CODE: ${code} is a ${typeof(code)}`)
            console.log(`STOCK: ${stock} is a ${typeof(stock)}`)
            console.log(`CODE IN proData: ${code in productDatabase}`)
            // Validate data
            if (!code || !name || isNaN(price) || price <= 0 || isNaN(stock) || stock < 0) {
                errorCount++;
                console.warn(`Invalid data at line ${i + 1}: ${line}`);
                continue;
            }
            if (code in productDatabase) {
				productDatabase[code]['stock'] = Number(productDatabase[code]['stock']) + stock;
				successCount++;
			} else {
                newInventory[code] = { name, price, stock };
                successCount++;
            }
        }
        
        if (successCount === 0) {
            showNotification('No valid products found in CSV', 'error');
            return;
        }
        
        // Update inventory
        if (fromStartDay) {
            // Update main database directly
            Object.assign(productDatabase, newInventory);
            saveToStorage();
            showNotification(`Inventory updated: ${successCount} products loaded`, 'success');
            setTimeout(() => openStartDayModal(), 300);
        } else {
            // Merge into temp inventory
            Object.assign(state.tempInventory, newInventory);
            populateInventoryTable();
            showNotification(`Invoice loaded: ${successCount} products${errorCount > 0 ? ` (${errorCount} errors)` : ''}`, 'success');
        }
        
    } catch (error) {
        console.error('Error parsing CSV:', error);
        showNotification('Error reading CSV file', 'error');
    }
}

// ============================================
// Day Management - Business Operations
// ============================================
function openStartDayModal() {
    // Populate inventory summary
    const sortedCodes = Object.keys(productDatabase).sort();
    elements.inventorySummary.innerHTML = sortedCodes.map(code => {
        const product = productDatabase[code];
        return `
            <div class="inventory-summary-item">
                <span>${code} - ${product.name}</span>
                <span>${product.stock} units</span>
            </div>
        `;
    }).join('');
    
    // Reset cash inputs
    elements.cash20.value = '0';
    elements.cash10.value = '0';
    elements.cash5.value = '0';
    elements.cash1.value = '0';
    elements.cash025.value = '0';
    elements.cash010.value = '0';
    elements.cash005.value = '0';
    elements.cash001.value = '0';
    updateAllCashTotals();
    
    elements.startDayModal.classList.add('active');
}

function closeStartDayModal() {
    elements.startDayModal.classList.remove('active');
}

function updateCashTotal(input, totalElement, value) {
    const count = parseInt(input.value) || 0;
    const total = count * value;
    totalElement.textContent = formatCurrency(total);
    updateAllCashTotals();
}

function updateAllCashTotals() {
    const total = roundCurrency(
        (parseInt(elements.cash20.value) || 0) * 20 +
        (parseInt(elements.cash10.value) || 0) * 10 +
        (parseInt(elements.cash5.value) || 0) * 5 +
        (parseInt(elements.cash1.value) || 0) * 1 +
        (parseInt(elements.cash025.value) || 0) * 0.25 +
        (parseInt(elements.cash010.value) || 0) * 0.10 +
        (parseInt(elements.cash005.value) || 0) * 0.05 +
        (parseInt(elements.cash001.value) || 0) * 0.01
    );
    elements.totalStartingCash.textContent = formatCurrency(total);
}

function confirmStartDay() {
    const startingCash = 
        (parseInt(elements.cash20.value) || 0) * 20 +
        (parseInt(elements.cash10.value) || 0) * 10 +
        (parseInt(elements.cash5.value) || 0) * 5 +
        (parseInt(elements.cash1.value) || 0) * 1 +
        (parseInt(elements.cash025.value) || 0) * 0.25 +
        (parseInt(elements.cash010.value) || 0) * 0.10 +
        (parseInt(elements.cash005.value) || 0) * 0.05 +
        (parseInt(elements.cash001.value) || 0) * 0.01;
    
    // Initialize day state
    state.dayStarted = true;
    state.dayStartTime = new Date();
    state.startingCash = startingCash;
    state.startingInventory = JSON.parse(JSON.stringify(productDatabase));
    state.receivedInventory = {};
    state.transactions = [];
    state.cashSales = 0;
    state.cardSales = 0;
    
    // Enable/disable buttons
    elements.btnStartDay.disabled = true;
    elements.btnEndDay.disabled = false;
    elements.btnAuditTill.disabled = false;
    elements.btnInventory.disabled = false;
    
    saveToStorage();
    closeStartDayModal();
    showNotification('Day started successfully', 'success');
}

function openAuditTillModal() {
    if (!state.dayStarted) {
        showNotification('Please start the day first', 'warning');
        return;
    }
    
    const expectedCash = state.startingCash + state.cashSales;
    const totalSales = state.cashSales + state.cardSales;
    
    document.getElementById('auditStartingCash').textContent = formatCurrency(state.startingCash);
    document.getElementById('auditCashSales').textContent = formatCurrency(state.cashSales);
    document.getElementById('auditExpectedCash').textContent = formatCurrency(expectedCash);
    document.getElementById('auditTotalTransactions').textContent = state.transactions.length;
    document.getElementById('auditCardSales').textContent = formatCurrency(state.cardSales);
    document.getElementById('auditTotalSales').textContent = formatCurrency(totalSales);
    
    elements.auditTillModal.classList.add('active');
}

function closeAuditTillModal() {
    elements.auditTillModal.classList.remove('active');
}

function openEndDayModal() {
    if (!state.dayStarted) {
        showNotification('No day in progress', 'warning');
        return;
    }
    
    if (state.items.length > 0) {
        showNotification('Please complete or clear the current transaction first', 'warning');
        return;
    }
    
    // Calculate totals
    const totalSales = state.cashSales + state.cardSales;
    const avgTransaction = state.transactions.length > 0 ? totalSales / state.transactions.length : 0;
    const expectedCash = state.startingCash + state.cashSales;
    
    // Populate report
    document.getElementById('reportCashSales').textContent = formatCurrency(state.cashSales);
    document.getElementById('reportCardSales').textContent = formatCurrency(state.cardSales);
    document.getElementById('reportTotalSales').textContent = formatCurrency(totalSales);
    document.getElementById('reportTotalTransactions').textContent = state.transactions.length;
    document.getElementById('reportAvgTransaction').textContent = formatCurrency(avgTransaction);
    document.getElementById('reportStartingCash').textContent = formatCurrency(state.startingCash);
    document.getElementById('reportCashFromSales').textContent = formatCurrency(state.cashSales);
    document.getElementById('reportExpectedCash').textContent = formatCurrency(expectedCash);
    
    // Populate inventory adjustments
    // Collect all product codes seen during the day (starting + any new from orders)
    const allCodes = new Set([
        ...Object.keys(state.startingInventory),
        ...Object.keys(productDatabase)
    ]);
    const sortedCodes = Array.from(allCodes).sort();
    
    const adjustmentsBody = document.getElementById('inventoryAdjustmentsBody');
    adjustmentsBody.innerHTML = sortedCodes.map(code => {
        const startStock  = state.startingInventory[code] ? state.startingInventory[code].stock : 0;
        const received    = state.receivedInventory[code] || 0;
        const endStock    = productDatabase[code] ? productDatabase[code].stock : 0;
        const sold        = startStock + received - endStock;
        const productName = (state.startingInventory[code] || productDatabase[code] || {}).name || code;
        
        return `
            <tr>
                <td>${code}</td>
                <td>${productName}</td>
                <td style="text-align:center">${startStock}</td>
                <td style="text-align:center;color:var(--color-success);font-weight:600">${received > 0 ? '+' + received : '—'}</td>
                <td style="text-align:center">${sold}</td>
                <td style="text-align:center">${endStock}</td>
            </tr>
        `;
    }).join('');
    
    elements.endDayModal.classList.add('active');
}

function closeEndDayModal() {
    elements.endDayModal.classList.remove('active');
}

function confirmEndDay() {
    // Snapshot EOD report before clearing state
    if (typeof PW !== 'undefined') {
        const eodHTML = generateEODReportHTML();
        PW.saveEOD(eodHTML, new Date(), {
            cashSales:    state.cashSales,
            cardSales:    state.cardSales,
            transactions: state.transactions.length
        });
    }
    // Reset day state
    state.dayStarted = false;
    state.dayStartTime = null;
    state.startingCash = 0;
    state.startingInventory = {};
    state.receivedInventory = {};
    state.transactions = [];
    state.cashSales = 0;
    state.cardSales = 0;
    
    // Enable/disable buttons
    elements.btnStartDay.disabled = false;
    elements.btnEndDay.disabled = true;
    elements.btnAuditTill.disabled = true;
    elements.btnInventory.disabled = true;
    
    advanceAppDate();     // move business date forward one day
    saveToStorage();
    closeEndDayModal();
    showNotification('Day ended successfully. Business date is now ' + getAppDateStr(), 'success');
}

// ============================================
// EOD Report Snapshot – for Calendar records
// ============================================
function generateEODReportHTML() {
    const now      = new Date();
    const appDate  = getAppDateObj();
    const totalSales     = state.cashSales + state.cardSales;
    const avgTransaction = state.transactions.length > 0 ? totalSales / state.transactions.length : 0;
    const expectedCash   = state.startingCash + state.cashSales;

    // Collect all codes seen during the day
    const allCodes = new Set([
        ...Object.keys(state.startingInventory),
        ...Object.keys(productDatabase)
    ]);

    const adjRows = Array.from(allCodes).sort().map(function(code) {
        const startStock  = state.startingInventory[code] ? state.startingInventory[code].stock : 0;
        const received    = state.receivedInventory[code] || 0;
        const endStock    = productDatabase[code] ? productDatabase[code].stock : 0;
        const sold        = startStock + received - endStock;
        const productName = (state.startingInventory[code] || productDatabase[code] || {}).name || code;

        return '<tr><td>' + code + '</td><td>' + productName +
               '</td><td class="pw-right">' + startStock +
               '</td><td class="pw-right">' + (received > 0 ? '+' + received : '\u2014') +
               '</td><td class="pw-right">' + sold +
               '</td><td class="pw-right">' + endStock + '</td></tr>';
    }).join('');

    return '<div class="pw-doc-header">' +
        '<div class="pw-doc-title">END OF DAY REPORT</div>' +
        '<div class="pw-doc-meta">' + appDate.toLocaleDateString() +
        ' &nbsp;&bull;&nbsp; Closed: ' + now.toLocaleTimeString() + '</div>' +
        '</div>' +
        '<div class="pw-eod-section pw-section"><h3>Sales Summary</h3>' +
        '<table><tr><td>Cash Sales</td><td class="pw-right">' + formatCurrency(state.cashSales) + '</td></tr>' +
        '<tr><td>Card Sales</td><td class="pw-right">' + formatCurrency(state.cardSales) + '</td></tr>' +
        '<tr class="pw-total-row"><td>Total Sales</td><td class="pw-right">' + formatCurrency(totalSales) + '</td></tr>' +
        '<tr><td>Transactions</td><td class="pw-right">' + state.transactions.length + '</td></tr>' +
        '<tr><td>Avg Transaction</td><td class="pw-right">' + formatCurrency(avgTransaction) + '</td></tr>' +
        '</table></div>' +
        '<div class="pw-eod-section pw-section"><h3>Cash Management</h3>' +
        '<table><tr><td>Starting Cash</td><td class="pw-right">' + formatCurrency(state.startingCash) + '</td></tr>' +
        '<tr><td>Cash from Sales</td><td class="pw-right">' + formatCurrency(state.cashSales) + '</td></tr>' +
        '<tr class="pw-total-row"><td>Expected in Drawer</td><td class="pw-right">' + formatCurrency(expectedCash) + '</td></tr>' +
        '</table></div>' +
        (adjRows ? '<div class="pw-eod-section pw-section"><h3>Inventory Adjustments</h3>' +
        '<table><thead><tr><th>SKU</th><th>Product</th><th class="pw-right">Start</th><th class="pw-right">Received</th><th class="pw-right">Sold</th><th class="pw-right">End</th></tr></thead>' +
        '<tbody>' + adjRows + '</tbody></table></div>' : '') +
        '<div class="pw-doc-footer">Zen Register \u2014 End of Day Record</div>';
}


// ============================================
// Utility Functions - Helper Stones
// ============================================
function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}

function showNotification(message, type = 'info') {
    // Simple notification - in production, use a proper notification system
    const colors = {
        info: 'var(--color-accent)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${colors[type]};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// Keyboard Shortcuts - Flowing Efficiency
// ============================================
document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
        closePaymentModal();
        closeReceiptModal();
        closeInventoryModal();
        closeEditProductModal();
        closeStartDayModal();
        closeAuditTillModal();
        closeEndDayModal();
        if (typeof closeOrderGuideModal === 'function') closeOrderGuideModal();
    }
    
    // F1 for Cash payment
    if (e.key === 'F1') {
        e.preventDefault();
        if (state.dayStarted) {
            openPaymentModal('cash');
        }
    }
    
    // F2 for Card payment
    if (e.key === 'F2') {
        e.preventDefault();
        if (state.dayStarted) {
            openPaymentModal('card');
        }
    }
    
    // Delete to void selected item
    if (e.key === 'Delete' && state.selectedItemIndex !== null) {
        voidSelectedItem();
    }
});

// ============================================
// Initialize Application - Plant the Garden
// ============================================
init();

// Make functions available globally for onclick handlers
window.selectItem = selectItem;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
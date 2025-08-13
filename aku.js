
let selectedWeapon = {
    name: '',
    price: '',
    id: ''
};


function enterStore() {

    window.location.href = 'dia.html';
}


function showDetails(name, description, price, id) {

    selectedWeapon = { name, price, id };
    

    document.getElementById('popupTitle').textContent = name;
    document.getElementById('popupDescription').textContent = description;
    document.getElementById('popupPrice').textContent = price;
    
    document.getElementById('popupOverlay').style.display = 'flex';
    
  
    window.tempWeaponData = selectedWeapon;
}

function closePopup() {
    document.getElementById('popupOverlay').style.display = 'none';
}

function goToPurchase() {
  
    const params = new URLSearchParams({
        name: selectedWeapon.name,
        price: selectedWeapon.price,
        id: selectedWeapon.id
    });
    
 
    window.location.href = `saya.html?${params.toString()}`;
}


function initializePurchasePage() {

    const urlParams = new URLSearchParams(window.location.search);
    const weaponName = urlParams.get('name');
    const weaponPrice = urlParams.get('price');
    const weaponId = urlParams.get('id');
    

    if (weaponName && weaponPrice) {
        document.getElementById('selectedItem').value = weaponName;
        document.getElementById('weaponPrice').value = weaponPrice;
        
      
        selectedWeapon = {
            name: weaponName,
            price: weaponPrice,
            id: weaponId
        };
    }
    
   
    setupFormValidation();
}

function setupFormValidation() {
    const form = document.getElementById('purchaseForm');
    const buyButton = document.getElementById('buyButton');
    
    if (!form || !buyButton) return;
    

    function validateForm() {
        const paymentMethod = document.getElementById('paymentMethod').value;
        const selectedItem = document.getElementById('selectedItem').value;
        const location = document.getElementById('location').value;
        const playerName = document.getElementById('playerName').value;
        const playerClass = document.getElementById('playerClass').value;
        
        const isValid = paymentMethod && selectedItem && location.trim() && 
                       playerName.trim() && playerClass;
        
        buyButton.disabled = !isValid;
        
        if (isValid) {
            buyButton.style.opacity = '1';
            buyButton.style.cursor = 'pointer';
        } else {
            buyButton.style.opacity = '0.5';
            buyButton.style.cursor = 'not-allowed';
        }
    }
    
 
    const formInputs = ['paymentMethod', 'location', 'playerName', 'playerClass'];
    formInputs.forEach(inputId => {
        const element = document.getElementById(inputId);
        if (element) {
            element.addEventListener('change', validateForm);
            element.addEventListener('input', validateForm);
        }
    });
    
  
    validateForm();
    
    
    form.addEventListener('submit', handlePurchaseSubmit);
}

function handlePurchaseSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const purchaseData = {
        weapon: formData.get('selectedItem'),
        price: formData.get('weaponPrice'),
        paymentMethod: formData.get('paymentMethod'),
        location: formData.get('location'),
        playerName: formData.get('playerName'),
        playerClass: formData.get('playerClass'),
        notes: formData.get('notes') || 'Tidak ada catatan khusus',
        timestamp: new Date().toLocaleString('id-ID')
    };
    
 
    showPurchaseConfirmation(purchaseData);
}

function showPurchaseConfirmation(data) {
    const confirmationHTML = `
        <div style="text-align: left; line-height: 1.8;">
            <p><strong>🎉 Pembelian Berhasil Dikonfirmasi! 🎉</strong></p>
            <hr style="border-color: #8B4513; margin: 15px 0;">
            <p><strong>📋 Detail Pembelian:</strong></p>
            <p>👤 <strong>Nama Pejuang:</strong> ${data.playerName}</p>
            <p>⚔️ <strong>Kelas:</strong> ${data.playerClass}</p>
            <p>🗡️ <strong>Senjata:</strong> ${data.weapon}</p>
            <p>💰 <strong>Harga:</strong> ${data.price}</p>
            <p>💳 <strong>Pembayaran:</strong> ${data.paymentMethod}</p>
            <p>📍 <strong>Lokasi Pengiriman:</strong> ${data.location}</p>
            <p>📝 <strong>Catatan:</strong> ${data.notes}</p>
            <p>🕐 <strong>Waktu Pemesanan:</strong> ${data.timestamp}</p>
            <hr style="border-color: #8B4513; margin: 15px 0;">
            <p style="color: #ffd700; font-weight: bold;">
                ⚡ Senjata legendaris Anda akan segera ditempa dan dikirim ke ${data.location}!
            </p>
            <p style="font-style: italic; opacity: 0.8;">
                "Semoga kekuatan senjata ini membawa kemenangan dalam setiap pertempuran!"
            </p>
        </div>
    `;
    
    document.getElementById('confirmationDetails').innerHTML = confirmationHTML;
    document.getElementById('confirmModal').style.display = 'flex';
    
    
    setTimeout(() => {
        document.getElementById('purchaseForm').reset();
        setupFormValidation(); 
    }, 1000);
}

document.addEventListener('DOMContentLoaded', function() {
    
    if (window.location.pathname.includes('saya.html')) {
        initializePurchasePage();
    }
    
   
    setupPopupEventListeners();
  
    setupKeyboardShortcuts();
});

function setupPopupEventListeners() {
    const popupOverlay = document.getElementById('popupOverlay');
    const confirmModal = document.getElementById('confirmModal');
    
    
    if (popupOverlay) {
        popupOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closePopup();
            }
        });
    }
    
    if (confirmModal) {
        confirmModal.addEventListener('click', function(e) {
            if (e.target === this) {
                confirmModal.style.display = 'none';
            }
        });
    }
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
       
        if (e.key === 'Escape') {
            const popupOverlay = document.getElementById('popupOverlay');
            const confirmModal = document.getElementById('confirmModal');
            
            if (popupOverlay && popupOverlay.style.display === 'flex') {
                closePopup();
            }
            
            if (confirmModal && confirmModal.style.display === 'flex') {
                confirmModal.style.display = 'none';
            }
        }
        
      
        if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'submit') {
            const form = e.target.closest('form');
            if (form) {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn && !submitBtn.disabled) {
                    submitBtn.click();
                }
            }
        }
    });
}


function showNotification(message, type = 'info') {
 
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#2d5016' : '#8B4513'};
        color: #d4af37;
        padding: 15px 25px;
        border-radius: 10px;
        border: 2px solid #d4af37;
        font-family: 'Cinzel', serif;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.5);
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
   
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function animateButton(button) {
    if (!button) return;
    
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}


function injectAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
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
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .pulse {
            animation: pulse 0.6s ease-in-out;
        }
    `;
    document.head.appendChild(style);
}


injectAnimationStyles();


window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    showNotification('Terjadi kesalahan. Silakan muat ulang halaman.', 'error');
});


function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
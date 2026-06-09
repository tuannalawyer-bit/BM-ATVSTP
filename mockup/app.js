document.addEventListener('DOMContentLoaded', () => {
    // Current date default
    const dateInput = document.getElementById('evaluation-date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    // Database in memory
    let defectiveProducts = [];
    let selectedImageSrc = '';

    // Mock Database for Barcode Autocomplete
    const productCatalog = {
        "8936079010025": { name: "Sữa tươi tiệt trùng TH True Milk ít đường 1L", img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&auto=format&fit=crop&q=60" },
        "8934563138012": { name: "Mì ăn liền Hảo Hảo tôm chua cay 75g", img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&auto=format&fit=crop&q=60" },
        "2901234500150": { name: "Táo Rockit New Zealand ống 4 quả", img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&auto=format&fit=crop&q=60" },
        "8935049500412": { name: "Bánh bông lan Solite vị Lá Dứa hộp 360g", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&auto=format&fit=crop&q=60" }
    };

    // Tab Navigation
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.add('hidden'));

            tab.classList.add('active');
            const target = tab.getAttribute('data-target');
            document.getElementById(target).classList.remove('hidden');
        });
    });

    // Form Expand / Collapse
    const btnAddProduct = document.getElementById('btn-add-product');
    const formPanel = document.getElementById('product-form-panel');
    const btnCancelProd = document.getElementById('btn-cancel-prod');

    btnAddProduct.addEventListener('click', () => {
        formPanel.classList.toggle('hidden');
        if (!formPanel.classList.contains('hidden')) {
            formPanel.scrollIntoView({ behavior: 'smooth' });
        }
    });

    btnCancelProd.addEventListener('click', (e) => {
        e.preventDefault();
        clearForm();
        formPanel.classList.add('hidden');
    });

    // Web Audio API for Barcode Scanner "Beep" Sound
    function playBeep() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.value = 1200; // High pitch beep
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.15);

            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.15);
        } catch (err) {
            console.log('Audio Context failed', err);
        }
    }

    // Modal Scanner Simulation
    const btnScanBarcode = document.getElementById('btn-scan-barcode');
    const scannerModal = document.getElementById('scanner-modal');
    const btnCloseScanner = document.getElementById('btn-close-scanner');
    const presetBtns = document.querySelectorAll('.preset-btn');
    const scannerImg = document.getElementById('scanner-img');

    btnScanBarcode.addEventListener('click', (e) => {
        e.preventDefault();
        scannerModal.classList.remove('hidden');
    });

    btnCloseScanner.addEventListener('click', () => {
        scannerModal.classList.add('hidden');
    });

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.getAttribute('data-code');
            const name = btn.getAttribute('data-name');
            
            // Play Beep Sound
            playBeep();
            
            // Populate fields
            document.getElementById('prod-barcode').value = code;
            document.getElementById('prod-name').value = name;
            
            // Close modal
            scannerModal.classList.add('hidden');
            
            // Focus on quantity
            document.getElementById('prod-qty').focus();
        });
    });

    // Handle Barcode Manual Input Autocomplete
    const barcodeInput = document.getElementById('prod-barcode');
    barcodeInput.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        if (productCatalog[value]) {
            document.getElementById('prod-name').value = productCatalog[value].name;
        }
    });

    // Image Upload Handling
    const uploadBox = document.getElementById('image-upload-box');
    const imageInput = document.getElementById('prod-image');
    const previewContainer = document.getElementById('image-preview-container');
    const previewImg = document.getElementById('image-preview');
    const btnRemoveImg = document.getElementById('btn-remove-img');

    uploadBox.addEventListener('click', () => imageInput.click());
    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            selectedImageSrc = URL.createObjectURL(file);
            previewImg.src = selectedImageSrc;
            uploadBox.style.display = 'none';
            previewContainer.classList.remove('hidden');
        }
    });

    btnRemoveImg.addEventListener('click', (e) => {
        e.preventDefault();
        imageInput.value = '';
        selectedImageSrc = '';
        previewImg.src = '';
        previewContainer.classList.add('hidden');
        uploadBox.style.display = 'flex';
    });

    // UUID Generator for csResultId
    function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Save Defective Product
    const btnSaveProd = document.getElementById('btn-save-prod');
    btnSaveProd.addEventListener('click', (e) => {
        e.preventDefault();
        
        const barcode = document.getElementById('prod-barcode').value.trim();
        const name = document.getElementById('prod-name').value.trim();
        const status = document.getElementById('prod-status').value;
        const qty = parseInt(document.getElementById('prod-qty').value) || 1;
        const nsx = document.getElementById('prod-nsx').value;
        const hsd = document.getElementById('prod-hsd').value;

        if (!barcode || !name) {
            alert('Vui lòng nhập Mã vạch và Tên sản phẩm!');
            return;
        }

        // Mock thumbnail image
        let imgUrl = selectedImageSrc || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=60';
        if (productCatalog[barcode] && !selectedImageSrc) {
            imgUrl = productCatalog[barcode].img;
        }

        const newProduct = {
            csResultId: generateUUID(),
            barcode: barcode,
            name: name,
            status: status,
            qty: qty,
            nsx: nsx ? formatDate(nsx) : 'N/A',
            hsd: hsd ? formatDate(hsd) : 'N/A',
            img: imgUrl
        };

        defectiveProducts.push(newProduct);
        renderProductList();
        clearForm();
        formPanel.classList.add('hidden');
        updateJSONPreview();
    });

    // Helper functions
    function formatDate(dateString) {
        const parts = dateString.split('-');
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    function clearForm() {
        document.getElementById('prod-barcode').value = '';
        document.getElementById('prod-name').value = '';
        document.getElementById('prod-qty').value = '1';
        document.getElementById('prod-nsx').value = '';
        document.getElementById('prod-hsd').value = '';
        document.getElementById('prod-status').selectedIndex = 0;
        
        // Reset image
        imageInput.value = '';
        selectedImageSrc = '';
        previewImg.src = '';
        previewContainer.classList.add('hidden');
        uploadBox.style.display = 'flex';
    }

    // Delete Product
    window.deleteProduct = function(csResultId) {
        defectiveProducts = defectiveProducts.filter(p => p.csResultId !== csResultId);
        renderProductList();
        updateJSONPreview();
    };

    // Render defective product list
    const defectiveProductsList = document.getElementById('defective-products-list');
    const totalSkuBadge = document.getElementById('total-sku-badge');

    function renderProductList() {
        if (defectiveProducts.length === 0) {
            defectiveProductsList.innerHTML = `
                <tr class="empty-row">
                    <td colspan="7">Chưa có sản phẩm lỗi nào được khai báo. Nhấn "Khai Báo Sản Phẩm Lỗi" ở trên để thêm.</td>
                </tr>
            `;
            totalSkuBadge.innerText = 'Total SKU: 0';
            return;
        }

        let html = '';
        let totalQty = 0;

        defectiveProducts.forEach(p => {
            totalQty += p.qty;
            html += `
                <tr>
                    <td><img src="${p.img}" class="product-thumb" alt="Product Image"></td>
                    <td class="code">${p.barcode}</td>
                    <td><strong>${p.name}</strong></td>
                    <td><span class="badge" style="background-color: ${p.status === 'Hết Hạn Sử Dụng' ? '#ef4444' : '#f59e0b'}">${p.status}</span></td>
                    <td style="font-size: 11px;">NSX: ${p.nsx}<br><strong>HSD: ${p.hsd}</strong></td>
                    <td style="font-weight: 600; text-align: center;">${p.qty}</td>
                    <td>
                        <button class="btn-icon" onclick="deleteProduct('${p.csResultId}')" title="Xóa">🗑️</button>
                    </td>
                </tr>
            `;
        });

        defectiveProductsList.innerHTML = html;
        totalSkuBadge.innerText = `Total SKU: ${defectiveProducts.length} (Tổng sản phẩm lỗi: ${totalQty})`;
    }

    // Update JSON Preview
    const jsonPreview = document.getElementById('json-preview');
    function updateJSONPreview() {
        const storeId = document.getElementById('store-select').value;
        const date = document.getElementById('evaluation-date').value;
        
        const payload = {
            metadata: {
                cId: 90, // Checklist cId
                siteId: storeId,
                date: date,
                inspector: "Nguyễn Anh Tuấn",
                csId: "90590b97-3486-4bee-a201-9f9ef581de59" // Mock checklist session ID
            },
            defectiveItems: defectiveProducts.map(p => ({
                csResultId: p.csResultId,
                barcode: p.barcode,
                name: p.name,
                errorsCount: p.qty,
                conditionStatus: p.status,
                dates: {
                    nsx: p.nsx,
                    hsd: p.hsd
                }
            }))
        };

        jsonPreview.innerText = JSON.stringify(payload, null, 4);
    }

    // Initial update of JSON preview
    updateJSONPreview();

    // Trigger update on fields changes
    document.getElementById('store-select').addEventListener('change', updateJSONPreview);
    dateInput.addEventListener('change', updateJSONPreview);

    // Sync to OPS Simulation
    const btnSyncOps = document.getElementById('btn-sync-ops');
    btnSyncOps.addEventListener('click', async () => {
        if (defectiveProducts.length === 0) {
            alert('Chưa có sản phẩm lỗi nào để đồng bộ! Hãy khai báo ít nhất 1 sản phẩm.');
            return;
        }

        btnSyncOps.disabled = true;
        btnSyncOps.innerText = '⏳ Đang đồng bộ...';

        const storeId = document.getElementById('store-select').value;
        const totalItems = defectiveProducts.length;

        // Print simulated sync log in alert format
        let logText = `--- BẮT ĐẦU ĐỒNG BỘ WINMART OPS ---\n`;
        logText += `Đang kết nối tới server ops.winmart.vn...\n`;
        logText += `Khởi tạo phiên đánh giá (csId = 90590b97-3486-4bee-a201-9f9ef581de59)...\n\n`;

        for (let i = 0; i < defectiveProducts.length; i++) {
            const p = defectiveProducts[i];
            logText += `[${i+1}/${totalItems}] Đang đồng bộ SKU: ${p.barcode} (${p.name.substring(0, 20)}...)\n`;
            logText += `   ↳ Gửi POST /UpdateCheckListSiteResult (csResultId = ${p.csResultId.substring(0,8)}..., point = ${p.qty}) -> Thành công!\n`;
            logText += `   ↳ Gửi POST /UpdateChecklistSiteDeadlineNote (updateType = 1, note = "${p.status}") -> Thành công!\n`;
            logText += `   ↳ Gửi POST /UpdateChecklistSiteDeadlineNote (updateType = 2, note = "Vận hành") -> Thành công!\n`;
            logText += `   ↳ Gửi POST /UpdateChecklistSiteResultNote (note = "Barcode: ${p.barcode} | NSX: ${p.nsx} - HSD: ${p.hsd}") -> Thành công!\n\n`;
        }

        logText += `Xác nhận và hoàn thành cuộc đánh giá:\n`;
        logText += `   ↳ Gửi POST /CompleteUpdateCheckListSiteResult (csId = 90590b97-3486-4bee-a201-9f9ef581de59) -> Thành công!\n`;
        logText += `--- ĐỒNG BỘ HOÀN TẤT ---`;

        setTimeout(() => {
            alert(logText);
            btnSyncOps.disabled = false;
            btnSyncOps.innerHTML = '⚡ Đẩy Dữ Liệu Lên OPS';
        }, 1500);
    });
});

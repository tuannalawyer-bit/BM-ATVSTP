document.addEventListener('DOMContentLoaded', () => {
    // Current date default
    const dateInput = document.getElementById('evaluation-date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    // Define the 6 checklist items under II. PRODUCT
    const productItems = [
        { code: "P1.1", desc: "Chất lượng sản phẩm: Không có sản phẩm bị mốc, thối (*). (Điền số SKU lỗi)", defaultDept: "Vận hành" },
        { code: "P1.2", desc: "Chất lượng sản phẩm: Không có sản phẩm kém chất lượng khác tại khu vực bày bán. (Điền số SKU lỗi)", defaultDept: "Vận hành" },
        { code: "P1.3", desc: "Hạn sử dụng: Không có hàng hết HSD/ kéo dài HSD tại khu vực trưng bày bán (*) (Điền số SKU lỗi)", defaultDept: "Vận hành" },
        { code: "P1.4", desc: "Nhãn mác: đủ thông tin, không mờ nhòe, nội dung phải đồng nhất (Điền số SKU lỗi)", defaultDept: "Vận hành" },
        { code: "P1.5", desc: "Bao bì: Nguyên vẹn, không hở/móp méo (Điền số SKU lỗi)", defaultDept: "NCC" },
        { code: "P1.6", desc: "Tuân thủ rút hàng khỏi quầy: đúng thời hạn quy định. (Điền số SKU lỗi)", defaultDept: "Vận hành" }
    ];

    // Data Store
    let defectiveProducts = {
        "P1.1": [],
        "P1.2": [],
        "P1.3": [],
        "P1.4": [],
        "P1.5": [],
        "P1.6": []
    };

    let departments = {
        "P1.1": "Vận hành",
        "P1.2": "Vận hành",
        "P1.3": "Vận hành",
        "P1.4": "Vận hành",
        "P1.5": "NCC",
        "P1.6": "Vận hành"
    };

    // Keep track of which row is currently scanning
    let currentlyScanningCode = "";

    // Mock Database for Barcode Autocomplete
    const productCatalog = {
        "8936079010025": { name: "Sữa tươi tiệt trùng TH True Milk ít đường 1L", img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&auto=format&fit=crop&q=60" },
        "8934563138012": { name: "Mì ăn liền Hảo Hảo tôm chua cay 75g", img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&auto=format&fit=crop&q=60" },
        "2901234500150": { name: "Táo Rockit New Zealand ống 4 quả", img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&auto=format&fit=crop&q=60" },
        "8935049500412": { name: "Bánh bông lan Solite vị Lá Dứa hộp 360g", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&auto=format&fit=crop&q=60" }
    };

    // Render the 6 Main Rows and Hidden Sub-Rows
    const tableBody = document.getElementById('product-checklist-rows');

    function renderChecklistTable() {
        let html = '';
        productItems.forEach(item => {
            const list = defectiveProducts[item.code];
            const totalQty = list.reduce((sum, p) => sum + p.qty, 0);
            const dept = departments[item.code];
            const aggregatedNote = getAggregatedNote(item.code);

            html += `
                <!-- Main Row -->
                <tr id="row-main-${item.code}">
                    <td class="code">${item.code}</td>
                    <td>${item.desc}</td>
                    <td style="text-align: center;">
                        <span class="error-badge-ops" id="ops-badge-${item.code}">${totalQty}</span>
                    </td>
                    <td>
                        <select class="table-input dept-select" data-code="${item.code}">
                            <option value="Vận hành" ${dept === 'Vận hành' ? 'selected' : ''}>Vận hành</option>
                            <option value="NCC" ${dept === 'NCC' ? 'selected' : ''}>NCC</option>
                            <option value="Logistics" ${dept === 'Logistics' ? 'selected' : ''}>Logistics</option>
                            <option value="Khác" ${dept === 'Khác' ? 'selected' : ''}>Khác</option>
                        </select>
                    </td>
                    <td>
                        <div class="aggregated-note-box" id="ops-note-${item.code}">${aggregatedNote || 'Trống (không lỗi)'}</div>
                    </td>
                    <td style="text-align: center;">
                        <button class="btn btn-secondary btn-manage" data-code="${item.code}" style="font-size: 11px; padding: 6px 12px;">
                            ⚙️ Quản lý lỗi (${list.length})
                        </button>
                    </td>
                </tr>

                <!-- Expanded Detail Row -->
                <tr id="row-detail-${item.code}" class="detail-row hidden">
                    <td colspan="6" class="detail-cell">
                        <div class="sub-panel-card">
                            <div class="sub-panel-title">KHAI BÁO CHI TIẾT SẢN PHẨM LỖI - HẠNG MỤC ${item.code}</div>
                            
                            <!-- Sub-form to Add Defective Product -->
                            <div class="sub-form-grid">
                                <div class="form-group col-2">
                                    <label>Mã Vạch (Barcode) / SKU</label>
                                    <div class="input-with-button">
                                        <input type="text" id="input-barcode-${item.code}" placeholder="Nhập mã vạch hoặc bấm quét">
                                        <button class="btn btn-primary btn-scan-trigger" data-code="${item.code}" style="padding: 6px 12px; font-size: 11px;">
                                            📷 Quét Mã
                                        </button>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Số Lượng Lỗi</label>
                                    <input type="number" id="input-qty-${item.code}" value="1" min="1">
                                </div>
                                <div class="form-group col-3">
                                    <label>Tên Sản Phẩm</label>
                                    <input type="text" id="input-name-${item.code}" placeholder="Tên sản phẩm">
                                </div>
                                <div class="form-group">
                                    <label>Tình Trạng Hỏng</label>
                                    <select id="input-status-${item.code}">
                                        <option value="Hết Hạn Sử Dụng">Hết Hạn Sử Dụng</option>
                                        <option value="Thối Mốc / Hỏng">Thối Mốc / Hỏng</option>
                                        <option value="Bao Bì Rách Móp">Bao Bì Rách Móp</option>
                                        <option value="Kém Chất Lượng Khác">Kém Chất Lượng Khác</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Ngày Sản Xuất (NSX)</label>
                                    <input type="date" id="input-nsx-${item.code}">
                                </div>
                                <div class="form-group">
                                    <label>Hạn Sử Dụng (HSD)</label>
                                    <input type="date" id="input-hsd-${item.code}">
                                </div>
                                <div class="form-group col-2">
                                    <label>Ghi Chú Riêng</label>
                                    <input type="text" id="input-note-${item.code}" placeholder="Nhập ghi chú cụ thể cho sản phẩm này">
                                </div>
                                <div class="form-group col-2">
                                    <label>Hình Ảnh Minh Chứng</label>
                                    <div class="image-upload-wrapper">
                                        <input type="file" id="file-img-${item.code}" accept="image/*" style="display: none;" data-code="${item.code}">
                                        <div class="image-upload-box" id="upload-box-${item.code}" data-code="${item.code}">
                                            <span class="icon">🖼️</span>
                                            <p style="font-size: 10px;">Chọn ảnh lỗi</p>
                                        </div>
                                        <div class="image-preview hidden" id="preview-container-${item.code}">
                                            <img id="preview-img-${item.code}" src="" alt="Preview">
                                            <button class="btn-remove-img" data-code="${item.code}">✕</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group sub-form-actions">
                                    <button class="btn btn-primary btn-save-sub" data-code="${item.code}" style="width: 100%;">
                                        Lưu Sản Phẩm
                                    </button>
                                </div>
                            </div>

                            <!-- List of Added Defective Products under this row -->
                            <div class="sub-products-list-wrapper">
                                <div class="sub-table-header">Danh sách lỗi đã nhập:</div>
                                <table class="sub-products-table">
                                    <thead>
                                        <tr>
                                            <th>Ảnh</th>
                                            <th>Mã Barcode</th>
                                            <th>Tên Sản Phẩm</th>
                                            <th>Tình Trạng</th>
                                            <th>NSX/HSD</th>
                                            <th>SL</th>
                                            <th>Ghi Chú</th>
                                            <th style="text-align: center;">Xóa</th>
                                        </tr>
                                    </thead>
                                    <tbody id="sub-products-list-body-${item.code}">
                                        ${renderSubProductsList(item.code)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;

        // Attach Event Listeners to the newly generated DOM elements
        attachEventListeners();
    }

    // Generate concatenated note for OPS
    function getAggregatedNote(code) {
        const list = defectiveProducts[code];
        if (list.length === 0) return "";
        const totalQty = list.reduce((sum, p) => sum + p.qty, 0);
        
        // Map products to a clean summary text
        const summaries = list.map(p => {
            let details = `SL:${p.qty}`;
            if (p.barcode) details += ` | Mã:${p.barcode}`;
            if (p.status) details += ` | TT:${p.status}`;
            if (p.hsd && p.hsd !== 'N/A') details += ` | HSD:${p.hsd}`;
            if (p.note) details += ` | GC:${p.note}`;
            return `[${p.name}: ${details}]`;
        });

        return `${totalQty} lỗi tổng hợp: ${summaries.join(' ; ')}`;
    }

    // Render defective products table for a specific row
    function renderSubProductsList(code) {
        const list = defectiveProducts[code];
        if (list.length === 0) {
            return `
                <tr>
                    <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 12px;">
                        Chưa khai báo sản phẩm lỗi nào cho mục này.
                    </td>
                </tr>
            `;
        }

        return list.map((p, idx) => `
            <tr>
                <td><img src="${p.img}" class="product-thumb" alt="Product Image"></td>
                <td class="code">${p.barcode}</td>
                <td><strong>${p.name}</strong></td>
                <td><span class="badge" style="background-color: ${p.status === 'Hết Hạn Sử Dụng' ? '#ef4444' : '#f59e0b'}; font-size: 9px; padding: 2px 6px;">${p.status}</span></td>
                <td style="font-size: 10px;">NSX: ${p.nsx}<br>HSD: ${p.hsd}</td>
                <td style="font-weight: 600;">${p.qty}</td>
                <td>${p.note || '-'}</td>
                <td style="text-align: center;">
                    <button class="btn-icon btn-delete-sub" data-code="${code}" data-idx="${idx}">🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    // Attach Event Listeners to DOM
    function attachEventListeners() {
        // Expand/Collapse Detail Row
        document.querySelectorAll('.btn-manage').forEach(btn => {
            btn.addEventListener('click', () => {
                const code = btn.getAttribute('data-code');
                const detailRow = document.getElementById(`row-detail-${code}`);
                
                // Toggle this row
                detailRow.classList.toggle('hidden');
                
                // Scroll into view
                if (!detailRow.classList.contains('hidden')) {
                    detailRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        });

        // Department Selection changes
        document.querySelectorAll('.dept-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const code = select.getAttribute('data-code');
                departments[code] = select.value;
                updateJSONPreview();
            });
        });

        // Image Dropzone Box click trigger
        document.querySelectorAll('.image-upload-box').forEach(box => {
            box.addEventListener('click', () => {
                const code = box.getAttribute('data-code');
                document.getElementById(`file-img-${code}`).click();
            });
        });

        // Image file selection
        document.querySelectorAll('input[type=file]').forEach(input => {
            input.addEventListener('change', (e) => {
                const code = input.getAttribute('data-code');
                if (e.target.files.length > 0) {
                    const file = e.target.files[0];
                    const url = URL.createObjectURL(file);
                    
                    // Show preview
                    document.getElementById(`preview-img-${code}`).src = url;
                    document.getElementById(`upload-box-${code}`).style.display = 'none';
                    document.getElementById(`preview-container-${code}`).classList.remove('hidden');
                    
                    // Temp save image URL inside input data attribute
                    input.setAttribute('data-url', url);
                }
            });
        });

        // Remove image evidence
        document.querySelectorAll('.btn-remove-img').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const code = btn.getAttribute('data-code');
                const fileInput = document.getElementById(`file-img-${code}`);
                
                fileInput.value = '';
                fileInput.removeAttribute('data-url');
                document.getElementById(`preview-img-${code}`).src = '';
                document.getElementById(`preview-container-${code}`).add('hidden');
                document.getElementById(`upload-box-${code}`).style.display = 'flex';
            });
        });

        // Autocomplete on barcode input manual entry
        productItems.forEach(item => {
            const input = document.getElementById(`input-barcode-${item.code}`);
            if (input) {
                input.addEventListener('input', (e) => {
                    const val = e.target.value.trim();
                    if (productCatalog[val]) {
                        document.getElementById(`input-name-${item.code}`).value = productCatalog[val].name;
                    }
                });
            }
        });

        // Scanner Trigger Modal opens
        document.querySelectorAll('.btn-scan-trigger').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                currentlyScanningCode = btn.getAttribute('data-code');
                document.getElementById('scanner-modal').classList.remove('hidden');
            });
        });

        // Save Sub Product
        document.querySelectorAll('.btn-save-sub').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const code = btn.getAttribute('data-code');
                saveSubProduct(code);
            });
        });

        // Delete Sub Product
        document.querySelectorAll('.btn-delete-sub').forEach(btn => {
            btn.addEventListener('click', () => {
                const code = btn.getAttribute('data-code');
                const idx = parseInt(btn.getAttribute('data-idx'));
                
                // Remove product
                defectiveProducts[code].splice(idx, 1);
                
                // Re-render
                renderChecklistTable();
                updateJSONPreview();
                
                // Keep the detail panel open for that item
                document.getElementById(`row-detail-${code}`).classList.remove('hidden');
            });
        });
    }

    // Save defect logic
    function saveSubProduct(code) {
        const barcode = document.getElementById(`input-barcode-${code}`).value.trim();
        const name = document.getElementById(`input-name-${code}`).value.trim();
        const qty = parseInt(document.getElementById(`input-qty-${code}`).value) || 1;
        const status = document.getElementById(`input-status-${code}`).value;
        const nsx = document.getElementById(`input-nsx-${code}`).value;
        const hsd = document.getElementById(`input-hsd-${code}`).value;
        const note = document.getElementById(`input-note-${code}`).value.trim();
        const imgInput = document.getElementById(`file-img-${code}`);
        const imgUrlTemp = imgInput ? imgInput.getAttribute('data-url') : '';

        if (!barcode || !name) {
            alert('Vui lòng nhập Mã vạch và Tên sản phẩm!');
            return;
        }

        let finalImg = imgUrlTemp || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=60';
        if (productCatalog[barcode] && !imgUrlTemp) {
            finalImg = productCatalog[barcode].img;
        }

        const newDefect = {
            barcode: barcode,
            name: name,
            qty: qty,
            status: status,
            nsx: nsx ? formatDate(nsx) : 'N/A',
            hsd: hsd ? formatDate(hsd) : 'N/A',
            note: note,
            img: finalImg
        };

        defectiveProducts[code].push(newDefect);

        // Re-render table
        renderChecklistTable();
        updateJSONPreview();

        // Keep details panel open for the active code
        document.getElementById(`row-detail-${code}`).classList.remove('hidden');
    }

    function formatDate(dateString) {
        const parts = dateString.split('-');
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    // Audio context scanner synth sound
    function playBeep() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.type = 'sine';
            osc.frequency.value = 1400; // high pitch beep
            gain.gain.setValueAtTime(0, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12);

            osc.start(audioCtx.currentTime);
            osc.stop(audioCtx.currentTime + 0.12);
        } catch (err) {
            console.log(err);
        }
    }

    // Barcode scanner simulator modal actions
    const scannerModal = document.getElementById('scanner-modal');
    const btnCloseScanner = document.getElementById('btn-close-scanner');
    const presetBtns = document.querySelectorAll('.preset-btn');

    btnCloseScanner.addEventListener('click', () => {
        scannerModal.classList.add('hidden');
    });

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.getAttribute('data-code');
            const name = btn.getAttribute('data-name');
            
            if (currentlyScanningCode) {
                // Beep
                playBeep();
                
                // Populate row specific form
                document.getElementById(`input-barcode-${currentlyScanningCode}`).value = code;
                document.getElementById(`input-name-${currentlyScanningCode}`).value = name;
                
                // Hide modal
                scannerModal.classList.add('hidden');
                
                // Focus qty input
                document.getElementById(`input-qty-${currentlyScanningCode}`).focus();
            }
        });
    });

    // JSON Sync Preview Generation
    const jsonPreview = document.getElementById('json-preview');
    const token = "TLvin1BuFwdC6rXhNtwYxuRS37fwBznnqe0lOD7wKwrPcBD"; // Mock Request Verification Token

    function updateJSONPreview() {
        const storeId = document.getElementById('store-select').value;
        const date = document.getElementById('evaluation-date').value;

        // Map checklist items to payload representation
        const syncPayload = {
            metadata: {
                cId: 90,
                siteId: storeId,
                date: date,
                csId: "90590b97-3486-4bee-a201-9f9ef581de59"
            },
            checklistItems: productItems.map(item => {
                const list = defectiveProducts[item.code];
                const totalQty = list.reduce((sum, p) => sum + p.qty, 0);
                const aggregatedNote = getAggregatedNote(item.code);

                return {
                    code: item.code,
                    csResultId: `mock-guid-${item.code}`, // Mocked csResultId for each row
                    totalErrors: totalQty, // Sends point=totalQty to OPS
                    department: departments[item.code], // Sends note=department, updateType=2 to OPS
                    aggregatedNote: aggregatedNote // Sends note=aggregatedNote to OPS
                };
            })
        };

        jsonPreview.innerText = JSON.stringify(syncPayload, null, 4);
    }

    // Trigger update on fields changes
    document.getElementById('store-select').addEventListener('change', updateJSONPreview);
    dateInput.addEventListener('change', updateJSONPreview);

    // Initial render
    renderChecklistTable();
    updateJSONPreview();

    // Sync to WinMart OPS Simulator
    const btnSyncOps = document.getElementById('btn-sync-ops');
    btnSyncOps.addEventListener('click', () => {
        // Check if there are any errors at all
        let hasErrors = false;
        productItems.forEach(item => {
            if (defectiveProducts[item.code].length > 0) hasErrors = true;
        });

        btnSyncOps.disabled = true;
        btnSyncOps.innerText = '⏳ Đang đồng bộ lên OPS...';

        setTimeout(() => {
            let logText = `--- BẮT ĐẦU ĐỒNG BỘ WINMART OPS ---\n`;
            logText += `Đang tải mã chống giả mạo (__RequestVerificationToken) [OK]\n`;
            logText += `Khởi tạo phiên đánh giá csId = 90590b97-3486-4bee-a201-9f9ef581de59...\n\n`;

            productItems.forEach(item => {
                const list = defectiveProducts[item.code];
                const totalQty = list.reduce((sum, p) => sum + p.qty, 0);
                const dept = departments[item.code];
                const note = getAggregatedNote(item.code);
                const mockResultId = `mock-guid-${item.code}`;

                logText += `HẠNG MỤC ${item.code}:\n`;
                if (totalQty === 0) {
                    logText += `   ↳ [Không lỗi] Gửi POST /UpdateCheckListSiteResult (point = 0) -> Thành công!\n`;
                    logText += `   ↳ Gửi POST /UpdateChecklistSiteResultNote (note = "") -> Thành công!\n`;
                } else {
                    logText += `   ↳ [Có lỗi] Gửi POST /UpdateCheckListSiteResult (point = ${totalQty}) -> Thành công!\n`;
                    logText += `   ↳ Gửi POST /UpdateChecklistSiteDeadlineNote (updateType = 2, note = "${dept}") -> Thành công!\n`;
                    logText += `   ↳ Gửi POST /UpdateChecklistSiteResultNote (note = "${note.substring(0, 50)}...") -> Thành công!\n`;
                }
                logText += `--------------------------------------------------\n`;
            });

            logText += `\nGửi POST /CompleteUpdateCheckListSiteResult (csId = 90590b97-3486-4bee-a201-9f9ef581de59) -> Thành công!\n`;
            logText += `--- ĐỒNG BỘ HOÀN TẤT ---`;

            alert(logText);
            btnSyncOps.disabled = false;
            btnSyncOps.innerText = '⚡ Đẩy Dữ Liệu Lên OPS';
        }, 1500);
    });
});

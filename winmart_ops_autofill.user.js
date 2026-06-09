// ==UserScript==
// @name         WinMart OPS Checklist Autofill Tool
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tự động hóa nhập liệu bảng đánh giá trên hệ thống WinMart OPS từ file Excel/CSV
// @author       Antigravity
// @match        https://ops.winmart.vn/ke-qua-danh-gia-bktt-mobile*
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.mini.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // CSS Styling for the beautiful floating UI panel
    const style = document.createElement('style');
    style.innerHTML = `
        #ops-autofill-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 380px;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(12px) saturate(180%);
            -webkit-backdrop-filter: blur(12px) saturate(180%);
            border: 1px solid rgba(209, 213, 219, 0.3);
            border-radius: 16px;
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
            z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        #ops-autofill-panel.minimized {
            width: 180px;
            height: 48px;
            overflow: hidden;
        }
        .ops-panel-header {
            background: linear-gradient(135deg, #e01b22, #b81419);
            color: #ffffff;
            padding: 12px 16px;
            font-weight: 600;
            font-size: 14px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
            user-select: none;
        }
        .ops-panel-body {
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .ops-dropzone {
            border: 2px dashed #e01b22;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            background: rgba(224, 27, 34, 0.03);
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .ops-dropzone:hover {
            background: rgba(224, 27, 34, 0.08);
            border-color: #b81419;
        }
        .ops-dropzone p {
            margin: 0;
            font-size: 12px;
            color: #4b5563;
        }
        .ops-dropzone .ops-icon {
            font-size: 24px;
            margin-bottom: 8px;
            display: block;
        }
        .ops-btn {
            background: #e01b22;
            color: white;
            border: none;
            padding: 10px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            transition: background 0.2s;
            text-align: center;
        }
        .ops-btn:hover {
            background: #b81419;
        }
        .ops-btn:disabled {
            background: #d1d5db;
            color: #9ca3af;
            cursor: not-allowed;
        }
        .ops-progress-container {
            display: none;
            flex-direction: column;
            gap: 6px;
        }
        .ops-progress-bar-bg {
            background: #e5e7eb;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
        }
        .ops-progress-bar {
            background: #e01b22;
            width: 0%;
            height: 100%;
            transition: width 0.1s ease;
        }
        .ops-progress-text {
            font-size: 11px;
            color: #4b5563;
            text-align: right;
        }
        .ops-log-viewer {
            background: #1f2937;
            color: #34d399;
            border-radius: 6px;
            padding: 8px;
            height: 100px;
            font-family: monospace;
            font-size: 10px;
            overflow-y: auto;
            white-space: pre-wrap;
            display: none;
        }
        .ops-mapping-info {
            font-size: 11px;
            color: #6b7280;
            background: #f3f4f6;
            padding: 8px;
            border-radius: 6px;
            line-height: 1.4;
        }
        .ops-badge {
            background: #e01b22;
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    // Create the HTML panel structure
    const panel = document.createElement('div');
    panel.id = 'ops-autofill-panel';
    panel.innerHTML = `
        <div class="ops-panel-header" id="ops-panel-header">
            <span>🚀 WinMart OPS Autofill</span>
            <span id="ops-toggle-btn" style="font-size: 12px;">▼</span>
        </div>
        <div class="ops-panel-body" id="ops-panel-body">
            <div class="ops-mapping-info">
                <strong>Yêu cầu cấu trúc file Excel/CSV:</strong><br>
                • Cột 1: Mã hạng mục (ví dụ: C1.1, C1.2...)<br>
                • Cột 2: Số lỗi (ví dụ: 0, 1, 2...)<br>
                • Cột 3: Ghi chú lỗi (ví dụ: Bụi bẩn...) [Tùy chọn]<br>
                • Cột 4: Nhóm lỗi (ví dụ: Bụi bẩn, Rách hỏng...) [Tùy chọn]<br>
                • Cột 5: Bộ phận trách nhiệm (ví dụ: Vận hành, NCC...) [Tùy chọn]
            </div>
            <div class="ops-dropzone" id="ops-dropzone">
                <span class="ops-icon">📁</span>
                <p>Kéo thả file Excel (.xlsx) hoặc CSV vào đây hoặc click để chọn file</p>
                <input type="file" id="ops-file-input" accept=".xlsx,.xls,.csv" style="display: none;">
            </div>
            <div id="ops-file-info" style="font-size: 12px; color: #10b981; font-weight: 500; display: none;"></div>
            <button class="ops-btn" id="ops-start-btn" disabled>Bắt đầu tự động điền</button>
            <div class="ops-progress-container" id="ops-progress-container">
                <div class="ops-progress-bar-bg">
                    <div class="ops-progress-bar" id="ops-progress-bar"></div>
                </div>
                <div class="ops-progress-text" id="ops-progress-text">Đang chuẩn bị... 0%</div>
            </div>
            <div class="ops-log-viewer" id="ops-log-viewer"></div>
        </div>
    `;
    document.body.appendChild(panel);

    // Variables to hold parsed data
    let parsedData = [];
    const token = $('[name=__RequestVerificationToken]').val();

    // Toggle minimize/maximize
    const header = document.getElementById('ops-panel-header');
    const toggleBtn = document.getElementById('ops-toggle-btn');
    header.addEventListener('click', () => {
        panel.classList.toggle('minimized');
        toggleBtn.innerText = panel.classList.contains('minimized') ? '▲' : '▼';
    });

    // Handle File Drop & Selection
    const dropzone = document.getElementById('ops-dropzone');
    const fileInput = document.getElementById('ops-file-input');
    const fileInfo = document.getElementById('ops-file-info');
    const startBtn = document.getElementById('ops-start-btn');

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.background = 'rgba(224, 27, 34, 0.1)';
    });
    dropzone.addEventListener('dragleave', () => {
        dropzone.style.background = 'rgba(224, 27, 34, 0.03)';
    });
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.background = 'rgba(224, 27, 34, 0.03)';
        if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    });
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // Parse the file
    function handleFile(file) {
        fileInfo.style.display = 'block';
        fileInfo.innerText = `📄 Đang đọc file: ${file.name}...`;
        startBtn.disabled = true;

        const reader = new FileReader();
        if (file.name.endsWith('.csv')) {
            reader.onload = function(e) {
                const text = e.target.result;
                parseCSV(text);
            };
            reader.readAsText(file, 'UTF-8');
        } else {
            reader.onload = function(e) {
                const data = new Uint8Array(e.target.result);
                try {
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    parseExcelJSON(json);
                } catch (err) {
                    fileInfo.innerText = `❌ Lỗi đọc Excel: ${err.message}`;
                }
            };
            reader.readAsArrayBuffer(file);
        }
    }

    function parseCSV(text) {
        const lines = text.split('\n');
        const rows = lines.map(line => line.split(',').map(cell => cell.trim()));
        parseExcelJSON(rows);
    }

    function parseExcelJSON(rows) {
        parsedData = [];
        // Filter out empty rows and validate structure
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length === 0 || !row[0]) continue;
            
            const code = row[0].toString().trim();
            // Validate code format like C1.1, C1.2, C10.1
            const codeMatch = code.match(/^[A-Z]\d+\.\d+$/i);
            if (codeMatch) {
                parsedData.push({
                    code: code.toUpperCase(),
                    errors: parseInt(row[1]) || 0,
                    note: row[2] ? row[2].toString().trim() : '',
                    group: row[3] ? row[3].toString().trim() : '',
                    department: row[4] ? row[4].toString().trim() : ''
                });
            }
        }

        if (parsedData.length > 0) {
            fileInfo.innerText = `✅ Đã đọc thành công ${parsedData.length} hạng mục hợp lệ.`;
            startBtn.disabled = false;
        } else {
            fileInfo.innerText = `❌ Không tìm thấy hạng mục hợp lệ (ví dụ: C1.1) ở cột 1.`;
        }
    }

    // Logger utility
    const logViewer = document.getElementById('ops-log-viewer');
    function log(message) {
        logViewer.style.display = 'block';
        logViewer.innerText += message + '\n';
        logViewer.scrollTop = logViewer.scrollHeight;
    }

    // Delay helper to avoid hammering the server
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Get mappings from DOM
    function getDomMappings() {
        const mappings = {};
        $('tr').each(function() {
            const text = $(this).find('td:nth-child(2)').text().trim();
            const match = text.match(/([A-Z]\d+\.\d+)/);
            if (match) {
                const code = match[1].toUpperCase();
                // Check multiple editable fields in this row
                const csResultId = $(this).find('[data-key]').first().data('key') || $(this).find('.resultPoint').data('key');
                if (csResultId) {
                    mappings[code] = csResultId;
                }
            }
        });
        return mappings;
    }

    // Execute autofill
    const startBtnEl = document.getElementById('ops-start-btn');
    const progressContainer = document.getElementById('ops-progress-container');
    const progressBar = document.getElementById('ops-progress-bar');
    const progressText = document.getElementById('ops-progress-text');

    startBtnEl.addEventListener('click', async () => {
        const domMappings = getDomMappings();
        const totalItems = parsedData.length;
        
        if (Object.keys(domMappings).length === 0) {
            alert('Không tìm thấy csResultId nào trên trang. Hãy đảm bảo bạn đang ở giao diện đánh giá có quyền chỉnh sửa.');
            return;
        }

        startBtnEl.disabled = true;
        progressContainer.style.display = 'flex';
        logViewer.innerText = '';
        log('--- BẮT ĐẦU TỰ ĐỘNG ĐIỀN ---');
        log(`Tìm thấy ${Object.keys(domMappings).length} hạng mục trên giao diện.`);

        let processed = 0;

        for (const item of parsedData) {
            const csResultId = domMappings[item.code];
            if (!csResultId) {
                log(`⚠️ Hạng mục ${item.code} không tìm thấy trên trang web hiện tại.`);
                processed++;
                updateProgress(processed, totalItems);
                continue;
            }

            log(`⚙️ Đang điền ${item.code} (ID: ${csResultId.substring(0, 8)}...)...`);

            try {
                // 1. Cập nhật Số lỗi (ResultPoint)
                await $.ajax({
                    url: '/DynamicFileExcel/UpdateCheckListSiteResult',
                    type: 'POST',
                    data: {
                        csResultId: csResultId,
                        point: item.errors,
                        "__RequestVerificationToken": token
                    },
                    dataType: 'json'
                });
                log(`   ↳ Số lỗi: ${item.errors} [OK]`);
                await delay(200);

                // 2. Cập nhật Ghi chú lỗi (ResultNote) nếu có
                if (item.note) {
                    await $.ajax({
                        url: '/DynamicFileExcel/UpdateChecklistSiteResultNote',
                        type: 'POST',
                        data: {
                            csResultId: csResultId,
                            note: item.note,
                            "__RequestVerificationToken": token
                        },
                        dataType: 'json'
                    });
                    log(`   ↳ Ghi chú: "${item.note}" [OK]`);
                    await delay(200);
                }

                // 3. Cập nhật Nhóm lỗi (UpdateChecklistSiteDeadlineNote - type 1) nếu có
                if (item.group) {
                    await $.ajax({
                        url: '/DynamicFileExcel/UpdateChecklistSiteDeadlineNote',
                        type: 'POST',
                        data: {
                            csResultId: csResultId,
                            note: item.group,
                            updateType: 1,
                            "__RequestVerificationToken": token
                        },
                        dataType: 'json'
                    });
                    log(`   ↳ Nhóm lỗi: "${item.group}" [OK]`);
                    await delay(200);
                }

                // 4. Cập nhật Bộ phận chịu trách nhiệm (UpdateChecklistSiteDeadlineNote - type 2) nếu có
                if (item.department) {
                    await $.ajax({
                        url: '/DynamicFileExcel/UpdateChecklistSiteDeadlineNote',
                        type: 'POST',
                        data: {
                            csResultId: csResultId,
                            note: item.department,
                            updateType: 2,
                            "__RequestVerificationToken": token
                        },
                        dataType: 'json'
                    });
                    log(`   ↳ Bộ phận: "${item.department}" [OK]`);
                    await delay(200);
                }

            } catch (err) {
                log(`   ❌ Lỗi khi cập nhật hạng mục ${item.code}: ${err.statusText || 'Unknown Error'}`);
            }

            processed++;
            updateProgress(processed, totalItems);
        }

        log('--- HOÀN THÀNH ---');
        log('Bạn có thể tải lại trang (F5) để kiểm tra kết quả.');
        alert('Tự động điền hoàn tất! Hãy tải lại trang để xem cập nhật.');
        startBtnEl.disabled = false;
    });

    function updateProgress(done, total) {
        const percent = Math.round((done / total) * 100);
        progressBar.style.width = `${percent}%`;
        progressText.innerText = `Hoàn thành ${done}/${total} (${percent}%)`;
    }
})();

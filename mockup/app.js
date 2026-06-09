document.addEventListener('DOMContentLoaded', () => {
    // Current date default
    const dateInput = document.getElementById('evaluation-date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    // Store Metadata with RM and AD
    const storeMetadata = {
        "5636": { name: "2014 - WM+ HNI Lạc Trung", rm: "Quách Tấn An", ad: "Phạm Huyền Trang" },
        "1204": { name: "1002 - WM Royal City", rm: "Trần Quốc Tuấn", ad: "Nguyễn Thị Lan" },
        "3401": { name: "3045 - WM+ HNI Nguyễn Khánh Toàn", rm: "Lê Minh Hoàng", ad: "Phạm Huyền Trang" },
        "5518": { name: "5518 - WM+ AGG 141/5 Nguyễn Thái Học", rm: "Quách Tấn An", ad: "Phạm Huyền Trang" }
    };

    // Full 43 checklist items database
    const checklistDatabase = [
        { num: 1, code: "C1.1", group: "C1.KV bên ngoài", desc: "Vỉa hè sạch sẽ, không có rác, không có vật dụng cản trở...", section: "I. CLEAN" },
        { num: 2, code: "C1.2", group: "C1.KV bên ngoài", desc: "Cửa kính/ cột Alu sạch sẽ, không dính tem niêm phong, không treo các vật dụng.", section: "I. CLEAN" },
        { num: 3, code: "C1.3", group: "C1.KV bên ngoài", desc: "Hình ảnh MKT đầy đủ, sạch sẽ, không rách/ bong tróc, còn hiệu lực áp dụng", section: "I. CLEAN" },
        { num: 4, code: "C2.1", group: "C2.Khu vực thu ngân", desc: "Kệ bày hàng trước và sau quầy thu ngân/ trên mặt quầy và trong quầy thu ngân: Gọn gàng, sạch sẽ, trang thiết bị không bám bụi, không dán tem niêm phong/tem giá lên các dụng cụ, quầy thu ngân, bảng tin;", section: "I. CLEAN" },
        { num: 5, code: "C2.2", group: "C2.Khu vực thu ngân", desc: "Thùng rác: sạch sẽ, có nắp đậy, lót túi nilong bên trong. (áp dụng cho thùng rác chứa rác thực phẩm)", section: "I. CLEAN" },
        { num: 6, code: "C2.3", group: "C2.Khu vực thu ngân", desc: "Bàn sơ chế/ CCDC (dao, kéo, thớt,..): Sạch sẽ, Các CCDC nguyên vẹn, làm bằng vật liệu phù hợp, không bị rỉ sét, ố vàng.", section: "I. CLEAN" },
        { num: 7, code: "C3.1", group: "C3.Không gian chung bên trong CH", desc: "Không gian: không có mùi ẩm mốc/mùi hôi/mùi lạ", section: "I. CLEAN" },
        { num: 8, code: "C3.2", group: "C3.Không gian chung bên trong CH", desc: "Sàn nhà/lối đi: thông thoáng, sạch sẽ", section: "I. CLEAN" },
        { num: 9, code: "C3.3", group: "C3.Không gian chung bên trong CH", desc: "Tường/trần: sạch sẽ, không mạng nhện, không ẩm mốc, bong tróc", section: "I. CLEAN" },
        { num: 10, code: "C3.4", group: "C3.Không gian chung bên trong CH", desc: "Giỏ đựng hàng: đảm bảo sạch sẽ, nguyên vẹn.", section: "I. CLEAN" },
        { num: 11, code: "C3.5", group: "C3.Không gian chung bên trong CH", desc: "Mâm kệ, hệ tủ: sạch, không bụi bẩn và vết băng keo", section: "I. CLEAN" },
        { num: 12, code: "C3.6", group: "C3.Không gian chung bên trong CH", desc: "sản phẩm không bụi bẩn.", section: "I. CLEAN" },
        { num: 13, code: "C3.7", group: "C3.Không gian chung bên trong CH", desc: "Kiểm soát côn trùng và động vật gây hại: Không có động vật gây hại sống/ chết trong cửa hàng; Không có côn trùng gây hại sống trong cửa hàng; Có đèn diệt côn trùng, đèn hoạt động tốt.", section: "I. CLEAN" },
        { num: 14, code: "C4.1", group: "C4.Khu vực Kho và Nhà vệ sinh", desc: "Kho: không có mùi hôi, sàn kho vệ sinh sạch sẽ, không có rác, hàng hóa sắp xếp gọn gàng.", section: "I. CLEAN" },
        { num: 15, code: "C4.2", group: "C4.Khu vực Kho và Nhà vệ sinh", desc: "Kệ kho: không bám bụi …", section: "I. CLEAN" },
        { num: 16, code: "C4.3", group: "C4.Khu vực Kho và Nhà vệ sinh", desc: "Nhà vệ sinh: luôn đóng cửa, sạch sẽ, gọn gàng, không có mùi hôi, nước và các trang thiết bị hoạt động bình thường;Có đầy đủ: nước sạch, dung dịch rửa tay/ xà phòng", section: "I. CLEAN" },
        
        { num: 17, code: "P1.1", group: "P1.Kiểm soát chất lượng sản phẩm", desc: "Chất lượng sản phẩm: Không có sản phẩm bị mốc, thối (*). (Điền số SKU lỗi)", section: "II. PRODUCT", isDetailed: true },
        { num: 18, code: "P1.2", group: "P1.Kiểm soát chất lượng sản phẩm", desc: "Chất lượng sản phẩm:Không có sản phẩm kém chất lượng khác tại khu vực bày bán.(Điền số SKU lỗi)", section: "II. PRODUCT", isDetailed: true },
        { num: 19, code: "P1.3", group: "P1.Kiểm soát chất lượng sản phẩm", desc: "Hạn sử dụng: Không có hàng hết HSD/ kéo dài HSD tại khu vực trưng bày bán (*) (Điền số SKU lỗi)", section: "II. PRODUCT", isDetailed: true },
        { num: 20, code: "P1.4", group: "P1.Kiểm soát chất lượng sản phẩm", desc: "Nhãn mác: đủ thông tin, không mờ nhòe, nội dung phải đồng nhất (Điền số SKU lỗi)", section: "II. PRODUCT", isDetailed: true },
        { num: 21, code: "P1.5", group: "P1.Kiểm soát chất lượng sản phẩm", desc: "Bao bì: Nguyên vẹn, không hở/móp méo (Điền số SKU lỗi)", section: "II. PRODUCT", isDetailed: true, defaultDept: "NCC" },
        { num: 22, code: "P1.6", group: "P1.Kiểm soát chất lượng sản phẩm", desc: "Tuân thủ rút hàng khỏi quầy: đúng thời hạn quy định.(Điền số SKU lỗi)", section: "II. PRODUCT", isDetailed: true },
        
        { num: 23, code: "P2.1", group: "P2. Kiểm soát hàng hóa khu vực bán hàng", desc: "Hàng hóa trưng bày đảm bảo nguyên tắc FIFO, FEFO", section: "II. PRODUCT" },
        { num: 24, code: "P2.2", group: "P2. Kiểm soát hàng hóa khu vực bán hàng", desc: "Đảm bảo nguyên tắc tránh nhiễm chéo (TP và PTP …)", section: "II. PRODUCT" },
        { num: 25, code: "P2.3", group: "P2. Kiểm soát hàng hóa khu vực bán hàng", desc: "Không để hàng hóa trực tiếp dưới sàn (áp dụng cho hàng thực phẩm)", section: "II. PRODUCT" },
        { num: 26, code: "P2.4", group: "P2. Kiểm soát hàng hóa khu vực bán hàng", desc: "Bảo quản SP theo đúng điều kiện trên nhãn hoặc điều kiện bảo quản với từng loại sản phẩm.", section: "II. PRODUCT" },
        { num: 27, code: "P2.5", group: "P2. Kiểm soát hàng hóa khu vực bán hàng", desc: "Hàng chờ xử lý: để tách biệt, có biển cảnh báo Hàng chờ xử lý và phải được liệt kê đầy đủ trong danh sách CXL", section: "II. PRODUCT" },
        { num: 28, code: "P2.6", group: "P2. Kiểm soát hàng hóa khu vực bán hàng", desc: "Tuân thủ kiểm soát nhiệt độ tủ bảo quản theo quy định", section: "II. PRODUCT" },
        { num: 29, code: "P3.1", group: "P3.Kiểm soát hàng hóa khu vực Kho", desc: "Trong kho vỏ thùng carton phải được sắp xếp gọn gàng.", section: "II. PRODUCT" },
        { num: 30, code: "P3.2", group: "P3.Kiểm soát hàng hóa khu vực Kho", desc: "Khu vực hàng chờ xử lý có biển cảnh báo Hàng chờ xử lý và có danh sách liệt kê đầy đủ các sản phẩm bảo quản tại khu vực hàng CXL.", section: "II. PRODUCT" },
        { num: 31, code: "P3.3", group: "P3.Kiểm soát hàng hóa khu vực Kho", desc: "Sắp xếp hàng hóa trong kho: Tuân thủ trưng bày theo layout đã được hướng dẫn.", section: "II. PRODUCT" },
        { num: 32, code: "P3.4", group: "P3.Kiểm soát hàng hóa khu vực Kho", desc: "Sắp xếp hàng hóa trong kho: Lưu trữ đảm bảo nguyên tắc FIFO, FEFO", section: "II. PRODUCT" },
        { num: 33, code: "P3.5", group: "P3.Kiểm soát hàng hóa khu vực Kho", desc: "Sắp xếp hàng hóa trong kho: Lưu trữ đảm bảo tránh nhiễm chéo (TP sống/TP chín, TP/ PTP …)", section: "II. PRODUCT" },
        { num: 34, code: "P3.6", group: "P3.Kiểm soát hàng hóa khu vực Kho", desc: "Sắp xếp hàng hóa trong kho: Không để hàng hóa TP trực tiếp dưới sàn", section: "II. PRODUCT" },
        
        { num: 35, code: "H1.1", group: "H1.Cười - Chào - Cảm ơn", desc: "Cười chào niềm nở, vui vẻ, thân thiện khi Khách đến và Khách đi (Chào khách: ngay khi Khách hàng bước mở cửa và bước vào cửa hàng; Cảm ơn và hẹn gặp lại khách hàng: ngay khi Khách hàng thanh toán xong và đưa hóa đơn cho khách) (Điền số lượng CBNV vi phạm)", section: "III. TIÊU CHUẨN DỊCH VỤ" },
        { num: 36, code: "H2.1", group: "H2.Tác phong diện mạo", desc: "Tác phong diện mạo chuẩn chỉnh theo quy định: Đồng phục, diện mạo; Đưa hóa đơn và tiền cho khách hàng bằng hai tay. (Điền số lượng CBNV vi phạm)", section: "III. TIÊU CHUẨN DỊCH VỤ" },
        { num: 37, code: "H3.1", group: "H3.Trưng bày hàng hóa", desc: "Tem giá/ tem khuyến mại đầy đủ, để đúng vị trí, đúng thông tin với sản phẩm (Điền số lượng tem giá sai/thiếu)", section: "III. TIÊU CHUẨN DỊCH VỤ" },
        { num: 38, code: "H3.2", group: "H3.Trưng bày hàng hóa", desc: "Trưng bày: Không để hàng hóa trống kệ.", section: "III. TIÊU CHUẨN DỊCH VỤ" },
        
        { num: 39, code: "O39", group: "Nhận diện", desc: "Bảng biển: biển hiệu của CH có đủ thông tin về cơ quan chủ quản trực tiếp (Tên Chi nhánh của WinCommerce) hay không? Có thông báo không bán rượu, bia, thuốc lá cho người dưới 18 tuổi tại nơi bày bán rượu/ bia/ thuốc lá; Lưu ý: Không được quảng cáo bán rượu/thuốc lá/sữa bột.", section: "IV. CÁC VẤN ĐỀ TUÂN THỦ KHÁC" },
        { num: 40, code: "O40", group: "Hồ sơ", desc: "Lưu trữ hồ sơ/ giấy tờ pháp lý tại CSVH (in bản cứng lưu tại CH) tối thiểu 5 loại giấy tờ sau: Giấy chứng nhận Đăng ký kinh doanh; Giấy chứng nhận Cơ sở đủ điều kiện An toàn thực phẩm; Giấy phép kinh doanh rượu; Giấy phép kinh doanh thuốc lá; Quyết định ủy quyền cho CHT…", section: "IV. CÁC VẤN ĐỀ TUÂN THỦ KHÁC" },
        { num: 41, code: "O41", group: "Kiểm định thiết bị", desc: "Cân điện tử được kiểm định đầy đủ và còn hiệu lực (1 năm/lần)", section: "IV. CÁC VẤN ĐỀ TUÂN THỦ KHÁC" },
        { num: 42, code: "O42", group: "PCCC", desc: "Kiểm tra công tác PCCC/ PCCN tại CH: Nội quy & Tiêu lệnh; Bình PCCC đạt tiêu chuẩn; Không để hàng hóa gần tủ điện; Không đun nấu trong cửa hàng.", section: "IV. CÁC VẤN ĐỀ TUÂN THỦ KHÁC" },
        
        { num: 43, code: "O43", group: "Biên bản", desc: "Biên bản ghi nhận điểm không phù hợp lập tại cửa hàng", section: "V. BIÊN BẢN GHI NHẬN ĐIỂM KHÔNG PHÙ HỢP" }
    ];

    // State Storage
    let activeSection = "I. CLEAN";

    // 1. Detailed items state (P1.1 - P1.6)
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

    // 2. Standard items state (All other 37 items)
    let checklistState = {};
    checklistDatabase.forEach(item => {
        if (!item.isDetailed) {
            checklistState[item.code] = {
                errors: 0,
                group: "",
                department: item.code === "P1.5" ? "NCC" : "Vận hành",
                note: "",
                image: ""
            };
        }
    });

    // Keep track of which row is currently scanning
    let currentlyScanningCode = "";

    // Mock Database for Barcode Autocomplete
    const productCatalog = {
        "8936079010025": { name: "Sữa tươi tiệt trùng TH True Milk ít đường 1L", img: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&auto=format&fit=crop&q=60" },
        "8934563138012": { name: "Mì ăn liền Hảo Hảo tôm chua cay 75g", img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&auto=format&fit=crop&q=60" },
        "2901234500150": { name: "Táo Rockit New Zealand ống 4 quả", img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&auto=format&fit=crop&q=60" },
        "8935049500412": { name: "Bánh bông lan Solite vị Lá Dứa hộp 360g", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&auto=format&fit=crop&q=60" }
    };

    // DOM Elements
    const storeSelect = document.getElementById('store-select');
    const rmInput = document.getElementById('rm-input');
    const adInput = document.getElementById('ad-input');
    const tableBody = document.getElementById('checklist-rows');
    const jsonPreview = document.getElementById('json-preview');

    // Sync Store Meta
    function updateStoreInfo() {
        const storeId = storeSelect.value;
        const meta = storeMetadata[storeId];
        if (meta) {
            rmInput.value = meta.rm;
            adInput.value = meta.ad;
        }
        updateJSONPreview();
    }
    storeSelect.addEventListener('change', updateStoreInfo);

    // Render Table Rows dynamically based on active section
    function renderChecklistTable() {
        let html = '';
        const items = checklistDatabase.filter(item => item.section === activeSection);

        items.forEach(item => {
            if (item.isDetailed) {
                // Render detailed row layout
                const list = defectiveProducts[item.code];
                const totalQty = list.reduce((sum, p) => sum + p.qty, 0);
                const dept = departments[item.code];
                const aggregatedNote = getAggregatedNote(item.code);
                const hasErrorsClass = totalQty > 0 ? 'has-errors-row' : '';

                html += `
                    <!-- Main Row (Detailed) -->
                    <tr id="row-main-${item.code}" class="${hasErrorsClass}">
                        <td class="code">${item.code}</td>
                        <td>
                            <strong>${item.desc}</strong>
                        </td>
                        <td style="text-align: center;">
                            <span class="error-badge-ops" id="ops-badge-${item.code}">${totalQty}</span>
                        </td>
                        <td>
                            <span class="text-muted" style="font-size: 11px;">Theo sản phẩm</span>
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
                            <span class="text-muted" style="font-size: 11px;">Theo sản phẩm</span>
                        </td>
                        <td style="text-align: center;">
                            <button class="btn btn-secondary btn-manage" data-code="${item.code}" style="font-size: 11px; padding: 6px 12px; margin: auto;">
                                ⚙️ Quản lý lỗi (${list.length})
                            </button>
                        </td>
                    </tr>

                    <!-- Expanded Detail Row (Detailed) -->
                    <tr id="row-detail-${item.code}" class="detail-row hidden">
                        <td colspan="8" class="detail-cell">
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
            } else {
                // Render standard row layout
                const state = checklistState[item.code];
                const hasErrorsClass = state.errors > 0 ? 'has-errors-row' : '';

                html += `
                    <!-- Main Row (Standard) -->
                    <tr id="row-main-${item.code}" class="${hasErrorsClass}">
                        <td class="code">${item.code}</td>
                        <td>${item.desc}</td>
                        <td style="text-align: center;">
                            <input type="number" class="table-input std-qty-input" data-code="${item.code}" value="${state.errors}" min="0" style="width: 70px; text-align: center;">
                        </td>
                        <td>
                            <input type="text" class="table-input std-group-input" data-code="${item.code}" placeholder="Nhóm lỗi" value="${state.group}">
                        </td>
                        <td>
                            <select class="table-input std-dept-select" data-code="${item.code}">
                                <option value="Vận hành" ${state.department === 'Vận hành' ? 'selected' : ''}>Vận hành</option>
                                <option value="NCC" ${state.department === 'NCC' ? 'selected' : ''}>NCC</option>
                                <option value="Logistics" ${state.department === 'Logistics' ? 'selected' : ''}>Logistics</option>
                                <option value="Khác" ${state.department === 'Khác' ? 'selected' : ''}>Khác</option>
                            </select>
                        </td>
                        <td>
                            <input type="text" class="table-input std-note-input" data-code="${item.code}" placeholder="Nhập ghi chú lỗi..." value="${state.note}">
                        </td>
                        <td style="text-align: center;">
                            <div class="std-image-wrapper">
                                <input type="file" id="file-std-${item.code}" accept="image/*" style="display: none;" data-code="${item.code}">
                                <div class="std-upload-btn" id="std-upload-box-${item.code}" data-code="${item.code}" style="${state.image ? 'display:none;' : 'display:flex;'}">
                                    📷
                                </div>
                                <div class="std-preview ${state.image ? '' : 'hidden'}" id="std-preview-container-${item.code}">
                                    <img id="std-preview-img-${item.code}" src="${state.image}" class="product-thumb">
                                    <button class="btn-remove-std-img" data-code="${item.code}">✕</button>
                                </div>
                            </div>
                        </td>
                        <td style="text-align: center;">
                            <span class="text-muted" style="font-size: 11px;">Mặc định</span>
                        </td>
                    </tr>
                `;
            }
        });

        tableBody.innerHTML = html;
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
                <td><span class="badge" style="background-color: ${p.status === 'Hết Hạn Sử Dụng' ? '#ef4444' : '#f59e0b'}; font-size: 9px; padding: 2px 6px; color: white;">${p.status}</span></td>
                <td style="font-size: 10px;">NSX: ${p.nsx}<br>HSD: ${p.hsd}</td>
                <td style="font-weight: 600;">${p.qty}</td>
                <td>${p.note || '-'}</td>
                <td style="text-align: center;">
                    <button class="btn-icon btn-delete-sub" data-code="${code}" data-idx="${idx}">🗑️</button>
                </td>
            </tr>
        `).join('');
    }

    // Attach Event Listeners to DOM elements
    function attachEventListeners() {
        // --- DETAILED ITEMS EVENT LISTENERS ---
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
        document.querySelectorAll('input[type=file]:not([id^="file-std-"])').forEach(input => {
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
                document.getElementById(`preview-container-${code}`).classList.add('hidden');
                document.getElementById(`upload-box-${code}`).style.display = 'flex';
            });
        });

        // Autocomplete on barcode input manual entry
        checklistDatabase.filter(item => item.isDetailed).forEach(item => {
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
                updateMetrics();
                updateJSONPreview();
                
                // Keep the detail panel open for that item
                document.getElementById(`row-detail-${code}`).classList.remove('hidden');
            });
        });

        // --- STANDARD ITEMS EVENT LISTENERS ---
        // Change Quantity (Errors)
        document.querySelectorAll('.std-qty-input').forEach(input => {
            input.addEventListener('change', () => {
                const code = input.getAttribute('data-code');
                const val = parseInt(input.value) || 0;
                checklistState[code].errors = val;
                
                // Update styling
                const row = document.getElementById(`row-main-${code}`);
                if (val > 0) {
                    row.classList.add('has-errors-row');
                } else {
                    row.classList.remove('has-errors-row');
                }
                updateMetrics();
                updateJSONPreview();
            });
        });

        // Change Group
        document.querySelectorAll('.std-group-input').forEach(input => {
            input.addEventListener('input', () => {
                const code = input.getAttribute('data-code');
                checklistState[code].group = input.value;
                updateJSONPreview();
            });
        });

        // Change Department
        document.querySelectorAll('.std-dept-select').forEach(select => {
            select.addEventListener('change', () => {
                const code = select.getAttribute('data-code');
                checklistState[code].department = select.value;
                updateJSONPreview();
            });
        });

        // Change Notes
        document.querySelectorAll('.std-note-input').forEach(input => {
            input.addEventListener('input', () => {
                const code = input.getAttribute('data-code');
                checklistState[code].note = input.value;
                updateJSONPreview();
            });
        });

        // Trigger Standard Image Input
        document.querySelectorAll('.std-upload-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const code = btn.getAttribute('data-code');
                document.getElementById(`file-std-${code}`).click();
            });
        });

        // Handle Standard Image File Select
        document.querySelectorAll('input[type=file][id^="file-std-"]').forEach(input => {
            input.addEventListener('change', (e) => {
                const code = input.getAttribute('data-code');
                if (e.target.files.length > 0) {
                    const file = e.target.files[0];
                    const url = URL.createObjectURL(file);
                    
                    checklistState[code].image = url;
                    
                    document.getElementById(`std-preview-img-${code}`).src = url;
                    document.getElementById(`std-upload-box-${code}`).style.display = 'none';
                    document.getElementById(`std-preview-container-${code}`).classList.remove('hidden');
                    updateJSONPreview();
                }
            });
        });

        // Remove Standard Image
        document.querySelectorAll('.btn-remove-std-img').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const code = btn.getAttribute('data-code');
                const fileInput = document.getElementById(`file-std-${code}`);
                
                fileInput.value = '';
                checklistState[code].image = '';
                
                document.getElementById(`std-preview-img-${code}`).src = '';
                document.getElementById(`std-preview-container-${code}`).classList.add('hidden');
                document.getElementById(`std-upload-box-${code}`).style.display = 'flex';
                updateJSONPreview();
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
        updateMetrics();
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

    // Update overall metrics (Total Errors, Total Penalty Points)
    function updateMetrics() {
        let totalErrors = 0;
        
        checklistDatabase.forEach(item => {
            if (item.isDetailed) {
                const list = defectiveProducts[item.code];
                totalErrors += list.reduce((sum, p) => sum + p.qty, 0);
            } else {
                totalErrors += checklistState[item.code].errors;
            }
        });
        
        let totalPenalty = totalErrors;
        
        document.getElementById('summary-total-errors').innerText = totalErrors;
        document.getElementById('summary-total-penalty').innerText = totalPenalty;
    }

    // Update JSON Preview
    function updateJSONPreview() {
        const storeId = storeSelect.value;
        const date = dateInput.value;
        const shift = document.getElementById('evaluation-shift').value;
        const status = document.getElementById('evaluation-status').value;
        const auditor = document.getElementById('auditor-input').value;

        const syncPayload = {
            metadata: {
                cId: 90,
                siteId: storeId,
                siteName: storeMetadata[storeId] ? storeMetadata[storeId].name : "",
                regionManager: rmInput.value,
                areaDirector: adInput.value,
                date: date,
                shift: shift,
                status: status,
                auditor: auditor,
                csId: "90590b97-3486-4bee-a201-9f9ef581de59"
            },
            checklistItems: checklistDatabase.map(item => {
                if (item.isDetailed) {
                    const list = defectiveProducts[item.code];
                    const totalQty = list.reduce((sum, p) => sum + p.qty, 0);
                    const aggregatedNote = getAggregatedNote(item.code);
                    return {
                        num: item.num,
                        code: item.code,
                        csResultId: `mock-guid-${item.code}`,
                        errors: totalQty,
                        group: "",
                        department: departments[item.code],
                        note: aggregatedNote,
                        image: list.length > 0 && list[0].img ? list[0].img : ""
                    };
                } else {
                    const state = checklistState[item.code];
                    return {
                        num: item.num,
                        code: item.code,
                        csResultId: `mock-guid-${item.code}`,
                        errors: state.errors,
                        group: state.group,
                        department: state.department,
                        note: state.note,
                        image: state.image
                    };
                }
            })
        };

        jsonPreview.innerText = JSON.stringify(syncPayload, null, 4);
    }

    // Handle Tab buttons switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeSection = btn.getAttribute('data-section');
            
            // Update title & description
            document.getElementById('current-section-title').innerText = activeSection + " - Hạng mục đánh giá";
            document.getElementById('current-section-desc').innerText = `Các hạng mục kiểm tra thuộc nhóm ${activeSection}.`;
            
            renderChecklistTable();
        });
    });

    // Update triggers on general fields changes
    storeSelect.addEventListener('change', updateJSONPreview);
    dateInput.addEventListener('change', updateJSONPreview);
    document.getElementById('evaluation-shift').addEventListener('change', updateJSONPreview);
    document.getElementById('evaluation-status').addEventListener('change', updateJSONPreview);
    document.getElementById('auditor-input').addEventListener('input', updateJSONPreview);

    // Initial render call
    updateStoreInfo();
    renderChecklistTable();
    updateMetrics();
    updateJSONPreview();

    // Export Excel / CSV Functionality
    const btnExportCSV = document.getElementById('btn-export-csv');
    btnExportCSV.addEventListener('click', () => {
        let csvContent = "\uFEFF"; // BOM for Excel UTF-8
        csvContent += "Mã hạng mục,Số lỗi,Ghi chú lỗi,Nhóm lỗi,Bộ phận chịu trách nhiệm\n";
        
        checklistDatabase.forEach(item => {
            let errors = 0;
            let note = "";
            let group = "";
            let dept = "Vận hành";
            
            if (item.isDetailed) {
                const list = defectiveProducts[item.code];
                errors = list.reduce((sum, p) => sum + p.qty, 0);
                note = getAggregatedNote(item.code);
                dept = departments[item.code];
            } else {
                const state = checklistState[item.code];
                errors = state.errors;
                note = state.note;
                group = state.group;
                dept = state.department;
            }
            
            const escapeCSV = (val) => {
                if (val === null || val === undefined) return "";
                let str = val.toString().replace(/"/g, '""');
                if (str.includes(",") || str.includes("\n") || str.includes('"')) {
                    return `"${str}"`;
                }
                return str;
            };
            
            csvContent += `${escapeCSV(item.code)},${errors},${escapeCSV(note)},${escapeCSV(group)},${escapeCSV(dept)}\n`;
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const storeId = storeSelect.value;
        const date = dateInput.value;
        link.setAttribute("href", url);
        link.setAttribute("download", `checklist_ops_${storeId}_${date}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Sync to WinMart OPS Simulator
    const btnSyncOps = document.getElementById('btn-sync-ops');
    btnSyncOps.addEventListener('click', () => {
        let errorItemsCount = 0;
        
        checklistDatabase.forEach(item => {
            if (item.isDetailed) {
                if (defectiveProducts[item.code].length > 0) errorItemsCount++;
            } else {
                if (checklistState[item.code].errors > 0) errorItemsCount++;
            }
        });

        btnSyncOps.disabled = true;
        btnSyncOps.innerText = '⏳ Đang đồng bộ lên OPS...';

        setTimeout(() => {
            let logText = `--- BẮT ĐẦU ĐỒNG BỘ WINMART OPS ---\n`;
            logText += `Đang tải mã chống giả mạo (__RequestVerificationToken) [OK]\n`;
            logText += `Khởi tạo phiên đánh giá csId = 90590b97-3486-4bee-a201-9f9ef581de59...\n`;
            logText += `Cửa hàng: ${storeSelect.options[storeSelect.selectedIndex].text}\n`;
            logText += `RM: ${rmInput.value} | AD: ${adInput.value}\n`;
            logText += `Ca đánh giá: ${document.getElementById('evaluation-shift').value}\n`;
            logText += `Trạng thái: ${document.getElementById('evaluation-status').value}\n`;
            logText += `Tổng số hạng mục ghi nhận lỗi: ${errorItemsCount} / 43\n\n`;

            checklistDatabase.forEach(item => {
                let errors = 0;
                let note = "";
                let group = "";
                let dept = "";
                
                if (item.isDetailed) {
                    const list = defectiveProducts[item.code];
                    errors = list.reduce((sum, p) => sum + p.qty, 0);
                    note = getAggregatedNote(item.code);
                    dept = departments[item.code];
                } else {
                    const state = checklistState[item.code];
                    errors = state.errors;
                    note = state.note;
                    group = state.group;
                    dept = state.department;
                }

                if (errors > 0) {
                    logText += `HẠNG MỤC ${item.code} (${item.group || 'Chung'}):\n`;
                    logText += `   ↳ Gửi POST /UpdateCheckListSiteResult (point = ${errors}) -> Thành công!\n`;
                    if (dept) {
                        logText += `   ↳ Gửi POST /UpdateChecklistSiteDeadlineNote (updateType = 2, note = "${dept}") -> Thành công!\n`;
                    }
                    if (group) {
                        logText += `   ↳ Gửi POST /UpdateChecklistSiteDeadlineNote (updateType = 1, note = "${group}") -> Thành công!\n`;
                    }
                    if (note) {
                        const noteSnippet = note.length > 55 ? note.substring(0, 55) + "..." : note;
                        logText += `   ↳ Gửi POST /UpdateChecklistSiteResultNote (note = "${noteSnippet}") -> Thành công!\n`;
                    }
                    logText += `--------------------------------------------------\n`;
                }
            });

            const cleanCount = 43 - errorItemsCount;
            if (cleanCount > 0) {
                logText += `\n[Tự động điền] Gửi POST /UpdateCheckListSiteResult (point = 0) cho ${cleanCount} hạng mục không có lỗi khác...\n`;
            }

            logText += `\nGửi POST /CompleteUpdateCheckListSiteResult (csId = 90590b97-3486-4bee-a201-9f9ef581de59) -> Thành công!\n`;
            logText += `--- ĐỒNG BỘ HOÀN TẤT ---`;

            alert(logText);
            btnSyncOps.disabled = false;
            btnSyncOps.innerText = '⚡ Đẩy Dữ Liệu Lên OPS';
        }, 1500);
    });
});

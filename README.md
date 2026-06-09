# Phân tích và Đề xuất Giải pháp Tự động hóa Form Đánh giá WinMart OPS

Dự án này tập trung vào việc nghiên cứu, phân tích và phát triển công cụ tự động hóa việc nhập liệu lên các bảng đánh giá trên hệ thống WinMart OPS (`ops.winmart.vn`).

---

## 1. Phân tích hiện trạng hệ thống WinMart OPS

Dựa trên cấu trúc trang đăng nhập tại đường dẫn `https://ops.winmart.vn/ds-danh-gia-bktt-mobile`, hệ thống có hai phương thức đăng nhập:
1. **Đăng nhập nội bộ (Standard Login):** Sử dụng email và mật khẩu qua form nội bộ gửi POST request tới `/Auth/DoLogin`.
2. **Đăng nhập Microsoft Account (Azure AD SSO):** Chuyển hướng xác thực thông qua `/dang-nhap-azad`.

Khi người dùng đăng nhập thành công, trình duyệt sẽ lưu giữ các session cookies chính:
- `ASP.NET_SessionId`
- `_Rop.Authentication`

Các trang kết quả đánh giá (như `https://ops.winmart.vn/ke-qua-danh-gia-bktt-mobile?csId=...`) yêu cầu bắt buộc phải có session hợp lệ này để truy cập.

---

## 2. Các giải pháp đề xuất

### Giải pháp 1: Chrome/Edge Extension hoặc Tampermonkey Script (Khuyên dùng)
- **Cơ chế:** Tiện ích mở rộng chạy trực tiếp trên trình duyệt. Người dùng tự đăng nhập Microsoft thủ công, sau đó công cụ sẽ hiển thị một Form tùy chỉnh hoặc nút nhập dữ liệu từ Excel để tự động điền các trường dữ liệu trên trang web WinMart.
- **Ưu điểm:** Vượt qua được tất cả lớp bảo mật xác thực (MFA/OTP) của Microsoft, cực kỳ an toàn vì không cần lưu trữ thông tin mật khẩu.
- **Nhược điểm:** Phải cài đặt Extension (chế độ Developer) hoặc cài Tampermonkey.

### Giải pháp 2: Phần mềm Desktop (Python Playwright) có lưu Session
- **Cơ chế:** Viết một tool GUI (PyQt/Tkinter). Lần chạy đầu tiên sẽ mở trình duyệt để người dùng đăng nhập. Sau đó, phần mềm lưu Session Cookies vào máy. Các lần sau, phần mềm sẽ chạy ngầm, tự động đọc dữ liệu từ file Excel và điền tự động mà không cần đăng nhập lại (trừ khi session hết hạn).
- **Ưu điểm:** Hỗ trợ nhập hàng loạt tốt, chạy độc lập dạng file `.exe`.
- **Nhược điểm:** Cần đăng nhập lại thủ công khi session Microsoft hết hạn.

### Giải pháp 3: Ứng dụng Web/Desktop tương tác trực tiếp qua API
- **Cơ chế:** Ứng dụng gửi HTTP POST request trực tiếp lên API lưu trữ của WinMart bằng cách yêu cầu người dùng copy Session Cookies dán vào phần mềm.
- **Ưu điểm:** Siêu nhẹ, chạy nhanh, giao diện độc lập hoàn toàn.
- **Nhược điểm:** Thao tác copy Cookie thủ công khá phức tạp đối với người dùng thông thường.

---

## 3. Các bước chuẩn bị tiếp theo

Để tiến hành code chi tiết, chúng tôi cần các thông tin sau từ phía bạn:
1. **Mã nguồn HTML / Ảnh chụp màn hình** của trang kết quả đánh giá mục tiêu sau khi đã đăng nhập thành công.
2. **Thông số Network Request (hoặc file HAR)** khi bạn bấm lưu/gửi kết quả đánh giá trên hệ thống WinMart OPS.

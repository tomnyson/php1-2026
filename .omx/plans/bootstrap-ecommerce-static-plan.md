# Kế hoạch triển khai website bán hàng tĩnh bằng Bootstrap

## Mục tiêu
Xây dựng bộ giao diện HTML tĩnh dùng Bootstrap cho website bán hàng đầy đủ luồng người dùng và khu vực quản trị, sẵn sàng để nối dữ liệu/PHP ở bước sau.

## Phạm vi
- Loại công việc: new feature
- Quy mô: 26 trang tĩnh HTML
- Hiện trạng repo: gần như trống, chỉ có `.omx/`
- Stack giao diện: HTML + Bootstrap 5 + Bootstrap Icons + CSS dùng chung + JS nhẹ cho tương tác cơ bản

## Inventory trang

### User-facing
1. `index.html` — trang chủ
2. `shop.html` — danh sách sản phẩm
3. `product-detail.html` — chi tiết sản phẩm
4. `cart.html` — giỏ hàng
5. `checkout.html` — thanh toán
6. `order-success.html` — đặt hàng thành công
7. `orders.html` — lịch sử đơn hàng
8. `order-detail.html` — chi tiết đơn hàng
9. `wishlist.html` — sản phẩm yêu thích
10. `login.html` — đăng nhập
11. `register.html` — đăng ký
12. `forgot-password.html` — quên mật khẩu
13. `account-profile.html` — thông tin tài khoản
14. `account-address.html` — sổ địa chỉ
15. `contact.html` — liên hệ / hỗ trợ

### Admin
16. `admin/index.html` — dashboard
17. `admin/products.html` — quản lý sản phẩm
18. `admin/product-form.html` — thêm/sửa sản phẩm
19. `admin/orders.html` — quản lý đơn hàng
20. `admin/order-detail.html` — chi tiết đơn hàng
21. `admin/customers.html` — quản lý khách hàng
22. `admin/categories.html` — quản lý danh mục
23. `admin/inventory.html` — tồn kho
24. `admin/reports.html` — báo cáo
25. `admin/settings.html` — cài đặt cửa hàng
26. `admin/login.html` — đăng nhập admin

## Cấu trúc thư mục đề xuất
```text
/
├─ index.html
├─ shop.html
├─ product-detail.html
├─ cart.html
├─ checkout.html
├─ order-success.html
├─ orders.html
├─ order-detail.html
├─ wishlist.html
├─ login.html
├─ register.html
├─ forgot-password.html
├─ account-profile.html
├─ account-address.html
├─ contact.html
├─ assets/
│  ├─ css/
│  │  ├─ bootstrap.min.css
│  │  ├─ style.css
│  │  └─ admin.css
│  ├─ js/
│  │  ├─ bootstrap.bundle.min.js
│  │  ├─ app.js
│  │  └─ admin.js
│  ├─ img/
│  │  ├─ products/
│  │  ├─ banners/
│  │  ├─ users/
│  │  └─ placeholders/
│  └─ vendor/
│     └─ bootstrap-icons/
└─ admin/
   ├─ index.html
   ├─ products.html
   ├─ product-form.html
   ├─ orders.html
   ├─ order-detail.html
   ├─ customers.html
   ├─ categories.html
   ├─ inventory.html
   ├─ reports.html
   ├─ settings.html
   └─ login.html
```

## UI patterns tái sử dụng
- Header user: topbar, search, mini-cart, menu điều hướng.
- Footer user: liên hệ, chính sách, newsletter, social links.
- Product card: ảnh, giá, badge, rating, nút thêm giỏ/yêu thích.
- Section title: tiêu đề + action link dùng lại cho homepage và listing.
- Filter/sort bar: bộ lọc giá, danh mục, trạng thái tồn kho.
- Form pattern: label, helper text, validation state, CTA chính/phụ.
- Empty state: giỏ hàng trống, wishlist trống, chưa có đơn hàng.
- Status badge: mới, đang giao, hoàn tất, hủy, hết hàng.
- Table responsive: orders, customers, inventory, categories.
- Admin shell: sidebar, topbar, breadcrumb, page header, action toolbar.
- Admin stat cards: doanh thu, đơn hàng, khách hàng, tồn kho thấp.
- Modal xác nhận: xóa sản phẩm, đổi trạng thái, logout.

## Trình tự triển khai đề xuất
1. Dựng nền tảng assets và layout khung chung cho user/admin.
2. Hoàn thiện nhóm trang user core: home, shop, detail, cart, checkout.
3. Hoàn thiện nhóm tài khoản user: auth, profile, address, orders.
4. Hoàn thiện admin shell và dashboard.
5. Hoàn thiện các trang CRUD admin và trang báo cáo/cài đặt.
6. Rà soát responsive, consistency, link điều hướng, trạng thái mẫu.

## Acceptance criteria
- Tất cả 26 trang HTML tồn tại đúng vị trí theo cấu trúc thư mục đã chốt.
- Mọi trang dùng Bootstrap 5 thống nhất, không vỡ layout ở mobile, tablet, desktop.
- User pages có header/footer đồng nhất; admin pages có sidebar/topbar đồng nhất.
- Các CTA, menu, breadcrumb, pagination, tab và bảng dữ liệu có trạng thái hover/focus rõ ràng.
- Mọi liên kết điều hướng chính giữa các trang tĩnh hoạt động đúng.
- Có đủ trạng thái mẫu: danh sách có dữ liệu, rỗng, badge trạng thái, form validation demo.
- Không phụ thuộc backend để render giao diện; mở trực tiếp file HTML vẫn xem được đầy đủ.
- CSS/JS dùng chung được tách riêng, không copy-paste style/script theo từng trang.

## Rủi ro và lưu ý
- Vì repo đang trống, cần kỷ luật tái sử dụng layout ngay từ đầu để tránh nhân bản HTML.
- Nếu chưa dùng template engine/PHP include, header/footer/sidebar sẽ lặp file; nên giữ naming và khối markup ổn định để dễ tách partial ở bước sau.
- Báo cáo admin nên dùng chart placeholder tĩnh ở pha này, chưa gắn thư viện ngoài nếu không thực sự cần.

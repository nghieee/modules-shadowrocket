<h1 align="center">🚀 Shadowrocket Modules</h1>

<p align="center">
  <b>📡 Mở khoá tính năng - 🔒 MITM Scripts - 🚫 Chặn quảng cáo</b>
  <br>
  <i>Các module tùy chỉnh giúp nâng cao trải nghiệm Shadowrocket.</i>
</p>

---

## 📂 Danh sách module

| 📜 Tên Module | 📝 Mô tả | Trạng thái |
|---|---|---|
| [locket.module](./locket.module) | Mở khoá Locket Gold 🏅 | ✅ Hoạt động |

---

## 🛠️ Cách cài đặt

### Bước 1: Cài module vào Shadowrocket
1. Mở **Shadowrocket** → vào tab **Config**
2. Chọn **Module** → nhấn dấu **+**
3. Dán URL raw của module:
```
https://raw.githubusercontent.com/dhungx/modules-shadowrocket/main/locket.module
```

### Bước 2: Bật MITM
1. Vào **Shadowrocket** → **Config** → **HTTPS Decryption**
2. Đảm bảo **Certificate** đã được cài và tin cậy
3. Thêm `api.revenuecat.com` vào danh sách Hostname (module sẽ tự thêm)

### Bước 3: Kích hoạt
1. Bật **VPN** của Shadowrocket
2. Mở lại ứng dụng Locket
3. Enjoy Locket Gold! 🎉

---

## 📦 Locket Gold Module

### Cơ chế hoạt động

Module này hoạt động bằng cách:

1. **`deleteHeader.js`** — Chạy trên **HTTP Request**: Xóa các header cache (`X-RevenueCat-ETag`, `If-None-Match`) để server RevenueCat không trả về response 304 (cached), đảm bảo script response được kích hoạt.

2. **`Locket.js`** — Chạy trên **HTTP Response**: Intercept response từ `api.revenuecat.com` và inject thông tin subscriber Gold, bao gồm:
   - Entitlement `Gold` với `expires_date: 2099-12-31`
   - Subscription `com.locket.Locket.gold.monthly` với trạng thái active

### API endpoint được hook
```
^https://api\.revenuecat\.com/.+/(receipts$|subscribers/[^/]+$)
```

---

## ⚠️ Lưu ý

- Module **chỉ dùng cho mục đích học tập và nghiên cứu**.
- Nếu bạn thích ứng dụng, hãy mua bản quyền để hỗ trợ nhà phát triển.
- RevenueCat có thể cập nhật API bất kỳ lúc nào, script có thể cần cập nhật.
- Yêu cầu Certificate MITM đã được cài và tin cậy trên thiết bị.

---

## 📬 Liên hệ

- GitHub: ng_hiee

---

<p align="center">Made with ❤️ by ng_hiee</p>

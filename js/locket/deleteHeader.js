/**
 * Locket - Delete Cache Headers Script
 * By: ng_hiee
 * Version: V1.0.3
 *
 * Hoạt động: Xoá các header liên quan đến cache trong request
 * gửi đến RevenueCat để đảm bảo server trả về response mới
 * (không dùng cache cũ), giúp script Locket.js hoạt động đúng.
 */

const version = 'V1.0.3';

/**
 * Đặt giá trị header (tìm kiếm không phân biệt hoa thường)
 * @param {Object} headers - Object chứa các header
 * @param {string} key - Tên header cần đặt
 * @param {string} value - Giá trị mới
 */
function setHeaderValue(headers, key, value) {
  const lowerKey = key.toLowerCase();
  // Kiểm tra xem header đã tồn tại dưới dạng lowercase chưa
  const existingKey = Object.keys(headers).find(k => k.toLowerCase() === lowerKey);
  if (existingKey) {
    headers[existingKey] = value;
  } else {
    headers[key] = value;
  }
}

/**
 * Xóa một header khỏi object headers (không phân biệt hoa thường)
 * @param {Object} headers - Object chứa các header
 * @param {string} key - Tên header cần xóa
 */
function deleteHeader(headers, key) {
  const existingKey = Object.keys(headers).find(k => k.toLowerCase() === key.toLowerCase());
  if (existingKey) {
    delete headers[existingKey];
  }
}

// Lấy danh sách header từ request hiện tại
var modifiedHeaders = Object.assign({}, $request.headers);

// Danh sách các header cần xóa (liên quan đến caching RevenueCat)
const headersToDelete = [
  "X-RevenueCat-ETag",
  "If-None-Match",
  "If-Modified-Since"
];

// Xóa các header cache
headersToDelete.forEach(function(headerKey) {
  deleteHeader(modifiedHeaders, headerKey);
});

// Cập nhật các header để bypass cache
setHeaderValue(modifiedHeaders, "Cache-Control", "no-cache, no-store, must-revalidate");
setHeaderValue(modifiedHeaders, "Pragma", "no-cache");

// Log để debug (Shadowrocket/Surge sẽ hiển thị trong console)
console.log("[Locket deleteHeader " + version + "] Headers đã được chỉnh sửa.");

// Trả về request với headers đã được sửa
$done({ headers: modifiedHeaders });

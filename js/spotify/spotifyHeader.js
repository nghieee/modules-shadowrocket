/**
 * Spotify - Modify Request Headers Script
 * By: ng_hiee
 * Version: V1.0.0
 *
 * Hoạt động: Chỉnh sửa các header trong request gửi đến
 * Spotify API để bypass một số cơ chế kiểm tra.
 */

const version = 'V1.0.0';

/**
 * Đặt giá trị header (tìm kiếm không phân biệt hoa thường)
 */
function setHeaderValue(headers, key, value) {
  const existingKey = Object.keys(headers).find(k => k.toLowerCase() === key.toLowerCase());
  if (existingKey) {
    headers[existingKey] = value;
  } else {
    headers[key] = value;
  }
}

/**
 * Xóa header khỏi object (không phân biệt hoa thường)
 */
function deleteHeader(headers, key) {
  const existingKey = Object.keys(headers).find(k => k.toLowerCase() === key.toLowerCase());
  if (existingKey) {
    delete headers[existingKey];
  }
}

// Lấy headers hiện tại
var modifiedHeaders = Object.assign({}, $request.headers);

// Xóa các header liên quan đến cache
var headersToDelete = [
  "If-None-Match",
  "If-Modified-Since",
  "X-Spotify-ETag"
];

headersToDelete.forEach(function(key) {
  deleteHeader(modifiedHeaders, key);
});

// Cập nhật cache-control
setHeaderValue(modifiedHeaders, "Cache-Control", "no-cache");
setHeaderValue(modifiedHeaders, "Pragma", "no-cache");

console.log("[Spotify Header " + version + "] Headers đã được chỉnh sửa.");

$done({ headers: modifiedHeaders });

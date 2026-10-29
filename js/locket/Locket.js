/**
 * Locket Gold Unlock Script
 * By: ng_hiee
 * Tương thích: Shadowrocket / Surge / LanceX
 * Version: V1.1.0
 *
 * Hoạt động: Intercept response từ RevenueCat API và inject
 * thông tin subscriber Gold để mở khoá tính năng premium.
 */

const APP_NAME = 'Locket';
const GOLD_ENTITLEMENT = 'Gold';

// Map tên entitlement theo app
const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold']
};

var ua = $request.headers["User-Agent"] || $request.headers["user-agent"] || "Locket/unknown";
var obj;

try {
  obj = JSON.parse($response.body);
} catch (e) {
  console.log("[Locket] Không thể parse JSON response: " + e.message);
  $done({});
}

// Thêm watermark
obj.Attention = "Mở khoá bởi ng_hiee";

// Cấu hình subscription Gold giả
var goldSubscription = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  period_type: "normal",
  expires_date: "2099-12-31T23:59:59Z",
  grace_period_expires_date: null,
  unsubscribe_detected_at: null,
  original_purchase_date: "2024-01-01T00:00:00Z",
  purchase_date: "2024-01-01T00:00:00Z",
  store: "app_store",
  is_active: true,
  will_renew: true,
  product_identifier: "com.locket.Locket.gold.monthly",
  product_plan_identifier: null,
  refunded_at: null,
  auto_resume_date: null
};

// Cấu hình entitlement Gold giả
var goldEntitlement = {
  expires_date: "2099-12-31T23:59:59Z",
  grace_period_expires_date: null,
  product_identifier: "com.locket.Locket.gold.monthly",
  product_plan_identifier: null,
  purchase_date: "2024-01-01T00:00:00Z"
};

// Đảm bảo có các key cần thiết trong response
if (!obj.subscriber) {
  obj.subscriber = {};
}

var subscriber = obj.subscriber;

// Khởi tạo các key nếu chưa có
if (!subscriber.entitlements) subscriber.entitlements = {};
if (!subscriber.subscriptions) subscriber.subscriptions = {};
if (!subscriber.non_subscriptions) subscriber.non_subscriptions = {};
if (!subscriber.other_purchases) subscriber.other_purchases = {};

// Inject entitlement Gold
subscriber.entitlements[GOLD_ENTITLEMENT] = goldEntitlement;

// Inject subscription
subscriber.subscriptions["com.locket.Locket.gold.monthly"] = goldSubscription;
subscriber.subscriptions["com.locket.Locket.gold.yearly"] = Object.assign({}, goldSubscription, {
  product_identifier: "com.locket.Locket.gold.yearly"
});

// Đặt first seen nếu chưa có
if (!subscriber.first_seen) {
  subscriber.first_seen = "2024-01-01T00:00:00Z";
}
if (!subscriber.last_seen) {
  subscriber.last_seen = new Date().toISOString();
}
if (!subscriber.original_app_user_id) {
  subscriber.original_app_user_id = "$RCAnonymousID:locket_gold_user";
}
if (!subscriber.original_application_version) {
  subscriber.original_application_version = "1.0";
}
if (!subscriber.original_purchase_date) {
  subscriber.original_purchase_date = "2024-01-01T00:00:00Z";
}

// Ghi lại obj đã sửa
obj.subscriber = subscriber;

// Trả về response đã chỉnh sửa
$done({
  status: 200,
  headers: $response.headers,
  body: JSON.stringify(obj)
});

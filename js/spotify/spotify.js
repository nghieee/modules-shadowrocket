/**
 * Spotify Premium Unlock Script
 * By: ng_hiee
 * Tương thích: Shadowrocket / Surge / LanceX
 * Version: V1.0.0
 *
 * Hoạt động: Intercept response từ Spotify API (spclient) và
 * sửa thông tin tài khoản để unlock tính năng Premium.
 *
 * Tính năng unlock:
 *  ✅ Phát nhạc không giới hạn (không bị shuffle bắt buộc)
 *  ✅ Bỏ quảng cáo audio
 *  ✅ Chất lượng âm thanh cao hơn
 *  ✅ Phát không giới hạn lượt skip
 *
 * ⚠️  Chỉ dùng cho mục đích học tập.
 */

// ─────────────────────────────────────────────
// 1. Đọc response body
// ─────────────────────────────────────────────
var body = $response.body;
var headers = $response.headers;
var url = $request.url;

if (!body || body.length === 0) {
  $done({});
}

// ─────────────────────────────────────────────
// 2. Xác định loại endpoint đang xử lý
// ─────────────────────────────────────────────
var isProductState = /\/product-state/.test(url);
var isAttributesState = /\/attributes-state/.test(url);
var isConnectState = /\/connect-state/.test(url);
var isRemoteState = /remote\/state/.test(url);

// ─────────────────────────────────────────────
// 3. Xử lý JSON endpoint (product-state)
//    Endpoint này kiểm tra gói subscription của user
// ─────────────────────────────────────────────
if (isProductState) {
  try {
    var obj = JSON.parse(body);

    // Cài đặt Premium attributes
    var premiumAttrs = {
      "type": "premium",
      "catalogue": "premium",
      "catalogue_countries": "AD,AE,AG,AL,AM,AO,AR,AT,AU,AZ,BA,BB,BD,BE,BF,BG,BH,BI,BJ,BN,BO,BR,BS,BT,BW,BY,BZ,CA,CD,CG,CH,CI,CL,CM,CO,CR,CV,CY,CZ,DE,DJ,DK,DM,DO,DZ,EC,EE,EG,ER,ES,ET,FI,FJ,FM,FR,GA,GB,GD,GE,GH,GM,GN,GQ,GR,GT,GW,GY,HK,HN,HR,HT,HU,ID,IE,IL,IN,IQ,IS,IT,JM,JO,JP,KE,KG,KH,KI,KM,KN,KR,KW,KZ,LA,LB,LC,LI,LK,LR,LS,LT,LU,LV,LY,MA,MC,MD,ME,MG,MH,MK,ML,MM,MN,MR,MT,MU,MV,MW,MX,MY,MZ,NA,NE,NG,NI,NL,NO,NP,NR,NZ,OM,PA,PE,PG,PH,PK,PL,PS,PT,PW,PY,QA,RO,RS,RW,SA,SB,SC,SD,SE,SG,SI,SK,SL,SM,SN,SO,SR,SS,ST,SV,SZ,TD,TG,TH,TJ,TL,TM,TN,TO,TR,TT,TV,TZ,UA,UG,US,UY,UZ,VA,VC,VE,VN,VU,WS,XK,YE,ZA,ZM,ZW",
      "global_can_download": "1",
      "global_can_on_demand": "1",
      "shuffle": "0",
      "shuffle_context": "0",
      "global_can_skip": "1",
      "global_skips_per_hour": "999",
      "global_skips_left": "999",
      "can_seek": "1",
      "can_play_explicit_content": "1",
      "playback_speed": "1",
      "audio_quality": "very_high",
      "download_quality": "very_high",
      "ads": "0",
      "radio_ad_support": "0",
      "education_music_ad_support": "0",
      "streaming_rules": "premium",
      "account_lm": "1",
      "can_use_superbird": "1",
      "has_exp_features": "1"
    };

    // Ghi đè attributes nếu đã có, hoặc tạo mới
    if (!obj.pairs) {
      obj.pairs = {};
    }

    // Merge từng thuộc tính premium vào response
    Object.keys(premiumAttrs).forEach(function(key) {
      obj.pairs[key] = premiumAttrs[key];
    });

    $done({
      status: 200,
      headers: headers,
      body: JSON.stringify(obj)
    });

  } catch (e) {
    console.log("[Spotify] Không thể parse product-state JSON: " + e.message);
    $done({});
  }
}

// ─────────────────────────────────────────────
// 4. Xử lý Connect State / Remote State
//    Endpoint này quản lý trạng thái phát nhạc
// ─────────────────────────────────────────────
else if (isConnectState || isRemoteState) {
  try {
    var obj = JSON.parse(body);

    // Đảm bảo player_state không bị giới hạn
    if (obj.player_state) {
      // Bỏ giới hạn shuffle bắt buộc
      if (obj.player_state.options) {
        obj.player_state.options.shuffling_context = false;
        obj.player_state.options.repeating_context = false;
        obj.player_state.options.repeating_track = false;
      }
    }

    // Xóa restrictions
    if (obj.player_state && obj.player_state.restrictions) {
      obj.player_state.restrictions = {};
    }

    $done({
      status: 200,
      headers: headers,
      body: JSON.stringify(obj)
    });

  } catch (e) {
    console.log("[Spotify] Không thể parse connect-state JSON: " + e.message);
    $done({});
  }
}

// ─────────────────────────────────────────────
// 5. Fallback: trả nguyên response nếu không xử lý được
// ─────────────────────────────────────────────
else {
  $done({});
}

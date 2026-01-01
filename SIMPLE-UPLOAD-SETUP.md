# 🚀 Hướng Dẫn Upload Đơn Giản - R2 + Apps Script

## Ý Tưởng Đơn Giản

1. **Cloudflare Worker** - Upload ảnh lên R2, lấy public URL
2. **Google Apps Script (3 dòng)** - Nhận data và thêm row vào Sheet
3. **car-game.html** - Chụp ảnh → Gọi Worker → Gọi Apps Script → Xong!

---

## Phần 1: Setup Cloudflare R2 (5 phút)

### Bước 1: Tạo R2 Bucket

1. Vào https://dash.cloudflare.com
2. Click **R2** (sidebar trái)
3. Click **Create bucket**
4. Tên bucket: **`car-photos`**
5. Click **Create bucket**

### Bước 2: Enable Public Access

1. Vào bucket **car-photos** vừa tạo
2. Tab **Settings**
3. Phần **Public access**:
   - Click **Allow Access**
   - Copy **Public bucket URL** (dạng: `https://pub-xxxxx.r2.dev`)
   - Lưu lại URL này!

### Bước 3: Tạo Worker

1. Click **Workers & Pages** (sidebar)
2. Click **Create application** → **Create Worker**
3. Tên Worker: **`car-uploader`**
4. Click **Deploy**

### Bước 4: Bind R2 Bucket

1. Vào Worker **car-uploader**
2. Tab **Settings** → **Variables**
3. Phần **R2 Bucket Bindings**:
   - Click **Add binding**
   - Variable name: **`CAR_PHOTOS`**
   - R2 bucket: Chọn **`car-photos`**
   - Click **Save**

### Bước 5: Paste Code

1. Tab **Quick edit** (hoặc click **Edit code**)
2. **Xóa hết code mẫu**
3. Mở file `cloudflare-worker-simple.js` (tôi sẽ tạo bên dưới)
4. **Copy và paste** vào
5. **Tìm dòng** có `https://pub-YOUR_ACCOUNT_ID.r2.dev`
6. **Thay thế** bằng Public bucket URL của bạn (từ Bước 2)
7. Click **Save and Deploy**

### Bước 6: Copy Worker URL

1. Click **Copy** nút bên cạnh URL
2. Dạng: `https://car-uploader.YOUR_SUBDOMAIN.workers.dev`
3. Lưu lại!

---

## Phần 2: Setup Google Apps Script (2 phút)

### Bước 1: Mở Apps Script

1. Vào Google Sheet: https://docs.google.com/spreadsheets/d/1L5uPWT-44HeOhFIDBZywS6JolM7BBgQHfmN2FzRaGsU/edit
2. **Extensions** → **Apps Script**

### Bước 2: Paste Code CỰC NGẮN

Xóa code cũ, paste code này:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Cars');

    sheet.appendRow([
      data.nameEn,
      data.nameVi,
      data.photoUrl,
      data.color,
      data.category,
      data.difficulty
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      success: true
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

Click **Save** (💾)

### Bước 3: Deploy Web App

1. Click **Deploy** → **New deployment**
2. Click ⚙️ → Chọn **Web app**
3. Settings:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. Click **Authorize access** → Chọn account → Allow
6. **Copy Web app URL**
7. Lưu lại!

---

## Phần 3: Update car-game.html (1 phút)

1. Mở `car-game.html`

2. Tìm `MY_CARS_CONFIG` (khoảng dòng 1070):

```javascript
const MY_CARS_CONFIG = {
    ENABLED: true,
    SHEET_ID: '1L5uPWT-44HeOhFIDBZywS6JolM7BBgQHfmN2FzRaGsU',
    SHEET_NAME: 'Cars',
    AUTO_LOAD: true,
    UPLOAD_URL: '',  // ← Paste Worker URL vào đây
    SHEET_API_URL: ''  // ← Paste Apps Script Web App URL vào đây
};
```

3. Paste 2 URLs:

```javascript
const MY_CARS_CONFIG = {
    ENABLED: true,
    SHEET_ID: '1L5uPWT-44HeOhFIDBZywS6JolM7BBgQHfmN2FzRaGsU',
    SHEET_NAME: 'Cars',
    AUTO_LOAD: true,
    UPLOAD_URL: 'https://car-uploader.YOUR_SUBDOMAIN.workers.dev',
    SHEET_API_URL: 'https://script.google.com/macros/s/AKfycbz.../exec'
};
```

4. **Save**

---

## ✅ Xong! Thử Ngay

1. Mở `car-game.html`
2. Click **"📸 My Cars"** → **"➕ Add New Car"**
3. Chụp ảnh
4. Điền thông tin
5. Click **"Add to Collection"**

**Kết quả:**
- Ảnh lên R2 ✓
- Row mới trong Sheet ✓
- Game reload với xe mới ✓

---

## 🎯 So Sánh

### Trước (Phức tạp):
- Google Apps Script dài 200+ dòng
- Upload Drive API phức tạp
- Setup permissions khó

### Bây giờ (Đơn giản):
- **Worker**: Upload R2 (30 dòng)
- **Apps Script**: Add row Sheet (15 dòng)
- **Setup**: 3 bước rõ ràng

---

## 💰 Chi Phí

**Cloudflare R2 Free Tier:**
- 10 GB storage
- 1 million requests/month
- **FREE** cho hàng ngàn ảnh!

**Google Apps Script:**
- FREE

**Tổng: $0** 🎉

---

## 🔧 Troubleshooting

### Worker lỗi "CAR_PHOTOS is not defined"
→ Chưa bind R2 bucket. Xem lại Phần 1 Bước 4

### Apps Script lỗi "Sheet not found"
→ Check sheet tab tên đúng là "Cars" (có chữ C hoa)

### Upload thành công nhưng không thấy ảnh
→ Check Public bucket URL đúng chưa

---

Đơn giản hơn giải pháp trước NHIỀU! 🚀

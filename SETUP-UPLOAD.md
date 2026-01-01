# 📸 Hướng Dẫn Setup Upload (3 phút)

## ĐƠN GIẢN NHẤT: Chỉ cần Google Apps Script!

**Frontend xử lý tất cả** → Chỉ cần 1 Apps Script endpoint!

---

## 🎯 Cách Hoạt Động

```
Frontend (car-game.html):
  ↓ Đọc ảnh từ camera/gallery
  ↓ Convert sang base64
  ↓ POST lên Apps Script

Apps Script:
  ↓ Nhận base64
  ↓ Save ảnh lên Google Drive
  ↓ Thêm row vào Google Sheet
  ↓ Return success

Done! ✅
```

**Không cần:**
- ❌ Cloudflare Worker
- ❌ Backend server
- ❌ Node.js / PHP
- ❌ Hosting

---

## ⚙️ Setup (3 bước - 3 phút)

### Bước 1: Mở Google Apps Script (30 giây)

1. Vào Google Sheet của bạn:
   https://docs.google.com/spreadsheets/d/1L5uPWT-44HeOhFIDBZywS6JolM7BBgQHfmN2FzRaGsU/edit

2. Click menu **"Extensions"** → **"Apps Script"**

3. Một tab mới sẽ mở ra với code editor

---

### Bước 2: Paste Code (1 phút)

1. **XÓA TẤT CẢ** code cũ trong editor (nếu có)

2. Mở file **`apps-script-simple.js`** trong project này

3. **COPY TOÀN BỘ** code

4. **PASTE** vào Apps Script editor

5. Click **💾 Save** (hoặc Ctrl+S)
   - Đặt tên: "Car Photo Uploader"

---

### Bước 3: Deploy Web App (1 phút)

1. Click nút **"Deploy"** (góc trên bên phải)

2. Chọn **"New deployment"**

3. Click icon **⚙️** bên cạnh "Select type"

4. Chọn **"Web app"**

5. Cài đặt:
   - **Description**: "Upload car photos" (tùy ý)
   - **Execute as**: **Me** (email của bạn)
   - **Who has access**: **Anyone**

6. Click **"Deploy"**

---

### Bước 3.1: Authorize (30 giây)

1. Popup hiện ra: Click **"Authorize access"**

2. Chọn Google account của bạn

3. Thấy cảnh báo: **"Google hasn't verified this app"**
   - Đây là **BÌNH THƯỜNG**! Code này do bạn tự viết nên an toàn
   - Click **"Advanced"** (ở dưới bên trái)
   - Click **"Go to Car Photo Uploader (unsafe)"**

4. Màn hình permissions:
   - Click **"Allow"** để cho phép:
     - See, edit, create, delete spreadsheets
     - See, edit, create, delete Google Drive files

5. Click **"Allow"**

---

### Bước 3.2: Copy Web App URL (10 giây)

1. Sau khi deploy xong, thấy thông báo: **"Deployment successfully created"**

2. **COPY** URL dạng:
   ```
   https://script.google.com/macros/s/AKfycbz...xxxxx.../exec
   ```

3. Click icon **📋** để copy

4. **LƯU LẠI** URL này!

---

### Bước 4: Paste URL vào Game (30 giây)

1. Mở file **`car-game.html`**

2. Tìm dòng (khoảng line 1166):
   ```javascript
   UPLOAD_URL: ''
   ```

3. Paste URL vào giữa 2 dấu nháy:
   ```javascript
   UPLOAD_URL: 'https://script.google.com/macros/s/AKfycbz...xxxxx.../exec'
   ```

4. **Save** file

---

## ✅ XONG! Thử Ngay

1. Mở `car-game.html` trong browser

2. Click **"📸 My Cars"**

3. Click **"➕ Add New Car"** (nút xanh lá)

4. **Chụp ảnh** hoặc chọn từ gallery

5. Điền thông tin:
   - English name: Fire Truck
   - Vietnamese name: Xe cứu hỏa
   - Color: Red
   - Category: emergency
   - Difficulty: 1

6. Click **"➕ Add to Collection"**

7. **Chờ upload...**

8. Thành công! ✅
   - Ảnh đã lưu trong Google Drive (folder "My Cars Photos")
   - Row mới đã thêm vào Google Sheet
   - Game tự động reload
   - Xe mới sẵn sàng để chơi!

---

## 📱 Sử Dụng Trên iPhone/Android

1. Mở `car-game.html` trên Safari (iPhone) hoặc Chrome (Android)

2. **"📸 My Cars"** → **"➕ Add New Car"**

3. Click **"📷 Tap to take photo..."**

4. Chọn:
   - **"Take Photo"** / **"Camera"** - Chụp ảnh mới
   - **"Photo Library"** / **"Gallery"** - Chọn ảnh có sẵn

5. Chụp/chọn ảnh xe đồ chơi

6. Điền thông tin và upload!

---

## 🔍 Kiểm Tra Kết Quả

### Google Drive:
1. Vào https://drive.google.com
2. Tìm folder **"My Cars Photos"**
3. Thấy ảnh vừa upload!

### Google Sheet:
1. Vào https://docs.google.com/spreadsheets/d/1L5uPWT-44HeOhFIDBZywS6JolM7BBgQHfmN2FzRaGsU/edit
2. Sheet tab **"Cars"**
3. Thấy row mới với:
   - Tên tiếng Anh
   - Tên tiếng Việt
   - Link ảnh Google Drive
   - Màu sắc
   - Category
   - Difficulty

### Game:
1. Click **"🔄 Reload Cars"** (hoặc reload trang)
2. Xe mới xuất hiện trong collection!
3. Thử chơi "Match Pairs" hoặc "Spell It!" với xe mới

---

## ❓ Troubleshooting

### "Upload not configured" khi click Add Car
→ Chưa paste UPLOAD_URL vào `car-game.html`
→ Xem lại Bước 4

### "Error: Missing required fields"
→ Điền đầy đủ: English name, Vietnamese name, Color

### "Error: Sheet 'Cars' not found"
→ Kiểm tra sheet tab tên **chính xác** là "Cars" (có chữ C hoa)

### Ảnh upload xong nhưng không hiển thị trong game
→ Click **"🔄 Reload Cars"**
→ Hoặc reload trang

### "Authorization required" khi upload
→ Quay lại Apps Script
→ Deploy lại và authorize permissions

---

## 🎉 Tại Sao Đơn Giản?

### Trước (Phức tạp):
```
❌ Cần setup Cloudflare Worker
❌ Cần tạo R2 bucket
❌ Cần bind bucket vào worker
❌ 2 endpoints riêng biệt
❌ Nhiều bước setup
```

### Bây giờ (Đơn giản):
```
✅ CHỈ cần Google Apps Script
✅ Frontend xử lý convert base64
✅ 1 endpoint duy nhất
✅ 3 phút setup
✅ Hoàn toàn miễn phí
```

---

## 💰 Chi Phí

**Google Apps Script:** FREE
**Google Drive:** FREE (15 GB)
**Google Sheets:** FREE

**Tổng: $0** 🎉

---

## 🚀 Nâng Cao (Tùy Chọn)

### Giới hạn dung lượng ảnh

Sửa trong `apps-script-simple.js`:

```javascript
// Thêm validation ở đầu hàm doPost
if (base64Image.length > 5000000) { // ~5MB
  throw new Error('Photo too large! Max 5MB');
}
```

### Thay đổi folder lưu ảnh

Sửa dòng:

```javascript
const folder = getOrCreateFolder('My Cars Photos');
```

Thành:

```javascript
const folder = getOrCreateFolder('Xe Đồ Chơi');
```

### Thêm timestamp vào tên file

Code hiện tại đã có timestamp:

```javascript
`${Date.now()}_${nameEn.replace(/\s+/g, '_')}.jpg`
```

Kết quả: `1704728400000_Fire_Truck.jpg`

---

**Chúc bạn thành công! 🚗📸✨**

Nếu có vấn đề gì, check lại từng bước trong hướng dẫn này.

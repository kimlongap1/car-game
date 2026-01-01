// ========================================
// GOOGLE APPS SCRIPT - CAR PHOTO UPLOADER
// ========================================
//
// SETUP INSTRUCTIONS:
// 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1L5uPWT-44HeOhFIDBZywS6JolM7BBgQHfmN2FzRaGsU/edit
// 2. Click "Extensions" → "Apps Script"
// 3. Delete any existing code
// 4. Paste this entire file
// 5. Click "Deploy" → "New deployment"
// 6. Choose type: "Web app"
// 7. Set "Execute as": Me
// 8. Set "Who has access": Anyone
// 9. Click "Deploy" and authorize
// 10. Copy the Web App URL
// 11. Paste the URL into MY_CARS_CONFIG.UPLOAD_URL in car-game.html
//
// ========================================

// Configuration - Update these if needed
const CONFIG = {
  SHEET_NAME: 'Cars', // Name of your sheet tab
  FOLDER_NAME: 'My Cars Photos', // Google Drive folder name for photos
};

// Handle GET requests - Return HTML form for testing
function doGet(e) {
  return HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Car Photo Uploader</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          background: white;
          border-radius: 20px;
          padding: 30px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        h1 {
          color: #333;
          margin-bottom: 20px;
          text-align: center;
          font-size: 24px;
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          font-weight: bold;
          margin-bottom: 5px;
          color: #555;
        }
        input, select {
          width: 100%;
          padding: 12px;
          font-size: 16px;
          border: 2px solid #ddd;
          border-radius: 10px;
          transition: border 0.3s;
        }
        input:focus, select:focus {
          outline: none;
          border-color: #667eea;
        }
        .photo-upload {
          border: 3px dashed #ddd;
          border-radius: 10px;
          padding: 30px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }
        .photo-upload:hover {
          border-color: #667eea;
          background: #f8f9ff;
        }
        .photo-upload.has-image {
          border-color: #4caf50;
          background: #f1f8f4;
        }
        #photoPreview {
          max-width: 100%;
          max-height: 200px;
          margin-top: 10px;
          border-radius: 10px;
          display: none;
        }
        .upload-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px 30px;
          border: none;
          border-radius: 10px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          width: 100%;
          transition: transform 0.2s;
        }
        .upload-btn:hover {
          transform: scale(1.05);
        }
        .upload-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: scale(1);
        }
        .status {
          margin-top: 20px;
          padding: 15px;
          border-radius: 10px;
          text-align: center;
          font-weight: bold;
          display: none;
        }
        .status.success {
          background: #e8f5e9;
          color: #2e7d32;
          display: block;
        }
        .status.error {
          background: #ffebee;
          color: #c62828;
          display: block;
        }
        .status.loading {
          background: #fff3e0;
          color: #e65100;
          display: block;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚗 Add New Car Photo</h1>

        <form id="carForm">
          <div class="form-group">
            <label>📸 Car Photo</label>
            <div class="photo-upload" id="photoUploadArea" onclick="document.getElementById('photoInput').click()">
              <input type="file" id="photoInput" accept="image/*" capture="environment" style="display: none;">
              <div id="uploadText">📷 Tap to take photo or select from gallery</div>
              <img id="photoPreview" alt="Preview">
            </div>
          </div>

          <div class="form-group">
            <label>🇬🇧 English Name</label>
            <input type="text" id="nameEn" placeholder="e.g., Fire Truck" required>
          </div>

          <div class="form-group">
            <label>🇻🇳 Vietnamese Name</label>
            <input type="text" id="nameVi" placeholder="e.g., Xe cứu hỏa" required>
          </div>

          <div class="form-group">
            <label>🎨 Color</label>
            <select id="color" required>
              <option value="">Select color...</option>
              <option value="red">Red / Đỏ</option>
              <option value="blue">Blue / Xanh dương</option>
              <option value="yellow">Yellow / Vàng</option>
              <option value="green">Green / Xanh lá</option>
              <option value="orange">Orange / Cam</option>
              <option value="purple">Purple / Tím</option>
              <option value="pink">Pink / Hồng</option>
              <option value="black">Black / Đen</option>
              <option value="white">White / Trắng</option>
              <option value="gray">Gray / Xám</option>
            </select>
          </div>

          <div class="form-group">
            <label>📁 Category</label>
            <input type="text" id="category" placeholder="e.g., emergency, sports, construction" value="toy">
          </div>

          <div class="form-group">
            <label>⭐ Difficulty (1-3)</label>
            <select id="difficulty">
              <option value="1">1 - Easy</option>
              <option value="2">2 - Medium</option>
              <option value="3">3 - Hard</option>
            </select>
          </div>

          <button type="submit" class="upload-btn" id="submitBtn">
            ➕ Add Car to Collection
          </button>
        </form>

        <div id="status" class="status"></div>
      </div>

      <script>
        const photoInput = document.getElementById('photoInput');
        const photoPreview = document.getElementById('photoPreview');
        const photoUploadArea = document.getElementById('photoUploadArea');
        const uploadText = document.getElementById('uploadText');
        const form = document.getElementById('carForm');
        const submitBtn = document.getElementById('submitBtn');
        const statusDiv = document.getElementById('status');

        let selectedFile = null;

        photoInput.addEventListener('change', function(e) {
          const file = e.target.files[0];
          if (file && file.type.startsWith('image/')) {
            selectedFile = file;
            const reader = new FileReader();
            reader.onload = function(e) {
              photoPreview.src = e.target.result;
              photoPreview.style.display = 'block';
              uploadText.textContent = '✓ Photo selected';
              photoUploadArea.classList.add('has-image');
            };
            reader.readAsDataURL(file);
          }
        });

        form.addEventListener('submit', async function(e) {
          e.preventDefault();

          if (!selectedFile) {
            showStatus('Please select a photo first!', 'error');
            return;
          }

          // Get form values
          const nameEn = document.getElementById('nameEn').value.trim();
          const nameVi = document.getElementById('nameVi').value.trim();
          const color = document.getElementById('color').value;
          const category = document.getElementById('category').value.trim();
          const difficulty = document.getElementById('difficulty').value;

          if (!nameEn || !nameVi || !color) {
            showStatus('Please fill all required fields!', 'error');
            return;
          }

          // Convert file to base64
          showStatus('Uploading photo...', 'loading');
          submitBtn.disabled = true;

          const reader = new FileReader();
          reader.onload = async function(e) {
            const base64Data = e.target.result.split(',')[1];

            try {
              const response = await fetch(window.location.href, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                  action: 'upload',
                  fileName: selectedFile.name,
                  fileData: base64Data,
                  mimeType: selectedFile.type,
                  nameEn: nameEn,
                  nameVi: nameVi,
                  color: color,
                  category: category,
                  difficulty: difficulty
                })
              });

              const result = await response.json();

              if (result.success) {
                showStatus('✅ Car added successfully!', 'success');
                // Reset form
                form.reset();
                photoPreview.style.display = 'none';
                uploadText.textContent = '📷 Tap to take photo or select from gallery';
                photoUploadArea.classList.remove('has-image');
                selectedFile = null;
              } else {
                showStatus('❌ Error: ' + (result.error || 'Upload failed'), 'error');
              }
            } catch (error) {
              showStatus('❌ Error: ' + error.message, 'error');
            } finally {
              submitBtn.disabled = false;
            }
          };

          reader.readAsDataURL(selectedFile);
        });

        function showStatus(message, type) {
          statusDiv.textContent = message;
          statusDiv.className = 'status ' + type;
        }
      </script>
    </body>
    </html>
  `);
}

// Handle POST requests - Upload photo and add to sheet
function doPost(e) {
  try {
    const params = e.parameter;

    if (params.action === 'upload') {
      // 1. Upload photo to Google Drive
      const fileData = Utilities.base64Decode(params.fileData);
      const blob = Utilities.newBlob(fileData, params.mimeType, params.fileName);

      // Get or create folder
      const folder = getOrCreateFolder(CONFIG.FOLDER_NAME);

      // Upload file with unique name
      const timestamp = new Date().getTime();
      const fileName = timestamp + '_' + params.fileName;
      const file = folder.createFile(blob.setName(fileName));

      // Make file publicly accessible
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      // Get public link
      const photoUrl = file.getUrl();

      // 2. Add row to Google Sheet
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);

      if (!sheet) {
        throw new Error('Sheet "' + CONFIG.SHEET_NAME + '" not found');
      }

      // Append new row
      sheet.appendRow([
        params.nameEn,
        params.nameVi,
        photoUrl,
        params.color,
        params.category,
        params.difficulty
      ]);

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Car added successfully!',
        photoUrl: photoUrl
      })).setMimeType(ContentService.MimeType.JSON);

    } else {
      throw new Error('Invalid action');
    }

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper function to get or create folder
function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);

  if (folders.hasNext()) {
    return folders.next();
  } else {
    return DriveApp.createFolder(folderName);
  }
}

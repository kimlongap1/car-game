// ============================================
// GOOGLE APPS SCRIPT - Upload Ảnh Từ Frontend
// ============================================
// Fixed CORS issues!

function doPost(e) {
  try {
    // Parse data từ frontend
    const data = JSON.parse(e.postData.contents);

    const base64Image = data.photo; // base64 string
    const nameEn = data.nameEn;
    const nameVi = data.nameVi;
    const color = data.color;
    const category = data.category || 'toy';
    const difficulty = data.difficulty || '1';

    // Validate
    if (!base64Image || !nameEn || !nameVi || !color) {
      throw new Error('Missing required fields');
    }

    // === STEP 1: Upload ảnh lên Google Drive ===

    // Decode base64 thành blob
    const blob = Utilities.newBlob(
      Utilities.base64Decode(base64Image),
      'image/jpeg',
      `${Date.now()}_${nameEn.replace(/\s+/g, '_')}.jpg`
    );

    // Tạo hoặc lấy folder "My Cars Photos"
    const folder = getOrCreateFolder('My Cars Photos');

    // Upload file
    const file = folder.createFile(blob);

    // Set public sharing
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    // Lấy public URL
    const photoUrl = file.getUrl();

    // === STEP 2: Thêm vào Google Sheet ===

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Cars');

    if (!sheet) {
      throw new Error('Sheet "Cars" not found');
    }

    // Append row mới
    sheet.appendRow([
      nameEn,
      nameVi,
      photoUrl,
      color,
      category,
      difficulty
    ]);

    // === SUCCESS! ===
    // Return with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Car added successfully!',
        photoUrl: photoUrl
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error.message);

    // Return error with CORS headers
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Add doGet handler for CORS preflight
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'Car Photo Upload API is running'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Helper: Tạo hoặc lấy folder
function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);

  if (folders.hasNext()) {
    return folders.next();
  } else {
    return DriveApp.createFolder(folderName);
  }
}

// Test function (optional)
function testUpload() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        photo: '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA==',
        nameEn: 'Test Car',
        nameVi: 'Xe thử nghiệm',
        color: 'red',
        category: 'toy',
        difficulty: '1'
      })
    }
  };

  const result = doPost(testData);
  Logger.log(result.getContent());
}

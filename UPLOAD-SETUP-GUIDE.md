# 🚗 Car Photo Upload Setup Guide

This guide will help you set up the photo upload feature so you can add new toy car photos directly from your iPhone/camera to your collection!

## 📋 What You'll Get

- **Upload photos** directly from your iPhone camera or photo gallery
- **Auto-save to Google Drive** - All photos stored in your Google Drive
- **Auto-add to Google Sheet** - Automatically adds new rows to your sheet
- **No manual copying** - Everything happens automatically!

---

## 🎯 Setup Steps (10 minutes)

### Step 1: Open Google Apps Script

1. Open your Google Sheet: [https://docs.google.com/spreadsheets/d/1L5uPWT-44HeOhFIDBZywS6JolM7BBgQHfmN2FzRaGsU/edit](https://docs.google.com/spreadsheets/d/1L5uPWT-44HeOhFIDBZywS6JolM7BBgQHfmN2FzRaGsU/edit)

2. Click **"Extensions"** in the top menu

3. Click **"Apps Script"**
   - This opens the Apps Script editor in a new tab

### Step 2: Add the Upload Code

1. You'll see a code editor with some default code

2. **Delete all the existing code** in the editor

3. Open the file `google-apps-script-upload.js` (in this project folder)

4. **Copy ALL the code** from `google-apps-script-upload.js`

5. **Paste it** into the Apps Script editor

6. Click **"Save"** (💾 icon or Ctrl+S)
   - Give it a name like "Car Photo Uploader" when prompted

### Step 3: Deploy as Web App

1. Click **"Deploy"** button (top right corner)

2. Select **"New deployment"**

3. Click the **⚙️ gear icon** next to "Select type"

4. Choose **"Web app"**

5. Fill in the settings:
   - **Description**: "Car Photo Upload API" (or anything you want)
   - **Execute as**: **Me** (your email)
   - **Who has access**: **Anyone**

6. Click **"Deploy"**

### Step 4: Authorize the Script

1. A popup will appear asking for permissions

2. Click **"Authorize access"**

3. Choose your Google account

4. You'll see a warning: **"Google hasn't verified this app"**
   - This is normal! It's YOUR script, so it's safe
   - Click **"Advanced"** (bottom left)
   - Click **"Go to Car Photo Uploader (unsafe)"**

5. Click **"Allow"** to grant permissions:
   - See, edit, create, and delete your spreadsheets
   - See, edit, create, and delete your Google Drive files

### Step 5: Copy the Web App URL

1. After deployment, you'll see **"Deployment successfully created"**

2. **COPY** the **"Web app URL"**
   - It looks like: `https://script.google.com/macros/s/AKfycbz.../exec`
   - Click the **📋 copy icon** next to it

3. **Keep this URL!** You'll need it in the next step

### Step 6: Add URL to car-game.html

1. Open `car-game.html` in a text editor

2. Find this line (around line 1075):
   ```javascript
   UPLOAD_URL: '' // Google Apps Script Web App URL
   ```

3. Paste your Web App URL between the quotes:
   ```javascript
   UPLOAD_URL: 'https://script.google.com/macros/s/AKfycbz.../exec'
   ```

4. **Save** the file

---

## ✅ You're Done! Test It Out

1. Open `car-game.html` in your browser (or reload if already open)

2. Click **"📸 My Cars"**

3. Click **"➕ Add New Car"** (green button)

4. You should see the upload form!

5. **Test the upload:**
   - Click "📷 Tap to take photo..."
   - Take a photo or select from gallery
   - Fill in the car name (English & Vietnamese)
   - Select color
   - Click **"➕ Add to Collection"**

6. **What happens:**
   - Photo uploads to Google Drive → folder "My Cars Photos"
   - New row automatically added to your Google Sheet
   - Game reloads with your new car!
   - You can immediately play with it! 🎉

---

## 📱 Using on iPhone

### How to Upload from iPhone:

1. Open `car-game.html` on your iPhone (via Safari or Chrome)

2. Go to **"📸 My Cars"** → **"➕ Add New Car"**

3. Tap **"📷 Tap to take photo..."**

4. Choose:
   - **"Take Photo"** - Opens camera to take new photo
   - **"Photo Library"** - Select existing photo

5. Take/select photo of your toy car

6. Fill in the details and submit!

---

## 🔧 Troubleshooting

### "Upload not configured" error
- Make sure you pasted the Web App URL in `MY_CARS_CONFIG.UPLOAD_URL`
- Make sure there are no extra spaces or quotes
- Reload the page

### "Error: Upload failed"
- Check that your Google Sheet is the right one
- Make sure the sheet tab is named "Cars" (case-sensitive)
- Try redeploying the Apps Script

### Photos not appearing in games
- Click "🔄 Reload Cars" after uploading
- Check your Google Sheet - is the new row there?
- Check the photo_url column - should be a Google Drive link

### Camera not opening on iPhone
- Make sure you're using Safari or Chrome (not in-app browsers)
- Grant camera permissions when prompted
- Try refreshing the page

---

## 📁 Where Are Photos Stored?

- **Google Drive**: Look for a folder called **"My Cars Photos"**
- All uploaded photos are saved there
- Photos are set to "Anyone with link can view"
- The link is automatically added to your Google Sheet

---

## 🎓 Advanced: Customize Upload Behavior

You can edit `google-apps-script-upload.js` to:

- Change the Google Drive folder name (line 13): `FOLDER_NAME: 'My Cars Photos'`
- Change the sheet name (line 12): `SHEET_NAME: 'Cars'`
- Add more fields or validation

After making changes:
1. Update the code in Apps Script editor
2. Save
3. Deploy → **Manage deployments**
4. Click **Edit** (pencil icon)
5. Set **Version**: New version
6. Click **Deploy**

---

## 🆘 Need Help?

If you run into issues:

1. Check the browser console (F12) for error messages
2. Check the Apps Script logs:
   - Open Apps Script editor
   - Click "Executions" (left sidebar)
   - Look for errors

3. Make sure:
   - Google Sheet ID is correct in both places
   - Sheet tab name is "Cars"
   - Web App URL is correctly pasted
   - You authorized all permissions

---

## 🎉 Enjoy!

You can now easily add new toy cars to your kid's learning collection by just taking photos! No more manual copy-paste of OneDrive links! 🚗📸✨

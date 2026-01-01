// ============================================
// CLOUDFLARE WORKER - Upload Ảnh Lên R2
// ============================================
// Cực đơn giản: Nhận ảnh → Upload R2 → Return URL
// ============================================

export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, corsHeaders);
    }

    try {
      // Parse form data
      const formData = await request.formData();
      const photoFile = formData.get('photo');

      if (!photoFile) {
        return json({ error: 'No photo provided' }, 400, corsHeaders);
      }

      // Tạo tên file unique
      const timestamp = Date.now();
      const fileExt = photoFile.name.split('.').pop() || 'jpg';
      const fileName = `${timestamp}.${fileExt}`;

      // Upload to R2
      await env.CAR_PHOTOS.put(fileName, photoFile.stream(), {
        httpMetadata: {
          contentType: photoFile.type,
        },
      });

      // TODO: THAY ĐỔI URL NÀY BẰNG PUBLIC BUCKET URL CỦA BẠN!
      // Lấy từ R2 dashboard > bucket > Settings > Public access
      const photoUrl = `https://pub-YOUR_ACCOUNT_ID.r2.dev/${fileName}`;

      // Return public URL
      return json({
        success: true,
        photoUrl: photoUrl,
        fileName: fileName
      }, 200, corsHeaders);

    } catch (error) {
      console.error('Upload error:', error);
      return json({ error: error.message }, 500, corsHeaders);
    }
  }
};

// Helper: Return JSON response
function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  });
}

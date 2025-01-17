// netlify/functions/thumbnailProxy/thumbnailProxy.js
exports.handler = async (event, context) => {
    try {
      // e.g. GET /.netlify/functions/thumbnailProxy?id=d86ws7mQYIg
      const videoId = event.queryStringParameters.id;
      if (!videoId) {
        return { statusCode: 400, body: 'Missing videoId param' };
      }
  
      // Build the real YouTube thumbnail URL
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
      const response = await fetch(thumbnailUrl);
  
      if (!response.ok) {
        return { statusCode: 404, body: 'Not found' };
      }
  
      // Convert to arrayBuffer so we can return base64
      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
  
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'image/jpeg',
          'Access-Control-Allow-Origin': '*', // Let Flutter request it
        },
        body: base64,
        isBase64Encoded: true,
      };
    } catch (err) {
      return { statusCode: 500, body: `Server error: ${err}` };
    }
  };
  
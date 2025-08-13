// api/udesk.js
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.json({ 
      status: 'OK', 
      message: 'API正常运行',
      time: new Date().toLocaleString()
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const data = req.body;
    
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = Math.random().toString(36).substring(2, 15);
    
    const params = new URLSearchParams({
      email: 'furuiqi@udesk.cn',
      token: '0bef498a-4e06-46d6-b0e0-4344cfed73a1',
      timestamp: timestamp,
      nonce: nonce
    });
    
    const url = `https://furuiqi.s5.udesk.cn/open_api_v1/tickets?${params}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket: data })
    });

    const result = await response.json();
    
    if (result.code === 1000) {
      res.json({ success: true, ticket_id: result.ticket_id });
    } else {
      res.status(400).json({ success: false, error: result.message });
    }
    
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
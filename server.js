const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/resource', express.static(path.join(__dirname, 'resource')));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Feedback submission endpoint
app.post('/api/feedback', (req, res) => {
  const { company, name, gender, age, phone, email, address, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and message are required fields.'
    });
  }

  const feedback = {
    id: Date.now().toString(),
    company: company || '',
    name,
    gender: gender || '',
    age: age || '',
    phone: phone || '',
    email,
    address: address || '',
    message,
    submittedAt: new Date().toISOString()
  };

  const feedbackFile = path.join(dataDir, 'feedback.json');
  let feedbackList = [];

  try {
    if (fs.existsSync(feedbackFile)) {
      const data = fs.readFileSync(feedbackFile, 'utf8');
      feedbackList = JSON.parse(data);
    }
  } catch (err) {
    feedbackList = [];
  }

  feedbackList.push(feedback);
  fs.writeFileSync(feedbackFile, JSON.stringify(feedbackList, null, 2), 'utf8');

  res.json({
    success: true,
    message: 'Thank you for your feedback! We will get back to you soon.'
  });
});

// Serve HTML pages - fallback to index.html for clean URLs
app.get('*', (req, res) => {
  const requestedPage = req.path === '/' ? '/index.html' : req.path;
  const filePath = path.join(__dirname, 'public', requestedPage);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════╗
  ║                                               ║
  ║   CoolMoso Website Server                     ║
  ║   Running at: http://localhost:${PORT}           ║
  ║                                               ║
  ║   Press Ctrl+C to stop                        ║
  ║                                               ║
  ╚═══════════════════════════════════════════════╝
  `);
});

# LivHeart Website

A website for a Japanese plush toy lifestyle brand, inspired by [livheart.cn](http://www.livheart.cn/). Built with pure HTML, CSS, and JavaScript -- no frameworks required.

## Features

- **Home** -- Hero slider, popular characters, latest news
- **Brand Introduction** -- Brand story, values, timeline
- **Products** -- Filterable product grid with categories
- **Store Locator** -- Searchable store directory with map placeholder
- **Business Cooperation** -- Partnership opportunities and contacts
- **News** -- News articles with load-more functionality
- **Online Shop** -- Product catalog with prices and cart buttons
- **Customer Feedback** -- Form submission (saved to `data/feedback.json`)

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Server:** Python (standard library only -- no dependencies)
- **Data:** JSON file storage for feedback

## Quick Start

### Prerequisites

- Python 3.6+ (pre-installed on most systems)

### Running the Server

```bash
# Navigate to the project directory
cd livheart-website

# Start the server
python server.py
# or on some systems:
python3 server.py
```

Then open **http://localhost:3000** in your browser.

### Custom Port

```bash
PORT=8080 python server.py
```

### Alternative: Node.js Server

If you have Node.js installed, you can also use the included Express server:

```bash
npm install
npm start
```

## Project Structure

```
livheart-website/
  server.py              # Python server (cross-platform, zero dependencies)
  server.js              # Node.js/Express server (alternative)
  package.json           # Node.js dependencies
  data/                  # Feedback submissions stored here
    feedback.json        # Auto-created on first submission
  public/                # Static website files
    index.html           # Home page
    brand.html           # Brand Introduction
    products.html        # Product catalog
    store-locator.html   # Store directory
    cooperation.html     # Business Cooperation
    news.html            # News & Topics
    shop.html            # Online Shop
    feedback.html        # Customer Feedback form
    css/
      style.css          # All styles
    js/
      main.js            # All interactivity
    images/              # Image assets (placeholder)
```

## Feedback API

**POST** `/api/feedback`

```json
{
  "name": "required",
  "email": "required",
  "message": "required",
  "company": "optional",
  "gender": "optional",
  "age": "optional",
  "phone": "optional",
  "address": "optional"
}
```

Response:
```json
{
  "success": true,
  "message": "Thank you for your feedback! We will get back to you soon."
}
```

## Cross-Platform

Works on **Windows**, **Linux**, and **macOS** -- uses only Python standard library modules.

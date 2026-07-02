# CoolMoso Website

A website for a Japanese plush toy lifestyle brand, inspired by [coolmoso.cn](http://www.coolmoso.cn/). Built with pure HTML, CSS, and JavaScript -- no frameworks required.

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
cd coolmoso-website

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

## Docker

The project ships with a `Dockerfile`, `.dockerignore`, and `docker-compose.yml` for containerized deployment. The image is based on `python:3.12-slim`, runs as a non-root user, and exposes port `3000`.

### Build the image locally

```bash
docker build -t coolmoso-website:latest .
```

### Run the container

```bash
docker run -d \
  --name coolmoso-website \
  -p 3000:3000 \
  -e PORT=3000 \
  -v "$(pwd)/data:/app/data" \
  coolmoso-website:latest
```

Then open **http://localhost:3000**. Feedback submissions persist to the host `./data` directory via the mounted volume.

### Run with Docker Compose

```bash
docker compose up -d        # start in background
docker compose logs -f      # follow logs
docker compose down         # stop and remove
```

## Deploy via Artifactory

These steps build the image, push it to a JFrog Artifactory Docker registry, and deploy it on a server. Replace placeholders with your real values.

| Placeholder | Example | Description |
|-------------|---------|-------------|
| `ARTIFACTORY_URL` | `mycompany.jfrog.io` | Your Artifactory host |
| `REPO` | `docker-local` | Target Docker repository in Artifactory |
| `IMAGE` | `coolmoso-website` | Image name |
| `TAG` | `1.0.0` | Image version tag |

### 1. Log in to Artifactory

```bash
docker login ARTIFACTORY_URL
# Username: <your-username>
# Password: <API key or identity token>
```

### 2. Build and tag the image

```bash
docker build -t ARTIFACTORY_URL/REPO/IMAGE:TAG .

# Optionally also tag as latest
docker tag ARTIFACTORY_URL/REPO/IMAGE:TAG ARTIFACTORY_URL/REPO/IMAGE:latest
```

### 3. Push to Artifactory

```bash
docker push ARTIFACTORY_URL/REPO/IMAGE:TAG
docker push ARTIFACTORY_URL/REPO/IMAGE:latest
```

### 4. Deploy on the target server

```bash
# On the deployment server (must be logged in to the same registry)
docker login ARTIFACTORY_URL

docker pull ARTIFACTORY_URL/REPO/IMAGE:TAG

docker run -d \
  --name coolmoso-website \
  --restart unless-stopped \
  -p 3000:3000 \
  -e PORT=3000 \
  -v /opt/coolmoso/data:/app/data \
  ARTIFACTORY_URL/REPO/IMAGE:TAG
```

### 5. Update an existing deployment

```bash
docker pull ARTIFACTORY_URL/REPO/IMAGE:TAG
docker stop coolmoso-website && docker rm coolmoso-website
# Re-run the docker run command from step 4
```

> For production, place an Nginx reverse proxy in front of the container for HTTPS termination on `www.coolmoso.cn`. See `DEPLOYMENT.md` for the full domain + SSL setup.

## Project Structure

```
coolmoso-website/
  server.py              # Python server (cross-platform, zero dependencies)
  server.js              # Node.js/Express server (alternative)
  package.json           # Node.js dependencies
  Dockerfile             # Container image definition (Python 3.12-slim)
  .dockerignore          # Files excluded from the Docker build context
  docker-compose.yml     # Local/single-host container orchestration
  DEPLOYMENT.md          # Full domain + server deployment guide
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

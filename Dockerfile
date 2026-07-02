# CoolMoso Website - Python server (standard library only, no pip installs)
FROM registry.cn-hangzhou.aliyuncs.com/library/python:3.12-slim

# Prevent Python from writing .pyc files and buffering stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=3000

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash appuser

WORKDIR /app

# Copy application source
COPY server.py ./
COPY public/ ./public/
COPY resource/ ./resource/

# Create writable data directory and hand ownership to the non-root user
RUN mkdir -p /app/data && chown -R appuser:appuser /app

USER appuser

# Persist feedback submissions outside the container layer
VOLUME ["/app/data"]

EXPOSE 3000

# Basic container healthcheck against the home page
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request,os; urllib.request.urlopen('http://localhost:%s/' % os.environ.get('PORT','3000'))" || exit 1

CMD ["python", "server.py"]

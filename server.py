"""
LivHeart Website - Local Development Server
Cross-platform (Windows / Linux / macOS)
No external dependencies required - uses Python standard library only.

Usage:
    python server.py
    python3 server.py

Then open http://localhost:3000 in your browser.
"""

import http.server
import json
import os
import sys
import socketserver
from datetime import datetime
from urllib.parse import parse_qs

PORT = int(os.environ.get('PORT', 3000))
PUBLIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'public')
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)


class LivHeartHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler that serves static files and handles API requests."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def do_POST(self):
        if self.path == '/api/feedback':
            self._handle_feedback()
        else:
            self.send_error(404, 'Not Found')

    def do_GET(self):
        # API: return all feedback as JSON
        if self.path == '/api/feedback':
            self._handle_get_feedback()
            return
        # Serve index.html for root
        if self.path == '/':
            self.path = '/index.html'
        super().do_GET()

    def _handle_get_feedback(self):
        feedback_file = os.path.join(DATA_DIR, 'feedback.json')
        feedback_list = []

        if os.path.exists(feedback_file):
            try:
                with open(feedback_file, 'r', encoding='utf-8') as f:
                    feedback_list = json.load(f)
            except (json.JSONDecodeError, IOError):
                feedback_list = []

        self._send_json(200, {
            'success': True,
            'count': len(feedback_list),
            'data': feedback_list
        })

    def _handle_feedback(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8')

        try:
            data = json.loads(body)
        except json.JSONDecodeError:
            # Try URL-encoded form data
            data = {}
            for key, values in parse_qs(body).items():
                data[key] = values[0] if values else ''

        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        message = data.get('message', '').strip()

        if not name or not email or not message:
            self._send_json(400, {
                'success': False,
                'message': 'Name, email, and message are required fields.'
            })
            return

        feedback = {
            'id': str(int(datetime.now().timestamp() * 1000)),
            'company': data.get('company', '').strip(),
            'name': name,
            'gender': data.get('gender', '').strip(),
            'age': data.get('age', '').strip(),
            'phone': data.get('phone', '').strip(),
            'email': email,
            'address': data.get('address', '').strip(),
            'message': message,
            'submittedAt': datetime.now().isoformat()
        }

        feedback_file = os.path.join(DATA_DIR, 'feedback.json')
        feedback_list = []

        if os.path.exists(feedback_file):
            try:
                with open(feedback_file, 'r', encoding='utf-8') as f:
                    feedback_list = json.load(f)
            except (json.JSONDecodeError, IOError):
                feedback_list = []

        feedback_list.append(feedback)

        with open(feedback_file, 'w', encoding='utf-8') as f:
            json.dump(feedback_list, f, indent=2, ensure_ascii=False)

        self._send_json(200, {
            'success': True,
            'message': 'Thank you for your feedback! We will get back to you soon.'
        })

    def _send_json(self, status_code, data):
        response = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(response)))
        self.end_headers()
        self.wfile.write(response)

    def log_message(self, format, *args):
        sys.stdout.write("[%s] %s\n" % (
            datetime.now().strftime('%H:%M:%S'),
            format % args
        ))


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


def main():
    print("")
    print("  LivHeart Website Server")
    print("  Running at: http://localhost:{}".format(PORT))
    print("  Press Ctrl+C to stop")
    print("")

    with ReusableTCPServer(("", PORT), LivHeartHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            httpd.server_close()


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
Wrapper to run Node.js backend through uvicorn/supervisor
"""
import subprocess
import sys
import os

def app(scope, receive, send):
    """Dummy ASGI app - not actually used"""
    pass

# Start Node.js server
if __name__ == "__main__":
    os.chdir('/app/backend')
    subprocess.run(['node', 'index.js'])
else:
    # When imported by uvicorn, start node server in background
    import threading
    def start_node():
        os.chdir('/app/backend')
        subprocess.run(['node', 'index.js'])
    thread = threading.Thread(target=start_node, daemon=True)
    thread.start()

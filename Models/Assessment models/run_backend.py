#!/usr/bin/env python3
"""
Simple script to start the backend with port management
"""
import os
import sys
import subprocess
import socket
import time

def find_free_port(start_port=8000):
    """Find a free port starting from start_port"""
    for port in range(start_port, start_port + 100):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('localhost', port))
                return port
        except OSError:
            continue
    return None

def kill_process_on_port(port):
    """Kill any process using the specified port"""
    try:
        # Find process using the port
        result = subprocess.run(['netstat', '-ano'], capture_output=True, text=True)
        for line in result.stdout.split('\n'):
            if f':{port}' in line and 'LISTENING' in line:
                parts = line.split()
                if len(parts) >= 5:
                    pid = parts[-1]
                    print(f"Killing process {pid} on port {port}")
                    subprocess.run(['taskkill', '/PID', pid, '/F'], capture_output=True)
                    time.sleep(1)
                    break
    except Exception as e:
        print(f"Warning: Could not kill process on port {port}: {e}")

def main():
    """Main function to start the backend"""
    print("🚀 Starting Talento AI Backend...")
    
    # Find a free port
    port = find_free_port()
    if not port:
        print("❌ No free ports found")
        sys.exit(1)
    
    print(f"✅ Using port {port}")
    
    # Set the PORT environment variable
    os.environ['PORT'] = str(port)
    
    # Kill any existing process on this port
    kill_process_on_port(port)
    
    print(f"🌐 Backend will be available at: http://localhost:{port}")
    print("📋 Available endpoints:")
    print(f"   - Health check: http://localhost:{port}/")
    print(f"   - Technical assessment: http://localhost:{port}/api/assessment/technical_assessment/")
    print(f"   - All other assessment endpoints: http://localhost:{port}/api/assessment/*")
    print("\n⏹️  Press Ctrl+C to stop the server")
    
    # Start the application
    try:
        from test_app import app
        import uvicorn
        
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=port,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 
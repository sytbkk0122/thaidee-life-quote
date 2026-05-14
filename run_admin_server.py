#!/usr/bin/env python3
"""
泰迪生活訂單管理後台伺服器
運行: python3 run_admin_server.py
訪問: http://localhost:8001
"""

import http.server
import socketserver
import os
from pathlib import Path

PORT = 8001
ADMIN_FILE = 'admin.html'

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # 所有路由都返回 admin.html
        if self.path == '/' or self.path == '/admin' or self.path == '/admin.html':
            self.path = '/admin.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

    def end_headers(self):
        # 添加緩存控制頭
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        return super().end_headers()

if __name__ == '__main__':
    # 變更工作目錄到項目根目錄
    os.chdir(Path(__file__).parent)

    handler = MyHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"""
╔═══════════════════════════════════════════════════╗
║   🏛️  泰迪生活訂單管理後台                          ║
╚═══════════════════════════════════════════════════╝

✅ 伺服器已啟動

📍 後台地址: http://localhost:{PORT}
📍 或在主系統中點擊「🔐 後台管理」按鈕

📊 功能:
  ✓ 查看所有客戶訂單
  ✓ 統計訂單數據
  ✓ 導出 CSV 檔案
  ✓ 導出 Excel 檔案
  ✓ 列印訂單報表
  ✓ 搜尋客戶訂單

⏹️  按 Ctrl+C 停止伺服器
        """)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n✅ 伺服器已停止")

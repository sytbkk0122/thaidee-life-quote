# 泰迪生活系統部署指南

## 📋 系統要求

### 前端（GitHub Pages）
- 無需任何本地依賴
- 支持所有現代瀏覽器（Chrome, Firefox, Safari, Edge）
- 建議使用最新版本瀏覽器以獲得最佳體驗

### 後台（本地伺服器）
- Python 3.6+
- 8001端口可用
- 建議使用Linux/Mac系統

## 🚀 快速開始

### 方式一：線上部署（前端）

1. **訪問線上版本**
   ```
   https://sytbkk0122.github.io/thaidee-life-quote/
   ```
   - 無需安裝任何軟件
   - 直接在瀏覽器打開
   - 支持所有裝置

### 方式二：本地部署（後台）

1. **克隆倉庫**
   ```bash
   git clone https://github.com/sytbkk0122/thaidee-life-quote.git
   cd thaidee-life-quote
   ```

2. **啟動後台伺服器**
   ```bash
   python3 run_admin_server.py
   ```
   
3. **訪問後台管理**
   ```
   http://localhost:8001
   ```
   
   密碼：`syt0122bkk`

## 🔧 系統配置

### 環境變量（可選）
```bash
# 設置自定義端口
export PORT=8001

# 設置自定義密碼
export ADMIN_PASSWORD=your_password
```

### 文件結構
```
thaidee-life-quote/
├── index.html              # 主報價系統
├── admin.html              # 訂單管理後台
├── price-management.html   # 價格管理系統
├── run_admin_server.py     # 後台伺服器
├── system_test.html        # 系統測試報告
├── CHANGELOG.md            # 更新日誌
├── optimization_notes.md   # 優化筆記
└── DEPLOYMENT_GUIDE.md     # 部署指南
```

## 🔐 後台管理功能

### 訂單管理（admin.html）
```
訪問: http://localhost:8001/admin.html
功能:
  ✓ 查看所有訂單
  ✓ 統計訂單數據
  ✓ 導出CSV文件
  ✓ 導出Excel文件
  ✓ 列印報表
  ✓ 搜尋客戶訂單
```

### 價格管理（price-management.html）
```
訪問: http://localhost:8001/price-management.html
功能:
  ✓ 實時修改景點價格
  ✓ 實時修改酒店價格
  ✓ 查看修改歷史
  ✓ 導出價格配置
  ✓ 恢復預設價格
```

## 🔄 數據同步

### localStorage（前台訂單）
```javascript
// 自動保存訂單數據
localStorage.setItem('thaidee_orders', JSON.stringify(orders))

// 後台讀取訂單
const orders = JSON.parse(localStorage.getItem('thaidee_orders') || '[]')
```

### localStorage（價格覆蓋）
```javascript
// 後台修改價格
const overrides = {
  spots: { 'SPOT_ID': 2500 },
  hotels: { 'Hotel Name': 3000 }
}
localStorage.setItem('thaidee_price_overrides', JSON.stringify(overrides))

// 前台讀取覆蓋價格
const overrides = JSON.parse(localStorage.getItem('thaidee_price_overrides') || '{}')
```

### sessionStorage（認證狀態）
```javascript
// 後台設置認證
sessionStorage.setItem('thaidee_admin_auth', 'syt0122bkk')

// 檢查認證狀態
const isAuth = sessionStorage.getItem('thaidee_admin_auth') === 'syt0122bkk'
```

## 📊 數據備份

### 導出訂單
1. 進入 http://localhost:8001
2. 點擊「📥 導出 CSV」按鈕
3. 保存文件到安全位置

### 導出價格
1. 進入 http://localhost:8001/price-management.html
2. 點擊「📥 導出價格」按鈕
3. 保存JSON文件

### 手動備份
```bash
# 備份localStorage數據
# 在瀏覽器開發者工具中執行
console.log(localStorage)
```

## 🔧 故障排除

### 問題：無法訪問後台
**解決方案：**
```bash
# 確認伺服器已啟動
python3 run_admin_server.py

# 檢查8001端口
netstat -an | grep 8001

# 如果端口被佔用，修改run_admin_server.py中的PORT變量
```

### 問題：密碼錯誤
**解決方案：**
- 確認密碼是否正確：`syt0122bkk`
- 清除瀏覽器sessionStorage
- 重新登入

### 問題：數據丟失
**解決方案：**
- 檢查localStorage是否啟用
- 檢查瀏覽器隱私設置
- 使用不同瀏覽器測試

## 🌐 域名配置

### 自定義域名
```
CNAME記錄指向: sytbkk0122.github.io
```

### SSL/HTTPS
- GitHub Pages自動啟用HTTPS
- 本地測試可用HTTP

## 📈 性能優化

### 前端優化
```javascript
// 景點卡片延遲加載
// 自動縮小CSS和JavaScript
// 使用瀏覽器緩存
```

### 後台優化
```python
# 使用緩存頭
# 啟用GZIP壓縮
# 設置合理的超時
```

## 🔒 安全最佳實踐

1. **定期更換密碼**
   ```
   現有密碼: syt0122bkk
   建議定期更改為強密碼
   ```

2. **備份重要數據**
   ```
   每週導出一次訂單和價格數據
   ```

3. **限制訪問**
   ```
   後台建議在防火牆後運行
   不建議開放公網訪問
   ```

4. **定期檢查日誌**
   ```
   監控異常訪問嘗試
   ```

## 📱 移動設備訪問

### 訪問前台（推薦）
```
https://sytbkk0122.github.io/thaidee-life-quote/
```
- 完全響應式設計
- 手機平板完美適配
- 無需安裝應用

### 訪問後台（不推薦）
```
後台主要用於桌面操作
建議使用平板或電腦
```

## 📞 技術支持

### 常見問題
- 訪問 `/system_test.html` 查看系統測試報告
- 查看 `CHANGELOG.md` 了解更新日誌
- 查看 `optimization_notes.md` 了解優化詳情

### 報告問題
```
GitHub Issue: https://github.com/sytbkk0122/thaidee-life-quote/issues
```

## 🎓 開發者指南

### 修改密碼
編輯 `admin.html` 和 `price-management.html`：
```javascript
const ADMIN_PASSWORD = 'your_new_password';
```

### 修改端口
編輯 `run_admin_server.py`：
```python
PORT = 8001  # 改為你要的端口
```

### 添加新功能
1. 編輯 `index.html` 添加前端代碼
2. 編輯 `admin.html` 添加後台功能
3. 測試所有功能
4. 提交代碼

## ✅ 部署檢查清單

- [x] GitHub Pages配置完成
- [x] 本地伺服器可用
- [x] 密碼保護正常
- [x] 數據同步工作
- [x] 響應式設計正常
- [x] 所有功能測試通過

---

**最後更新**: 2026-05-14
**版本**: v1.0.0 (Production Ready)
**維護狀態**: 🟢 活躍維護

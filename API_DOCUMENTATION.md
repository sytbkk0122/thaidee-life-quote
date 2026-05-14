# 泰迪生活系統 API 文檔

## 概述

泰迪生活系統採用客戶端存儲架構，使用 `localStorage` 和 `sessionStorage` 進行數據管理。

## 數據儲存結構

### 1. 訂單數據 (localStorage)

**Key**: `thaidee_orders`

**格式**:
```json
[
  {
    "id": "ORD-1715704800000",
    "timestamp": "2026/5/14 10:30:45",
    "name": "客戶名稱",
    "email": "customer@example.com",
    "phone": "0812345678",
    "dep": "2026-05-20",
    "ret": "2026-05-25",
    "adults": 2,
    "grand": 25000,
    "diningMode": "service",
    "note": "特殊需求備註"
  }
]
```

**使用方式**:
```javascript
// 讀取訂單
const orders = JSON.parse(localStorage.getItem('thaidee_orders') || '[]');

// 新增訂單
const newOrder = { /* order data */ };
orders.push(newOrder);
localStorage.setItem('thaidee_orders', JSON.stringify(orders));

// 清空訂單
localStorage.removeItem('thaidee_orders');
```

### 2. 價格覆蓋 (localStorage)

**Key**: `thaidee_price_overrides`

**格式**:
```json
{
  "spots": {
    "SPOT_ID_1": 2500,
    "SPOT_ID_2": 3000
  },
  "hotels": {
    "Hotel Name 1": 3500,
    "Hotel Name 2": 4000
  }
}
```

**使用方式**:
```javascript
// 讀取價格覆蓋
const overrides = JSON.parse(localStorage.getItem('thaidee_price_overrides') || '{}');

// 修改景點價格
overrides.spots['SPOT_ID'] = 2500;
localStorage.setItem('thaidee_price_overrides', JSON.stringify(overrides));

// 修改酒店價格
overrides.hotels['Hotel Name'] = 3500;
localStorage.setItem('thaidee_price_overrides', JSON.stringify(overrides));
```

### 3. 認證狀態 (sessionStorage)

**Key**: `thaidee_admin_auth`

**格式**: `string` (密碼)

**使用方式**:
```javascript
// 設置認證
sessionStorage.setItem('thaidee_admin_auth', 'syt0122bkk');

// 檢查認證
const isAuth = sessionStorage.getItem('thaidee_admin_auth') === 'syt0122bkk';

// 清除認證
sessionStorage.removeItem('thaidee_admin_auth');
```

### 4. 景點和酒店數據 (sessionStorage)

**Key**: `thaidee_spots_data`, `thaidee_hotels_data`

**格式**: JSON 陣列

**使用方式**:
```javascript
// 讀取景點數據
const spots = JSON.parse(sessionStorage.getItem('thaidee_spots_data') || '[]');

// 讀取酒店數據
const hotels = JSON.parse(sessionStorage.getItem('thaidee_hotels_data') || '[]');
```

## 全局數據對象

### SPOTS 數據結構

```javascript
{
  id: "SPOT_ID",           // 唯一識別符
  region: "曼谷",          // 地區
  category: "廟宇",        // 分類
  name: "景點名稱",        // 名稱
  desc: "景點描述",        // 描述
  costThb: 200,           // 成本價 (THB)
  sellThb: 400,           // 售價 (THB)
  sellTwd: 368,           // 售價 (台幣)
  hours: 2,               // 遊覽時間
  isNew: false,           // 新景點
  isHot: true             // 熱門景點
}
```

### HOTELS 數據結構

```javascript
{
  name: "酒店名稱",
  region: "曼谷",
  stars: 4,
  costThb: 2000,
  sellThb: 2300,
  sellTwd: 2116,
  amenities: ["WiFi", "Pool"]
}
```

### RESTAURANTS 數據結構

```javascript
{
  id: "REST_ID",
  city: "曼谷",
  type: "米其林/街頭小食",
  name: "餐廳名稱",
  desc: "餐廳描述",
  price: 500
}
```

### PACKAGE_TOURS 數據結構

```javascript
{
  id: "PKG001",
  name: "套裝名稱",
  desc: "描述",
  days: 3,
  cities: "曼谷",
  price: 25000,
  type: "suite"
}
```

### DAY_TOURS 數據結構

```javascript
{
  id: "DAY001",
  name: "一日遊名稱",
  desc: "描述",
  city: "曼谷",
  hours: 8,
  price: 2500,
  type: "daytour"
}
```

## 價格計算公式

### 景點價格計算
```
售價 (THB) = 成本價 + 200 THB (景點標準加成)
售價 (台幣) = 售價 (THB) × 0.92 (匯率)
```

### 酒店價格計算
```
售價 (THB) = 成本價 + 300 THB (酒店標準加成)
售價 (台幣) = 售價 (THB) × 0.92 (匯率)
```

## 後台管理 API

### 訂單管理

**讀取訂單列表**
```javascript
const orders = JSON.parse(localStorage.getItem('thaidee_orders') || '[]');
console.log(`總訂單數: ${orders.length}`);
```

**統計訂單信息**
```javascript
const totalRevenue = orders.reduce((sum, o) => sum + (o.grand || 0), 0);
const uniqueCustomers = new Set(orders.map(o => o.email)).size;
const avgDays = orders.length > 0
  ? (orders.reduce((sum, o) => {
      const dep = new Date(o.dep);
      const ret = new Date(o.ret);
      return sum + Math.ceil((ret - dep) / (1000 * 60 * 60 * 24));
    }, 0) / orders.length).toFixed(1)
  : 0;
```

**搜尋訂單**
```javascript
function filterOrders(query) {
  return orders.filter(o => 
    o.name.toLowerCase().includes(query) ||
    o.email.toLowerCase().includes(query)
  );
}
```

**導出 CSV**
```javascript
function exportToCSV() {
  let csv = '訂單ID,日期,客戶名稱,郵件,電話,總價\n';
  orders.forEach(o => {
    csv += `${o.id},"${o.timestamp}","${o.name}","${o.email}","${o.phone}",${o.grand}\n`;
  });
  // 下載 CSV 文件
}
```

### 價格管理

**讀取價格覆蓋**
```javascript
const overrides = JSON.parse(localStorage.getItem('thaidee_price_overrides') || '{}');
```

**修改景點價格**
```javascript
function updateSpotPrice(spotId, newPrice) {
  const overrides = JSON.parse(localStorage.getItem('thaidee_price_overrides') || '{}');
  if (!overrides.spots) overrides.spots = {};
  overrides.spots[spotId] = parseInt(newPrice);
  localStorage.setItem('thaidee_price_overrides', JSON.stringify(overrides));
}
```

**修改酒店價格**
```javascript
function updateHotelPrice(hotelName, newPrice) {
  const overrides = JSON.parse(localStorage.getItem('thaidee_price_overrides') || '{}');
  if (!overrides.hotels) overrides.hotels = {};
  overrides.hotels[hotelName] = parseInt(newPrice);
  localStorage.setItem('thaidee_price_overrides', JSON.stringify(overrides));
}
```

## 認證 API

**檢查認證**
```javascript
function checkPassword() {
  const stored = sessionStorage.getItem('thaidee_admin_auth');
  return stored === 'syt0122bkk';
}
```

**設置認證**
```javascript
function setAuth(password) {
  if (password === 'syt0122bkk') {
    sessionStorage.setItem('thaidee_admin_auth', password);
    return true;
  }
  return false;
}
```

**清除認證**
```javascript
function clearAuth() {
  sessionStorage.removeItem('thaidee_admin_auth');
}
```

## 前台報價 API

**添加景點到行程**
```javascript
function addSpotToDay(spotId, timeSlot) {
  // timeSlot: 'am', 'pm', 'eve'
  const day = S.days[S.currentDay];
  const spot = SPOTS.find(s => s.id === spotId);
  if (day[timeSlot].length < MAX_PER_SLOT) {
    day[timeSlot].push(spot);
    updatePrice();
  }
}
```

**移除景點**
```javascript
function removeSpotFromDay(spotId, timeSlot) {
  const day = S.days[S.currentDay];
  day[timeSlot] = day[timeSlot].filter(s => s.id !== spotId);
  updatePrice();
}
```

**計算總價**
```javascript
function calculateTotal() {
  const spotCost = S.days.reduce((sum, day) => {
    return sum + [...day.am, ...day.pm, ...day.eve]
      .reduce((daySum, spot) => daySum + (spot.sellTwd || 0), 0);
  }, 0);
  
  const hotelCost = S.days.length * (selectedHotel?.sellTwd || 0);
  const vehicleCost = parseInt(document.getElementById('sel-vehicle').value) * S.days.length;
  
  return spotCost + hotelCost + vehicleCost;
}
```

**生成訂單**
```javascript
function generateOrder() {
  const order = {
    id: 'ORD-' + Date.now(),
    timestamp: new Date().toLocaleString('zh-TW'),
    name: document.getElementById('c-name').value,
    email: document.getElementById('c-email').value,
    phone: document.getElementById('c-phone').value,
    dep: document.getElementById('c-dep').value,
    ret: document.getElementById('c-ret').value,
    adults: parseInt(document.getElementById('c-adults').value),
    grand: calculateTotal(),
    diningMode: window.CURRENT_DINING_MODE,
    note: ''
  };
  
  const orders = JSON.parse(localStorage.getItem('thaidee_orders') || '[]');
  orders.push(order);
  localStorage.setItem('thaidee_orders', JSON.stringify(orders));
  
  return order;
}
```

## 錯誤處理

**檢查數據完整性**
```javascript
function validateOrderData(order) {
  return order.name && order.email && order.phone && 
         order.dep && order.ret && order.adults > 0;
}
```

**錯誤日誌**
```javascript
function logError(message, error) {
  console.error(`[ERROR] ${message}`, error);
  // 可以發送到監控服務
}
```

---

**最後更新**: 2026-05-14
**API 版本**: 1.0.0

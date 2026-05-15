# 🔧 GitHub Pages 手動修復指南

## 問題診斷

```
GitHub 倉庫中的檔案: 200,894 bytes ✅
GitHub Pages 讀取的版本: 9,115 bytes ❌
差異: 191,779 bytes (95%)
```

**原因**: GitHub Pages 的構建緩存嚴重損壞，指向的是錯誤的或極舊的版本

---

## 🔴 手動修復步驟（重要）

### 步驟 1: 進入 GitHub 倉庫設置

1. 打開: https://github.com/sytbkk0122/thaidee-life-quote
2. 點擊右上角 **Settings** (倉庫設置)

### 步驟 2: 進入 Pages 配置

3. 左側導航列找到 **Pages**
4. 你會看到 "Source" 部分（通常顯示 "Branch: main / (root)"）

### 步驟 3: 強制重新構建

5. 在 "Source" 下拉菜單，**改為 `gh-pages` 分支**（如果沒有，選其他分支）
6. 點 **Save**
7. 等待 10-30 秒（會看到黃色的構建進度）
8. 完成後，**再改回 `main` 分支**
9. 再點一次 **Save**

### 步驟 4: 驗證修復

10. 等待 2-3 分鐘
11. 訪問: https://sytbkk0122.github.io/thaidee-life-quote/
12. **刷新頁面** (Cmd+Shift+R)
13. 應該可以看到新菜單：🚕 接送、⛳ 高爾夫等

---

## ✅ 預期結果

修復完成後，你會看到：

```
首頁 → 立即開始報價
  ↓
菜單出現 6 個選項：
  🎯 熱門景點
  📦 套裝行程
  🌅 一日遊
  ⛳ 高爾夫     ← 新！
  🏖️ 外派
  🚕 接送       ← 新！
```

---

## 🤖 自動修復腳本

如果上述步驟成功，往後 GitHub Pages 更新問題會由以下自動化處理：

### 方式 1: 手動執行修復

```bash
cd /private/tmp/repos/thaidee-life-quote
bash fix-github-pages-cache.sh
```

### 方式 2: 自動化工作流

✅ 已在 `.github/workflows/auto-fix-pages-cache.yml` 配置

**執行時間**: 每天下午 3 點
**功能**:
- 自動檢測 Pages 同步狀態
- 若發現不一致，自動推送修復提交
- 強制 GitHub Pages 重建

**手動觸發**:
1. 進入 GitHub 倉庫
2. 點 **Actions** 標籤
3. 找 "Auto-Fix GitHub Pages Cache"
4. 點 **Run workflow**

---

## 🚨 若上述方法都無法修復

請嘗試：

1. **清除瀏覽器緩存**
   - Mac: Cmd+Shift+Delete
   - Windows: Ctrl+Shift+Delete

2. **用私密視窗測試**
   - Mac: Cmd+Shift+N (Chrome)
   - Windows: Ctrl+Shift+N (Chrome)

3. **檢查 GitHub 倉庫狀態**
   ```bash
   git status
   git log --oneline -5
   ```

4. **最後手段: 完整重新部署**
   ```bash
   git add .
   git commit -m "Complete rebuild"
   git push -f origin main
   ```

---

## 📞 支援

如果仍然有問題，檢查：

1. 倉庫是否為 public（GitHub Pages 需要公開倉庫或付費計劃）
2. index.html 是否在倉庫根目錄
3. GitHub Pages 設置中的分支是否正確

---

*此指南於 2026-05-16 建立*

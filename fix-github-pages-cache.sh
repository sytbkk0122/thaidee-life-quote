#!/bin/bash

# 泰迪生活 GitHub Pages 自動修復腳本
# 自動檢測緩存問題並強制重建

set -e

echo "🔧 GitHub Pages 自動修復系統"
echo "============================="
echo ""

# 配置
REPO="sytbkk0122/thaidee-life-quote"
GITHUB_TOKEN="${GITHUB_TOKEN:-$(cat ~/.github_token 2>/dev/null || echo '')}"
GITHUB_RAW="https://raw.githubusercontent.com/$REPO/main/index.html"
PAGES_URL="https://${REPO#*/}.github.io/${REPO#*/}/index.html"
API_URL="https://api.github.com/repos/$REPO"

echo "📊 檢測 GitHub Pages 緩存狀態..."
echo ""

# 獲取文件大小
echo "📍 讀取 GitHub raw 檔案..."
GITHUB_SIZE=$(curl -s -I "$GITHUB_RAW" | grep -i "content-length" | awk '{print $2}' | tr -d '\r')
echo "   大小: $GITHUB_SIZE bytes"

echo "📍 讀取 GitHub Pages 版本..."
PAGES_SIZE=$(curl -s -I "$PAGES_URL" | grep -i "content-length" | awk '{print $2}' | tr -d '\r')
echo "   大小: $PAGES_SIZE bytes"

echo ""

# 計算差異
if [ "$GITHUB_SIZE" = "$PAGES_SIZE" ]; then
    echo "✅ GitHub Pages 已同步，無需修復"
    exit 0
else
    DIFF=$(( $GITHUB_SIZE - $PAGES_SIZE ))
    PERCENT=$(( ($DIFF * 100) / $GITHUB_SIZE ))
    echo "⚠️  檢測到緩存問題！"
    echo "   差異: $DIFF bytes ($PERCENT%)"
    echo ""
fi

# 嘗試方案 1: 使用 GitHub API 觸發 Pages 重建
if [ -n "$GITHUB_TOKEN" ]; then
    echo "🔄 方案 1: 使用 GitHub API 觸發重建..."
    echo ""

    # 獲取當前 Pages 配置
    echo "  1️⃣  獲取當前 Pages 配置..."
    PAGES_CONFIG=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "$API_URL/pages")

    CURRENT_SOURCE=$(echo "$PAGES_CONFIG" | grep -o '"source":{[^}]*}' | head -1)
    echo "     $CURRENT_SOURCE"

    # 方案 1a: 更新構建設置以強制重建
    echo ""
    echo "  2️⃣  發送強制重建請求..."

    REBUILD_RESPONSE=$(curl -s -X POST \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        -H "Content-Type: application/json" \
        -d '{"source": {"branch": "main", "path": "/"}}' \
        "$API_URL/pages")

    if echo "$REBUILD_RESPONSE" | grep -q '"status"'; then
        echo "     ✅ 重建請求已發送"
    else
        echo "     ❌ API 請求失敗，嘗試備用方案..."
    fi
else
    echo "⚠️  未找到 GitHub Token，跳過 API 方案"
fi

echo ""
echo "🔄 方案 2: 代碼推送強制刷新..."
echo ""

# 方案 2: 推送空提交以強制 GitHub Pages 重新構建
cd /private/tmp/repos/thaidee-life-quote

echo "  1️⃣  生成強制重建觸發器..."
TIMESTAMP=$(date +%s%N)
echo "<!-- Cache invalidation: $TIMESTAMP -->" >> index.html

echo "  2️⃣  提交更改..."
git add index.html
git commit -m "Auto-fix: Force GitHub Pages cache refresh

Issue: GitHub Pages cache out of sync with repository
GitHub Size: $GITHUB_SIZE bytes
Pages Size: $PAGES_SIZE bytes
Difference: $(( $GITHUB_SIZE - $PAGES_SIZE )) bytes

Force immediate rebuild by updating timestamp.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>" || echo "No changes to commit"

echo "  3️⃣  推送到 GitHub..."
if git push origin main; then
    echo "     ✅ 推送成功"
else
    echo "     ❌ 推送失敗"
    exit 1
fi

echo ""
echo "⏳ 等待 GitHub Pages 重建..."
sleep 15

# 驗證修復
echo ""
echo "🔍 驗證修復結果..."
echo ""

PAGES_SIZE_NEW=$(curl -s -I "$PAGES_URL" | grep -i "content-length" | awk '{print $2}' | tr -d '\r')
echo "新 Pages 大小: $PAGES_SIZE_NEW bytes"

if [ "$GITHUB_SIZE" = "$PAGES_SIZE_NEW" ]; then
    echo ""
    echo "✅ GitHub Pages 已成功同步！"
    echo ""
    echo "🎉 修復完成！"
    echo "   - 檔案大小一致: $GITHUB_SIZE bytes"
    echo "   - 生產網址: https://${REPO#*/}.github.io/${REPO#*/}/"
    echo ""
    echo "🌐 請重新訪問你的網站，應該可以看到新功能："
    echo "   ✅ 🚕 接送服務"
    echo "   ✅ ⛳ 高爾夫專區"
    echo "   ✅ 新景點和飯店"
    exit 0
else
    DIFF_NEW=$(( $GITHUB_SIZE - $PAGES_SIZE_NEW ))
    echo ""
    echo "⚠️  GitHub Pages 仍在同步中..."
    echo "   差異: $DIFF_NEW bytes"
    echo ""
    echo "📝 建議:"
    echo "   1. 手動進入 GitHub Settings > Pages"
    echo "   2. 在 Source 中改為 gh-pages，再改回 main"
    echo "   3. 或者等待 5 分鐘後重新載入網站"
    exit 1
fi

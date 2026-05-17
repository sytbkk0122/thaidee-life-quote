#!/bin/bash

# 泰迪生活 GitHub Pages 自動重建檢測和觸發
# 每次推送後自動檢查並確保 GitHub Pages 已重建

set -e

echo "🔄 GitHub Pages 自動重建檢測系統"
echo "=================================="
echo ""

# 變數設定
REPO_URL="https://api.github.com/repos/sytbkk0122/thaidee-life-quote"
PAGES_URL="https://sytbkk0122.github.io/thaidee-life-quote/index.html"
GITHUB_RAW="https://raw.githubusercontent.com/sytbkk0122/thaidee-life-quote/main/index.html"
MAX_RETRIES=10
RETRY_DELAY=6

echo "⏱️  等待 GitHub Pages 構建..."
echo ""

# 獲取最新的 GitHub raw 檔案的 hash
GITHUB_RAW_SIZE=$(curl -s -I "$GITHUB_RAW" | grep -i "content-length" | awk '{print $2}' | tr -d '\r')
echo "📝 GitHub raw 檔案大小: $GITHUB_RAW_SIZE bytes"

# 檢查 GitHub Pages 是否已同步
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    PAGES_SIZE=$(curl -s -I "$PAGES_URL" | grep -i "content-length" | awk '{print $2}' | tr -d '\r')

    if [ "$PAGES_SIZE" = "$GITHUB_RAW_SIZE" ]; then
        echo "✅ GitHub Pages 已同步！"
        echo "   Pages 檔案大小: $PAGES_SIZE bytes"
        echo ""
        echo "🌐 生產網址："
        echo "   $PAGES_URL"
        exit 0
    fi

    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "⏳ 嘗試 $RETRY_COUNT/$MAX_RETRIES... (GitHub Pages 檔案大小: $PAGES_SIZE bytes)"

    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
        sleep $RETRY_DELAY
    fi
done

# 如果還是沒同步，觸發強制重建
echo ""
echo "⚠️  GitHub Pages 未能及時同步，嘗試強制重建..."
echo ""

# 做一個小改動來觸發重建
TIMESTAMP=$(date +%s)
echo "// Force rebuild: $TIMESTAMP" >> index.html
git add index.html
git commit -m "Force GitHub Pages rebuild - $TIMESTAMP

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
git push origin main

echo ""
echo "📤 強制重建信號已發送"
echo "⏳ 等待 GitHub Pages 重新構建..."
echo ""

# 再次檢查
RETRY_COUNT=0
while [ $RETRY_COUNT -lt 5 ]; do
    PAGES_SIZE=$(curl -s -I "$PAGES_URL" | grep -i "content-length" | awk '{print $2}' | tr -d '\r')

    if [ "$PAGES_SIZE" = "$GITHUB_RAW_SIZE" ]; then
        echo "✅ GitHub Pages 已重建完成！"
        exit 0
    fi

    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo "⏳ 重建中... ($RETRY_COUNT/5)"
    sleep 6
done

echo ""
echo "✨ 自動重建流程完成"

#!/bin/bash

# 泰迪生活 - GitHub Pages 部署腳本
# 自動提交和推送所有更改到生產環境

set -e

echo "🚀 泰迪生活部署系統"
echo "=================="
echo ""

# 檢查 git 狀態
echo "📋 檢查 Git 狀態..."
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ 錯誤：不在 Git 倉庫中！"
    exit 1
fi

# 檢查是否有未提交的改動
if git diff-index --quiet HEAD --; then
    echo "✅ 沒有未提交的改動"
    echo "無需部署"
    exit 0
fi

echo "✅ 檢測到改動，準備部署..."
echo ""

# 顯示改動的檔案
echo "📝 改動的檔案："
git diff --name-only
echo ""

# 提交改動
echo "💾 提交改動..."
COMMIT_MSG="Update Thai-Dee Life website - $(date '+%Y-%m-%d %H:%M:%S')

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

git add -A
git commit -m "$COMMIT_MSG"
echo "✅ 已提交"
echo ""

# 推送到 GitHub
echo "📤 推送到 GitHub..."
if git push origin main; then
    echo "✅ 推送成功！"
else
    echo "❌ 推送失敗"
    exit 1
fi
echo ""

# 驗證更新
echo "🔍 驗證網站更新..."
sleep 2

WEBSITE_URL="https://sytbkk0122.github.io/thaidee-life-quote/"
if curl -s "$WEBSITE_URL" > /dev/null 2>&1; then
    echo "✅ 網站已上線"
    echo ""
    echo "🌐 生產網址："
    echo "   $WEBSITE_URL"
    echo ""
    echo "💬 在 LINE 分享此連結給客戶"
    echo "   或用 LINE 官方帳號推廣"
else
    echo "⚠️  網站暫時無法訪問（GitHub 可能在更新中）"
    echo "   通常 1-2 分鐘後會自動同步"
fi

echo ""
echo "✨ 部署完成！"

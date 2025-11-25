// js/version-check.js

// 1. 定义当前应用版本号
const CURRENT_APP_VERSION = "1.0.5";

// 2. 检查并清理
if (localStorage.getItem('appVersion') !== CURRENT_APP_VERSION) {
    console.log(`检测到新版本 ${CURRENT_APP_VERSION}，正在重置所有本地配置...`);
    localStorage.clear();
    localStorage.setItem('appVersion', CURRENT_APP_VERSION);

    // (可选) 显示提示
    const alertEl = document.createElement('div');
    alertEl.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        padding: 15px 25px; background-color: #4CAF50; color: white;
        border-radius: 8px; z-index: 99999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: sans-serif; font-size: 16px; text-align: center;
    `;
    alertEl.textContent = '系统已更新，配置已重置为最新版本！';
    document.body.appendChild(alertEl);
    setTimeout(() => alertEl.remove(), 3000);

}


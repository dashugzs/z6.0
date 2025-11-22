// xin/js/tabs/game-modal-handler.js
document.addEventListener('DOMContentLoaded', function() {
    const gameTabIds = ['link6', 'link7', 'link8', 'link9', 'link10']; // 支持后续新增ID
    const DARK_MODE_KEY = 'darkMode'; // 与设置面板一致的本地存储键名
    const DARK_MODE_TOGGLE = '#dark-mode-toggle'; // 你的夜间模式开关选择器（需与实际HTML匹配）

    initGameModalHandler();

    // -------------------------- 核心修复：监听夜间模式开关变化 --------------------------
    function initDarkModeListener() {
        const darkModeToggle = document.querySelector(DARK_MODE_TOGGLE);
        if (!darkModeToggle) return;

        // 1. 初始化时，根据本地存储设置开关状态和body类
        const savedDarkMode = localStorage.getItem(DARK_MODE_KEY) === 'true';
        if (savedDarkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }

        // 2. 监听开关变化，实时更新主题
        darkModeToggle.addEventListener('change', function() {
            const isDarkMode = this.checked;
            // 同步body类（触发全局主题变化）
            document.body.classList.toggle('dark-mode', isDarkMode);
            // 保存状态到本地存储（与设置面板逻辑一致）
            localStorage.setItem(DARK_MODE_KEY, isDarkMode);
            // 手动触发themechange事件，让所有主题相关元素响应
            document.dispatchEvent(new CustomEvent('themechange'));
        });
    }

    // 初始化恢复按钮容器（统一管理所有恢复按钮，避免重叠）
    function initRestoreContainer() {
        let restoreContainer = document.getElementById('modal-restore-container');
        if (!restoreContainer) {
            restoreContainer = document.createElement('div');
            restoreContainer.id = 'modal-restore-container';
            restoreContainer.style.cssText = `
                position: fixed; bottom: 20px; right: 20px;
                display: flex; flex-direction: column; gap: 10px; /* 垂直排列，间距10px */
                z-index: 99998; /* 低于弹窗，高于页面其他内容 */
            `;
            document.body.appendChild(restoreContainer);
        }
        return restoreContainer;
    }

    function initGameModalHandler() {
        // 先初始化夜间模式监听和恢复按钮容器
        initDarkModeListener();
        initRestoreContainer();

        const tabsContainer = document.getElementById('category-tabs-container');
        if (!tabsContainer) return;

        tabsContainer.addEventListener('click', function(e) {
            const tab = e.target.closest('.category-tab');
            if (!tab || !tab.dataset.id || !gameTabIds.includes(tab.dataset.id)) return;

            e.preventDefault();
            e.stopPropagation();

            const buttonUniqueId = tab.dataset.id; // 每个按钮的唯一标识（如link6、link7）
            const buttonName = tab.textContent.trim(); // 每个按钮的显示名称（如"游戏1"、"工具2"）

            const originalHandleTabClick = CategoryTabManager.handleTabClick;
            CategoryTabManager.handleTabClick = function() {};

            // 打开弹窗时传入按钮信息
            openGameModal(tab.dataset.url, buttonUniqueId, buttonName);

            setTimeout(() => {
                CategoryTabManager.handleTabClick = originalHandleTabClick;
            }, 0);
        });

        // 监听主题变化事件（包括手动触发和设置面板触发），更新所有相关元素
        document.addEventListener('themechange', updateModalTheme);
    }

    /**
     * 打开弹窗（接收按钮唯一ID和名称）
     * @param {string} url - 弹窗内容URL
     * @param {string} buttonUniqueId - 触发弹窗的按钮唯一ID
     * @param {string} buttonName - 触发弹窗的按钮显示名称
     */
    function openGameModal(url, buttonUniqueId, buttonName) {
        // 移除已存在的同ID弹窗（避免重复打开）
        const existingModal = document.querySelector(`.game-modal[data-unique-id="${buttonUniqueId}"]`);
        if (existingModal) existingModal.remove();

        // --- 创建弹窗基本结构 ---
        const modal = document.createElement('div');
        modal.className = 'game-modal';
        modal.dataset.uniqueId = buttonUniqueId; // 存储按钮唯一ID，用于关联恢复按钮
        modal.dataset.buttonName = buttonName; // 存储按钮名称，用于恢复按钮显示
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            display: flex; justify-content: center; align-items: center;
            z-index: 99999; padding: 20px; box-sizing: border-box;
            background-color: rgba(0, 0, 0, 0.8); backdrop-filter: blur(4px);
        `;

        const modalContent = document.createElement('div');
        modalContent.className = 'game-modal-content';
        modalContent.style.cssText = `
            position: relative;
            width: 100%;
            max-width: 1200px;
            height: 66.666vh; /* 固定为屏幕高度的三分之二 */
            max-height: 900px;
            background-color: #222;
            border-radius: 12px;
            overflow: hidden !important; /* 强制隐藏弹窗的滚动条 */
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
        `;

        // --- 标题栏 ---
        const titleBar = document.createElement('div');
        titleBar.className = 'game-modal-titlebar';
        titleBar.style.cssText = `
            height: 25px;
            line-height: 25px;
            background-color: #333;
            color: white;
            text-align: center;
            font-size: 12px;
            font-weight: bold;
            position: relative;
            border-bottom: 1px solid #444;
        `;
        titleBar.textContent = '小牛搜索-XnSs.Fun'; // 标题栏保持统一，恢复按钮显示具体功能名称

        // --- 最小化按钮 ---
        const minimizeBtn = document.createElement('button');
        minimizeBtn.className = 'game-modal-minimize';
        minimizeBtn.innerHTML = '−';
        minimizeBtn.title = '最小化';
        minimizeBtn.style.cssText = `
            position: absolute; top: 50%; right: 56px; /* 顺序：最小化 → 全屏 → 关闭 */
            width: 16px; height: 16px;
            border: none; border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 12px;
            cursor: pointer; z-index: 10;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s ease;
            transform: translateY(-50%);
            padding: 0;
        `;

        // --- 全屏按钮 ---
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'game-modal-fullscreen';
        fullscreenBtn.innerHTML = '⛶';
        fullscreenBtn.title = '全屏显示';
        fullscreenBtn.style.cssText = `
            position: absolute; top: 50%; right: 32px;
            width: 16px; height: 16px;
            border: none; border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 10px;
            cursor: pointer; z-index: 10;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s ease;
            transform: translateY(-50%);
            padding: 0;
        `;

        // --- 关闭按钮 ---
        const closeBtn = document.createElement('button');
        closeBtn.className = 'game-modal-close';
        closeBtn.innerHTML = '×';
        closeBtn.title = '关闭';
        closeBtn.style.cssText = `
            position: absolute; top: 50%; right: 8px;
            width: 16px; height: 16px;
            border: none; border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.1);
            color: white;
            font-size: 12px;
            cursor: pointer; z-index: 10;
            display: flex; align-items: center; justify-content: center;
            transition: all 0.2s ease;
            transform: translateY(-50%);
            padding: 0;
        `;

        // --- Iframe容器 ---
        const iframeContainer = document.createElement('div');
        iframeContainer.style.cssText = `
            flex: 1;
            width: 100%;
            height: calc(100% - 25px);
        `;
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
        `;
        iframeContainer.appendChild(iframe);

        // --- 组装元素 ---
        titleBar.appendChild(minimizeBtn);
        titleBar.appendChild(fullscreenBtn);
        titleBar.appendChild(closeBtn);
        modalContent.appendChild(titleBar);
        modalContent.appendChild(iframeContainer);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // --- 事件监听 ---
        // 关闭弹窗（同时移除对应的恢复按钮）
        const closeModal = () => {
            modal.remove();
            removeRestoreButton(buttonUniqueId); // 关键：关闭时同步删除恢复按钮
        };
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        const escHandler = (e) => { 
            if (e.key === 'Escape' && document.activeElement.tagName !== 'INPUT') { // 避免输入时误关闭
                closeModal(); 
                document.removeEventListener('keydown', escHandler); 
            } 
        };
        document.addEventListener('keydown', escHandler);

        // --- 全屏按钮事件 ---
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                if (modalContent.requestFullscreen) modalContent.requestFullscreen();
                else if (modalContent.webkitRequestFullscreen) modalContent.webkitRequestFullscreen();
                else if (modalContent.msRequestFullscreen) modalContent.msRequestFullscreen();
                fullscreenBtn.innerHTML = '⛌';
                fullscreenBtn.title = '退出全屏';
            } else {
                if (document.exitFullscreen) document.exitFullscreen();
                else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                else if (document.msExitFullscreen) document.msExitFullscreen();
                fullscreenBtn.innerHTML = '⛶';
                fullscreenBtn.title = '全屏显示';
            }
        });

        document.addEventListener('fullscreenchange', () => {
            if (document.fullscreenElement) {
                fullscreenBtn.innerHTML = '⛌';
                fullscreenBtn.title = '退出全屏';
            } else {
                fullscreenBtn.innerHTML = '⛶';
                fullscreenBtn.title = '全屏显示';
            }
        });

        // --- 最小化事件（创建对应名称的恢复按钮） ---
        minimizeBtn.addEventListener('click', () => {
            modal.style.display = 'none'; // 隐藏弹窗
            createRestoreButton(buttonUniqueId, buttonName); // 创建恢复按钮（显示按钮名称）
        });

        // 页面加载完成后注入样式
        iframe.onload = function() {
            setTimeout(() => {
                try {
                    const doc = iframe.contentDocument || iframe.contentWindow.document;
                    injectBaseStyles(doc);
                } catch (e) {
                    console.warn("注入样式失败，可能是跨域限制。", e);
                }
            }, 100);
        };

        // 应用初始主题（页面加载时立即生效）
        updateModalTheme();
    }

    /**
     * 创建恢复按钮（每个弹窗对应一个，显示按钮名称）
     * @param {string} buttonUniqueId - 按钮唯一ID（关联弹窗）
     * @param {string} buttonName - 按钮名称（恢复按钮显示文本）
     */
    function createRestoreButton(buttonUniqueId, buttonName) {
        // 先移除已存在的同ID恢复按钮（避免重复）
        removeRestoreButton(buttonUniqueId);

        const restoreBtn = document.createElement('button');
        restoreBtn.className = 'game-modal-restore';
        restoreBtn.dataset.forModal = buttonUniqueId; // 关联对应的弹窗ID
        restoreBtn.innerHTML = buttonName; // 显示按钮名称（如"游戏1"）
        restoreBtn.title = `恢复 "${buttonName}"`;
        restoreBtn.style.cssText = `
            padding: 8px 15px;
            border: none; border-radius: 20px;
            background-color: #333;
            color: white;
            font-size: 12px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
            text-align: center;
            min-width: 80px; /* 保证按钮宽度一致，排版整齐 */
        `;

        // 点击恢复按钮，显示对应的弹窗
        restoreBtn.addEventListener('click', () => {
            const modal = document.querySelector(`.game-modal[data-unique-id="${buttonUniqueId}"]`);
            if (modal) {
                modal.style.display = 'flex'; // 恢复弹窗显示
                removeRestoreButton(buttonUniqueId); // 移除恢复按钮
            }
        });

        // 添加到恢复按钮容器（自动垂直排版）
        const restoreContainer = document.getElementById('modal-restore-container');
        if (restoreContainer) {
            restoreContainer.appendChild(restoreBtn);
        }

        // 应用当前主题（创建时立即匹配当前模式）
        updateRestoreButtonTheme(restoreBtn);
    }

    /**
     * 移除指定ID的恢复按钮
     * @param {string} buttonUniqueId - 按钮唯一ID
     */
    function removeRestoreButton(buttonUniqueId) {
        const restoreBtn = document.querySelector(`.game-modal-restore[data-for-modal="${buttonUniqueId}"]`);
        if (restoreBtn && restoreBtn.parentNode) {
            restoreBtn.parentNode.removeChild(restoreBtn);
        }
    }

    /**
     * 向文档注入基础样式（隐藏滚动条）
     */
    function injectBaseStyles(doc) {
        try {
            const styleId = 'custom-fit-styles';
            if (doc.getElementById(styleId)) return;
            const style = doc.createElement('style');
            style.id = styleId;
            style.textContent = `
                html, body { margin: 0; padding: 0; overflow-x: hidden !important; overflow-y: auto !important; }
                * { scrollbar-width: none !important; -ms-overflow-style: none !important; }
                *::-webkit-scrollbar { display: none !important; }
            `;
            doc.head.appendChild(style);
        } catch (e) { /* 跨域忽略 */ }
    }

    /**
     * 更新恢复按钮的主题样式
     * @param {HTMLElement} restoreBtn - 单个恢复按钮（可选，默认更新所有）
     */
    function updateRestoreButtonTheme(restoreBtn) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const targetButtons = restoreBtn ? [restoreBtn] : document.querySelectorAll('.game-modal-restore');
        
        targetButtons.forEach(btn => {
            if (isDarkMode) {
                // 深色模式样式（与设置面板风格一致）
                btn.style.backgroundColor = 'rgba(30, 30, 30, 0.9)';
                btn.style.color = '#ffffff';
                btn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
            } else {
                // 浅色模式样式
                btn.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                btn.style.color = '#333333';
                btn.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }
        });
    }

    /**
     * 更新整个弹窗和恢复按钮的主题
     */
    function updateModalTheme() {
        const modals = document.querySelectorAll('.game-modal');
        const isDarkMode = document.body.classList.contains('dark-mode');

        modals.forEach(modal => {
            const [modalContent, titleBar, minimizeBtn, fullscreenBtn, closeBtn] = 
                modal.querySelectorAll('.game-modal-content, .game-modal-titlebar, .game-modal-minimize, .game-modal-fullscreen, .game-modal-close');
            
            // 弹窗主体主题
            if (isDarkMode) {
                modalContent.style.backgroundColor = '#1e1e1e';
                titleBar.style.backgroundColor = '#2a2a2a';
                titleBar.style.borderBottom = '1px solid #333';
                [minimizeBtn, fullscreenBtn, closeBtn].forEach(btn => {
                    btn.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    btn.style.color = 'white';
                });
            } else {
                modalContent.style.backgroundColor = '#f0f0f0';
                titleBar.style.backgroundColor = '#e0e0e0';
                titleBar.style.color = '#333';
                titleBar.style.borderBottom = '1px solid #ddd';
                [minimizeBtn, fullscreenBtn, closeBtn].forEach(btn => {
                    btn.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
                    btn.style.color = '#333';
                });
            }
        });

        // 同步更新所有恢复按钮的主题
        updateRestoreButtonTheme();
    }

    /**
     * 添加全局基础样式（按钮hover效果、响应式调整等）
     */
    (function addModalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 窗口控制按钮hover效果 */
            .game-modal-minimize:hover,
            .game-modal-fullscreen:hover,
            .game-modal-close:hover {
                background-color: rgba(255, 0, 0, 0.8) !important;
                transform: scale(1.2) translateY(-50%);
            }
            /* 恢复按钮hover效果 */
            .game-modal-restore:hover {
                transform: scale(1.05);
                box-shadow: 0 6px 16px rgba(0,0,0,0.4);
            }
            /* 主题过渡动画（平滑切换） */
            .game-modal-content, .game-modal-titlebar, .game-modal-restore {
                transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
            }
            /* 响应式调整（小屏幕） */
            @media (max-width: 768px) {
                .game-modal-content { width: 98% !important; height: 60vh !important; }
                .game-modal-titlebar { font-size: 10px; height: 22px; line-height: 22px; }
                .game-modal-minimize, .game-modal-fullscreen, .game-modal-close { 
                    width: 14px; height: 14px; font-size: 10px; 
                }
                .game-modal-minimize { right: 48px; }
                .game-modal-fullscreen { right: 28px; }
                /* 恢复按钮响应式 */
                #modal-restore-container { bottom: 15px; right: 15px; gap: 8px; }
                .game-modal-restore { padding: 6px 12px; font-size: 10px; min-width: 60px; }
            }
        `;
        document.head.appendChild(style);
    })();
});
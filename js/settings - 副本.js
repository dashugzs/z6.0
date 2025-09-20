document.addEventListener('DOMContentLoaded', function() {
    // 创建必要的DOM元素
    createSettingsElements();
    
    // 初始化事件监听
    initEventListeners();
    
    // 自动检测并应用夜间模式
    autoDetectDarkMode();
    
    // 从本地存储加载其他设置
    loadOtherSettings();
    
    // 加载并渲染公告模块
    loadNotices();
});

// 自动检测并应用夜间模式
function autoDetectDarkMode() {
    // 1. 优先检查用户之前的设置，如果没有设置则使用自动模式
    const savedMode = getSetting('darkMode') || 'auto';
    if (savedMode === 'enabled') {
        enableDarkMode(true);
        return;
    } else if (savedMode === 'disabled') {
        disableDarkMode(true);
        return;
    }
    
    // 2. 检查浏览器/系统偏好
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        enableDarkMode(true);
        return;
    }
    
    // 3. 根据时间自动切换 (晚上7点到早上6点)
    const hour = new Date().getHours();
    const isNightTime = hour >= 19 || hour < 6;
    if (isNightTime) {
        enableDarkMode(true);
        return;
    }
    
    // 默认使用日间模式
    disableDarkMode(true);
}

// 从本地存储加载其他设置（除了夜间模式，因为已经自动检测）
function loadOtherSettings() {
    // 加载壁纸设置
    const wallpaper = getSetting('wallpaper');
    const wallpaperType = getSetting('wallpaperType');
    
    if (wallpaper && wallpaper !== 'none' && wallpaperType) {
        setWallpaper(wallpaper);
        // 更新壁纸选中状态
        if (wallpaperType === 'default' && typeof wallpaperConfig !== 'undefined') {
            const wallpaperId = wallpaperConfig.defaultWallpapers.find(w => w.fullUrl === wallpaper)?.id;
            if (wallpaperId) {
                document.querySelectorAll('#default-wallpapers .wallpaper-thumb').forEach(thumb => {
                    if (thumb.getAttribute('data-wallpaper') === wallpaperId) {
                        thumb.classList.add('selected');
                    }
                });
            }
        } else if (wallpaperType === 'custom') {
            const customWallpapers = getCustomWallpapers();
            const index = customWallpapers.indexOf(wallpaper);
            if (index !== -1) {
                document.querySelectorAll('#custom-wallpapers .wallpaper-thumb').forEach((thumb, i) => {
                    if (i === index) {
                        thumb.classList.add('selected');
                    }
                });
            }
        }
    }
    
    // 渲染自定义壁纸
    renderCustomWallpapers();
}

// 创建设置相关的DOM元素
function createSettingsElements() {
    // 创建壁纸容器
    const wallpaperContainer = document.createElement('div');
    wallpaperContainer.id = 'wallpaper-container';
    document.body.prepend(wallpaperContainer);
    
    // 创建设置按钮
    const settingsButton = document.createElement('div');
    settingsButton.id = 'settings-button';
    settingsButton.innerHTML = '<i class="iconfont icon-setting"></i>';
    document.body.appendChild(settingsButton);
    
    // 创建设置面板
    const settingsPanel = document.createElement('div');
    settingsPanel.id = 'settings-panel';
    settingsPanel.innerHTML = `
        <div class="settings-section">
            <h3>夜间模式</h3>
            <div class="setting-buttons">
                <button class="setting-btn" id="dark-mode-enable">开启</button>
                <button class="setting-btn" id="dark-mode-disable">关闭</button>
                <button class="setting-btn" id="dark-mode-auto">自动</button>
            </div>
        </div>
        
        <div class="settings-section">
            <h3>壁纸设置</h3>
            <div class="setting-buttons">
                <input type="file" id="wallpaper-upload" accept="image/*">
                <button class="setting-btn" id="add-custom-wallpaper">添加自定义壁纸</button>
                <button class="setting-btn" id="no-wallpaper">无壁纸</button>
            </div>
            <div style="margin-top: 10px;">
                <h4>默认壁纸</h4>
                <div class="wallpaper-thumbs-container" id="default-wallpapers">
                    <!-- 默认壁纸将通过JS动态生成 -->
                </div>
                
                <h4>我的壁纸</h4>
                <div class="wallpaper-thumbs-container" id="custom-wallpapers">
                    <!-- 自定义壁纸将在这里动态生成 -->
                </div>
            </div>
        </div>
        
        <div class="settings-section" id="notices-container">
            <h3>公告信息</h3>
            <div id="notices-content">
                <!-- 公告内容将通过JS动态生成 -->
                <div class="notice-placeholder">加载公告中...</div>
            </div>
        </div>
        
        <div class="settings-section">
            <h3>用户中心</h3>
            <a href="admin.html" id="login-btn" target="_blank">管理员登录</a>
            <a href="https://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=niu@xnss.fun" id="login-btn" target="_blank">联系邮箱:niu@xnss.fun</a>

        </div>
    `;
    document.body.appendChild(settingsPanel);

    // 动态生成默认壁纸缩略图
    const defaultWallpapersContainer = document.getElementById('default-wallpapers');
    if (typeof wallpaperConfig !== 'undefined' && wallpaperConfig.defaultWallpapers) {
        wallpaperConfig.defaultWallpapers.forEach(wallpaper => {
            const img = document.createElement('img');
            img.src = wallpaper.thumbUrl;
            img.className = 'wallpaper-thumb';
            img.dataset.wallpaper = wallpaper.id;
            defaultWallpapersContainer.appendChild(img);
        });
    }
}

// 初始化事件监听
function initEventListeners() {
    const settingsButton = document.getElementById('settings-button');
    const settingsPanel = document.getElementById('settings-panel');
    const menuButton = document.getElementById('menu');
    const navList = document.querySelector('.list');
    
    // 切换设置面板显示/隐藏
    settingsButton.addEventListener('click', function() {
        settingsPanel.classList.toggle('open');
        this.classList.toggle('on');
        
        // 导航按钮控制
        if (settingsPanel.classList.contains('open')) {
            if (menuButton) menuButton.style.display = 'none';
            if (navList && !navList.classList.contains('closed')) {
                navList.classList.add('closed');
            }
            
            // 新增：隐藏文件选择按钮和文字（延迟确保元素渲染）
            setTimeout(() => {
                hideFileSelectionElements();
            }, 100);
        } else {
            if (menuButton) menuButton.style.display = '';
        }
    });
    
    // 夜间模式控制
    document.getElementById('dark-mode-enable').addEventListener('click', function(e) {
        e.stopPropagation();
        enableDarkMode();
        updateDarkModeButtons('enabled');
        updateSearchStyle();
    });
    
    document.getElementById('dark-mode-disable').addEventListener('click', function(e) {
        e.stopPropagation();
        disableDarkMode();
        updateDarkModeButtons('disabled');
        updateSearchStyle();
    });
    
    document.getElementById('dark-mode-auto').addEventListener('click', function(e) {
        e.stopPropagation();
        saveSetting('darkMode', 'auto');
        autoDetectDarkMode();
        updateDarkModeButtons('auto');
        updateSearchStyle();
    });
    
    // 壁纸控制
    document.getElementById('add-custom-wallpaper').addEventListener('click', function(e) {
        e.stopPropagation();
        const customWallpapers = getCustomWallpapers();
        if (customWallpapers.length >= 6) {
            alert('最多只能添加6张自定义壁纸');
            return;
        }
        document.getElementById('wallpaper-upload').click();
    });
    
    document.getElementById('wallpaper-upload').addEventListener('change', function(e) {
        e.stopPropagation();
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                addCustomWallpaper(event.target.result);
                document.getElementById('wallpaper-upload').value = '';
                updateSearchStyle();
            };
            reader.readAsDataURL(file);
        }
    });
    
    document.getElementById('no-wallpaper').addEventListener('click', function(e) {
        e.stopPropagation();
        removeWallpaper();
        saveSetting('wallpaper', 'none');
        saveSetting('wallpaperType', 'none');
        updateSearchStyle();
    });
    
    // 默认壁纸选择事件
    document.querySelectorAll('#default-wallpapers .wallpaper-thumb').forEach(thumb => {
        thumb.addEventListener('click', function(e) {
            e.stopPropagation();
            const wallpaperId = this.getAttribute('data-wallpaper');
            const wallpaper = wallpaperConfig.defaultWallpapers.find(w => w.id === wallpaperId);
            if (wallpaper) {
                setWallpaper(wallpaper.fullUrl);
                saveSetting('wallpaper', wallpaper.fullUrl);
                saveSetting('wallpaperType', 'default');
                
                document.querySelectorAll('.wallpaper-thumb').forEach(t => {
                    t.classList.remove('selected');
                });
                this.classList.add('selected');
                updateSearchStyle();
            }
        });
    });
    
    // 点击页面其他地方关闭设置面板
    document.addEventListener('click', function(e) {
        if (!settingsPanel.contains(e.target) && e.target !== settingsButton && 
            !settingsButton.contains(e.target)) {
            settingsPanel.classList.remove('open');
            settingsButton.classList.remove('on');
            if (menuButton) menuButton.style.display = '';
        }
    });
    
    // 阻止面板内部事件冒泡
    settingsPanel.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // 监听系统外观变化
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (getSetting('darkMode') === 'auto' || !getSetting('darkMode')) {
                autoDetectDarkMode();
            }
        });
    }
}

// 新增：隐藏文件选择按钮和相关文字
function hideFileSelectionElements() {
    // 目标元素选择器（覆盖多种可能的命名）
    const selectors = {
        fileInputs: [
            '#wallpaper-upload',
            '.wallpaper-setting input[type="file"]',
            '.wallpaper-upload input'
        ],
        fileTexts: [
            '.no-file-selected',
            '.file-select-info',
            '.wallpaper-setting .text-hint'
        ]
    };
    
    // 隐藏文件输入按钮
    selectors.fileInputs.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = 'none';
        }
    });
    
    // 隐藏"未选择文件"文字
    selectors.fileTexts.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = 'none';
        }
    });
}

// 更新夜间模式按钮状态
function updateDarkModeButtons(activeMode) {
    document.getElementById('dark-mode-enable').classList.remove('active');
    document.getElementById('dark-mode-disable').classList.remove('active');
    document.getElementById('dark-mode-auto').classList.remove('active');
    
    if (activeMode === 'enabled') {
        document.getElementById('dark-mode-enable').classList.add('active');
    } else if (activeMode === 'disabled') {
        document.getElementById('dark-mode-disable').classList.add('active');
    } else if (activeMode === 'auto') {
        document.getElementById('dark-mode-auto').classList.add('active');
    }
}

// 启用夜间模式
function enableDarkMode(isInitial = false) {
    document.body.classList.add('dark-mode');
    updateSearchStyle();
    if (!isInitial) {
        saveSetting('darkMode', 'enabled');
    }
}

// 禁用夜间模式
function disableDarkMode(isInitial = false) {
    document.body.classList.remove('dark-mode');
    updateSearchStyle();
    if (!isInitial) {
        saveSetting('darkMode', 'disabled');
    }
}

// 保存设置到本地存储
function saveSetting(key, value) {
    try {
        localStorage.setItem('xiaoniu_' + key, value);
    } catch (e) {
        console.error('无法保存设置到本地存储:', e);
    }
}

// 从本地存储获取设置
function getSetting(key) {
    try {
        return localStorage.getItem('xiaoniu_' + key);
    } catch (e) {
        console.error('无法从本地存储获取设置:', e);
        return null;
    }
}

// 设置壁纸
function setWallpaper(url) {
    const container = document.getElementById('wallpaper-container');
    container.style.backgroundImage = `url(${url})`;
    container.style.display = 'block';
}

// 移除壁纸
function removeWallpaper() {
    const container = document.getElementById('wallpaper-container');
    container.style.backgroundImage = 'none';
    container.style.display = 'none';
    
    document.querySelectorAll('.wallpaper-thumb').forEach(thumb => {
        thumb.classList.remove('selected');
    });
}

// 获取自定义壁纸列表
function getCustomWallpapers() {
    const wallpapers = getSetting('customWallpapers');
    return wallpapers ? JSON.parse(wallpapers) : [];
}

// 添加自定义壁纸
function addCustomWallpaper(url) {
    const customWallpapers = getCustomWallpapers();
    customWallpapers.push(url);
    saveSetting('customWallpapers', JSON.stringify(customWallpapers));
    
    renderCustomWallpapers();
    
    setWallpaper(url);
    saveSetting('wallpaper', url);
    saveSetting('wallpaperType', 'custom');
    
    document.querySelectorAll('.wallpaper-thumb').forEach(t => {
        t.classList.remove('selected');
    });
    const thumbs = document.querySelectorAll('#custom-wallpapers .wallpaper-thumb');
    if (thumbs.length > 0) {
        thumbs[thumbs.length - 1].classList.add('selected');
    }
}

// 渲染自定义壁纸
function renderCustomWallpapers() {
    const container = document.getElementById('custom-wallpapers');
    container.innerHTML = '';
    
    const customWallpapers = getCustomWallpapers();
    customWallpapers.forEach((wallpaper, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'custom-wallpaper-item';
        
        const img = document.createElement('img');
        img.src = wallpaper;
        img.className = 'wallpaper-thumb';
        img.addEventListener('click', function() {
            setWallpaper(wallpaper);
            saveSetting('wallpaper', wallpaper);
            saveSetting('wallpaperType', 'custom');
            
            document.querySelectorAll('.wallpaper-thumb').forEach(t => {
                t.classList.remove('selected');
            });
            this.classList.add('selected');
            updateSearchStyle();
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-wallpaper';
        deleteBtn.innerHTML = '×';
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            customWallpapers.splice(index, 1);
            saveSetting('customWallpapers', JSON.stringify(customWallpapers));
            
            const currentWallpaper = getSetting('wallpaper');
            if (currentWallpaper === wallpaper) {
                removeWallpaper();
                saveSetting('wallpaper', 'none');
                saveSetting('wallpaperType', 'none');
            }
            
            renderCustomWallpapers();
        });
        
        wrapper.appendChild(img);
        wrapper.appendChild(deleteBtn);
        container.appendChild(wrapper);
    });
}

// 加载公告
function loadNotices() {
    const container = document.getElementById('notices-content');
    container.innerHTML = '';
    
    if (typeof noticeConfig !== 'undefined' && noticeConfig.notices && noticeConfig.notices.length > 0) {
        noticeConfig.notices.forEach(notice => {
            const noticeEl = document.createElement('div');
            noticeEl.className = 'notice-section';
            noticeEl.innerHTML = `
                <h4>${notice.title}</h4>
                <p>${notice.content}</p>
            `;
            container.appendChild(noticeEl);
        });
    } else {
        container.innerHTML = '<div class="notice-placeholder">暂无公告</div>';
    }
}

// 更新搜索框样式（根据当前模式）
function updateSearchStyle() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const search = document.getElementById('search');
    const searchInput = document.getElementById('search-text');
    
    if (search && searchInput) {
        search.style.background = isDarkMode ? 'var(--search-bg-dark)' : 'var(--search-bg-light)';
        search.style.boxShadow = isDarkMode ? 'var(--search-shadow-dark)' : 'var(--search-shadow-light)';
        searchInput.style.backgroundColor = isDarkMode ? 'var(--search-input-dark)' : 'var(--search-input-light)';
    }
}

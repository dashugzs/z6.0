/* settings.js */
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
  
  // 添加夜间模式切换按钮点击事件（在页面底部文字）
  const nightModeToggle = document.querySelector('div[style="position: absolute; bottom: 0; width: 100%; text-align: center; transform: translateY(10%);"]');
  if (nightModeToggle) {
    nightModeToggle.style.cursor = 'pointer';
    nightModeToggle.addEventListener('click', function() {
      if (document.body.classList.contains('dark-mode')) {
        disableDarkMode();
      } else {
        enableDarkMode();
      }
    });
  }
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
  
  // 切换设置面板显示/隐藏
  settingsButton.addEventListener('click', function() {
    settingsPanel.classList.toggle('open');
    this.classList.toggle('on');
  });
  
  // 夜间模式控制
  document.getElementById('dark-mode-enable').addEventListener('click', function(e) {
    e.stopPropagation();
    enableDarkMode();
    updateDarkModeButtons('enabled');
    updateSearchStyle(); // 更新搜索框样式
  });
  
  document.getElementById('dark-mode-disable').addEventListener('click', function(e) {
    e.stopPropagation();
    disableDarkMode();
    updateDarkModeButtons('disabled');
    updateSearchStyle(); // 更新搜索框样式
  });
  
  document.getElementById('dark-mode-auto').addEventListener('click', function(e) {
    e.stopPropagation();
    // 清除保存的设置，使用自动模式
    saveSetting('darkMode', 'auto');
    autoDetectDarkMode();
    updateDarkModeButtons('auto');
    updateSearchStyle(); // 更新搜索框样式
  });
  
  // 壁纸控制
  document.getElementById('add-custom-wallpaper').addEventListener('click', function(e) {
    e.stopPropagation();
    // 检查当前自定义壁纸数量
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
        // 添加到自定义壁纸列表
        addCustomWallpaper(event.target.result);
        // 清空input值，允许重复选择同一文件
        document.getElementById('wallpaper-upload').value = '';
        updateSearchStyle(); // 更新搜索框样式
      };
      reader.readAsDataURL(file);
    }
  });
  
  document.getElementById('no-wallpaper').addEventListener('click', function(e) {
    e.stopPropagation();
    removeWallpaper();
    saveSetting('wallpaper', 'none');
    saveSetting('wallpaperType', 'none');
    updateSearchStyle(); // 更新搜索框样式
  });
  
  // 默认壁纸选择事件
  document.querySelectorAll('#default-wallpapers .wallpaper-thumb').forEach(thumb => {
    thumb.addEventListener('click', function(e) {
      e.stopPropagation();
      const wallpaperId = this.getAttribute('data-wallpaper');
      // 从配置中找到对应的壁纸URL
      const wallpaper = wallpaperConfig.defaultWallpapers.find(w => w.id === wallpaperId);
      if (wallpaper) {
        setWallpaper(wallpaper.fullUrl);
        saveSetting('wallpaper', wallpaper.fullUrl);
        saveSetting('wallpaperType', 'default');
        
        // 更新选中状态
        document.querySelectorAll('.wallpaper-thumb').forEach(t => {
          t.classList.remove('selected');
        });
        this.classList.add('selected');
        updateSearchStyle(); // 更新搜索框样式
      }
    });
  });
  
  // 点击页面其他地方关闭设置面板
  document.addEventListener('click', function(e) {
    if (!settingsPanel.contains(e.target) && e.target !== settingsButton && 
        !settingsButton.contains(e.target)) {
      settingsPanel.classList.remove('open');
      settingsButton.classList.remove('on');
    }
  });
  
  // 阻止面板内部事件冒泡
  settingsPanel.addEventListener('click', function(e) {
    e.stopPropagation();
  });
  
  // 监听系统外观变化
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      // 只有在自动模式下才响应系统变化
      if (getSetting('darkMode') === 'auto' || !getSetting('darkMode')) {
        autoDetectDarkMode();
      }
    });
  }
}

// 更新夜间模式按钮状态
function updateDarkModeButtons(activeMode) {
  // 移除所有按钮的active类
  document.querySelectorAll('#dark-mode-enable, #dark-mode-disable, #dark-mode-auto').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // 为当前激活的模式按钮添加active类
  if (activeMode === 'enabled') {
    document.getElementById('dark-mode-enable').classList.add('active');
  } else if (activeMode === 'disabled') {
    document.getElementById('dark-mode-disable').classList.add('active');
  } else if (activeMode === 'auto') {
    document.getElementById('dark-mode-auto').classList.add('active');
  }
}

// 辅助函数：获取本地存储的设置
function getSetting(key) {
  return localStorage.getItem('setting_' + key);
}

// 辅助函数：保存设置到本地存储
function saveSetting(key, value) {
  localStorage.setItem('setting_' + key, value);
}

// 启用夜间模式
function enableDarkMode(initializing = false) {
  document.body.classList.add('dark-mode');
  if (!initializing) {
    saveSetting('darkMode', 'enabled');
  }
  updateDarkModeButtons('enabled');
}

// 禁用夜间模式
function disableDarkMode(initializing = false) {
  document.body.classList.remove('dark-mode');
  if (!initializing) {
    saveSetting('darkMode', 'disabled');
  }
  updateDarkModeButtons('disabled');
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
  
  // 移除所有选中状态
  document.querySelectorAll('.wallpaper-thumb').forEach(thumb => {
    thumb.classList.remove('selected');
  });
}

// 获取自定义壁纸列表
function getCustomWallpapers() {
  const wallpapers = localStorage.getItem('custom_wallpapers');
  return wallpapers ? JSON.parse(wallpapers) : [];
}

// 添加自定义壁纸
function addCustomWallpaper(dataUrl) {
  const customWallpapers = getCustomWallpapers();
  
  // 检查是否已存在相同的壁纸
  if (!customWallpapers.includes(dataUrl)) {
    customWallpapers.push(dataUrl);
    localStorage.setItem('custom_wallpapers', JSON.stringify(customWallpapers));
    renderCustomWallpapers();
    
    // 自动选中新添加的壁纸
    setWallpaper(dataUrl);
    saveSetting('wallpaper', dataUrl);
    saveSetting('wallpaperType', 'custom');
  }
}

// 渲染自定义壁纸
function renderCustomWallpapers() {
  const container = document.getElementById('custom-wallpapers');
  container.innerHTML = ''; // 清空现有内容
  
  const customWallpapers = getCustomWallpapers();
  customWallpapers.forEach((wallpaper, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-wallpaper-item';
    
    const img = document.createElement('img');
    img.src = wallpaper;
    img.className = 'wallpaper-thumb';
    img.addEventListener('click', function(e) {
      e.stopPropagation();
      setWallpaper(wallpaper);
      saveSetting('wallpaper', wallpaper);
      saveSetting('wallpaperType', 'custom');
      
      // 更新选中状态
      document.querySelectorAll('.wallpaper-thumb').forEach(t => {
        t.classList.remove('selected');
      });
      img.classList.add('selected');
      updateSearchStyle();
    });
    
    // 删除按钮
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-wallpaper';
    deleteBtn.innerHTML = '×';
    deleteBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      // 从数组中移除
      customWallpapers.splice(index, 1);
      localStorage.setItem('custom_wallpapers', JSON.stringify(customWallpapers));
      // 重新渲染
      renderCustomWallpapers();
      
      // 如果删除的是当前使用的壁纸，则移除壁纸
      if (getSetting('wallpaper') === wallpaper) {
        removeWallpaper();
        saveSetting('wallpaper', 'none');
        saveSetting('wallpaperType', 'none');
      }
    });
    
    wrapper.appendChild(img);
    wrapper.appendChild(deleteBtn);
    container.appendChild(wrapper);
  });
}

// 加载并渲染公告
function loadNotices() {
  const container = document.getElementById('notices-content');
  
  if (typeof noticeConfig !== 'undefined' && noticeConfig.notices && noticeConfig.notices.length > 0) {
    container.innerHTML = ''; // 清空占位符
    
    noticeConfig.notices.forEach(notice => {
      const noticeEl = document.createElement('div');
      noticeEl.className = 'notice-section';
      noticeEl.innerHTML = `
        <h4>${notice.title || ''}</h4>
        <p>${notice.content || ''}</p>
      `;
      container.appendChild(noticeEl);
    });
  } else {
    container.innerHTML = '<div class="notice-placeholder">暂无公告信息</div>';
  }
}

// 更新搜索框样式（根据当前模式和壁纸）
function updateSearchStyle() {
  // 可以根据需要实现搜索框样式的更新逻辑
}
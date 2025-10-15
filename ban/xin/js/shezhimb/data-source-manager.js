// 数据源管理功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化数据源管理事件监听
    initDataSourceListeners();
    
    // 加载保存的数据源设置
    loadSavedDataSource();
});

// 初始化数据源管理事件监听
function initDataSourceListeners() {
    // 数据源URL映射
    const dataSourceUrls = {
        cloud: 'https://dhsssj.xnss.fun/cloud',
        hot: 'https://dhsssj.xnss.fun/hot',
        ecommerce: 'https://shuju.xnss.fun/dianshang',
        dev: 'https://shuju.xnss.fun/kaifazhe',
        yule: 'https://shuju.xnss.fun/yule',
        ziyuan: 'https://shuju.xnss.fun/ziyuan'
    };
    
    // 统一处理数据源按钮点击
    document.querySelectorAll('.data-source-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const sourceType = this.dataset.source;
            
            // 设置活跃状态
            setActiveDataSourceButton(sourceType);
            
            switch(sourceType) {
case 'default':
    setDataSource('default');
    document.getElementById('custom-data-url').value = '';
    
    // 清除缓存的导航数据
    localStorage.removeItem('navBackupData');
    
    // 重新加载默认数据
    const defaultData = {
        navigationData: window.DEFAULT_NAV_DATA,
        searchData: []
    };
    saveBackupData(defaultData);
    updateNavigationUI(defaultData);
    
    // 强制重新渲染导航
    if (window.BlockNavRenderer) {
        BlockNavRenderer.render(defaultData.navigationData);
    }
    if (window.SearchUtils) {
        SearchUtils.renderSearchOptions();
    }
    // 显示提示并刷新页面
    alert('数据源已更新成功，即将刷新页面');
    setTimeout(() => window.location.reload(), 1000);
    break;
                    
                case 'local':
                    document.getElementById('local-data-file').click();
                    break;
                    
                case 'template':
                    downloadDataSourceTemplate();
                    break;
                    
                // 处理新增的数据源类型
case 'cloud':
case 'hot':
case 'ecommerce':
case 'dev':
case 'yule':
case 'ziyuan':
    const url = dataSourceUrls[sourceType];
    if (url) {
        document.getElementById('custom-data-url').value = url;
        setDataSource('custom', url);
        reloadNavigationData(url);
        // 显示提示并刷新页面
        alert('数据源已更新成功，即将刷新页面');
        setTimeout(() => window.location.reload(), 1000);
    }
    break;
            }
        });
    });
    // 本地文件上传处理
    document.getElementById('local-data-file').addEventListener('change', function(e) {
        e.stopPropagation();
        const file = e.target.files[0];
        if (file) {
            if (!file.name.endsWith('.js')) {
                alert('请上传. js文件');
                return;
            }
            
            const reader = new FileReader();
reader.onload = function(event) {
    try {
        const content = event.target.result;
        localStorage.setItem('localDataSourceContent', content);
        setDataSource('local');
        reloadNavigationDataFromLocalFile(content);
        // 显示提示并刷新页面
        alert('本地数据源已更新成功，即将刷新页面');
        setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
        console.error('解析本地数据文件失败:', error);
        alert('文件格式错误，请检查文件内容');
    }
};
            reader.readAsText(file);
        }
    });
    
    // 应用链接接口按钮
    // 应用链接接口按钮
document.getElementById('apply-data-url').addEventListener('click', function(e) {
    e.stopPropagation();
    let url = document.getElementById('custom-data-url').value.trim();
    if (url) {
        // 自动添加http/https前缀
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
            document.getElementById('custom-data-url').value = url;
        }
        setDataSource('custom', url);
        reloadNavigationData(url);
        
        // 清除其他按钮的活跃状态
        setActiveDataSourceButton(null);
        
        // 显示提示并刷新页面
        alert('数据源已更新成功，即将刷新页面');
        setTimeout(() => window.location.reload(), 1000);
    } else {
        alert('请输入接口链接');
    }
});
    
    // 设置活跃按钮状态
function setActiveDataSourceButton(sourceType) {
    document.querySelectorAll('.data-source-btn').forEach(btn => {
        if (btn.dataset.source === sourceType) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    // 保存选中状态到本地存储
    if (sourceType) {
        localStorage.setItem('activeDataSource', sourceType);
    }
}

// 在初始化时加载保存的选中状态

    // 加载保存的按钮状态
function loadDataSourceButtonState() {
    try {
        // 优先读取 activeDataSource（按钮选中状态）
        const savedSource = localStorage.getItem('activeDataSource');
        if (savedSource) {
            setActiveDataSourceButton(savedSource);
            return; // 若有保存的选中状态，直接应用
        }
        
        // 再从数据源设置中读取类型
        const saved = localStorage.getItem('dataSourceSettings');
        if (saved) {
            const data = JSON.parse(saved);
            const presetSources = Object.keys(dataSourceUrls); // 包含cloud、hot等预设类型
            // 匹配预设数据源或特殊类型
            if (presetSources.includes(data.type) || 
                ['default', 'local', 'template'].includes(data.type)) {
                setActiveDataSourceButton(data.type);
            }
        }
    } catch (error) {
        console.error('加载数据源按钮状态失败:', error);
    }
}
    
    // 初始加载按钮状态
    loadDataSourceButtonState();
}
// 设置数据源类型
function setDataSource(type, url = '') {
    const data = {
        type: type,
        url: url
    };
    localStorage.setItem('dataSourceSettings', JSON.stringify(data));
    
    // 更新按钮活跃状态
    document.querySelectorAll('.data-source-btn').forEach(btn => {
        if (btn.dataset.source === type) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// 加载保存的数据源设置
function loadSavedDataSource() {
    try {
        const saved = localStorage.getItem('dataSourceSettings');
        if (saved) {
            const data = JSON.parse(saved);
            if (data.type === 'custom' && data.url) {
                document.getElementById('custom-data-url').value = data.url;
            }
        }
    } catch (error) {
        console.error('加载保存的数据源设置失败:', error);
    }
}

// 下载数据源模板文件
function downloadDataSourceTemplate() {
    const templateUrl = 'js/daohangmb/shuju.js';
    const a = document.createElement('a');
    a.href = templateUrl;
    a.download = 'shuju.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// 从本地文件重新加载导航数据
function reloadNavigationDataFromLocalFile(content) {
    try {
        const jsonStr = content.replace(/^const\s+appData\s*=\s*/, '').replace(/;$/, '');
        const appData = JSON.parse(jsonStr);
        
        if (!Array.isArray(appData.navigationData)) {
            throw new Error('导航数据不是数组');
        }
        
        const cleanData = {
            navigationData: appData.navigationData
                ? appData.navigationData.map(cat => ({
                    title: cat?.title || '未命名分类',
                    links: Array.isArray(cat?.links) 
                        ? cat.links.map(link => ({
                            name: link?.name || '未命名链接',
                            url: link?.url || '#',
                            rel: link?.rel || 'nofollow',
                            target: link?.target || '_blank'
                        }))
                        : []
                }))
                : [],
            searchData: appData.searchData || []
        };
        
        if (cleanData.navigationData.length === 0) {
            console.warn('本地文件导航数据为空，使用默认数据');
            cleanData.navigationData = window.DEFAULT_NAV_DATA;
        }
        
        saveBackupData(cleanData);
        updateNavigationUI(cleanData);
        
    } catch (error) {
        console.error('加载本地数据失败:', error);
        alert('加载本地数据失败: ' + error.message);
    }
}

// 重新加载导航数据
function reloadNavigationData(url) {
    if (url === null) {
        const defaultData = {
            navigationData: window.DEFAULT_NAV_DATA,
            searchData: []
        };
        saveBackupData(defaultData);
        updateNavigationUI(defaultData);
        return;
    }
    
    fetchDataWithRetry(url).then(data => {
        updateNavigationUI(data);
    }).catch(error => {
        console.error('加载数据失败:', error);
        alert('加载数据失败: ' + error.message);
        const defaultData = {
            navigationData: window.DEFAULT_NAV_DATA,
            searchData: []
        };
        updateNavigationUI(defaultData);
    });
}

// 使用指定URL获取数据
function fetchDataWithRetry(url, retryCount = 0) {
    const MAX_RETRIES = 3;
    
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status}`);
            }
            return response.text();
        })
        .then(dataText => {
            try {
                const jsonStr = dataText.replace(/^const\s+appData\s*=\s*/, '').replace(/;$/, '');
                const appData = JSON.parse(jsonStr);
                
                if (!Array.isArray(appData.navigationData)) {
                    throw new Error('导航数据不是数组');
                }
                if (!Array.isArray(appData.searchData)) {
                    throw new Error('搜索数据不是数组');
                }
                
                const cleanData = {
                    navigationData: appData.navigationData
                        ? appData.navigationData.map(cat => ({
                            title: cat?.title || '未命名分类',
                            links: Array.isArray(cat?.links) 
                                ? cat.links.map(link => ({
                                    name: link?.name || '未命名链接',
                                    url: link?.url || '#',
                                    rel: link?.rel || 'nofollow',
                                    target: link?.target || '_blank'
                                }))
                                : []
                        }))
                        : [],
                    searchData: appData.searchData || []
                };
                
                if (cleanData.navigationData.length === 0) {
                    console.warn('远程导航数据为空，使用默认数据');
                    cleanData.navigationData = window.DEFAULT_NAV_DATA;
                }
                
                saveBackupData(cleanData);
                return cleanData;
                
            } catch (error) {
                if (retryCount < MAX_RETRIES) {
                    retryCount++;
                    console.log(`数据加载失败，正在重试（${retryCount}/${MAX_RETRIES}）:`, error);
                    return fetchDataWithRetry(url, retryCount);
                }
                throw error;
            }
        });
}

// 更新导航UI
// 修改后
function updateNavigationUI(data) {
    window.navigationData = data.navigationData;
    console.log('导航数据更新成功，共', window.navigationData.length, '个分类');
    
    // 强制刷新导航面板
    if (window.BlockNavRenderer) {
        // 先清空容器再重新渲染
        const navContainer = document.getElementById('navigation-container');
        if (navContainer) {
            navContainer.innerHTML = '<div class="horizontal-navigation"></div>';
        }
        BlockNavRenderer.render(window.navigationData);
    }
    
    // 强制刷新右侧导航
    if (window.NavigationUtils) {
        // 先清空列表再重新渲染
        const listContainer = document.querySelector('.list ul');
        if (listContainer) {
            listContainer.innerHTML = '';
        }
        NavigationUtils.updateNavigation(window.navigationData);
    }
    
    if (window.SearchUtils) {
        SearchUtils.renderSearchOptions();
    }
    
    // 显示更新提示
    const alertEl = document.createElement('div');
    alertEl.style = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:10px 20px;background:#4CAF50;color:white;border-radius:4px;z-index:9999';
    alertEl.textContent = '数据源已更新成功';
    document.body.appendChild(alertEl);
    setTimeout(() => alertEl.remove(), 2000);
}

// 保存备份数据
function saveBackupData(data) {
    try {
        localStorage.setItem('navBackupData', JSON.stringify(data));
    } catch (e) {
        console.warn('无法保存备份数据到localStorage:', e);
    }
}

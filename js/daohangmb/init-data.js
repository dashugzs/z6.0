// 数据加载与处理https://dhsssj.xnss.fun/js/shuju/sshuju.js
(function() {
    const WORKER_URL = "https://dhsssj.xnss.fun";
    const MAX_RETRIES = 3;
    
    // 备份与恢复数据
    function saveBackupData(data) {
        try {
            localStorage.setItem('navBackupData', JSON.stringify(data));
        } catch (e) {
            console.warn('无法保存备份数据到localStorage:', e);
        }
    }

    function getBackupData() {
        try {
            const backup = localStorage.getItem('navBackupData');
            if (backup) {
                const data = JSON.parse(backup);
                return {
                    navigationData: Array.isArray(data.navigationData) ? data.navigationData : window.DEFAULT_NAV_DATA,
                    searchData: Array.isArray(data.searchData) ? data.searchData : []
                };
            }
        } catch (e) {
            console.warn('无法从localStorage获取备份数据:', e);
        }
        // 备份数据无效时返回默认数据
        return {
            navigationData: window.DEFAULT_NAV_DATA,
            searchData: []
        };
    }

    // 带重试机制的数据加载
    function fetchDataWithRetry(retryCount = 0) {
        return fetch(WORKER_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP错误: ${response.status}`);
                }
                return response.text();
            })
            .then(dataText => {
                // 解析数据
                try {
                    // 尝试解析标准格式
                    const jsonStr = dataText.replace(/^const\s+appData\s*=\s*/, '').replace(/;$/, '');
                    const appData = JSON.parse(jsonStr);
                    
                    // 严格验证数据结构
                    if (!Array.isArray(appData.navigationData)) {
                        throw new Error('导航数据不是数组');
                    }
                    if (!Array.isArray(appData.searchData)) {
                        throw new Error('搜索数据不是数组');
                    }
                    
                    // 数据清洗与格式化
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
                    
                    // 如果导航数据为空，使用默认数据
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
                        return fetchDataWithRetry(retryCount);
                    }
                    throw error;
                }
            });
    }

    try {
        fetchDataWithRetry().then(data => {
            window.navigationData = data.navigationData;
            window.searchData = data.searchData;
            console.log('导航数据加载成功，共', window.navigationData.length, '个分类');
            
            // 使用方块导航渲染器
            BlockNavRenderer.render(window.navigationData);
            
            if (window.SearchUtils) {
                SearchUtils.renderSearchOptions();
                SearchUtils.setupEventListeners();
            }
        }).catch(error => {
            console.error('所有加载尝试失败，使用备份数据:', error);
            
            const backupData = getBackupData();
            window.navigationData = backupData.navigationData;
            window.searchData = backupData.searchData;
            
            // 使用方块导航渲染器
            BlockNavRenderer.render(window.navigationData);
            
            if (window.SearchUtils) {
                SearchUtils.renderSearchOptions();
                SearchUtils.setupEventListeners();
            }
            
            const alertEl = document.createElement('div');
            alertEl.style = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);padding:10px 20px;background:#ff4444;color:white;border-radius:4px;z-index:9999';
            alertEl.textContent = '如遇异常Ctrl+F5强制刷新或Ctrl+Shift+R清除缓存';
            document.body.appendChild(alertEl);
            setTimeout(() => alertEl.remove(), 3000);
        });
    } catch (error) {
        console.error('初始化数据处理失败:', error);
        // 使用默认数据作为最后的保障
        window.navigationData = window.DEFAULT_NAV_DATA;
        window.searchData = [];
        BlockNavRenderer.render(window.navigationData);
    }

})();




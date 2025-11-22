// 分类标签管理器
const CategoryTabManager = {
    // 标签数据配置
    tabConfig: [
        { id: 'default', name: '默认', type: 'data', url: 'https://shuju.xnss.fun' },
        { id: 'ecommerce', name: '电商', type: 'data', url: 'https://shuju.xnss.fun/dianshang' },
        { id: 'development', name: '开发', type: 'data', url: 'https://shuju.xnss.fun/kaifazhe' },
        { id: 'entertainment', name: '娱乐', type: 'data', url: 'https://shuju.xnss.fun/yule' },
        { id: 'resources', name: '资源', type: 'data', url: 'https://shuju.xnss.fun/ziyuan' },
        { id: 'link6', name: '豆包', type: 'link', url: 'https://www.doubao.com/chat/' },
        { id: 'link7', name: '文心一言', type: 'link', url: 'https://yiyan.baidu.com/' },
        { id: 'link8', name: 'DeepSeek', type: 'link', url: 'https://chat.deepseek.com/' },
        { id: 'link9', name: '2048', type: 'link', url: 'https://y.xiaoniuss.top/yxmb/10/index.html' },
        { id: 'link10', name: '推箱子', type: 'link', url: 'https://y.xiaoniuss.top/yxmb/39/index.html' }
    ],
    
    // 已加载的数据缓存
    dataCache: {},
    
    // 初始化
    init: function() {
        this.renderTabs();
        this.bindEvents();
        this.loadInitialData();
        this.applyTheme(); // 应用主题
    },
    
    // 渲染标签按钮
    renderTabs: function() {
        const container = document.getElementById('category-tabs-container');
        if (!container) return;
        
        // 创建标签容器
        const tabsWrapper = document.createElement('div');
        tabsWrapper.className = 'category-tabs';
        container.appendChild(tabsWrapper);
        
        // 创建标签按钮
        this.tabConfig.forEach((tab, index) => {
            const button = document.createElement('button');
            button.id = `tab-${tab.id}`;
            button.className = `category-tab ${index === 0 ? 'active' : ''}`;
            button.textContent = tab.name;
            button.dataset.type = tab.type;
            button.dataset.url = tab.url;
            button.dataset.id = tab.id;
            
            tabsWrapper.appendChild(button);
        });
    },
    
    // 绑定事件
    bindEvents: function() {
        const container = document.getElementById('category-tabs-container');
        if (!container) return;
        
        container.addEventListener('click', (e) => {
            const tab = e.target.closest('.category-tab');
            if (!tab) return;
            
            // 更新选中状态
            this.updateActiveTab(tab);
            
            // 处理点击事件
            this.handleTabClick(tab);
        });
        
        // 监听主题变化
        document.addEventListener('themechange', () => this.applyTheme());
    },
    
    // 更新选中的标签
    updateActiveTab: function(activeTab) {
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        activeTab.classList.add('active');
    },
    
    // 处理标签点击
    handleTabClick: function(tab) {
        const type = tab.dataset.type;
        const url = tab.dataset.url;
        const id = tab.dataset.id;
        
        // 显示加载状态
        this.showLoadingState();
        
        if (type === 'data') {
            this.loadNavigationData(id, url)
                .catch(error => {
                    console.error(`加载${id}数据失败:`, error);
                    this.showErrorState(`加载${tab.textContent}数据失败: ${error.message}`);
                });
        } else if (type === 'link') {
            // 处理普通链接
            if (url && url !== '#') {
                window.open(url, '_blank');
            }
            // 隐藏加载状态
            this.hideLoadingState();
        }
    },
    
    // 加载导航数据 - 与1init-data.js保持一致的解析逻辑
    loadNavigationData: function(id, url) {
        return new Promise((resolve, reject) => {
            // 检查缓存
            if (this.dataCache[id]) {
                BlockNavRenderer.render(this.dataCache[id]);
                this.hideLoadingState();
                resolve(this.dataCache[id]);
                return;
            }
            
            // 特殊处理默认数据
            if (id === 'default' && url === null) {
                if (typeof window.navigationData !== 'undefined') {
                    this.dataCache[id] = window.navigationData;
                    BlockNavRenderer.render(window.navigationData);
                    this.hideLoadingState();
                    resolve(window.navigationData);
                } else {
                    // 尝试从备份数据加载
                    try {
                        const backup = localStorage.getItem('navBackupData');
                        if (backup) {
                            const backupData = JSON.parse(backup);
                            const navData = Array.isArray(backupData.navigationData) 
                                ? backupData.navigationData 
                                : window.DEFAULT_NAV_DATA;
                            
                            this.dataCache[id] = navData;
                            BlockNavRenderer.render(navData);
                            this.hideLoadingState();
                            resolve(navData);
                        } else {
                            reject(new Error('默认数据未初始化且无备份数据'));
                        }
                    } catch (e) {
                        reject(new Error('加载默认数据失败: ' + e.message));
                    }
                }
                return;
            }
            
            // 加载远程数据 - 关键修改：处理const appData格式
            if (url) {
                // 添加防缓存随机参数
                const urlWithCacheBust = new URL(url);
                urlWithCacheBust.searchParams.append('t', new Date().getTime());
                
                fetch(urlWithCacheBust.toString())
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP错误，状态码: ${response.status}`);
                        }
                        return response.text(); // 先获取文本，而不是直接JSON解析
                    })
                    .then(dataText => {
                        try {
                            // 关键处理：移除开头的const appData = 和结尾的;
                            const jsonStr = dataText
                                .replace(/^const\s+appData\s*=\s*/, '')
                                .replace(/;$/, '');
                            
                            const appData = JSON.parse(jsonStr);
                            
                            // 验证数据结构（与1init-data.js保持一致）
                            if (!Array.isArray(appData.navigationData)) {
                                throw new Error('导航数据不是数组');
                            }
                            
                            // 数据清洗与格式化
                            const cleanData = appData.navigationData.map(cat => ({
                                title: cat?.title || '未命名分类',
                                links: Array.isArray(cat?.links) 
                                    ? cat.links.map(link => ({
                                        name: link?.name || '未命名链接',
                                        url: link?.url || '#',
                                        rel: link?.rel || 'nofollow',
                                        target: link?.target || '_blank'
                                    }))
                                    : []
                            }));
                            
                            this.dataCache[id] = cleanData;
                            BlockNavRenderer.render(cleanData);
                            this.hideLoadingState();
                            resolve(cleanData);
                        } catch (parseError) {
                            reject(new Error('数据解析失败: ' + parseError.message));
                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            } else {
                reject(new Error('未指定数据URL'));
            }
        });
    },
    
    // 初始加载前5个标签的数据
    loadInitialData: function() {
        // 只加载前5个数据类型的标签，但不触发渲染
        this.tabConfig.slice(0, 5).forEach(tab => {
            if (tab.type === 'data' && tab.id !== 'default' && tab.url) {
                // 静默加载到缓存，不触发渲染
                const urlWithCacheBust = new URL(tab.url);
                urlWithCacheBust.searchParams.append('t', new Date().getTime());
                
                fetch(urlWithCacheBust.toString())
                    .then(response => response.ok ? response.text() : null)
                    .then(dataText => {
                        if (dataText) {
                            try {
                                const jsonStr = dataText
                                    .replace(/^const\s+appData\s*=\s*/, '')
                                    .replace(/;$/, '');
                                const appData = JSON.parse(jsonStr);
                                
                                if (Array.isArray(appData.navigationData)) {
                                    const cleanData = appData.navigationData.map(cat => ({
                                        title: cat?.title || '未命名分类',
                                        links: Array.isArray(cat?.links) 
                                            ? cat.links.map(link => ({
                                                name: link?.name || '未命名链接',
                                                url: link?.url || '#',
                                                rel: link?.rel || 'nofollow',
                                                target: link?.target || '_blank'
                                            }))
                                            : []
                                    }));
                                    this.dataCache[tab.id] = cleanData;
                                }
                            } catch (e) {
                                console.warn(`预加载${tab.id}数据失败:`, e);
                            }
                        }
                    })
                    .catch(error => {
                        console.warn(`预加载${tab.id}数据失败:`, error);
                    });
            }
        });
    },
    
    // 显示加载状态
    showLoadingState: function() {
        const container = document.querySelector('.horizontal-navigation');
        if (container) {
            container.innerHTML = '<div class="loading-state">加载中...</div>';
        }
    },
    
    // 隐藏加载状态
    hideLoadingState: function() {
        const loadingEl = document.querySelector('.loading-state');
        if (loadingEl) {
            loadingEl.remove();
        }
    },
    
    // 显示错误状态
    showErrorState: function(message) {
        const container = document.querySelector('.horizontal-navigation');
        if (container) {
            container.innerHTML = `<div class="error-state">${message}</div>`;
        }
    },
    
    // 提供外部更新链接的接口
    updateTabUrl: function(tabId, newUrl) {
        const tab = this.tabConfig.find(t => t.id === tabId);
        if (tab) {
            tab.url = newUrl;
            const button = document.querySelector(`.category-tab[data-id="${tabId}"]`);
            if (button) {
                button.dataset.url = newUrl;
            }
            // 清除缓存
            delete this.dataCache[tabId];
        }
    },
    
    // 应用主题
    applyTheme: function() {
        const isDarkMode = document.documentElement.classList.contains('dark-mode');
        const tabs = document.querySelectorAll('.category-tab');
        
        tabs.forEach(tab => {
            if (tab.classList.contains('active')) {
                tab.style.backgroundColor = isDarkMode ? '#4a89dc' : '#61a0ff';
            } else {
                tab.style.backgroundColor = isDarkMode ? 'rgba(80, 80, 80, 0.6)' : 'rgba(255, 255, 255, 0.6)';
                tab.style.color = isDarkMode ? '#ddd' : 'var(--text-color)';
            }
        });
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 等待BlockNavRenderer加载完成
    const checkRendererLoaded = setInterval(() => {
        if (typeof BlockNavRenderer !== 'undefined') {
            clearInterval(checkRendererLoaded);
            CategoryTabManager.init();
            
            // 监听主题切换
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'class') {
                        CategoryTabManager.applyTheme();
                    }
                });
            });
            
            observer.observe(document.documentElement, { attributes: true });
        }
    }, 100);
});

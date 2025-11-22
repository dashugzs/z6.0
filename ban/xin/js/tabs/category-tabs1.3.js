// 分类标签管理器
const CategoryTabManager = {
    // 分类配置（新增）
    categoryGroups: [
        { id: 'search-sources', name: '搜索源' },
        { id: 'video-sources', name: '影视盘' },
        { id: 'ai-models', name: 'AI大模型' },
        { id: 'entertainment', name: '娱乐一下' }
    ],
    
    // 标签数据配置（更新分类关联）
    tabConfig: [
        { id: 'default', name: '默认', type: 'data', url: 'https://shuju.xnss.fun', group: 'search-sources' },
        { id: 'ecommerce', name: '电商', type: 'data', url: 'https://shuju.xnss.fun/dianshang', group: 'search-sources' },
        { id: 'development', name: '开发', type: 'data', url: 'https://shuju.xnss.fun/kaifazhe', group: 'search-sources' },
        { id: 'entertainment', name: '娱乐', type: 'data', url: 'https://shuju.xnss.fun/yule', group: 'search-sources' },
        { id: 'resources', name: '资源', type: 'data', url: 'https://shuju.xnss.fun/ziyuan', group: 'search-sources' },
        { id: 'link6', name: '豆包', type: 'link', url: 'https://www.doubao.com/chat/', group: 'ai-models' },
        { id: 'link7', name: '文心一言', type: 'link', url: 'https://yiyan.baidu.com/', group: 'ai-models' },
        { id: 'link8', name: '橘子盘搜', type: 'link', url: 'https://www.nmme.icu/', group: 'video-sources' },
        { id: 'link81', name: '百度网盘资源', type: 'link', url: 'https://xiongdipan.com/', group: 'video-sources' },
        { id: 'link82', name: '阿里网盘资源', type: 'link', url: 'https://www.alipansou.com/', group: 'video-sources' },
        { id: 'link83', name: '夸克网盘资源', type: 'link', url: 'https://aipanso.com/', group: 'video-sources' },
        { id: 'link9', name: '2048', type: 'link', url: 'https://y.xiaoniuss.top/yxmb/10/index.html', group: 'entertainment' },
        { id: 'link10', name: '推箱子', type: 'link', url: 'https://y.xiaoniuss.top/yxmb/39/index.html', group: 'entertainment' }
    ],
    
    // 已加载的数据缓存
    dataCache: {},
    activeGroup: 'search-sources', // 默认激活搜索源分类
    
    // 初始化
    init: function() {
        this.renderCategoryGroups(); // 渲染分类组
        this.renderTabs();
        this.bindEvents();
        this.loadInitialData();
        this.applyTheme();
    },
    
    // 渲染分类标题组（新增）
    renderCategoryGroups: function() {
        const container = document.getElementById('category-tabs-container');
        if (!container) return;
        
        // 创建分类标题容器
        const categoryGroupWrapper = document.createElement('div');
        categoryGroupWrapper.className = 'category-groups';
        container.appendChild(categoryGroupWrapper);
        
        // 创建分类标题按钮
        this.categoryGroups.forEach(group => {
            const button = document.createElement('button');
            button.id = `category-group-${group.id}`;
            button.className = `category-group-btn ${group.id === this.activeGroup ? 'active' : ''}`;
            button.textContent = group.name;
            button.dataset.groupId = group.id;
            
            categoryGroupWrapper.appendChild(button);
        });
    },
    
    // 渲染标签按钮（更新）
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
            button.className = `category-tab ${this.activeGroup === tab.group && (this.activeGroup === 'search-sources' && index === 0) ? 'active' : ''}`;
            button.textContent = tab.name;
            button.dataset.type = tab.type;
            button.dataset.url = tab.url;
            button.dataset.id = tab.id;
            button.dataset.group = tab.group;
            // 默认只显示激活组的标签
            button.style.display = this.activeGroup === tab.group ? 'inline-block' : 'none';
            
            tabsWrapper.appendChild(button);
        });
    },
    
    // 绑定事件（更新）
    bindEvents: function() {
        const container = document.getElementById('category-tabs-container');
        if (!container) return;
        
        // 分类组点击事件
        container.addEventListener('click', (e) => {
            const groupBtn = e.target.closest('.category-group-btn');
            if (groupBtn) {
                this.activeGroup = groupBtn.dataset.groupId;
                this.updateActiveGroup();
                this.updateActiveTab(null); // 重置标签选中状态
                return;
            }
            
            // 标签点击事件
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
    
    // 更新激活的分类组（新增）
    updateActiveGroup: function() {
        // 更新分类组按钮状态
        document.querySelectorAll('.category-group-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.groupId === this.activeGroup);
        });
        
        // 更新标签显示状态
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.style.display = tab.dataset.group === this.activeGroup ? 'inline-block' : 'none';
        });
        
        // 如果切换到搜索源，默认激活第一个标签
        if (this.activeGroup === 'search-sources') {
            const firstTab = document.querySelector(`.category-tab[data-group="search-sources"]`);
            if (firstTab) {
                this.updateActiveTab(firstTab);
                this.handleTabClick(firstTab);
            }
        }
    },
    
    // 更新选中的标签（保持不变）
    updateActiveTab: function(activeTab) {
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        if (activeTab) {
            activeTab.classList.add('active');
        }
    },
    
    // 其余方法保持不变...
    handleTabClick: function(tab) {
        // 保持原有实现
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
            if (url && url !== '#' && (!window.gameTabIds || !window.gameTabIds.includes(id))) {
                window.open(url, '_blank');
            }
            // 隐藏加载状态
            this.hideLoadingState();
        }
    },
    
    // 加载导航数据（保持不变）
    loadNavigationData: function(id, url) {
        // 保持原有实现
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
            
            // 加载远程数据
            if (url) {
                // 添加防缓存随机参数
                const urlWithCacheBust = new URL(url);
                urlWithCacheBust.searchParams.append('t', new Date().getTime());
                
                fetch(urlWithCacheBust.toString())
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP错误，状态码: ${response.status}`);
                        }
                        return response.text();
                    })
                    .then(dataText => {
                        try {
                            const jsonStr = dataText
                                .replace(/^const\s+appData\s*=\s*/, '')
                                .replace(/;$/, '');
                            
                            const appData = JSON.parse(jsonStr);
                            
                            if (!Array.isArray(appData.navigationData)) {
                                throw new Error('导航数据不是数组');
                            }
                            
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
    
    // 初始加载数据（保持不变）
    loadInitialData: function() {
        this.tabConfig.slice(0, 5).forEach(tab => {
            if (tab.type === 'data' && tab.id !== 'default' && tab.url) {
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
                                console.error(`预加载${tab.id}数据失败:`, e);
                            }
                        }
                    })
                    .catch(error => console.error(`预加载${tab.id}数据失败:`, error));
            }
        });
    },
    
    // 主题相关方法（保持不变）
    applyTheme: function() {
        // 保持原有实现
    },
    
    // 加载状态相关方法（保持不变）
    showLoadingState: function() {
        const container = document.getElementById('navigation-container');
        if (container) {
            container.classList.add('loading');
        }
    },
    
    hideLoadingState: function() {
        const container = document.getElementById('navigation-container');
        if (container) {
            container.classList.remove('loading');
        }
    },
    
    showErrorState: function(message) {
        const container = document.getElementById('navigation-container');
        if (container) {
            container.classList.remove('loading');
            container.innerHTML = `<div class="error-state">${message}</div>`;
        }
    }
};

// 初始化分类标签管理器
document.addEventListener('DOMContentLoaded', () => {
    CategoryTabManager.init();
});

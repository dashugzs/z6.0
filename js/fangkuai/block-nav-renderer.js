// 方块导航渲染工具 - 专门处理方块式导航面板渲染
const BlockNavRenderer = {
    /**
     * 渲染方块式导航面板
     * @param {Array} navigationData - 导航数据数组
     */
    render: function(navigationData) {
        // 获取导航容器
        const container = document.querySelector('.horizontal-navigation');
        if (!container) {
            console.error('导航容器未找到 (.horizontal-navigation)');
            return;
        }
        
        // 清空容器
        container.innerHTML = '';
        
        // 确保数据是数组
        const safeData = Array.isArray(navigationData) ? navigationData : [];
        
        // 处理空数据场景
        if (safeData.length === 0) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'empty-state';
            emptyEl.innerHTML = '暂无导航数据<br>请联系管理员添加或检查网络连接';
            container.appendChild(emptyEl);
            return;
        }
        
        // 创建分类容器
        const categoriesContainer = document.createElement('div');
        categoriesContainer.className = 'categories-container';
        container.appendChild(categoriesContainer);
        
        // 渲染导航分类方块
        safeData.forEach((category, catIndex) => {
            // 验证分类有效性
            if (!category || typeof category !== 'object') {
                console.warn('无效的导航分类数据，已跳过', category);
                return;
            }
            
            // 创建分类方块
            const categoryBlock = document.createElement('div');
            categoryBlock.className = 'category-block';
            
            // 创建分类标题
            const titleEl = document.createElement('div');
            titleEl.className = 'category-title';
            titleEl.textContent = category.title || `未命名分类${catIndex + 1}`;
            categoryBlock.appendChild(titleEl);
            
            // 创建链接容器
            const linksContainer = document.createElement('div');
            linksContainer.className = 'links-container';
            
            // 创建链接网格
            const linksGrid = document.createElement('div');
            linksGrid.className = 'links-grid';
            
            // 确保links是数组
            const links = Array.isArray(category.links) ? category.links : [];
            
            if (links.length === 0) {
                const noLinksEl = document.createElement('div');
                noLinksEl.className = 'category-empty';
                noLinksEl.textContent = '该分类暂无链接';
                linksGrid.appendChild(noLinksEl);
            } else {
                // 渲染有效链接
                links.forEach((link, linkIndex) => {
                    if (!link || typeof link !== 'object') {
                        console.warn(`分类 ${catIndex} 中的无效链接数据，已跳过`, link);
                        return;
                    }
                    
                    const linkEl = document.createElement('a');
                    linkEl.className = 'nav-link';
                    linkEl.href = link.url || '#';
                    linkEl.textContent = link.name || `未命名链接${linkIndex + 1}`;
                    linkEl.rel = link.rel || 'nofollow';
                    linkEl.target = link.target || '_blank';
                    linksGrid.appendChild(linkEl);
                });
            }
            
            linksContainer.appendChild(linksGrid);
            categoryBlock.appendChild(linksContainer);
            categoriesContainer.appendChild(categoryBlock);
        });
    }
};

// 页面加载完成后检查是否需要初始化
document.addEventListener('DOMContentLoaded', function() {
    // 如果导航数据已加载则直接渲染
    if (typeof window.navigationData !== 'undefined') {
        BlockNavRenderer.render(window.navigationData);
    }
});

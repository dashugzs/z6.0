/**
 * 水平导航渲染工具 - 专门处理m.html的导航面板渲染
 */
const HorizontalNavRenderer = {
    /**
     * 渲染水平导航面板
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
        
        // 渲染导航分类
        safeData.forEach((category, catIndex) => {
            // 验证分类有效性
            if (!category || typeof category !== 'object') {
                console.warn('跳过无效分类数据:', category);
                return;
            }
            
            // 创建分类容器
            const categoryEl = document.createElement('div');
            categoryEl.className = 'nav-category';
            
            // 分类标题
            const titleEl = document.createElement('div');
            titleEl.className = 'nav-category-title';
            titleEl.textContent = category.title || `未命名分类${catIndex + 1}`;
            categoryEl.appendChild(titleEl);
            
            // 链接容器（横向排列）
            const linksContainer = document.createElement('div');
            linksContainer.className = 'nav-links';
            
            // 处理链接数据
            const links = Array.isArray(category.links) ? category.links : [];
            
            if (links.length === 0) {
                // 无链接时显示提示
                const noLinksEl = document.createElement('div');
                noLinksEl.className = 'category-empty';
                noLinksEl.textContent = '该分类暂无链接';
                linksContainer.appendChild(noLinksEl);
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
                    linksContainer.appendChild(linkEl);
                });
            }
            
            categoryEl.appendChild(linksContainer);
            container.appendChild(categoryEl);
        });
    }
};
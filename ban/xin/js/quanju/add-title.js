// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 查找顶部导航栏和搜索框容器
    const navbar = document.getElementById('top-navbar');
    const searchContainer = document.getElementById('search-container');
    
    // 确保元素存在
    if (!navbar || !searchContainer) {
        console.error('未找到导航栏或搜索框容器，无法添加标题');
        return;
    }
    
    // 创建标题元素
    const titleElement = document.createElement('div');
    titleElement.id = 'site-title';
    titleElement.textContent = '小牛搜索XnSs.Top';
    
    // 设置标题样式
    titleElement.style.cssText = `
        width: 100%;
        text-align: center;
        padding: 66px 0;
        font-size: 38px;
        font-weight: bold;
        color: var(--text-color);
        margin-top: 60px; /* 与顶部导航栏高度一致，避免重叠 */
    `;
    
    // 在导航栏之后、搜索框容器之前插入标题
    navbar.insertAdjacentElement('afterend', titleElement);
    
    // 调整搜索框容器位置，避免重叠
    searchContainer.style.marginTop = '20px';
});

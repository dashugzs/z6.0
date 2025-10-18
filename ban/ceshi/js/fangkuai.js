// 修改后的cs/js/fangkuai.js代码（配合解决遮挡问题）
// fangkuai.js
// 负责管理方块容器，提供添加子容器的接口

// 动态添加方块容器样式
function addFangkuaiStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* 方块容器样式 - 与搜索容器保持一致的宽度和毛玻璃效果 */
        .fangkuai-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            position: relative;
            z-index: 100; /* 低于搜索容器 */
        }
        
        .glass-container {
            background-color: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 10px;
            padding: 20px;
            display: flex;
            gap: 20px;
        }
    `;
    document.head.appendChild(style);
}

// 创建方块容器
function createFangkuaiContainer() {
    const searchContainer = document.querySelector('.search-container');
    if (!searchContainer) return null;
    
    // 创建方块容器（搜索框下方）
    const fangkuaiContainer = document.createElement('div');
    fangkuaiContainer.className = 'fangkuai-container';
    
    const glassContainer = document.createElement('div');
    glassContainer.className = 'glass-container';
    
    fangkuaiContainer.appendChild(glassContainer);
    
    // 添加到搜索容器下方，确保有足够间距避免重叠
    const contentPlaceholder = document.querySelector('.content-placeholder');
    if (contentPlaceholder) {
        contentPlaceholder.parentNode.insertBefore(fangkuaiContainer, contentPlaceholder.nextSibling);
    } else {
        // 添加额外的margin-top确保与搜索框保持距离
        fangkuaiContainer.style.marginTop = '20px';
        searchContainer.parentNode.insertBefore(fangkuaiContainer, searchContainer.nextSibling);
    }
    
    return glassContainer;
}

// 向方块容器添加子容器
function addToFangkuaiContainer(element, width) {
    const glassContainer = document.querySelector('.glass-container');
    if (!glassContainer || !element) return false;
    
    // 设置宽度
    if (width) {
        element.style.width = width;
    }
    
    glassContainer.appendChild(element);
    return true;
}

// 初始化方块容器
function initFangkuaiContainer() {
    addFangkuaiStyles();
    return createFangkuaiContainer();
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initFangkuaiContainer, 300); // 与搜索加载延迟一致
});

// 暴露接口供其他模块使用
window.fangkuai = {
    addToContainer: addToFangkuaiContainer
};

// navigationLoader.js
// 负责导航模块的加载和渲染，依赖fangkuai.js提供的容器

// 动态添加导航样式
function addNavigationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* 导航容器样式 - 占方块容器2/3宽度，左对齐 */
        .navigation-container {
            color: white;
            text-align: left;
        }
        
        .navigation-title {
            text-align: left;
            font-size: 18px;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .nav-category {
            margin-bottom: 20px;
        }
        
        .category-name {
            font-size: 16px;
            margin-bottom: 10px;
            text-align: left;
            color: rgba(255, 255, 255, 0.9);
        }
        
        .nav-links {
            display: flex;
            flex-wrap: wrap;
            gap: 9px;
        }
        
        .nav-link-item {
            width: calc(16.666% - 8px); /* 一行显示6个 */
            box-sizing: border-box;
        }
        
        .nav-link {
            display: block;
            padding: 6px 8px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            text-align: center;
            font-size: 12px;
            color: white;
            text-decoration: none;
            transition: all 0.2s ease;
        }
        
        .nav-link:hover {
            background-color: rgba(255, 103, 0, 0.8);
            transform: scale(1.05);
        }
        
        /* 右侧内容区样式 - 占方块容器1/3宽度 */
        .content-area {
            width: 33.333%;
        }
    `;
    document.head.appendChild(style);
}

// 创建导航容器
function createNavigationContainer() {
    // 创建左侧导航容器
    const navContainer = document.createElement('div');
    navContainer.className = 'navigation-container';
    
    const navTitle = document.createElement('div');
    navTitle.className = 'navigation-title';
    navTitle.textContent = '网址导航';
    
    const navContent = document.createElement('div');
    navContent.className = 'navigation-content';
    
    navContainer.appendChild(navTitle);
    navContainer.appendChild(navContent);
    
    // 创建右侧内容区
    const contentArea = document.createElement('div');
    contentArea.className = 'content-area';
    
    // 将导航容器添加到方块容器中，占2/3宽度
    window.fangkuai.addToContainer(navContainer, '66.666%');
    // 将右侧内容区添加到方块容器中，占1/3宽度
    window.fangkuai.addToContainer(contentArea, '33.333%');
    
    return navContent;
}

// 渲染导航数据
function renderNavigationData(navigationData, container) {
    if (!navigationData || !container) return;
    
    navigationData.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'nav-category';
        
        // 分类名称
        const categoryName = document.createElement('div');
        categoryName.className = 'category-name';
        categoryName.textContent = category.title;
        
        // 链接容器
        const linksDiv = document.createElement('div');
        linksDiv.className = 'nav-links';
        
        // 添加链接
        category.links.forEach(link => {
            const linkItem = document.createElement('div');
            linkItem.className = 'nav-link-item';
            
            const aTag = document.createElement('a');
            aTag.href = link.url;
            aTag.className = 'nav-link';
            aTag.textContent = link.name;
            aTag.target = link.target || '_blank';
            aTag.rel = link.rel || 'nofollow';
            
            linkItem.appendChild(aTag);
            linksDiv.appendChild(linkItem);
        });
        
        categoryDiv.appendChild(categoryName);
        categoryDiv.appendChild(linksDiv);
        container.appendChild(categoryDiv);
    });
}

// 加载导航数据
function loadNavigationData(container) {
    // 与搜索模块使用相同的数据源
    const dataUrl = 'https://shuju.xnss.fun/default';
    const timeoutTimer = setTimeout(() => {
        container.innerHTML = '<p style="text-align: center; padding: 20px;">导航数据加载超时</p>';
    }, 10000);

    fetch(dataUrl)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
            return response.text();
        })
        .then(scriptContent => {
            clearTimeout(timeoutTimer);
            // 处理脚本内容，确保变量作用域正确
            const modifiedScript = `${scriptContent}\nwindow.appData = appData;`;
            
            const blob = new Blob([modifiedScript], { type: 'text/javascript' });
            const blobUrl = URL.createObjectURL(blob);

            const script = document.createElement('script');
            script.src = blobUrl;
            script.onload = function() {
                URL.revokeObjectURL(blobUrl);
                // 验证数据结构
                if (window.appData && 
                    window.appData.hasOwnProperty('navigationData') && 
                    Array.isArray(window.appData.navigationData)) {
                    renderNavigationData(window.appData.navigationData, container);
                } else {
                    container.innerHTML = `
                        <p style="text-align: center; padding: 20px;">
                            导航数据格式错误<br>
                            预期结构: { navigationData: [...] }
                        </p>
                    `;
                }
            };
            script.onerror = function() {
                container.innerHTML = '<p style="text-align: center; padding: 20px;">导航脚本解析失败</p>';
            };
            document.head.appendChild(script);
        })
        .catch(error => {
            clearTimeout(timeoutTimer);
            console.error('导航数据加载失败:', error);
            container.innerHTML = `<p style="text-align: center; padding: 20px;">加载失败: ${error.message}</p>`;
        });
}

// 初始化导航功能
function initNavigation() {
    addNavigationStyles();
    // 等待fangkuai容器初始化完成
    const checkContainer = setInterval(() => {
        if (window.fangkuai && document.querySelector('.glass-container')) {
            clearInterval(checkContainer);
            const navContentContainer = createNavigationContainer();
            if (navContentContainer) {
                loadNavigationData(navContentContainer);
            }
        }
    }, 100);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initNavigation, 350); // 稍晚于方块容器初始化
});

// 动态创建顶部导航条
document.addEventListener('DOMContentLoaded', function() {
    // 创建导航条容器
    const navbar = document.createElement('div');
    navbar.id = 'top-navbar';
    navbar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 60px;
        background: var(--search-bg-light);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        box-shadow: var(--search-shadow-light);
        z-index: 90; /* 确保在弹出面板下方 */
        display: flex;
        align-items: center;
        padding: 0 20px;
        box-sizing: border-box;
    `;
    
    // 适配夜间模式
function updateDarkMode() {
    if (document.documentElement.classList.contains('dark-mode')) {
        // 夜间模式固定样式
        navbar.style.background = 'rgba(30, 31, 33, 0.8)';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.webkitBackdropFilter = 'blur(10px)';
    } else {
        // 日间模式固定样式
        navbar.style.background = 'rgba(255,255,255,0.83)';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.webkitBackdropFilter = 'blur(10px)';
    }
}
    
    // 初始检查夜间模式
    updateDarkMode();
    
    // 监听夜间模式变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                updateDarkMode();
            }
        });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    // 创建logo容器
    const logoContainer = document.createElement('a');
    logoContainer.href = './index.html';
    logoContainer.style.display = 'flex';
    logoContainer.style.alignItems = 'center';
    logoContainer.style.height = '100%';
    logoContainer.style.marginRight = '10px';
    
    // 添加logo图片
    const logoImg = document.createElement('img');
    logoImg.src = 'https://img.alicdn.com/imgextra/i3/2327995847/O1CN01fhXl2q1t3yYaZYRnO_!!2327995847.png';
    logoImg.alt = '小牛搜索logo';
    logoImg.style.height = '50px';
    logoImg.style.width = 'auto';
    logoImg.style.marginRight = '10px';
    
    // 创建文字容器
    const textContainer = document.createElement('div');
    textContainer.style.height = '40px';
    textContainer.style.display = 'flex';
    textContainer.style.flexDirection = 'column';
    textContainer.style.justifyContent = 'center';
    textContainer.style.color = 'var(--text-color)';
    
    // 第一行文字
    const line1 = document.createElement('div');
    line1.textContent = '小牛搜索';
    line1.style.fontSize = '18px';
    line1.style.fontWeight = 'bold';
    line1.style.textAlign = 'center';
    
    // 第二行文字
    const line2 = document.createElement('div');
    line2.textContent = '勇敢牛牛 不怕困难';
    line2.style.fontSize = '12px';
    line2.style.textAlign = 'center';
    
    // 计算并设置文字宽度，确保两行总宽度一致
    textContainer.appendChild(line1);
    textContainer.appendChild(line2);
    
    // 等待文字渲染后设置宽度
    setTimeout(() => {
        const line1Width = line1.offsetWidth;
        line2.style.width = `${line1Width}px`;
        line2.style.marginLeft = 'auto';
        line2.style.marginRight = 'auto';
    }, 0);
    
    // 组装logo区域
    logoContainer.appendChild(logoImg);
    logoContainer.appendChild(textContainer);
    navbar.appendChild(logoContainer);
    
    // 创建中间5个导航项容器
    const middleNav = document.createElement('div');
    middleNav.style.display = 'flex';
    middleNav.style.marginLeft = '20px';
    middleNav.style.flexGrow = '1';
    
    // 添加5个预留导航项
    const leftNavItems = [
        { text: '小牛书签', url: 'https://b.xiaoniuss.top/' },
        { text: '小牛插件', url: 'https://c.xiaoniuss.top/' },
        { text: '视频解析', url: 'https://v.xiaoniuss.top/' },
        { text: '小牛TV', url: 'https://tv.xiaoniuss.top' },
        { text: '运营官1号', url: 'https://xydh.fun/guoxiaohan' },
        { text: '代码工具', url: 'https://c.xiaoniuss.top/bjq/' },
        { text: '色值选择', url: 'https://c.xiaoniuss.top/ys/' }
    ];
    // 创建左侧导航项
    leftNavItems.forEach(item => {
        const navItem = document.createElement('a');
        navItem.href = item.url;
        navItem.textContent = item.text;
        navItem.rel = 'nofollow';
        navItem.target = '_blank'; // 新窗口打开
        navItem.style.margin = '0 10px';
        navItem.style.color = 'var(--text-color)';
        navItem.style.textDecoration = 'none';
        navItem.style.whiteSpace = 'nowrap';
        navItem.style.fontSize = '14px'; // 减小文字大小
        middleNav.appendChild(navItem);
    });
    navbar.appendChild(middleNav);
    
    // 创建右侧3个导航项容器
    const rightNav = document.createElement('div');
    rightNav.style.display = 'flex';
    rightNav.style.marginLeft = 'auto';
    
    // 添加3个预留导航项
    const rightNavItems = [
        { text: '豆包AI', url: 'https://www.doubao.com/' },
        { text: '文心一言', url: 'https://yiyan.baidu.com/' },
        { text: 'DeepSeek', url: 'https://www.deepseek.com/en' }
    ];
    // 创建右侧导航项
    rightNavItems.forEach(item => {
        const navItem = document.createElement('a');
        navItem.href = item.url;
        navItem.textContent = item.text;
        navItem.rel = 'nofollow';
        navItem.target = '_blank'; // 新窗口打开
        navItem.style.margin = '0 10px';
        navItem.style.color = 'var(--text-color)';
        navItem.style.textDecoration = 'none';
        navItem.style.whiteSpace = 'nowrap';
        navItem.style.fontSize = '14px'; // 减小文字大小
        rightNav.appendChild(navItem);
    });   
    navbar.appendChild(rightNav);
    
    // 将导航条添加到页面
    document.body.prepend(navbar);
    
    // 调整搜索框位置，避免被导航条遮挡
    const searchContainer = document.getElementById('search');
    if (searchContainer) {
        searchContainer.style.top = 'calc(20% + 10px)'; // 原top值加上导航条高度
    }
});

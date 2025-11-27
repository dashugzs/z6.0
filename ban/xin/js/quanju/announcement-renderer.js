// 全局变量
let currentIndex = 0;
let carouselTimer = null;
let animationDuration = 600;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initAnnouncementCarousel();
    }, 200);
});

/**
 * 初始化公告轮播
 */
function initAnnouncementCarousel() {
    // 数据校验
    if (!announcementData?.carousel || announcementData.carousel.length === 0) {
        console.warn('公告轮播数据为空');
        return;
    }

    // 获取容器位置
    const searchContainer = document.getElementById('search-container');
    const categoryTabs = document.getElementById('category-tabs-container');
    if (!searchContainer) return;

    // 创建公告栏容器
    const announcementEl = createAnnouncementContainer();
    // 插入到搜索框下方
    if (categoryTabs) {
        searchContainer.parentNode.insertBefore(announcementEl, categoryTabs);
    } else {
        searchContainer.after(announcementEl);
    }

    // 渲染初始公告
    renderAnnouncementItem(currentIndex);
    
    // 启动轮播（多条时才开启）
    if (announcementData.carousel.length > 1) {
        startCarousel();
    }
}

/**
 * 创建公告栏DOM容器（包含固定标题）
 */
function createAnnouncementContainer() {
    const container = document.createElement('div');
    container.id = 'announcement-container';
    
    // 添加固定的"公告："标题
    const label = document.createElement('span');
    label.className = 'announcement-label';
    label.textContent = '公告：';
    container.appendChild(label);
    
    // 应用动画类型配置
    const config = announcementData.carouselConfig || {};
    animationDuration = config.animationDuration || 600;
    
    if (config.animationType === 'slide') {
        container.classList.add('slide-mode');
    }
    
    // 设置CSS变量
    container.style.setProperty('--animation-duration', `${animationDuration}ms`);
    
    return container;
}

/**
 * 渲染单条公告（带滚动效果）
 */
function renderAnnouncementItem(index) {
    const container = document.getElementById('announcement-container');
    if (!container) return;

    // 清除现有轮播内容（保留标题）
    const existingCarousel = container.querySelector('.announcement-carousel');
    if (existingCarousel) {
        existingCarousel.remove();
    }

    // 获取当前公告数据
    const item = announcementData.carousel[index];
    const carouselItem = document.createElement('div');
    carouselItem.className = 'announcement-carousel active';

    // 构建滚动内容容器
    const scrollContent = document.createElement('div');
    scrollContent.className = 'announcement-scroll-content';

    // 构建文本滚动容器
    const textWrapper = document.createElement('div');
    textWrapper.className = 'announcement-text-wrapper';

    // 构建内容
    let content = `<span class="announcement-text">${item.text}</span>`;
    if (item.link) {
        // 新增逻辑：判断是否为网页链接（http/https开头），默认新标签打开
        const isWebLink = item.link.startsWith('http://') || item.link.startsWith('https://');
        // 优先使用item.target，若无则根据是否为网页链接决定默认值
        const target = item.target || (isWebLink ? '_blank' : '_self');
        
        content += `<a href="${item.link}" class="announcement-link" target="${target}">
            ${item.linkText || '查看'}
        </a>`;
    }

    textWrapper.innerHTML = content;
    scrollContent.appendChild(textWrapper);
    carouselItem.appendChild(scrollContent);
    container.appendChild(carouselItem);

    // 判断断文本长度，短文本不滚动
    checkTextLength(textWrapper);
}

/**
 * 检查文本长度，短文本禁用滚动
 */
function checkTextLength(wrapper) {
    const container = document.getElementById('announcement-container');
    const containerWidth = container.offsetWidth - 60; // 减去标题宽度
    const contentWidth = wrapper.offsetWidth;
    
    if (contentWidth <= containerWidth) {
        wrapper.classList.add('short-text');
    }
}

/**
 * 启动轮播定时器
 */
function startCarousel() {
    // 清除现有定时器
    stopCarousel();

    const interval = announcementData.carouselConfig?.interval || 3000;
    carouselTimer = setInterval(() => {
        // 隐藏当前项
        const currentItem = document.querySelector('.announcement-carousel.active');
        if (currentItem) {
            currentItem.classList.remove('active');
        }

        // 计算下一个索引
        currentIndex = (currentIndex + 1) % announcementData.carousel.length;

        // 延迟渲染（匹配动画时长）
        setTimeout(() => {
            renderAnnouncementItem(currentIndex);
        }, animationDuration);
    }, interval);
}

/**
 * 停止轮播
 */
function stopCarousel() {
    if (carouselTimer) {
        clearInterval(carouselTimer);
        carouselTimer = null;
    }
}

/**
 * 页面卸载时清理
 */
window.addEventListener('beforeunload', () => {
    stopCarousel();
});
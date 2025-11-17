// 隐藏链接悬停时左下角显示的URL
document.addEventListener('DOMContentLoaded', function() {
    // 处理所有现有链接
    processLinks();
    
    // 监听DOM变化，处理动态添加的链接
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === 1) { // 元素节点
                    processLinks(node);
                }
            });
        });
    });
    
    // 配置观察器
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // 处理链接的核心函数
    function processLinks(context) {
        const container = context || document;
        const links = container.querySelectorAll('a');
        
        links.forEach(link => {
            // 已经处理过的链接不再重复处理
            if (link.dataset.processed) return;
            link.dataset.processed = 'true';
            
            // 保存原始链接
            const originalHref = link.href;
            const originalTarget = link.target;
            
            // 移除href属性以阻止浏览器默认显示
            link.removeAttribute('href');
            // 存储链接信息到data属性
            link.dataset.href = originalHref;
            if (originalTarget) {
                link.dataset.target = originalTarget;
            }
            
            // 添加点击事件实现跳转
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.dataset.href;
                const target = this.dataset.target || '_self';
                
                if (href) {
                    if (target === '_blank') {
                        window.open(href, '_blank');
                    } else {
                        window.location.href = href;
                    }
                }
            });
            
            // 保留悬停效果（如果有CSS定义）
            link.style.cursor = 'pointer';
        });
    }
});

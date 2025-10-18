document.addEventListener('DOMContentLoaded', function() {
    // 创建星星容器
    function createStarsContainer() {
        const container = document.createElement('div');
        container.className = 'stars-container';
        document.body.insertBefore(container, document.body.firstChild);
        return container;
    }

    // 创建星星
    function createStars() {
        const container = createStarsContainer();
        const starCount = 250;
        const sizes = ['small', 'medium', 'large'];
        const sizeWeights = [0.4, 0.35, 0.25];
        
        // 存储所有星星DOM，用于后续互动计算
        const stars = [];
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            // 按权重选择大小
            let size;
            const rand = Math.random();
            if (rand < sizeWeights[0]) {
                size = sizes[0];
            } else if (rand < sizeWeights[0] + sizeWeights[1]) {
                size = sizes[1];
            } else {
                size = sizes[2];
            }
            star.classList.add(size);
            
            // 随机位置
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            star.style.left = `${left}%`;
            star.style.top = `${top}%`;
            
            // 存储星星位置信息（百分比）
            star.dataset.left = left;
            star.dataset.top = top;
            
            // 随机动画参数
            const delay = Math.random() * 15;
            star.style.animationDelay = `${delay}s`;
            const directions = ['normal', 'reverse', 'alternate', 'alternate-reverse'];
            star.style.animationDirection = directions[Math.floor(Math.random() * directions.length)];
            
            container.appendChild(star);
            stars.push(star);
        }

        // 添加鼠标互动逻辑
        addMouseInteraction(container, stars);
    }

    // 鼠标互动核心逻辑
    function addMouseInteraction(container, stars) {
        // 互动范围（像素）- 可调整灵敏度
        const interactionRadius = 120;
        
        // 监听鼠标移动
        container.addEventListener('mousemove', (e) => {
            // 获取鼠标在视口中的坐标
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // 遍历星星，计算距离
            stars.forEach(star => {
                // 将星星的百分比位置转换为像素位置
                const starX = (parseFloat(star.dataset.left) / 100) * viewportWidth;
                const starY = (parseFloat(star.dataset.top) / 100) * viewportHeight;
                
                // 计算鼠标与星星的直线距离
                const distance = Math.sqrt(
                    Math.pow(mouseX - starX, 2) + 
                    Math.pow(mouseY - starY, 2)
                );
                
                // 根据距离添加/移除互动效果
                if (distance < interactionRadius) {
                    star.classList.add('interactive');
                    // 距离越近，放大效果越强（可选增强）
                    const scale = 1.8 - (distance / interactionRadius) * 0.5;
                    star.style.transform = `scale(${scale})`;
                } else {
                    star.classList.remove('interactive');
                    star.style.transform = ''; // 恢复原有动画的transform
                }
            });
        });

        // 鼠标离开容器时移除所有互动效果
        container.addEventListener('mouseleave', () => {
            stars.forEach(star => {
                star.classList.remove('interactive');
                star.style.transform = '';
            });
        });
    }

    createStars();
});
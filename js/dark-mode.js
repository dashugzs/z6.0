document.addEventListener('DOMContentLoaded', function() {
    // 检查系统/浏览器的暗色模式偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 检查本地存储的用户偏好
    const savedMode = localStorage.getItem('darkMode');
    
    // 时间判断函数 (19:00-6:00 自动切换夜间模式)
    function isNightTime() {
        const hour = new Date().getHours();
        return hour >= 19 || hour < 6;
    }
    
    // 初始化夜间模式
    function initDarkMode() {
        // 优先级: 本地存储 > 系统偏好 > 时间判断
        if (savedMode === 'true' || 
            (savedMode === null && prefersDark) || 
            (savedMode === null && !prefersDark && isNightTime())) {
            document.body.classList.add('dark-mode');
        }
        // 初始化图标显示
        updateModeIcon();
    }
    
    // 切换夜间模式
    function toggleDarkMode() {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDark);
        // 更新图标显示
        updateModeIcon();
    }
    
    // 更新模式图标（月亮/太阳）
    function updateModeIcon() {
        const icon = document.getElementById('modeIcon');
        if (icon) {
            if (document.body.classList.contains('dark-mode')) {
                icon.className = 'iconfont icon-sun'; // 夜间模式显示太阳（表示可切换到日间）
            } else {
                icon.className = 'iconfont icon-moon'; // 日间模式显示月亮（表示可切换到夜间）
            }
        }
    }
    
    // 绑定文字点击事件
    function bindTextToggleEvent() {
        const toggleText = document.getElementById('modeToggleText');
        if (toggleText) {
            toggleText.addEventListener('click', toggleDarkMode);
        }
    }
    
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('darkMode')) { // 如果用户没有手动设置过
            if (e.matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
            updateModeIcon(); // 同步更新图标
        }
    });
    
    // 初始化
    initDarkMode();
    bindTextToggleEvent(); // 绑定点击文字切换模式的事件
});
// 公告内容数据
const announcementData = {
    // 轮播公告列表（支持多条切换）
    carousel: [
        {
            text: "欢迎使用小牛搜索！最新上线了自定义壁纸功能，点击右上侧设置按钮快来体验吧！",
            link: null//"#settings-button",
            //linkText:  "立即体验"
        },
        {
            text: "建议设置浏览器或设备系统为深色模式或夜间模式，页面体验更佳！",
            link: null
        },
        {
            text: "小牛TV影视工具已经上线，可搜索全网热门影视资源快来体验吧！",
            link: "https://tv.xiaoniuss.top/",
            linkText: "点击进入"
        },
        {
            text: "现在支持导入/导出自定义导航数据，数据备份更方便！点击右上侧设置按钮快来体验吧！",
            link: null// "#button-text",
            //linkText: "了解详情"
        }
    ],
    // 轮播配置
    carouselConfig: {
        interval: 3000, // 切换间隔（毫秒）
        animationDuration: 600, // 动画过渡时长（毫秒）
        animationType: "fade" // 动画类型：fade（淡入淡出）/slide（上下滑动）
    },
    // 历史公告（备用）
    history: [
        {
            text: "系统已完成升级，性能提升30%",
            link: null
        },
        {
            text: "新增多个实用工具入口",
            link: "#tools",
            linkText: "查看工具"
        }
    ]
};
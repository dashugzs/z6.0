// 导航工具函数 - 只包含逻辑，不包含数据
const NavigationUtils = {
  /**
   * 生成导航HTML并插入到指定容器
   * @param {string} containerSelector - 容器的CSS选择器
   * @param {Array} data - 导航数据数组
   */
  generateNavigation: function(containerSelector, data) {
    const navContainer = document.querySelector(containerSelector);
    if (!navContainer) {
      console.error('导航容器未找到:', containerSelector);
      return;
    }
    
    // 确保数据是数组
    const safeData = Array.isArray(data) ? data : [];
    
    // 清空现有内容
    navContainer.innerHTML = '';
    
    // 如果没有数据，显示提示信息
    if (safeData.length === 0) {
      const emptyMsg = document.createElement('li');
      emptyMsg.className = 'empty-message';
      emptyMsg.textContent = '暂无导航数据';
      emptyMsg.style.textAlign = 'center';
      emptyMsg.style.padding = '20px';
      navContainer.appendChild(emptyMsg);
      return;
    }
    
    // 遍历导航数据生成HTML
    safeData.forEach((category, catIndex) => {
      // 验证分类数据有效性
      if (!category || typeof category !== 'object') {
        console.warn('无效的导航分类数据，已跳过', category);
        return;
      }
      
      // 创建分类标题
      const titleLi = document.createElement('li');
      titleLi.className = 'title';
      titleLi.textContent = category.title || `未命名分类${catIndex + 1}`;
      navContainer.appendChild(titleLi);
      
      // 确保links是数组
      const links = Array.isArray(category.links) ? category.links : [];
      
      // 如果分类没有链接，显示提示
      if (links.length === 0) {
        const noLinksMsg = document.createElement('li');
        noLinksMsg.className = 'no-links';
        noLinksMsg.textContent = '该分类暂无链接';
        noLinksMsg.style.color = '#888';
        noLinksMsg.style.padding = '5px 0 15px 10px';
        navContainer.appendChild(noLinksMsg);
        return;
      }
      
      // 创建链接列表
      links.forEach((link, linkIndex) => {
        // 验证链接数据有效性
        if (!link || typeof link !== 'object') {
          console.warn(`分类 ${catIndex} 中的无效链接数据，已跳过`, link);
          return;
        }
        
        const linkLi = document.createElement('li');
        // 为链接添加默认属性以防数据不完整
        const rel = link.rel || "nofollow";
        const target = link.target || "_blank";
        const url = link.url || "#";
        const name = link.name || `未命名链接${linkIndex + 1}`;
        
        linkLi.innerHTML = `
          <a rel="${rel}" href="${url}" target="${target}">
            ${name}
          </a>
        `;
        navContainer.appendChild(linkLi);
      });
    });
  },
  
  /**
   * 初始化导航
   */
  init: function() {
    // 双重检查导航数据
    if (typeof navigationData !== 'undefined') {
      if (Array.isArray(navigationData)) {
        this.generateNavigation('.list ul', navigationData);
      } else {
        console.error('导航数据格式错误，应为数组');
        // 使用默认数据
        this.generateNavigation('.list ul', [
          {
            title: "默认导航",
            links: [
              { name: "百度", url: "https://www.baidu.com", rel: "nofollow", target: "_blank" },
              { name: "谷歌", url: "https://www.google.com", rel: "nofollow", target: "_blank" }
            ]
          }
        ]);
      }
    } else {
      console.warn('导航数据未加载，尝试从缓存获取');
      // 尝试从本地缓存获取
      try {
        const navBackup = localStorage.getItem('navDataBackup');
        if (navBackup) {
          const backupData = JSON.parse(navBackup);
          if (Array.isArray(backupData)) {
            window.navigationData = backupData;
            this.generateNavigation('.list ul', backupData);
            return;
          }
        }
      } catch (e) {
        console.error('从缓存恢复导航数据失败:', e);
      }
      
      // 使用默认数据作为最后的 fallback
      this.generateNavigation('.list ul', [
        {
          title: "默认导航",
          links: [
            { name: "百度", url: "https://www.baidu.com", rel: "nofollow", target: "_blank" },
            { name: "谷歌", url: "https://www.google.com", rel: "nofollow", target: "_blank" }
          ]
        }
      ]);
    }
  },
  
  /**
   * 添加新的导航分类
   * @param {Object} category - 新分类对象
   */
  addCategory: function(category) {
    if (typeof navigationData !== 'undefined' && category && category.title) {
      // 确保导航数据是数组
      if (!Array.isArray(navigationData)) {
        navigationData = [];
      }
      // 验证分类数据
      const safeCategory = {
        title: category.title,
        links: Array.isArray(category.links) ? category.links : []
      };
      navigationData.push(safeCategory);
      this.generateNavigation('.list ul', navigationData);
      // 更新缓存
      try {
        localStorage.setItem('navDataBackup', JSON.stringify(navigationData));
        localStorage.setItem('navDataTimestamp', Date.now().toString());
      } catch (e) {
        console.error('添加分类后更新缓存失败:', e);
      }
    }
  },
  
  /**
   * 更新导航数据并重新渲染
   * @param {Array} newData - 新的导航数据
   */
  updateNavigation: function(newData) {
    // 验证新数据
    const safeData = Array.isArray(newData) ? newData : [];
    // 替换全局导航数据
    window.navigationData = safeData;
    this.generateNavigation('.list ul', safeData);
    // 更新缓存
    try {
      localStorage.setItem('navDataBackup', JSON.stringify(safeData));
      localStorage.setItem('navDataTimestamp', Date.now().toString());
    } catch (e) {
      console.error('更新导航数据后更新缓存失败:', e);
    }
  }
};

// 页面加载完成后初始化导航
document.addEventListener('DOMContentLoaded', function() {
  NavigationUtils.init();
});
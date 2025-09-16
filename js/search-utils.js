// 搜索工具函数 - 只包含逻辑，不包含数据
const SearchUtils = {
  /**
   * 生成搜索选项HTML并插入到指定容器
   */
  renderSearchOptions: function() {
    const searchList = document.getElementById('search-list');
    const form = document.getElementById('super-search-fm');
    const typeText = document.querySelector('.type-text');
    
    if (!searchList || !form || !typeText || !window.searchData || !Array.isArray(window.searchData)) return;
    
    // 清空现有内容（保留原始结构）
    const originalSType = searchList.querySelector('.s-type');
    const existingGroups = searchList.querySelectorAll('.search-group');
    existingGroups.forEach(group => group.remove());
    
    // 确保分类选择器存在
    let typeContainer;
    if (originalSType) {
      typeContainer = originalSType;
      typeContainer.querySelector('.s-type-list').innerHTML = '';
    } else {
      typeContainer = document.createElement('div');
      typeContainer.className = 's-type';
      
      const typeSpan = document.createElement('span');
      typeSpan.className = 'type-text';
      
      const typeList = document.createElement('div');
      typeList.className = 's-type-list animated fadeInUp';
      
      typeContainer.appendChild(typeSpan);
      typeContainer.appendChild(typeList);
      searchList.appendChild(typeContainer);
    }

    const typeSpan = typeContainer.querySelector('.type-text');
    const typeList = typeContainer.querySelector('.s-type-list');
    
    // 生成分类选项
    window.searchData.forEach((group, groupIndex) => {
      const groupLabel = document.createElement('label');
      groupLabel.setAttribute('for', group.id);
      groupLabel.textContent = group.title || `分类${groupIndex + 1}`;
      groupLabel.addEventListener('click', () => {
        this.showGroup(groupIndex);
        // 更新显示的分类名称
        typeSpan.textContent = group.title || `分类${groupIndex + 1}`;
      });
      typeList.appendChild(groupLabel);
    });
    
    // 生成搜索组
    window.searchData.forEach((group, groupIndex) => {
      const searchGroup = document.createElement('div');
      searchGroup.className = `search-group ${groupIndex === 0 ? 's-current' : ''}`;
      searchGroup.id = group.id;
      
      const typeUl = document.createElement('ul');
      typeUl.className = 'search-type';
      
      // 生成搜索引擎选项
      if (group.options && Array.isArray(group.options)) {
        group.options.forEach((option, optionIndex) => {
          const optionId = option.id || `type-${groupIndex}-${optionIndex}`;
          const isChecked = option.checked || (groupIndex === 0 && optionIndex === 0);
          
          const li = document.createElement('li');
          li.innerHTML = `
            <input type="radio" name="search-type" id="${optionId}" value="${option.value}" ${isChecked ? 'checked' : ''}>
            <label for="${optionId}">${option.name || `搜索${optionIndex + 1}`}</label>
          `;
          
          // 设置默认选中项的占位符
          if (isChecked) {
            document.getElementById('search-text').placeholder = option.placeholder || '输入搜索内容';
            form.action = option.value;
            if (groupIndex === 0) {
              typeSpan.textContent = group.title || `分类${groupIndex + 1}`;
            }
          }
          
          // 添加点击事件
          li.querySelector('input').addEventListener('change', (e) => {
            document.getElementById('search-text').placeholder = option.placeholder || '输入搜索内容';
            form.action = e.target.value;
          });
          
          typeUl.appendChild(li);
        });
      }
      
      searchGroup.appendChild(typeUl);
      searchList.appendChild(searchGroup);
    });
  },
  
  /**
   * 显示指定的搜索组
   * @param {number} groupIndex - 组索引
   */
  showGroup: function(groupIndex) {
    if (!window.searchData || !Array.isArray(window.searchData) || !window.searchData[groupIndex]) return;
    
    // 隐藏所有组
    document.querySelectorAll('.search-group').forEach(group => {
      group.classList.remove('s-current');
    });
    
    // 显示选中组
    const targetGroup = document.getElementById(window.searchData[groupIndex].id);
    if (targetGroup) {
      targetGroup.classList.add('s-current');
      
      // 自动选择该分类下的第一个搜索引擎
      const firstRadio = targetGroup.querySelector('input[type="radio"]');
      const form = document.getElementById('super-search-fm');
      const searchText = document.getElementById('search-text');
      
      if (firstRadio && form && searchText) {
        // 获取第一个搜索引擎的配置
        const firstOption = window.searchData[groupIndex].options[0];
        
        // 选中第一个选项
        firstRadio.checked = true;
        
        // 更新搜索框占位符
        searchText.placeholder = firstOption.placeholder || '输入搜索内容';
        
        // 更新表单提交地址
        form.action = firstOption.value;
      }
    }
  },
  
  /**
   * 设置搜索事件监听器
   */
  setupEventListeners: function() {
    const form = document.getElementById('super-search-fm');
    const searchText = document.getElementById('search-text');
    
    if (!form || !searchText) return;
    
    // 搜索框焦点事件
    searchText.addEventListener('focus', () => {
      document.getElementById('search-list').classList.remove('hide-type-list');
    });
    
    // 点击页面其他地方隐藏搜索类型列表
    document.addEventListener('click', (e) => {
      const searchContainer = document.getElementById('search');
      if (!searchContainer.contains(e.target)) {
        document.getElementById('search-list').classList.add('hide-type-list');
      }
    });
    
    // 阻止搜索列表内部点击事件冒泡
    document.getElementById('search-list').addEventListener('click', (e) => {
      e.stopPropagation();
    });
  },
  
  /**
   * 初始化搜索功能
   */
  init: function() {
    // 延迟初始化，等待远程数据加载
    const checkData = setInterval(() => {
      if (typeof window.searchData !== 'undefined' && Array.isArray(window.searchData) && window.searchData.length > 0) {
        clearInterval(checkData);
        this.renderSearchOptions();
        this.setupEventListeners();
      }
    }, 100); // 每100ms检查一次数据是否加载完成
    
    // 超时保护（5秒后如果还没数据则使用默认结构）
    setTimeout(() => {
      if (!window.searchData || !Array.isArray(window.searchData) || window.searchData.length === 0) {
        clearInterval(checkData);
        console.warn('搜索数据未加载，使用默认UI结构');
        this.renderSearchOptions(); // 即使没有数据也渲染基础UI
        this.setupEventListeners();
      }
    }, 5000);
  }
};

// 页面加载完成后初始化搜索功能
document.addEventListener('DOMContentLoaded', function() {
  SearchUtils.init();
});
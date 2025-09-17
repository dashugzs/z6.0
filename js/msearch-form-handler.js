/**
 * 搜索表单提交处理逻辑
 * 负责搜索框提交验证和跳转
 */
const SearchFormHandler = {
  /**
   * 初始化搜索表单事件监听
   */
  init() {
    // 等待DOM加载完成
    document.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('super-search-fm');
      if (form) {
        form.addEventListener('submit', (e) => this.handleSubmit(e));
      } else {
        console.warn('未找到搜索表单，搜索功能无法初始化');
      }
    });
  },

  /**
   * 处理表单提交逻辑
   * @param {Event} e - 提交事件对象
   */
  handleSubmit(e) {
    // 检查搜索数据是否加载
    if (!window.searchData || window.searchData.length === 0) {
      e.preventDefault();
      alert('搜索数据未加载完成，请稍候再试');
      return false;
    }

    // 验证搜索输入
    const searchInput = document.getElementById('search-text');
    if (!searchInput) {
      e.preventDefault();
      console.error('未找到搜索输入框');
      return false;
    }

    const searchText = searchInput.value.trim();
    if (!searchText) {
      e.preventDefault();
      searchInput.focus();
      return false;
    }

    // 处理选中的搜索引擎
    const activeOption = document.querySelector('input[name="search-type"]:checked');
    if (activeOption) {
      e.preventDefault();
      try {
        const url = activeOption.value + encodeURIComponent(searchText);
        window.open(url, '_blank');
      } catch (err) {
        console.error('搜索跳转失败:', err);
        alert('搜索功能异常，请重试');
      }
      return false;
    }

    return true;
  }
};

// 初始化处理
SearchFormHandler.init();
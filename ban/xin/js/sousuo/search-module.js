// 搜索数据 (从ss.js迁移)
const searchData = [
  {
    "id": "group-a",
    "title": "常用",
    "options": [
      {
        "id": "type-baidu",
        "value": "https://www.baidu.com/s?wd=",
        "placeholder": "百度一下 点击左上角常用》按钮可切换搜索源",
        "name": "百度",
        "checked": true
      },
      {
        "id": "type-google",
        "value": "https://m.xnss.fun/mima/",
        "placeholder": "输入密令",
        "name": "蜜码"
      },
      {
        "id": "type-taobao",
        "value": "https://s.taobao.com/search?q=",
        "placeholder": "输入商品的名字关键词",
        "name": "淘宝"
      },
      {
        "id": "type-bing1",
        "value": "https://search.jd.com/Search?keyword=",
        "placeholder": "输入商品的名字关键词",
        "name": "京东"
      },
      {
        "id": "type-jiexi8",
        "value": "https://www.nmme.xyz/s/1/",
        "placeholder": "输入视频网址或电影名字",
        "name": "橘子盘搜"
      },
      {
        "id": "type-wangpan",
        "value": "https://www.alipansou.com/search?k=",
        "placeholder": "输入电视电影资源名字",
        "name": "猫狸盘搜"
      },
      {
        "id": "type-wangpan7",
        "value": "https://music.163.com/#/search/m/?s=",
        "placeholder": "输入音乐的名字",
        "name": "网易云"
      }
    ]
  },
  {
    "id": "group-b",
    "title": "搜索",
    "options": [
      {
        "id": "type-search",
        "value": "https://www.baidu.com/s?wd=",
        "placeholder": "百度一下",
        "name": "百度"
      },
      {
        "id": "type-google2",
        "value": "https://m.xnss.fun/mima/",
        "placeholder": "输入密令",
        "name": "蜜码"
      },
      {
        "id": "type-360",
        "value": "https://www.so.com/s?q=",
        "placeholder": "360好搜",
        "name": "360"
      },
      {
        "id": "type-sogo",
        "value": "https://www.sogou.com/web?query=",
        "placeholder": "搜狗搜索",
        "name": "搜狗"
      },
      {
        "id": "type-bing",
        "value": "https://cn.bing.com/search?q=",
        "placeholder": "微软Bing搜索",
        "name": "Bing"
      },
      {
        "id": "type-sm",
        "value": "https://yz.m.sm.cn/s?q=",
        "placeholder": "UC移动端搜索",
        "name": "神马"
      }
    ]
  },
  {
    "id": "group-c",
    "title": "音视",
    "options": [
      {
        "id": "type-wangpan1",
        "value": "https://music.163.com/#/search/m/?s=",
        "placeholder": "输入音乐的名字",
        "name": "网易云"
      },
      {
        "id": "type-wangpan8",
        "value": "https://y.qq.com/n/ryqq/search?searchid=1&remoteplace=txt.yqq.top&w=",
        "placeholder": "输入音乐的名字",
        "name": "qq音乐"
      },
      {
        "id": "type-wangpan2",
        "value": "https://search.bilibili.com/all?keyword=",
        "placeholder": "输入电视电影资源名字",
        "name": "bilibili"
      },
      {
        "id": "type-wangpan3",
        "value": "https://v.qq.com/x/search/?q=",
        "placeholder": "输入电视电影资源名字",
        "name": "腾讯"
      },
      {
        "id": "type-wangpan4",
        "value": "https://so.iqiyi.com/so/q_",
        "placeholder": "输入电视电影资源名字",
        "name": "爱奇艺"
      }
    ]
  },
  {
    "id": "group-d",
    "title": "社区",
    "options": [
      {
        "id": "type-zhihu",
        "value": "https://www.zhihu.com/search?type=content&amp;q=",
        "placeholder": "知乎",
        "name": "知乎"
      },
      {
        "id": "type-wechat",
        "value": "http://weixin.sogou.com/weixin?type=2&amp;query=",
        "placeholder": "微信",
        "name": "微信"
      },
      {
        "id": "type-weibo",
        "value": "http://s.weibo.com/weibo/",
        "placeholder": "微博",
        "name": "微博"
      },
      {
        "id": "type-douban",
        "value": "https://www.douban.com/search?q=",
        "placeholder": "豆瓣",
        "name": "豆瓣"
      },
      {
        "id": "type-why",
        "value": "https://ask.seowhy.com/search/?q=",
        "placeholder": "SEO问答社区",
        "name": "搜外问答"
      }
    ]
  },
  {
    "id": "group-e",
    "title": "解析",
    "options": [
      {
        "id": "type-jiexi",
        "value": "https://z1.m1907.cn/?jx=",
        "placeholder": "M1907解析接口",
        "name": "M1907"
      },
      {
        "id": "type-jiexi1",
        "value": "https://vip.bljiex.com/?v=",
        "placeholder": "BL智能解析接口",
        "name": "BL智能"
      },
      {
        "id": "type-jiexi2",
        "value": "https://17kyun.com/api.php?url=",
        "placeholder": "17kyun解析接口",
        "name": "17kyun"
      },
      {
        "id": "type-jiexi3",
        "value": "https://jx.618g.com/?url=",
        "placeholder": "618G解析接口",
        "name": "618G"
      },
      {
        "id": "type-jiexi4",
        "value": "https://okjx.cc/?url=",
        "placeholder": "OK解析接口",
        "name": "OK解析"
      },
      {
        "id": "type-jiexi5",
        "value": "https://jx.m3u8.tv/jiexi/?url=",
        "placeholder": "M3U8解析接口",
        "name": "M3U8解析接口"
      }
    ]
  }
];
// 将搜索数据暴露到全局
window.searchData = searchData;
// 搜索工具类
const SearchUtils = {
  /**
   * 生成搜索模块HTML并插入到页面
   */
  renderSearchModule() {
    const container = document.getElementById('search-container');
    if (!container) {
      console.error('未找到搜索容器 #search-container');
      return;
    }
    
    // 生成搜索模块HTML
    container.innerHTML = `
      <div id="search" class="s-search">
        <div id="search-list" class="hide-type-list">
          <div class="s-type">
            <span class="type-text"></span>
            <div class="s-type-list animated fadeInUp">
              <!-- 由JS动态生成 -->
            </div>
          </div>
          <!-- 搜索组由JS动态生成 -->
        </div>
        <form action="https://www.baidu.com/s?wd=" method="get" target="_blank" id="super-search-fm">
          <input type="text" id="search-text" placeholder="输入关键字搜索" style="outline:0" autocomplete="off"/>

          <button type="submit">
            <img src="https://img.alicdn.com/imgextra/i3/2327995847/O1CN01fhXl2q1t3yYaZYRnO_!!2327995847.png" alt="搜索图标" style="width: 30px; height: 30px; vertical-align: middle;">
          </button>
          <ul id="ul" class="ko"></ul>
        </form>
        <input type="checkbox" id="set-search-blank" class="bubble-3" autocomplete="off" style="display:none"/>
      </div>
    `;
    
    this.renderSearchOptions();
    this.setupEventListeners();
  },
  
  /**
   * 生成搜索选项HTML
   */
  renderSearchOptions() {
    const searchList = document.getElementById('search-list');
    const form = document.getElementById('super-search-fm');
    const typeText = document.querySelector('.type-text');
    
    if (!searchList || !form || !typeText) return;
    
    // 清空现有内容（保留原始结构）
    const originalSType = searchList.querySelector('.s-type');
    const existingGroups = searchList.querySelectorAll('.search-group');
    existingGroups.forEach(group => group.remove());
    
    const typeSpan = originalSType.querySelector('.type-text');
    const typeList = originalSType.querySelector('.s-type-list');
    
    // 生成分类选项
    searchData.forEach((group, groupIndex) => {
      const groupLabel = document.createElement('label');
      groupLabel.setAttribute('for', group.id);
      groupLabel.textContent = group.title || `分类${groupIndex + 1}`;
      groupLabel.addEventListener('click', () => {
        this.showGroup(groupIndex);
        typeSpan.textContent = group.title || `分类${groupIndex + 1}`;
      });
      typeList.appendChild(groupLabel);
    });
    
    // 生成搜索组
    searchData.forEach((group, groupIndex) => {
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
  showGroup(groupIndex) {
    if (!searchData || !Array.isArray(searchData) || !searchData[groupIndex]) return;
    
    // 隐藏所有组
    document.querySelectorAll('.search-group').forEach(group => {
      group.classList.remove('s-current');
    });
    
    // 显示选中组
    const targetGroup = document.getElementById(searchData[groupIndex].id);
    if (targetGroup) {
      targetGroup.classList.add('s-current');
      
      // 自动选择该分类下的第一个搜索引擎
      const firstRadio = targetGroup.querySelector('input[type="radio"]');
      const form = document.getElementById('super-search-fm');
      const searchText = document.getElementById('search-text');
      
      if (firstRadio && form && searchText) {
        // 获取第一个搜索引擎的配置
        const firstOption = searchData[groupIndex].options[0];
        firstRadio.checked = true;
        searchText.placeholder = firstOption.placeholder || '输入搜索内容';
        form.action = firstOption.value;
      }
    }
  },
  
  /**
   * 设置搜索事件监听器
   */
  setupEventListeners() {
    const form = document.getElementById('super-search-fm');
    const searchText = document.getElementById('search-text');
    const searchList = document.getElementById('search-list');
    
    if (!form || !searchText || !searchList) return;
    
    // 搜索框焦点事件
    searchText.addEventListener('focus', () => {
      searchList.classList.remove('hide-type-list');
    });
    
    // 点击页面其他地方隐藏搜索类型列表
    document.addEventListener('click', (e) => {
      const searchContainer = document.getElementById('search');
      if (!searchContainer?.contains(e.target)) {
        searchList.classList.add('hide-type-list');
      }
    });
    
    // 阻止搜索列表内部点击事件冒泡
    searchList.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
};

// 关键：页面加载完成后初始化搜索模块
document.addEventListener('DOMContentLoaded', () => {
  SearchUtils.renderSearchModule();

});

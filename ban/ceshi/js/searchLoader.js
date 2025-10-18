// 修改后的cs/js/searchLoader.js代码（优化搜索建议排序）
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('search-container');
    if (container) {
        container.innerHTML = `
            <div class="s-search mx-auto text-center" style="color: white; padding: 20px;">
                <p>加载中...</p>
            </div>
        `;
    }
    setTimeout(loadSearchData, 300);
});

function loadSearchData() {
    const container = document.getElementById('search-container');
    if (!container) {
        console.error('未找到搜索容器 #search-container');
        return;
    }

    const dataUrl = 'https://shuju.xnss.fun/default'; 
    const timeoutTimer = setTimeout(() => {
        showError('搜索数据加载超时');
    }, 10000);

    fetch(dataUrl)
        .then(response => {
            if (!response.ok) throw new Error('数据源请求失败');
            return response.text();
        })
        .then(scriptContent => {
            clearTimeout(timeoutTimer);
            const modifiedScript = `${scriptContent}\nwindow.appData = appData;`;
            
            const blob = new Blob([modifiedScript], { type: 'text/javascript' });
            const blobUrl = URL.createObjectURL(blob);

            const script = document.createElement('script');
            script.src = blobUrl;
            script.onload = function() {
                URL.revokeObjectURL(blobUrl);
                if (window.appData && Array.isArray(window.appData.searchData)) {
                    renderSearchBox(window.appData.searchData);
                } else {
                    showError('搜索数据格式错误');
                }
            };
            script.onerror = function() {
                showError('处理后的脚本加载失败');
            };
            document.head.appendChild(script);
        })
        .catch(error => {
            clearTimeout(timeoutTimer);
            console.error('数据加载失败:', error);
            showError('搜索数据加载失败，请检查网络');
        });
}

function renderSearchBox(searchData) {
    const container = document.getElementById('search-container');
    if (!container) return;

    // 修复搜索建议框样式，解决对齐和遮挡问题
    let html = `
        <div class="s-search">
            <div id="search" class="s-search mx-auto">
                <div class="big-title text-center mb-3 mb-md-5 mt-2">
                    <p class="h1" style="color: #fff;letter-spacing: 6px;">小牛搜索</p>
                </div>
                
                <div id="search-list-menu" class="hide-type-list">
                    <div class="s-type text-center">
                        <div class="s-type-list big">
                            <div class="anchor" style="position: absolute; left: 50%; opacity: 0;"></div>
    `;

    searchData.forEach(group => {
        html += `<label for="${group.id}" data-id="${group.id}" ${group.id === 'group-a' ? 'class="active"' : ''}>
                    <span>${group.title}</span>
                </label>`;
    });

    html += `
                        </div>
                    </div>
                </div>
                
                <!-- 搜索框容器 - 增加相对定位以便建议框绝对定位 -->
                <div style="position: relative; max-width: 800px; margin: 0 auto; z-index: 2000;">
                    <form id="search-form" class="super-search-fm">
                        <input type="text" id="search-text" class="form-control smart-tips search-key" 
                               placeholder="输入关键字搜索" style="outline:0" autocomplete="off">
                        <button type="submit"><i class="fa fa-search"></i></button>
                    </form>
                    
                    <!-- 全局搜索建议框 - 带磨玻璃效果 -->
                    <div id="global-search-suggestions" class="search-smart-tips" style="display: none; 
                        position: absolute; 
                        left: 0; 
                        right: 0;
                        top: 100%; /* 紧接搜索框下方 */
                        background-color: rgba(255, 255, 255, 0.85); /* 半透明白色 */
                        backdrop-filter: blur(10px); /* 磨玻璃效果 */
                        -webkit-backdrop-filter: blur(10px);
                        border-radius: 0 0 4px 4px; 
                        z-index: 2000; /* 最高层级避免被遮挡 */
                        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
                        max-height: 400px; /* 增加最大高度 */
                        overflow-y: auto; /* 内容过多时滚动 */
                        box-sizing: border-box;
                        border: 1px solid rgba(255, 255, 255, 0.2);">
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            <!-- 建议项将通过JS动态添加 -->
                        </ul>
                    </div>
                </div>
                
                <div id="search-list" class="hide-type-list">
    `;

    searchData.forEach(group => {
        html += `
            <div class="search-group ${group.id} ${group.id === 'group-a' ? 'active' : ''}">
                <ul class="search-type">
        `;

        group.options.forEach(option => {
            html += `
                <li>
                    <input hidden="" type="radio" name="type" id="${option.id}"
                           value="${option.value}" data-placeholder="${option.placeholder || '输入搜索内容'}" 
                           ${option.checked ? 'checked="checked"' : ''}>
                    <label for="${option.id}"><span class="text-muted">${option.name}</span></label>
                </li>
            `;
        });

        html += `
                </ul>
            </div>
        `;
    });

    html += `
                </div>
                <div class="card search-smart-tips" style="display: none">
                    <ul></ul>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
    initSearchEvents();
    
    // 确保搜索容器及其父元素设置正确的层级和溢出属性
    const searchContainers = [
        document.querySelector('.search-container'),
        document.querySelector('.header-big'),
        document.getElementById('search-container')
    ];
    searchContainers.forEach(elem => {
        if (elem) {
            elem.style.zIndex = '2000';
            elem.style.overflow = 'visible';
            elem.style.position = 'relative';
        }
    });
}

// 改进的搜索算法，根据关键词契合度排序
function searchNavigationData(keyword) {
    if (!keyword || !window.appData || !window.appData.navigationData) {
        return [];
    }
    
    const results = [];
    const lowerKeyword = keyword.toLowerCase();
    const keywordLength = lowerKeyword.length;
    
    window.appData.navigationData.forEach(category => {
        category.links.forEach(link => {
            const lowerName = link.name.toLowerCase();
            const lowerUrl = link.url.toLowerCase();
            let score = 0;
            
            // 检查是否匹配
            const nameMatches = lowerName.includes(lowerKeyword);
            const urlMatches = lowerUrl.includes(lowerKeyword);
            
            if (nameMatches || urlMatches) {
                // 1. 名称匹配权重高于URL匹配
                if (nameMatches) {
                    score += 100; // 名称匹配基础分
                    
                    // 2. 匹配位置：越靠前得分越高
                    const nameIndex = lowerName.indexOf(lowerKeyword);
                    if (nameIndex === 0) {
                        score += 50; // 开头匹配额外加分
                    } else if (nameIndex < 5) {
                        score += 30; // 前5个字符内匹配加分
                    } else if (nameIndex < 10) {
                        score += 10; // 前10个字符内匹配加分
                    }
                    
                    // 3. 匹配长度占比：越长得分越高
                    const matchRatio = keywordLength / lowerName.length;
                    score += Math.round(matchRatio * 30);
                }
                
                // URL匹配得分
                if (urlMatches) {
                    score += 30; // URL匹配基础分
                    
                    // URL中匹配位置加分
                    const urlIndex = lowerUrl.indexOf(lowerKeyword);
                    if (urlIndex === 0) {
                        score += 20;
                    } else if (urlIndex < 5) {
                        score += 10;
                    }
                }
                
                // 4. 完全匹配额外加分
                if (lowerName === lowerKeyword) {
                    score += 100;
                }
                
                results.push({
                    name: link.name,
                    url: link.url,
                    category: category.title,
                    score: score // 存储评分用于排序
                });
            }
        });
    });
    
    // 根据得分降序排序，得分高的排在前面
    return results.sort((a, b) => b.score - a.score);
}

function showSuggestions(results) {
    const suggestionsContainer = document.getElementById('global-search-suggestions');
    const suggestionsList = suggestionsContainer.querySelector('ul');
    
    if (results.length === 0) {
        suggestionsContainer.style.display = 'none';
        return;
    }
    
    suggestionsList.innerHTML = '';
    
    results.forEach(item => {
        const li = document.createElement('li');
        li.style.padding = '8px 15px';
        li.style.borderBottom = '1px solid rgba(255,255,255,0.3)';
        li.style.cursor = 'pointer';
        li.style.whiteSpace = 'nowrap';
        li.style.overflow = 'hidden';
        li.style.textOverflow = 'ellipsis';
        li.style.backgroundColor = 'transparent';
        
        const searchText = document.getElementById('search-text').value.toLowerCase();
        let displayName = item.name;
        const index = item.name.toLowerCase().indexOf(searchText);
        if (index !== -1) {
            displayName = item.name.substring(0, index) + 
                          '<span style="color: #ff6700; font-weight: bold;">' + 
                          item.name.substring(index, index + searchText.length) + 
                          '</span>' + 
                          item.name.substring(index + searchText.length);
        }
        
        li.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>${displayName}</span>
                <span style="font-size: 12px; color: #999;">${item.category}</span>
            </div>
        `;
        
        li.addEventListener('click', () => {
            window.open(item.url, '_blank');
            document.getElementById('search-text').value = '';
            suggestionsContainer.style.display = 'none';
        });
        
        suggestionsList.appendChild(li);
    });
    
    suggestionsContainer.style.display = 'block';
}

function initSearchEvents() {
    const typeLabels = document.querySelectorAll('.s-type-list label');
    const searchGroups = document.querySelectorAll('.search-group');
    const radioInputs = document.querySelectorAll('input[name="type"]');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-text');
    const suggestionsContainer = document.getElementById('global-search-suggestions');

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });

    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.trim();
        
        if (keyword.length < 1) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        const results = searchNavigationData(keyword);
        showSuggestions(results);
    });

    typeLabels.forEach(label => {
        label.addEventListener('click', function() {
            typeLabels.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const groupId = this.dataset.id;
            searchGroups.forEach(group => {
                group.classList.remove('active');
                if (group.classList.contains(groupId)) {
                    group.classList.add('active');
                }
            });
            const firstRadio = document.querySelector(`.${groupId} input[type="radio"]`);
            if (firstRadio) {
                firstRadio.checked = true;
                searchInput.placeholder = firstRadio.dataset.placeholder || '输入搜索内容';
            }
        });
    });

    radioInputs.forEach(radio => {
        radio.addEventListener('change', function() {
            searchInput.placeholder = this.dataset.placeholder || '输入搜索内容';
        });
    });

    const firstChecked = document.querySelector('input[name="type"]:checked');
    if (firstChecked) {
        searchInput.placeholder = firstChecked.dataset.placeholder || '输入搜索内容';
    }

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchText = searchInput.value.trim();
        const selectedRadio = document.querySelector('input[name="type"]:checked');
        
        suggestionsContainer.style.display = 'none';
        
        if (selectedRadio && searchText) {
            const url = selectedRadio.value + encodeURIComponent(searchText);
            window.open(url, '_blank');
        }
    });

    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const searchText = this.value.trim();
            const selectedRadio = document.querySelector('input[name="type"]:checked');
            
            suggestionsContainer.style.display = 'none';
            
            if (selectedRadio && searchText) {
                const url = selectedRadio.value + encodeURIComponent(searchText);
                window.open(url, '_blank');
            }
        }
    });
}

function showError(message) {
    const container = document.getElementById('search-container');
    if (container) {
        container.innerHTML = `
            <div class="s-search mx-auto text-center" style="color: white; padding: 20px;">
                <p>${message}</p>
                <button onclick="window.location.reload()" style="margin-top:10px; padding:5px 15px; border:none; border-radius:4px; background:rgba(255,255,255,0.2); color:white; cursor:pointer;">
                    刷新页面
                </button>
            </div>
        `;
    }
}

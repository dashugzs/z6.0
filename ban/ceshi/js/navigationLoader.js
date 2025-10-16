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

    // 关键：通过fetch获取脚本内容，手动修正变量作用域
    fetch(dataUrl)
        .then(response => {
            if (!response.ok) throw new Error('数据源请求失败');
            return response.text(); // 获取脚本文本内容
        })
        .then(scriptContent => {
            clearTimeout(timeoutTimer);
            // 在原脚本后追加代码：将局部appData赋值给window.appData
            const modifiedScript = `${scriptContent}\nwindow.appData = appData;`;
            
            // 创建Blob对象并生成URL（避免跨域和脚本注入风险）
            const blob = new Blob([modifiedScript], { type: 'text/javascript' });
            const blobUrl = URL.createObjectURL(blob);

            // 加载处理后的脚本
            const script = document.createElement('script');
            script.src = blobUrl;
            script.onload = function() {
                URL.revokeObjectURL(blobUrl); // 释放资源
                // 验证数据结构
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
// 渲染搜索框（保持与原页面样式一致）
function renderSearchBox(searchData) {
    const container = document.getElementById('search-container');
    if (!container) return;

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

    // 生成分类标签
    searchData.forEach(group => {
        html += `<label for="${group.id}" data-id="${group.id}" ${group.id === 'group-a' ? 'class="active"' : ''}>
                    <span>${group.title}</span>
                </label>`;
    });

    html += `
                        </div>
                    </div>
                </div>
                
                <form id="search-form" class="super-search-fm">
                    <input type="text" id="search-text" class="form-control smart-tips search-key" 
                           placeholder="输入关键字搜索" style="outline:0" autocomplete="off">
                    <button type="submit"><i class="fa fa-search"></i></button>
                </form>
                
                <div id="search-list" class="hide-type-list">
    `;

    // 生成搜索分组
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
}

// 初始化搜索事件（与原页面逻辑一致）
function initSearchEvents() {
    const typeLabels = document.querySelectorAll('.s-type-list label');
    const searchGroups = document.querySelectorAll('.search-group');
    const radioInputs = document.querySelectorAll('input[name="type"]');
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-text');

    // 分类标签切换
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
            // 自动选中第一个选项
            const firstRadio = document.querySelector(`.${groupId} input[type="radio"]`);
            if (firstRadio) {
                firstRadio.checked = true;
                searchInput.placeholder = firstRadio.dataset.placeholder || '输入搜索内容';
            }
        });
    });

    // 选项切换时更新占位符
    radioInputs.forEach(radio => {
        radio.addEventListener('change', function() {
            searchInput.placeholder = this.dataset.placeholder || '输入搜索内容';
        });
    });

    // 初始化第一个选项的占位符
    const firstChecked = document.querySelector('input[name="type"]:checked');
    if (firstChecked) {
        searchInput.placeholder = firstChecked.dataset.placeholder || '输入搜索内容';
    }

    // 表单提交
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchText = searchInput.value.trim();
        const selectedRadio = document.querySelector('input[name="type"]:checked');
        if (selectedRadio && searchText) {
            const url = selectedRadio.value + encodeURIComponent(searchText);
            window.open(url, '_blank');
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

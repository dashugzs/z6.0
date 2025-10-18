// 全局搜索功能实现
document.addEventListener('DOMContentLoaded', function() {
    // 等待导航数据加载完成
    const checkNavData = setInterval(() => {
        if (window.navigationData && Array.isArray(window.navigationData)) {
            clearInterval(checkNavData);
            initGlobalSearch();
        }
    }, 100);

    // 超时保护
    setTimeout(() => {
        clearInterval(checkNavData);
        if (!window.navigationData) {
            console.warn('导航数据加载超时，全局搜索功能可能无法正常工作');
        }
    }, 5000);
});

function initGlobalSearch() {
    const searchInput = document.getElementById('search-text');
    const resultsContainer = document.getElementById('ul');
    const searchForm = document.getElementById('super-search-fm');
    
    if (!searchInput || !resultsContainer || !searchForm) {
        console.error('搜索相关元素未找到，全局搜索功能无法初始化');
        return;
    }

    // 搜索输入事件监听
    searchInput.addEventListener('input', function(e) {
        const keyword = e.target.value.trim().toLowerCase();
        
        if (keyword.length < 1) {
            resultsContainer.style.display = 'none';
            return;
        }
        
        // 搜索导航数据
        const results = searchNavigationData(keyword);
        
        // 显示搜索结果
        displaySearchResults(results);
    });

    // 点击其他区域隐藏搜索结果
    document.addEventListener('click', function(e) {
        const searchContainer = document.getElementById('search');
        if (!searchContainer.contains(e.target)) {
            resultsContainer.style.display = 'none';
        }
    });

    // 阻止搜索结果区域的点击事件冒泡
    resultsContainer.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // 处理回车事件，保留原搜索功能
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            resultsContainer.style.display = 'none';
            // 让原表单处理提交
        }
    });

    // 搜索导航数据并按匹配度排序
    function searchNavigationData(keyword) {
        const results = [];
        
        if (!window.navigationData || !Array.isArray(window.navigationData)) {
            return results;
        }

        // 遍历所有分类和链接
        window.navigationData.forEach(category => {
            if (!category.links || !Array.isArray(category.links)) return;
            
            category.links.forEach(link => {
                if (!link.name || !link.url) return;
                
                // 计算匹配度
                const name = link.name.toLowerCase();
                let score = 0;
                
                // 完全匹配得分最高
                if (name === keyword) {
                    score = 100;
                } 
                // 开头匹配次之
                else if (name.startsWith(keyword)) {
                    score = 80;
                } 
                // 包含关键词
                else if (name.includes(keyword)) {
                    score = 60;
                }

                // 如果有匹配，添加到结果
                if (score > 0) {
                    results.push({
                        ...link,
                        category: category.title || '未分类',
                        score: score
                    });
                }
            });
        });

        // 按匹配度排序，得分高的在前
        return results.sort((a, b) => b.score - a.score);
    }

    // 显示搜索结果
    function displaySearchResults(results) {
        if (results.length === 0) {
            resultsContainer.style.display = 'none';
            return;
        }

        // 清空现有结果
        resultsContainer.innerHTML = '';
        
        // 添加新结果
        results.forEach(item => {
            const li = document.createElement('li');
            li.className = 'wei';
            
            const link = document.createElement('a');
            link.className = 'a';
            link.href = item.url;
            link.target = item.target || '_blank';
            link.textContent = item.name;
            
            // 添加分类信息
            const categorySpan = document.createElement('span');
            categorySpan.style.fontSize = '12px';
            categorySpan.style.color = '#888';
            categorySpan.style.marginLeft = '10px';
            categorySpan.textContent = `[${item.category}]`;
            
            link.appendChild(categorySpan);
            li.appendChild(link);
            
            // 点击链接后隐藏结果
            link.addEventListener('click', function() {
                resultsContainer.style.display = 'none';
                searchInput.value = '';
            });
            
            resultsContainer.appendChild(li);
        });

        // 显示结果容器
        resultsContainer.style.display = 'block';
    }
}
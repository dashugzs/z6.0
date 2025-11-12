// 管理员弹窗功能实现（适配日夜模式）
document.addEventListener('DOMContentLoaded', function() {
    // 正确的密钥（实际应用中建议加密存储）
    const CORRECT_KEY = 'xnss'; // 替换为实际密钥
    
    // 获取管理员登录按钮并修改行为
    const loginBtn = document.querySelector('#login-btn[href="admin.html"]');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            createAndShowAdminModal();
        });
    }
    
    // 创建并显示管理员弹窗
    function createAndShowAdminModal() {
        // 移除已有弹窗
        const existingModal = document.getElementById('admin-modal');
        if (existingModal) existingModal.remove();
        
        // 创建弹窗容器
        const modal = document.createElement('div');
        modal.id = 'admin-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            transition: background-color 0.3s ease;
            background-color: var(--modal-overlay-bg);
        `;
        
        // 创建弹窗内容
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: var(--modal-bg);
            color: var(--modal-text);
            padding: 30px;
            border-radius: 10px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        `;
        
        // 密钥输入区域
        const keyInputSection = document.createElement('div');
        keyInputSection.id = 'key-input-section';
        keyInputSection.innerHTML = `
            <h2 style="text-align: center; margin-bottom: 20px;">管理员验证</h2>
            <div style="margin-bottom: 20px;">
                <label for="admin-key" style="display: block; margin-bottom: 8px;">请输入密钥：</label>
                <input type="password" id="admin-key" 
                       style="width: 100%; padding: 10px; font-size: 16px; 
                              border: 1px solid var(--input-border); 
                              border-radius: 5px; 
                              background-color: var(--input-bg); 
                              color: var(--modal-text);">
            </div>
            <button id="verify-key" 
                    style="width: 100%; padding: 10px; 
                           background-color: var(--btn-primary); 
                           color: white; border: none; 
                           border-radius: 5px; cursor: pointer; 
                           font-size: 16px; transition: background-color 0.2s;">
                验证
            </button>
            <p id="key-error" style="color: var(--error-color); text-align: center; margin-top: 15px; display: none;">
                密钥不正确，请重新输入
            </p>
        `;
        
        // 功能按钮区域（初始隐藏）
        const buttonsSection = document.createElement('div');
        buttonsSection.id = 'admin-buttons-section';
        buttonsSection.style.display = 'none';
        buttonsSection.innerHTML = `
            <h2 style="text-align: center; margin-bottom: 20px;">管理员功能</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <button class="admin-function-btn" data-url="https://github.com">Github</button>
                <button class="admin-function-btn" data-url="https://dash.cloudflare.com">cloudflare</button>
                <button class="admin-function-btn" data-url="https://xiaoniuss.top/guali1x2sa/login.html">数据管理</button>
                <button class="admin-function-btn" data-url="https://xiaoniuss.top/guali1x2sa/login-master">账户管理</button>
            </div>
            <button id="close-admin-modal" 
                    style="width: 100%; padding: 10px; 
                           background-color: var(--btn-secondary); 
                           color: var(--modal-text); border: none; 
                           border-radius: 5px; cursor: pointer; 
                           font-size: 16px; transition: background-color 0.2s;">
                关闭
            </button>
        `;
        
        // 核心：定义日夜模式的CSS变量
        const style = document.createElement('style');
        style.textContent = `
            /* 日间模式变量 */
            :root {
                --modal-overlay-bg: rgba(0, 0, 0, 0.7);
                --modal-bg: #ffffff;
                --modal-text: #333333;
                --input-border: #dddddd;
                --input-bg: #ffffff;
                --btn-primary: #3F9DFF;
                --btn-secondary: #666666;
                --error-color: #ff4444;
                --func-btn-bg: #f0f0f0;
                --func-btn-hover: #3F9DFF;
            }
            
            /* 夜间模式变量（假设页面通过body.dark-mode切换） */
            body.dark-mode {
                --modal-overlay-bg: rgba(0, 0, 0, 0.9);
                --modal-bg: #2d2d2d;
                --modal-text: #f0f0f0;
                --input-border: #444444;
                --input-bg: #3d3d3d;
                --btn-primary: #52a8ff;
                --btn-secondary: #444444;
                --error-color: #ff6b6b;
                --func-btn-bg: #444444;
                --func-btn-hover: #52a8ff;
            }
            
            /* 功能按钮样式 */
            .admin-function-btn {
                padding: 12px;
                font-size: 16px;
                border: none;
                border-radius: 5px;
                background-color: var(--func-btn-bg);
                color: var(--modal-text);
                cursor: pointer;
                transition: all 0.2s;
            }
            .admin-function-btn:hover {
                background-color: var(--func-btn-hover);
                color: white;
                transform: translateY(-2px);
            }
        `;
        
        // 组合元素
        modalContent.appendChild(keyInputSection);
        modalContent.appendChild(buttonsSection);
        modal.appendChild(modalContent);
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // 验证按钮事件
        document.getElementById('verify-key').addEventListener('click', verifyAdminKey);
        
        // 关闭按钮事件
        document.getElementById('close-admin-modal').addEventListener('click', () => modal.remove());
        
        // 功能按钮事件
        document.querySelectorAll('.admin-function-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                window.open(this.getAttribute('data-url'), '_blank');
            });
        });
        
        // 点击外部关闭
        modal.addEventListener('click', e => {
            if (e.target === modal) modal.remove();
        });
        
        // ESC键关闭
        const escHandler = e => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);

        // 监听模式切换（如果页面有动态切换模式的功能）
        const modeChangeHandler = () => {
            // 触发重绘（确保变量生效）
            modal.style.opacity = '0.99';
            setTimeout(() => modal.style.opacity = '1', 0);
        };
        document.body.addEventListener('modechange', modeChangeHandler); // 假设页面切换模式时触发此事件
        
        // 移除弹窗时清理事件监听
        modal.addEventListener('remove', () => {
            document.body.removeEventListener('modechange', modeChangeHandler);
        });
    }
    
    // 验证管理员密钥
    function verifyAdminKey() {
        const keyInput = document.getElementById('admin-key');
        const keyError = document.getElementById('key-error');
        const inputSection = document.getElementById('key-input-section');
        const buttonsSection = document.getElementById('admin-buttons-section');
        
        if (keyInput.value === CORRECT_KEY) {
            keyError.style.display = 'none';
            inputSection.style.display = 'none';
            buttonsSection.style.display = 'block';
        } else {
            keyError.style.display = 'block';
            keyInput.value = '';
            keyInput.focus();
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Copy code functionality
    document.querySelectorAll('.btn-secondary').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.code-snippet-card');
            const codeBlock = card.querySelector('code');
            const text = codeBlock.textContent;
            
            navigator.clipboard.writeText(text).then(() => {
                // Change button text temporarily
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy code:', err);
                alert('Failed to copy code. Please try again.');
            });
        });
    });

    // Run code functionality
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.code-snippet-card');
            const language = card.querySelector('.language-tag').textContent;
            const code = card.querySelector('code').textContent;

            // Simple code execution simulation
            console.log(`Running ${language} code:`);
            console.log(code);
            
            // Show execution feedback
            const originalText = this.textContent;
            this.textContent = 'Running...';
            this.disabled = true;

            // Simulate code execution delay
            setTimeout(() => {
                this.textContent = 'Completed!';
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                }, 1500);
            }, 1000);
        });
    });

    // Save snippet functionality
    document.querySelectorAll('.btn-icon').forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('svg');
            const card = this.closest('.code-snippet-card');
            const snippetTitle = card.querySelector('h3').textContent;

            // Toggle saved state
            if (this.classList.contains('saved')) {
                this.classList.remove('saved');
                icon.style.fill = 'none';
                showToast(`Removed "${snippetTitle}" from saved snippets`);
            } else {
                this.classList.add('saved');
                icon.style.fill = 'currentColor';
                showToast(`Saved "${snippetTitle}" to your collection`);
            }
        });
    });

    // Toast notification system
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        // Add styles dynamically if not in CSS
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = 'var(--primary)';
        toast.style.color = 'white';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = 'var(--shadow-md)';
        toast.style.zIndex = '1000';
        toast.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2.7s';

        // Add animation keyframes if not in CSS
        if (!document.querySelector('#toast-animations')) {
            const style = document.createElement('style');
            style.id = 'toast-animations';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeOut {
                    from { opacity: 1; transform: translateY(0); }
                    to { opacity: 0; transform: translateY(20px); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Initialize syntax highlighting
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
});
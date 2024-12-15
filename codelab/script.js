document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('toggleBtn');
    const codePanel = document.getElementById('codePanel');
    const codeInput = document.getElementById('codeInput');
    const shareBtn = document.getElementById('shareBtn');
    const languageSelect = document.getElementById('languageSelect'); // Assuming this exists

    // Toggle Code Panel Visibility
    toggleBtn.addEventListener('click', () => {
        codePanel.classList.toggle('active');
        toggleBtn.textContent = codePanel.classList.contains('active') 
            ? 'Close Code Panel' 
            : 'Open Code Panel';
    });

    // Toast Notification System
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        // Styling for toast notification
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

        // Add animation keyframes if not already present
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

    // Attach Listeners to Snippet Card Buttons
    function attachSnippetCardListeners(card) {
        // Copy Button Functionality
        const copyButton = card.querySelector('.btn-secondary');
        copyButton.addEventListener('click', function() {
            const codeBlock = card.querySelector('code');
            const text = codeBlock.textContent;
            
            navigator.clipboard.writeText(text).then(() => {
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
        
        // Run Button Functionality
        const runButton = card.querySelector('.btn-primary');
        runButton.addEventListener('click', function() {
            const language = card.querySelector('.language-tag').textContent;
            const code = card.querySelector('code').textContent;
    
            console.log(`Running ${language} code:`);
            console.log(code);
            
            const originalText = this.textContent;
            this.textContent = 'Running...';
            this.disabled = true;
    
            setTimeout(() => {
                this.textContent = 'Completed!';
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                }, 1500);
            }, 1000);
        });
        
        // Save Button Functionality
        const saveButton = card.querySelector('.btn-icon');
        saveButton.addEventListener('click', function() {
            const icon = this.querySelector('svg');
            const snippetTitle = card.querySelector('h3').textContent;
    
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
    }

    // Share Button Functionality
    shareBtn.addEventListener('click', () => {
        const code = codeInput.value.trim();
        const language = languageSelect.value;
        
        if (code) {
            // Create the full code snippet card structure
            const snippetCard = document.createElement('article');
            snippetCard.className = 'code-snippet-card';
            
            // Card header
            const cardHeader = document.createElement('div');
            cardHeader.className = 'card-header';
            
            const cardMeta = document.createElement('div');
            cardMeta.className = 'card-meta';
            
            const snippetTitle = document.createElement('h3');
            snippetTitle.textContent = `${language.toUpperCase()} Snippet`;
            
            const author = document.createElement('span');
            author.className = 'author';
            author.textContent = 'by You';
            
            const languageTag = document.createElement('span');
            languageTag.className = 'language-tag';
            languageTag.textContent = language.toUpperCase();
            
            // Save button
            const saveButton = document.createElement('button');
            saveButton.className = 'btn-icon';
            saveButton.setAttribute('aria-label', 'Save snippet');
            saveButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
            `;
            
            // Code snippet area
            const codeSnippetDiv = document.createElement('div');
            codeSnippetDiv.className = 'code-snippet';
            codeSnippetDiv.setAttribute('data-language', language);
            
            const pre = document.createElement('pre');
            const codeElement = document.createElement('code');
            codeElement.className = `language-${language}`;
            codeElement.textContent = code;
            
            pre.appendChild(codeElement);
            codeSnippetDiv.appendChild(pre);
            
            // Card actions
            const cardActions = document.createElement('div');
            cardActions.className = 'card-actions';
            
            const copyButton = document.createElement('button');
            copyButton.className = 'btn btn-secondary';
            copyButton.textContent = 'Copy Code';
            
            const runButton = document.createElement('button');
            runButton.className = 'btn btn-primary';
            runButton.textContent = 'Run Code';
            
            // Assemble the card
            cardMeta.append(snippetTitle, author, languageTag);
            cardHeader.append(cardMeta, saveButton);
            cardActions.append(copyButton, runButton);
            
            snippetCard.append(cardHeader, codeSnippetDiv, cardActions);
            
            // Find the code grid to append the new snippet
            const codeGrid = document.querySelector('.code-grid');
            
            if (codeGrid) {
                codeGrid.insertBefore(snippetCard, codeGrid.firstChild);
            } else {
                console.error('Could not find .code-grid element');
            }
            
            // Attach event listeners for new buttons
            attachSnippetCardListeners(snippetCard);
            
            // Highlight new code if Prism is available
            if (typeof Prism !== 'undefined') {
                Prism.highlightAll();
            }
            
            // Clear input and close panel
            codeInput.value = '';
            codePanel.classList.remove('active');
            toggleBtn.textContent = 'Open Code Panel';
        } else {
            alert('Please enter some code before sharing.');
        }
    });

    // Initialize syntax highlighting if Prism is available
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
});
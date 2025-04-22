document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('emailModal');
    const emailTriggers = document.querySelectorAll('.email-trigger');
    const closeModal = document.querySelector('.close-modal');
    const copyBtn = document.getElementById('copyEmail');
    
    // Show modal
    emailTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const email = trigger.getAttribute('data-email');
            document.getElementById('emailText').textContent = email;
            modal.classList.add('active');
        });
    });
    
    // Close modal
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Copy email
    copyBtn.addEventListener('click', () => {
        const email = document.getElementById('emailText').textContent;
        navigator.clipboard.writeText(email).then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy';
            }, 2000);
        });
    });
});
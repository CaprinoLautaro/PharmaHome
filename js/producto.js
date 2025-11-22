// producto.js
document.addEventListener('DOMContentLoaded', function () {
    const customSelect = document.querySelector('.custom-select-wrapper');
    if (!customSelect) return;

    const trigger = customSelect.querySelector('.custom-select-trigger');
    const options = customSelect.querySelectorAll('.custom-select-option');
    const triggerText = trigger.querySelector('span');

    trigger.addEventListener('click', () => {
        customSelect.classList.toggle('open');
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            triggerText.textContent = option.textContent;
            customSelect.classList.remove('open');
        });
    });

    window.addEventListener('click', (e) => {
        if (!customSelect.contains(e.target)) {
            customSelect.classList.remove('open');
        }
    });
});
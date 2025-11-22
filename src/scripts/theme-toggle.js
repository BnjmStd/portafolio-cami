const handleToggle = () => {
    const element = document.documentElement;
    const current = element.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    element.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
}

const initTheme = () => {
    const theme = (() => {
        if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
            return localStorage.getItem('theme');
        }
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    })();

    document.documentElement.setAttribute('data-theme', theme);

    const button = document.getElementById('theme-toggle');
    if (button) {
        // Clone to remove existing listeners to avoid duplicates
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        newButton.addEventListener('click', handleToggle);
    }
};

// Run on initial load
initTheme();

// Run on view transitions navigation
document.addEventListener('astro:page-load', initTheme);

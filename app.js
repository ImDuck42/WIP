// Panel Management
let basePath = '';

function togglePanel() {
    const panel = document.getElementById('sidePanel');
    const isActive = panel.classList.toggle('active');
    panel.setAttribute('aria-expanded', isActive);
}

// Scroll Management
const scrollTopButton = document.querySelector('.scroll-top');

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleScroll() {
    scrollTopButton.classList.toggle('visible', window.scrollY > 300);
}

window.addEventListener('scroll', () => {
    window.requestAnimationFrame(handleScroll);
});

// Category Configuration
const categoryConfig = {
    nsfw: new Set(['waifu', 'neko', 'trap', 'blowjob']),
    sfw: new Set(['waifu', 'neko', 'shinobu', 'megumin', 'hug', 'kiss', 'pat', 'smug'])
};

const apiCache = new Map();
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes

function updateCategories() {
    const dropdown = document.getElementById('categoryDropdown');
    const isNSFW = document.getElementById('nsfwToggle').checked;
    const type = isNSFW ? 'nsfw' : 'sfw';
    
    dropdown.innerHTML = '<option value="" disabled selected>Select Category</option>';
    categoryConfig[type].forEach(cat => {
        dropdown.appendChild(new Option(
            `${cat.charAt(0).toUpperCase()}${cat.slice(1)}`,
            cat
        ));
    });
}

// URL Management
function updateURL(type, category) {
    window.history.pushState({}, '', `${basePath}/${type}/${category}`);
}

function parseURL() {
    const [, type, category] = window.location.pathname.split('/');
    return { type: type || '', category: category || '' };
}

function validateURLParams() {
    const { type, category } = parseURL();
    const isValidType = ['nsfw', 'sfw'].includes(type);
    const isValidCategory = isValidType && categoryConfig[type].has(category);
    
    if (!isValidType || !isValidCategory) {
        window.history.replaceState({}, '', basePath || '/');
        return false;
    }
    
    document.getElementById('nsfwToggle').checked = type === 'nsfw';
    updateCategories();
    document.getElementById('categoryDropdown').value = category;
    return true;
}

// Image Handling
async function fetchAndDisplayWaifus() {
    const type = document.getElementById('nsfwToggle').checked ? 'nsfw' : 'sfw';
    const category = document.getElementById('categoryDropdown').value;
    const container = document.getElementById('waifu-container');

    if (!category) {
        showError('Please select a category first!', 'assets/oops.png');
        return;
    }

    if (window.innerWidth <= 768) togglePanel();

    const cacheKey = `${type}-${category}`;
    if (apiCache.has(cacheKey)) {
        const { timestamp, data } = apiCache.get(cacheKey);
        if (Date.now() - timestamp < CACHE_EXPIRATION) {
            displayWaifus(data);
            updateURL(type, category);
            return;
        }
    }

    try {
        container.innerHTML = '<div class="loading-skeleton"></div>'.repeat(9);
        
        const response = await fetch(`https://api.waifu.pics/many/${type}/${category}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ exclude: [] })
        });

        if (!response.ok) throw new Error(`API Error: ${response.status} - ${await response.text()}`);
        
        const { files } = await response.json();
        apiCache.set(cacheKey, { timestamp: Date.now(), data: files });
        displayWaifus(files);
        updateURL(type, category);

    } catch (error) {
        window.history.replaceState({}, '', basePath || '/');
        showError(`Failed to generate waifus: ${error.message}`, 'assets/smthnwrong.png', true);
    }
}

function displayWaifus(files) {
    const container = document.getElementById('waifu-container');
    container.innerHTML = files.map(url => `
        <div class="image-wrapper">
            <img src="${url}" 
                 alt="Anime character illustration" 
                 loading="lazy" 
                 width="300" 
                 height="400">
        </div>
    `).join('');
}

function showError(message, icon, showRetry = false) {
    const container = document.getElementById('waifu-container');
    container.innerHTML = `
        <div class="error-container" role="alert">
            <div class="error-icon">
                <img src="${icon}" alt="" aria-hidden="true">
            </div>
            <p class="error-text">${message}</p>
            ${showRetry ? `
            <button class="retry-btn" onclick="fetchAndDisplayWaifus()">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 4v6h-6M1 20v-6h6"/>
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                </svg>
                Try Again
            </button>` : ''}
        </div>
    `;
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    const [_, repo] = window.location.pathname.split('/');
    basePath = repo ? `/${repo}` : '';

    if (sessionStorage.redirect) {
        try {
            const redirectUrl = new URL(sessionStorage.redirect);
            window.history.replaceState({}, '', redirectUrl.pathname.replace(/\/{2,}/g, '/'));
        } finally {
            delete sessionStorage.redirect;
        }
    }

    document.getElementById('nsfwToggle').addEventListener('change', updateCategories);
    updateCategories();
    
    if (validateURLParams()) {
        fetchAndDisplayWaifus();
    }
    
    window.addEventListener('popstate', () => {
        if (validateURLParams()) fetchAndDisplayWaifus();
    });
});
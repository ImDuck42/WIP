// Panel Management
function togglePanel() {
    const panel = document.getElementById('sidePanel');
    panel.classList.toggle('active');
}

// Scroll to Top
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Scroll Button Visibility
window.addEventListener('scroll', () => {
    const scrollBtn = document.querySelector('.scroll-top');
    scrollBtn.classList.toggle('visible', window.scrollY > 300);
});

// Category Configuration
const nsfwCategories = ['waifu', 'neko', 'trap', 'blowjob'];
const sfwCategories = ['waifu', 'neko', 'shinobu', 'megumin', 'hug', 'kiss', 'pat', 'smug'];

function updateCategories() {
    const dropdown = document.getElementById('categoryDropdown');
    const isNSFW = document.getElementById('nsfwToggle').checked;
    const categories = isNSFW ? nsfwCategories : sfwCategories;

    dropdown.innerHTML = '<option value="" disabled selected>Select Category</option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = `${cat.charAt(0).toUpperCase()}${cat.slice(1)}`;
        dropdown.appendChild(option);
    });
}

// Image Generation
async function fetchAndDisplayWaifus() {
    const type = document.getElementById('nsfwToggle').checked ? 'nsfw' : 'sfw';
    const category = document.getElementById('categoryDropdown').value;
    const container = document.getElementById('waifu-container');

    // Auto-close panel on mobile
    if (window.innerWidth <= 768) {
        togglePanel();
    }

    try {
        container.innerHTML = '<div class="loading">Generating...</div>';
        
        const response = await fetch(`https://api.waifu.pics/many/${type}/${category}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        if (!response.ok) throw new Error('API Error');
        
        const { files } = await response.json();
        container.innerHTML = files.map(url => `
            <img src="${url}" alt="Generated waifu" loading="lazy">
        `).join('');

    } catch (error) {
        console.error('Error:', error);
        // In fetchAndDisplayWaifus() catch block:
        container.innerHTML = `
            <div class="error-container">
                <div class="error-icon">⚠️</div>
                <p class="error-text">Failed to generate waifus<br><small>${error.message || 'Unknown error'}</small></p>
                <button class="retry-btn" onclick="fetchAndDisplayWaifus()">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M23 4v6h-6M1 20v-6h6"/>
                        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                    </svg>
                    Try Again
                </button>
            </div>
        `;
    }
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('nsfwToggle').addEventListener('change', updateCategories);
    updateCategories();
});
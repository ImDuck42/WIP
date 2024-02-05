function toggleSidePanel() {
    var sidePanel = document.getElementById("sidePanel");
    sidePanel.style.right = sidePanel.style.right === "-300px" ? "0" : "-300px";
}

function closeSidePanel() {
    document.getElementById("sidePanel").style.right = "-300px";
}

function openSocialLink(url) {
    window.open(url, '_blank');
}

// Update the fetch URL based on category and type

async function fetchAndDisplayWaifus() {
    const type = document.getElementById('nsfwToggle').checked ? 'nsfw' : 'sfw';
    const category = document.getElementById('categoryDropdown').value;
    const apiUrl = `https://api.waifu.pics/many/${type}/${category}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        const data = await response.json();

        const waifuContainer = document.getElementById('waifu-container');
        waifuContainer.innerHTML = ''; // Clear existing images

        data.files.forEach(url => {
            waifuContainer.innerHTML += `<img src="${url}" alt="Waifu Image">`;
        });

        // Append waifu images to the <main> section
        document.querySelector('main').innerHTML = waifuContainer.innerHTML;

    } catch (error) {
        console.error('Error fetching waifu images:', error);
    }
}

// Enable the NSFW toggle and set initial category dropdown options
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('nsfwToggle').removeAttribute('disabled');
    const categoryDropdown = document.getElementById('categoryDropdown');

    // Set initial category options based on NSFW toggle
    updateCategoryOptions();

    // Set initial category options when NSFW toggle changes
    document.getElementById('nsfwToggle').addEventListener('change', updateCategoryOptions);
});

// Update category options dynamically based on NSFW toggle
function updateCategoryOptions() {
    const nsfwToggle = document.getElementById('nsfwToggle');
    const categoryDropdown = document.getElementById('categoryDropdown');

    // Clear existing options
    categoryDropdown.innerHTML = '';

    const categories = nsfwToggle.checked ? nsfwCategories : sfwCategories;

    // Add categories dynamically
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.text = category;
        categoryDropdown.add(option);
    });
}

// NSFW categories
const nsfwCategories = ['waifu', 'neko', 'trap', 'blowjob'];

// SFW categories
const sfwCategories = ['waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 'cry', 'hug', 'awoo', 'kiss', 'lick', 'pat', 'smug', 'bonk', 'yeet', 'blush', 'smile', 'wave', 'highfive', 'handhold', 'nom', 'bite', 'glomp', 'slap', 'kill', 'kick', 'happy', 'wink', 'poke', 'dance', 'cringe'];

// Scroll to Top Button Script
function scrollToTop() {
    var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
    var targetScroll = 0; // Scroll to the top
    var scrollStep = currentScroll / 20;

    function scrollAnimation() {
        // If currentScroll is greater than targetScroll, scroll up
        if (currentScroll > targetScroll) {
            currentScroll -= scrollStep;
            document.documentElement.scrollTop = currentScroll;
            document.body.scrollTop = currentScroll;

            // Continue the animation
            window.requestAnimationFrame(scrollAnimation);
        } else {
            // Stop the animation when you reach the top
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }
    }

    // Start the animation
    window.requestAnimationFrame(scrollAnimation);
}

// Scroll Animation
window.onscroll = function () {
    var scrollToTopBtn = document.getElementById("scrollToTopBtn");

    // Show the button when the user scrolls down 20px from the top
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};

// content.js - Runs on Instagram pages to hide features
console.log('InstaFocus content script loaded');

// Define selectors for Instagram features
const featureSelectors = {
    'Home Feed': [
        'a[href="/"]',
        'a[href="/?hl=en"]',
        '[data-testid="home-feed"]'
    ],
    'Explore': [
        'a[href="/explore/"]',
        'a[href="/explore/?hl=en"]',
        '[data-testid="explore"]'
    ],
    'Reels': [
        'a[href="/reels/"]',
        'a[href="/reels/?hl=en"]',
        '[data-testid="reels"]'
    ],
    'Messages': [
        'a[href="/direct/inbox/"]',
        'a[href="/direct/inbox/?hl=en"]',
        '[data-testid="messages"]'
    ],
    'Likes': [
        'a[href="/activity/"]',
        'a[href="/activity/?hl=en"]',
        '[data-testid="likes"]'
    ],
    'Create': [
        'a[href="/create/"]',
        'a[href="/create/?hl=en"]',
        '[data-testid="create"]'
    ]
};

// Function to hide elements based on selectors
function hideElements(selectors) {
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            // Hide the element and its parent container
            el.style.display = 'none';
            
            // Also try to hide the parent nav item
            const parent = el.closest('div[role="button"], div[class*="nav"], span[class*="nav"]');
            if (parent) {
                parent.style.display = 'none';
            }
        });
    });
}

// Function to hide features based on settings
function hideInstagramFeatures() {
    // Get saved settings from Chrome storage
    chrome.storage.sync.get(Object.keys(featureSelectors), function(result) {
        console.log('InstaFocus settings:', result);
        
        Object.keys(featureSelectors).forEach(feature => {
            if (result[feature] === false) { // If feature is disabled
                console.log(`Hiding ${feature}`);
                hideElements(featureSelectors[feature]);
            }
        });
    });
}

// Function to inject CSS for more reliable hiding
function injectHidingCSS() {
    const style = document.createElement('style');
    style.id = 'instafocus-hiding';
    style.textContent = `
        /* InstaFocus hiding styles */
        a[href="/reels/"] { display: none !important; }
        a[href="/explore/"] { display: none !important; }
        a[href="/direct/inbox/"] { display: none !important; }
        a[href="/activity/"] { display: none !important; }
        a[href="/create/"] { display: none !important; }
    `;
    document.head.appendChild(style);
}

// Run when page loads
hideInstagramFeatures();

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'updateSettings') {
        console.log(`Updating ${request.feature}: ${request.enabled}`);
        
        if (!request.enabled) {
            // Hide the feature
            hideElements(featureSelectors[request.feature]);
        } else {
            // Show the feature (remove hiding)
            featureSelectors[request.feature].forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    el.style.display = '';
                    const parent = el.closest('div[role="button"], div[class*="nav"], span[class*="nav"]');
                    if (parent) {
                        parent.style.display = '';
                    }
                });
            });
        }
    }
});

// Re-run when page content changes (for Instagram's SPA navigation)
const observer = new MutationObserver(function(mutations) {
    let shouldUpdate = false;
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            shouldUpdate = true;
        }
    });
    
    if (shouldUpdate) {
        setTimeout(hideInstagramFeatures, 500); // Small delay to let content load
    }
});

// Start observing
observer.observe(document.body, { 
    childList: true, 
    subtree: true 
});

// Also run on navigation changes
let currentUrl = location.href;
setInterval(function() {
    if (location.href !== currentUrl) {
        currentUrl = location.href;
        setTimeout(hideInstagramFeatures, 1000);
    }
}, 1000);

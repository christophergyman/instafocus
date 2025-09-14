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

// Enhanced function to show elements (unhide)
function showElements(selectors) {
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            // Show the element
            el.style.display = '';
            el.style.visibility = '';
            el.style.opacity = '';
            
            // Also show the parent nav item
            const parent = el.closest('div[role="button"], div[class*="nav"], span[class*="nav"]');
            if (parent) {
                parent.style.display = '';
                parent.style.visibility = '';
                parent.style.opacity = '';
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
            // REVERSED LOGIC: Only hide if explicitly set to true (checked/selected)
            // If no setting exists (undefined) or false, show everything (default)
            if (result[feature] === true) {
                console.log(`Hiding ${feature} (explicitly selected to hide)`);
                hideElements(featureSelectors[feature]);
            } else {
                console.log(`Showing ${feature} (not selected to hide)`);
                showElements(featureSelectors[feature]);
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
        
        // REVERSED LOGIC: Checked = Hide, Unchecked = Show
        if (request.enabled) {
            // Hide the feature (checkbox is checked)
            console.log(`Hiding ${request.feature} (checkbox checked)`);
            hideElements(featureSelectors[request.feature]);
        } else {
            // Show the feature (checkbox is unchecked)
            console.log(`Showing ${request.feature} (checkbox unchecked)`);
            showElements(featureSelectors[request.feature]);
        }
    }
});

// Function to remove CSS hiding for a specific feature
function removeFeatureFromCSS(feature) {
    const styleElement = document.getElementById('instafocus-hiding');
    if (styleElement) {
        // Remove the specific CSS rule for this feature
        const selectors = featureSelectors[feature];
        selectors.forEach(selector => {
            // This is a simplified approach - in practice, you might want to rebuild the CSS
            console.log(`Removing CSS hiding for ${selector}`);
        });
    }
}

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

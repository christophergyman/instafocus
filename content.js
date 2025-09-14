// content.js - Runs on Instagram pages to hide features
console.log('InstaFocus content script loaded');

// Define selectors for Instagram features with more comprehensive targeting
const featureSelectors = {
    'Home Feed': [
        'a[href="/"]',
        'a[href="/?hl=en"]',
        '[data-testid="home-feed"]',
        'svg[aria-label="Home"]',
        'svg[aria-label="Home (current page)"]'
    ],
    'Explore': [
        'a[href="/explore/"]',
        'a[href="/explore/?hl=en"]',
        '[data-testid="explore"]',
        'svg[aria-label="Explore"]',
        'svg[aria-label="Find People"]'
    ],
    'Reels': [
        'a[href="/reels/"]',
        'a[href="/reels/?hl=en"]',
        '[data-testid="reels"]',
        'svg[aria-label="Reels"]'
    ],
    'Messages': [
        'a[href="/direct/inbox/"]',
        'a[href="/direct/inbox/?hl=en"]',
        '[data-testid="messages"]',
        'svg[aria-label="Direct"]',
        'svg[aria-label="Messenger"]'
    ],
    'Likes': [
        'a[href="/activity/"]',
        'a[href="/activity/?hl=en"]',
        '[data-testid="likes"]',
        'svg[aria-label="Activity Feed"]',
        'svg[aria-label="Notifications"]'
    ],
    'Create': [
        'a[href="/create/"]',
        'a[href="/create/?hl=en"]',
        '[data-testid="create"]',
        'svg[aria-label="New post"]',
        'svg[aria-label="Create"]',
        'div[role="button"]:has(svg[aria-label="New post"])',
        'div[role="button"]:has(svg[aria-label="Create"])'
    ],
    'Search': [
        'input[placeholder*="Search"]',
        'input[placeholder*="search"]',
        '[data-testid="search"]',
        'svg[aria-label="Search"]',
        'div[role="button"]:has(svg[aria-label="Search"])',
        'a[href*="/search/"]'
    ],
    'Notifications': [
        'a[href="/activity/"]',
        'a[href="/activity/?hl=en"]',
        '[data-testid="notifications"]',
        'svg[aria-label="Notifications"]',
        'svg[aria-label="Activity Feed"]',
        'div[role="button"]:has(svg[aria-label="Notifications"])',
        'div[role="button"]:has(svg[aria-label="Activity Feed"])'
    ]
};

// Function to hide elements based on selectors
function hideElements(selectors) {
    selectors.forEach(selector => {
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                // Hide the element and its parent container
                el.style.display = 'none';
                
                // Also try to hide the parent nav item
                const parent = el.closest('div[role="button"], div[class*="nav"], span[class*="nav"], a, section');
                if (parent) {
                    parent.style.display = 'none';
                }
                
                // Hide the entire navigation item container
                const navItem = el.closest('div[class*="nav"], div[role="button"], section[class*="nav"]');
                if (navItem) {
                    navItem.style.display = 'none';
                }
            });
        } catch (e) {
            console.log(`Error with selector ${selector}:`, e);
        }
    });
}

// Enhanced function to show elements (unhide)
function showElements(selectors) {
    selectors.forEach(selector => {
        try {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                // Show the element
                el.style.display = '';
                el.style.visibility = '';
                el.style.opacity = '';
                
                // Also show the parent nav item
                const parent = el.closest('div[role="button"], div[class*="nav"], span[class*="nav"], a, section');
                if (parent) {
                    parent.style.display = '';
                    parent.style.visibility = '';
                    parent.style.opacity = '';
                }
                
                // Show the entire navigation item container
                const navItem = el.closest('div[class*="nav"], div[role="button"], section[class*="nav"]');
                if (navItem) {
                    navItem.style.display = '';
                    navItem.style.visibility = '';
                    navItem.style.opacity = '';
                }
            });
        } catch (e) {
            console.log(`Error with selector ${selector}:`, e);
        }
    });
}

// Function to force refresh all features based on current settings
function forceRefreshAllFeatures() {
    console.log('Force refreshing all features...');
    chrome.storage.sync.get(Object.keys(featureSelectors), function(result) {
        console.log('Current settings:', result);
        
        Object.keys(featureSelectors).forEach(feature => {
            if (result[feature] === true) {
                console.log(`Force hiding ${feature}`);
                hideElements(featureSelectors[feature]);
            } else {
                console.log(`Force showing ${feature}`);
                showElements(featureSelectors[feature]);
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
        /* InstaFocus hiding styles - more comprehensive */
        a[href="/reels/"] { display: none !important; }
        a[href="/explore/"] { display: none !important; }
        a[href="/direct/inbox/"] { display: none !important; }
        a[href="/activity/"] { display: none !important; }
        a[href="/create/"] { display: none !important; }
        input[placeholder*="Search"] { display: none !important; }
        svg[aria-label="Search"] { display: none !important; }
        svg[aria-label="Notifications"] { display: none !important; }
        svg[aria-label="New post"] { display: none !important; }
        svg[aria-label="Create"] { display: none !important; }
        svg[aria-label="Home"] { display: none !important; }
        svg[aria-label="Explore"] { display: none !important; }
        svg[aria-label="Reels"] { display: none !important; }
        svg[aria-label="Direct"] { display: none !important; }
        svg[aria-label="Messenger"] { display: none !important; }
        svg[aria-label="Activity Feed"] { display: none !important; }
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
        
        // Force refresh all features after a short delay to ensure changes are applied
        setTimeout(() => {
            forceRefreshAllFeatures();
        }, 100);
    }
    
    // Handle force refresh request
    if (request.action === 'forceRefresh') {
        console.log('Force refresh requested');
        forceRefreshAllFeatures();
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
        setTimeout(hideInstagramFeatures, 200); // Reduced delay for faster response
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
        setTimeout(hideInstagramFeatures, 500); // Reduced delay
    }
}, 1000);

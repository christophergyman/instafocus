// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get all checkbox elements
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    // Add event listeners to each checkbox
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            const feature = this.value;
            const isChecked = this.checked;
            
            // Log the change
            console.log(`${feature} is now ${isChecked ? 'enabled' : 'disabled'}`);
            
            // Save to Chrome storage and notify content script
            saveFeatureState(feature, isChecked);
        });
    });
    
    // Load saved states when popup opens
    loadFeatureStates();
    
    console.log('InstaFocus loaded successfully!');
});

// Function to save feature state to Chrome storage
function saveFeatureState(feature, isEnabled) {
    // Save to Chrome storage
    chrome.storage.sync.set({[feature]: isEnabled}, function() {
        console.log(`Saving: ${feature} = ${isEnabled}`);
        
        // Notify content script of changes
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0] && tabs[0].url.includes('instagram.com')) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'updateSettings',
                    feature: feature,
                    enabled: isEnabled
                });
            }
        });
    });
}

// Function to load saved feature states
function loadFeatureStates() {
    console.log('Loading saved feature states...');
    
    // Load from Chrome storage
    chrome.storage.sync.get(['Home Feed', 'Explore', 'Reels', 'Messages', 'Likes', 'Create'], function(result) {
        Object.keys(result).forEach(function(feature) {
            const checkbox = document.querySelector(`input[value="${feature}"]`);
            if (checkbox) {
                checkbox.checked = result[feature];
            }
        });
    });
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the close button element
    const closeBtn = document.getElementById('closeBtn');
    
    // Add click event listener to the close button
    closeBtn.addEventListener('click', function() {
        // Close the popup window
        window.close();
    });
    
    // Optional: Add some interactive functionality
    console.log('Hello World Extension loaded successfully!');
    
    // You can add more functionality here as needed
    // For example, you could add animations, API calls, etc.
});

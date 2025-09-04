// Server Navigation JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Channel navigation functionality
    const channelItems = document.querySelectorAll('.channel-item');
    const channelContents = document.querySelectorAll('.channel-content');
    const currentChannelSpan = document.getElementById('current-channel');

    channelItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all channel items
            channelItems.forEach(channel => channel.classList.remove('active'));
            
            // Add active class to clicked channel
            item.classList.add('active');
            
            // Get channel name
            const channelName = item.dataset.channel;
            
            // Update current channel name in header
            if (currentChannelSpan) {
                currentChannelSpan.textContent = channelName;
            }
            
            // Hide all channel contents
            channelContents.forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active');
            });
            
            // Show selected channel content
            const targetContent = document.getElementById(`${channelName}-content`);
            if (targetContent) {
                targetContent.style.display = 'block';
                targetContent.classList.add('active');
            }
        });
    });

    // Server item hover effects
    const serverItems = document.querySelectorAll('.server-item');
    serverItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('.server-icon');
            if (icon && !item.classList.contains('active')) {
                icon.style.borderRadius = '16px';
            }
        });

        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('.server-icon');
            if (icon && !item.classList.contains('active')) {
                icon.style.borderRadius = '50%';
            }
        });
    });

    // Add smooth scrolling to messages container (only for main chat, not server pages)
    const messagesContainer = document.querySelector('.messages-container');
    const isServerPage = document.querySelector('.channels-sidebar');
    
    // Only auto-scroll to bottom if it's NOT a server page (i.e., it's the main portfolio)
    if (messagesContainer && !isServerPage) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Simple channel switching without animations
    // Note: Channel switching is already handled above in the main channelItems.forEach loop

    // Initialize tooltips
    const tooltips = document.querySelectorAll('.server-tooltip');
    tooltips.forEach(tooltip => {
        const serverItem = tooltip.parentElement;
        
        serverItem.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
        });
        
        serverItem.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
        });
    });
});

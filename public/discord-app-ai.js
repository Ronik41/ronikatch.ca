// Discord Portfolio JavaScript with AI Integration
class RoniBot {
    constructor() {
        // Using secure server-side API
        this.apiEndpoint = 'https://your-vercel-app.vercel.app/api/chat';
        
        // Rate limiting and protection
        this.rateLimits = {
            maxRequestsPerMinute: 10,
            maxRequestsPerHour: 50,
            maxMessageLength: 500,
            cooldownMs: 2000 // 2 seconds between messages
        };
        
        this.usage = {
            requests: [],
            lastMessageTime: 0,
            blockedRequests: 0
        };
        
        this.knowledge = {
            experience: {
                tesla: {
                    title: "Tesla - Manufacturing & Software Engineering Intern",
                    period: "Incoming Fall 2025",
                    location: "Sparks, Nevada",
                    description: "Upcoming internship at Tesla focusing on manufacturing and software engineering."
                },
                whoop: {
                    title: "WHOOP - Manufacturing Test Software Intern",
                    period: "Jan 2025 – May 2025",
                    location: "Boston, MA",
                    description: "Developed manufacturing test software for WHOOP's wearable fitness devices, focusing on hardware validation and test automation systems.",
                    achievements: [
                        "$100,000+ manufacturing cost reduction through autonomous test fixture hardware migration",
                        "80% cycle time improvement and 2% yield increase through system redesign",
                        "2000x serial communication speed increase by rewriting UART parsing algorithm from O(n) to O(1)",
                        "Developed virtual test environment with hardware simulation for system validation",
                        "Earned Co-op Student of the Year Award nomination"
                    ]
                },
                ford: {
                    title: "Ford Motor Company - Manufacturing Software Intern",
                    period: "May 2024 – Aug 2024",
                    location: "Waterloo",
                    description: "Developed embedded software for Ford's manufacturing systems, focusing on test automation and real-time telemetry control for vehicle production lines.",
                    achievements: [
                        "98% line coverage through reverse engineering and delivering 500+ unit tests",
                        "100% functional test coverage in embedded systems using Google Mock framework",
                        "Refactored real-time telemetry control code ensuring 15-25 year runtime stability",
                        "Performed hardware-in-the-loop testing using Radmoon, ValueCAN, and debug boards"
                    ]
                },
                electrium: {
                    title: "Electrium Mobility - Embedded Systems Developer",
                    period: "Aug 2023 – Jan 2024",
                    location: "Waterloo",
                    description: "Developed embedded systems for electric mobility solutions, focusing on motor control, communication protocols, and hardware integration.",
                    achievements: [
                        "Implemented UART communication protocols for system-level integration",
                        "$200 cost avoidance through PCB component diagnosis & precision soldering",
                        "Synchronized dual-controller system with CAN bus communication",
                        "Programmed PWM control algorithms for 3-phase DC MOSFET bridge achieving 40km/h speeds"
                    ]
                },
                exceed: {
                    title: "Exceed Robotics - Robotics Instructor",
                    period: "Apr 2023 – Aug 2023",
                    location: "Thornhill",
                    description: "Designed and built custom robotics platforms, integrating sensors, actuators, and microcontrollers for educational programs.",
                    achievements: [
                        "Designed and built custom robotics platforms, integrating sensors, actuators, and microcontrollers using C/C++, Arduino, and Python",
                        "Led development of advanced projects including image processing for object recognition and game development using NumPy, Pygame, and OpenCV",
                        "Developed and delivered curriculum for circuit diagram design, microcontroller programming, and 3D modeling using Autodesk Fusion360 and TinkerCAD",
                        "Fostered hands-on learning environment for students in robotics and programming"
                    ]
                }
            },
            skills: {
                languages: ["C/C++", "Python", "C/Arduino", "MATLAB"],
                protocols: ["UART", "SPI", "I2C", "CAN", "Ethernet", "BLE"],
                platforms: ["STM32", "Arduino", "Raspberry Pi", "Embedded Systems", "Real-time Systems"],
                testing: ["Hardware-in-the-loop Testing", "Test Automation", "Manufacturing Test Fixtures", "System Validation"],
                tools: ["Git", "SonarQube", "Google Test", "SQLite", "Hardware Validation", "System Software"]
            },
            projects: [
                {
                    name: "Fall Detection Device",
                    technologies: ["STM32", "J-Link Debugger", "Git"],
                    description: "99.9% accuracy STM32-based fall detection system using C++ and STM32CubeIDE, integrating I2C accelerometer/gyroscope for real-time sensor data processing and hardware validation"
                },
                {
                    name: "Line Production Control System",
                    technologies: ["Arduino", "PLC", "IoT"],
                    description: "15% production downtime reduction through Arduino-based control system design, replacing obsolete circuit board with manufacturing systems automation and significant cost savings"
                },
                {
                    name: "Discord Bot",
                    technologies: ["Virtual Private Server", "Cloud", "Python"],
                    description: "Deployed and maintained Discord bot for non-profit organization using Oracle Cloud services with 24/7 system availability and Linux-based server management"
                }
            ],
            education: {
                university: "University of Waterloo",
                degree: "Bachelor of Applied Science in Computer Engineering, Co-op",
                period: "2023 – Present",
                location: "Waterloo, ON",
                awards: ["Waterloo Engineering Consulting Competition Award"]
            },
            contact: {
                email: "roni.katch@gmail.com",
                linkedin: "linkedin.com/in/roni-katcharovski"
            }
        };

        this.responses = {
            greeting: [
                "Hey there! 👋 I'm RoniBot, your guide to learning about Roni Katcharovski!",
                "Hello! I'm here to tell you all about Roni's amazing journey in engineering!",
                "Hi! Ready to explore Roni's experience and skills? Let's chat!"
            ],
            default: [
                "That's an interesting question! Let me think about what I know regarding Roni...",
                "Great question! Here's what I can tell you about that...",
                "I'd be happy to help you learn more about that aspect of Roni's background!"
            ]
        };

        this.init();
    }

    // No longer needed - using server-side API

    init() {
        this.messagesContainer = document.getElementById('messages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');

        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        this.updateTimestamp();

        // Server navigation
        document.querySelectorAll('.server-item').forEach(item => {
            item.addEventListener('click', () => this.handleServerClick(item));
        });
    }

    updateTimestamp() {
        const timestampElement = document.getElementById('bot-timestamp');
        if (timestampElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            timestampElement.textContent = `Today at ${timeString}`;
        }
    }

    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Input validation
        if (!this.validateInput(message)) {
            return;
        }

        // Rate limiting check
        if (!this.checkRateLimit()) {
            this.addMessage("⏰ Please wait a moment before sending another message. Rate limit exceeded.", 'bot');
            return;
        }

        this.addMessage(message, 'user');
        this.messageInput.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Use AI to generate response
        this.generateAIResponse(message);
    }

    validateInput(message) {
        // Check message length
        if (message.length > this.rateLimits.maxMessageLength) {
            this.addMessage(`❌ Message too long! Please keep it under ${this.rateLimits.maxMessageLength} characters.`, 'bot');
            return false;
        }

        // Check for potentially harmful content (basic filtering)
        const harmfulPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /eval\s*\(/i,
            /function\s*\(/i
        ];

        for (const pattern of harmfulPatterns) {
            if (pattern.test(message)) {
                this.addMessage("❌ Message contains potentially harmful content. Please try again.", 'bot');
                return false;
            }
        }

        return true;
    }

    checkRateLimit() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        const oneHourAgo = now - 3600000;

        // Clean old requests
        this.usage.requests = this.usage.requests.filter(time => time > oneHourAgo);

        // Check cooldown
        if (now - this.usage.lastMessageTime < this.rateLimits.cooldownMs) {
            return false;
        }

        // Check minute limit
        const recentRequests = this.usage.requests.filter(time => time > oneMinuteAgo);
        if (recentRequests.length >= this.rateLimits.maxRequestsPerMinute) {
            this.usage.blockedRequests++;
            return false;
        }

        // Check hour limit
        if (this.usage.requests.length >= this.rateLimits.maxRequestsPerHour) {
            this.usage.blockedRequests++;
            return false;
        }

        // Add current request
        this.usage.requests.push(now);
        this.usage.lastMessageTime = now;

        return true;
    }

    async generateAIResponse(message) {
        try {
            // Check if we should use AI or fallback (for cost control)
            if (this.shouldUseFallback()) {
                console.log('Using fallback due to high usage or error rate');
                this.removeTypingIndicator();
                const fallbackResponse = this.generateResponse(message);
                this.addMessage(fallbackResponse, 'bot');
                return;
            }

            // Create context about Roni for the AI
            const context = this.createContext();
            const prompt = `You are RoniBot, a helpful and enthusiastic assistant that knows everything about Roni Katcharovski, a Computer Engineering student at University of Waterloo. 

Here's Roni's information:
${context}

User question: "${message}"

Instructions:
- Be conversational, friendly, and enthusiastic about Roni's achievements and personality
- Use Discord-style formatting with emojis and **bold** text when appropriate
- You now have access to Roni's personal information (favorite color, hobbies, interests, etc.) - use this to give detailed, personal responses
- Show personality and be proud of Roni's accomplishments, both professional and personal
- Mention his hobbies, interests, and personal details when relevant
- Keep responses concise but informative (2-4 sentences typically)
- If the question is unclear, ask for clarification while suggesting relevant topics
- Be enthusiastic about his diverse interests from chess to rock climbing to thrash metal!

Please provide a helpful, conversational response about Roni.`;

            console.log('Calling secure API with prompt:', prompt.substring(0, 200) + '...');
            const response = await this.callSecureAPI(prompt);
            console.log('Secure API response:', response);
            
            // Remove typing indicator and show response
            setTimeout(() => {
                this.removeTypingIndicator();
                this.addMessage(response, 'bot');
            }, 1000 + Math.random() * 1000);
            
        } catch (error) {
            console.error('Secure API Error:', error);
            console.log('Falling back to pattern matching...');
            
            // Track API errors
            this.usage.apiErrors = (this.usage.apiErrors || 0) + 1;
            
            // Fallback to pattern matching
            setTimeout(() => {
                this.removeTypingIndicator();
                const fallbackResponse = this.generateResponse(message);
                this.addMessage(fallbackResponse, 'bot');
            }, 1000);
        }
    }

    shouldUseFallback() {
        // Use fallback if too many API errors or very high usage
        const apiErrorRate = (this.usage.apiErrors || 0) / Math.max(this.usage.requests.length, 1);
        const isHighUsage = this.usage.requests.length > this.rateLimits.maxRequestsPerHour * 0.8;
        
        return apiErrorRate > 0.3 || isHighUsage;
    }

    async callSecureAPI(prompt) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: prompt
                })
            });

            console.log('Secure API Response Status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Secure API Error Details:', errorData);
                throw new Error(`Secure API request failed: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            console.log('Secure API Response:', data);
            
            if (!data.response) {
                throw new Error('Invalid secure API response structure');
            }
            
            return data.response;
        } catch (error) {
            console.error('Secure API Error:', error);
            throw error;
        }
    }

    createContext() {
        let context = `Roni Katcharovski - Computer Engineering Student at University of Waterloo

PERSONALITY & INTERESTS:
- Passionate about embedded systems and hardware-software integration
- Enjoys solving complex engineering problems and optimizing systems
- Interested in manufacturing automation and real-time systems
- Loves working with microcontrollers, sensors, and communication protocols
- Enjoys both hands-on hardware work and software development
- Values efficiency, innovation, and creating impactful solutions
- Team player who enjoys collaborating with cross-functional teams

PERSONAL DETAILS:
- Favorite Color: Orange 🧡
- Hometown: Vaughan, Ontario
- Relationship: Has a girlfriend and loves her very much 💕
- Favorite Programming Language: Python (because it's easy and no pointers)
- Dream Company: Google (loves the office and company importance)

HOBBIES & ACTIVITIES:
- Chess: 1400 rated on chess.com, favorite openings are Caro-Kann and London
- Rock Climbing: Indoor bouldering, highest grade climbed is V6
- Fishing: Freshwater fishing
- Sports: Soccer, hockey, baseball, ultimate frisbee
- Hiking: Enjoys outdoor hiking adventures
- Music: Thrash metal (Metallica, Megadeth), jazz (Take Five, Golden Brown), country

LEADERSHIP & VOLUNTEERING:
- Engineering Society at UWaterloo: Director/Commissioner
- First Year Orientation Coordinator at UWaterloo
- Spent significant time in first two years volunteering and leading

EXPERIENCE:
`;

        // Add experience details
        Object.values(this.knowledge.experience).forEach(exp => {
            context += `- ${exp.title} (${exp.period}) - ${exp.location}\n`;
            if (exp.achievements) {
                exp.achievements.forEach(achievement => {
                    context += `  • ${achievement}\n`;
                });
            }
            context += `  ${exp.description}\n\n`;
        });

        context += `SKILLS:
Languages: ${this.knowledge.skills.languages.join(', ')}
Protocols: ${this.knowledge.skills.protocols.join(', ')}
Platforms: ${this.knowledge.skills.platforms.join(', ')}
Testing: ${this.knowledge.skills.testing.join(', ')}
Tools: ${this.knowledge.skills.tools.join(', ')}

PROJECTS:
`;
        this.knowledge.projects.forEach(project => {
            context += `- ${project.name}: ${project.description}\n`;
        });

        context += `
EDUCATION:
${this.knowledge.education.university} - ${this.knowledge.education.degree} (${this.knowledge.education.period})
Awards: ${this.knowledge.education.awards.join(', ')}

CONTACT:
Email: ${this.knowledge.contact.email}
LinkedIn: ${this.knowledge.contact.linkedin}

IMPORTANT: When users ask about personal preferences (favorite color, hobbies, etc.), be honest that you don't have that specific information but suggest they could ask about his technical interests, projects, or professional experience instead.`;

        return context;
    }

    // Fallback pattern matching (kept as backup)
    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Greeting responses
        if (this.containsAny(lowerMessage, ['hi', 'hello', 'hey', 'greetings'])) {
            return this.getRandomResponse(this.responses.greeting);
        }

        // Experience queries
        if (this.containsAny(lowerMessage, ['experience', 'work', 'job', 'internship', 'worked'])) {
            return this.getExperienceResponse(lowerMessage);
        }

        // Skills queries
        if (this.containsAny(lowerMessage, ['skills', 'programming', 'languages', 'technologies', 'tech'])) {
            return this.getSkillsResponse(lowerMessage);
        }

        // Projects queries
        if (this.containsAny(lowerMessage, ['projects', 'built', 'created', 'developed'])) {
            return this.getProjectsResponse();
        }

        // Education queries
        if (this.containsAny(lowerMessage, ['education', 'university', 'school', 'degree', 'waterloo'])) {
            return this.getEducationResponse();
        }

        // Contact queries
        if (this.containsAny(lowerMessage, ['contact', 'reach', 'email', 'linkedin'])) {
            return this.getContactResponse();
        }

        // Company-specific queries
        if (this.containsAny(lowerMessage, ['tesla'])) {
            return this.getCompanyResponse('tesla');
        }
        if (this.containsAny(lowerMessage, ['whoop'])) {
            return this.getCompanyResponse('whoop');
        }
        if (this.containsAny(lowerMessage, ['ford'])) {
            return this.getCompanyResponse('ford');
        }
        if (this.containsAny(lowerMessage, ['electrium'])) {
            return this.getCompanyResponse('electrium');
        }
        if (this.containsAny(lowerMessage, ['exceed', 'robotics'])) {
            return this.getCompanyResponse('exceed');
        }

        // Default response with helpful suggestions
        return `I'd love to help you learn about Roni! Try asking me about:
        
🏢 His work experience (Tesla, WHOOP, Ford, Electrium, Exceed Robotics)
💻 His technical skills and programming languages
🚀 His projects and achievements
🎓 His education at University of Waterloo
📞 How to contact him

What would you like to know more about?`;
    }

    getExperienceResponse(message) {
        let response = "Roni has incredible experience in embedded systems and manufacturing software! Here's his journey:\n\n";
        
        response += "🚗 **Tesla** (Incoming Fall 2025) - Manufacturing & Software Engineering Intern in Sparks, Nevada\n\n";
        response += "🏃 **WHOOP** (Jan 2025 – May 2025) - Manufacturing Test Software Intern in Boston, MA\n";
        response += "• $100,000+ manufacturing cost reduction through autonomous test fixture hardware migration\n";
        response += "• 80% cycle time improvement and 2% yield increase through system redesign\n";
        response += "• 2000x serial communication speed increase by rewriting UART parsing algorithm\n";
        response += "• Earned Co-op Student of the Year Award nomination\n\n";
        
        response += "🚗 **Ford Motor Company** (May 2024 – Aug 2024) - Manufacturing Software Intern in Waterloo\n";
        response += "• 98% line coverage through reverse engineering and delivering 500+ unit tests\n";
        response += "• 100% functional test coverage in embedded systems using Google Mock framework\n";
        response += "• Refactored real-time telemetry control code ensuring 15-25 year runtime stability\n\n";
        
        response += "⚡ **Electrium Mobility** (Aug 2023 – Jan 2024) - Embedded Systems Developer in Waterloo\n";
        response += "• Implemented UART communication protocols for system-level integration\n";
        response += "• $200 cost avoidance through PCB component diagnosis & precision soldering\n";
        response += "• Programmed PWM control algorithms for 3-phase DC MOSFET bridge achieving 40km/h speeds\n\n";
        
        response += "🤖 **Exceed Robotics** (Apr 2023 – Aug 2023) - Robotics Instructor in Thornhill\n";
        response += "• Designed and built custom robotics platforms with sensors, actuators, and microcontrollers\n";
        response += "• Led development of image processing projects using NumPy, Pygame, and OpenCV\n";
        response += "• Developed curriculum for circuit design, microcontroller programming, and 3D modeling\n\n";
        
        response += "Pretty impressive, right? He's got experience across automotive, wearable tech, embedded systems, and robotics education!";
        
        return response;
    }

    getSkillsResponse(message) {
        let response = "Roni has a strong technical foundation! Here are his key skills:\n\n";
        
        response += "💻 **Programming Languages:**\n";
        response += this.knowledge.skills.languages.map(lang => `• ${lang}`).join('\n') + '\n\n';
        
        response += "🔌 **Protocols & Communication:**\n";
        response += this.knowledge.skills.protocols.map(protocol => `• ${protocol}`).join('\n') + '\n\n';
        
        response += "🖥️ **Platforms & Systems:**\n";
        response += this.knowledge.skills.platforms.map(platform => `• ${platform}`).join('\n') + '\n\n';
        
        response += "🧪 **Testing & Validation:**\n";
        response += this.knowledge.skills.testing.map(test => `• ${test}`).join('\n') + '\n\n';
        
        response += "🛠️ **Tools & Technologies:**\n";
        response += this.knowledge.skills.tools.map(tool => `• ${tool}`).join('\n');
        
        return response;
    }

    getProjectsResponse() {
        let response = "Roni has built some impressive projects! Here are his highlights:\n\n";
        
        this.knowledge.projects.forEach(project => {
            response += `🚀 **${project.name}**\n`;
            response += `Technologies: ${project.technologies.join(', ')}\n`;
            response += `${project.description}\n\n`;
        });
        
        return response;
    }

    getEducationResponse() {
        const edu = this.knowledge.education;
        let response = `🎓 **Education:**\n\n`;
        response += `**${edu.university}** - ${edu.degree}\n`;
        response += `Period: ${edu.period}\n`;
        response += `Location: ${edu.location}\n\n`;
        response += `**Awards & Recognition:**\n`;
        response += edu.awards.map(award => `• ${award}`).join('\n');
        
        return response;
    }

    getContactResponse() {
        const contact = this.knowledge.contact;
        let response = `📞 **Contact Roni:**\n\n`;
        response += `📧 Email: ${contact.email}\n`;
        response += `💼 LinkedIn: ${contact.linkedin}\n\n`;
        response += `Feel free to reach out! He's always interested in new opportunities and connections.`;
        
        return response;
    }

    getCompanyResponse(company) {
        const exp = this.knowledge.experience[company];
        if (!exp) return "I don't have information about that company.";
        
        let response = `🏢 **${exp.title}**\n\n`;
        response += `**Period:** ${exp.period}\n`;
        response += `**Location:** ${exp.location}\n\n`;
        response += `**Description:** ${exp.description}\n\n`;
        
        if (exp.achievements && exp.achievements.length > 0) {
            response += `**Key Achievements:**\n`;
            exp.achievements.forEach(achievement => {
                response += `• ${achievement}\n`;
            });
        }
        
        return response;
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        if (sender === 'bot') {
            avatar.innerHTML = '<i class="fas fa-robot"></i>';
        } else {
            avatar.innerHTML = '<img src="profile-picture.png" alt="You" />';
            avatar.style.backgroundColor = '#7289da';
        }

        const content = document.createElement('div');
        content.className = 'message-content';

        const header = document.createElement('div');
        header.className = 'message-header';
        
        const username = document.createElement('span');
        username.className = 'username';
        username.textContent = sender === 'bot' ? 'RoniBot' : 'You';
        
        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        timestamp.textContent = `Today at ${timeString}`;
        
        header.appendChild(username);
        header.appendChild(timestamp);
        
        if (sender === 'bot') {
            const botTag = document.createElement('span');
            botTag.className = 'bot-tag';
            botTag.textContent = 'BOT';
            header.appendChild(botTag);
        }

        const messageText = document.createElement('div');
        messageText.className = 'message-text';
        messageText.innerHTML = this.formatMessage(text);

        content.appendChild(header);
        content.appendChild(messageText);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessage(text) {
        // Convert markdown-style formatting to HTML
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <span>RoniBot is typing</span>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    containsAny(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    handleServerClick(item) {
        // Server navigation logic (if needed)
        const server = item.dataset.server;
        if (server) {
            // Handle server-specific logic
        }
    }

    // Admin function to check usage (for debugging)
    getUsageStats() {
        return {
            totalRequests: this.usage.requests.length,
            blockedRequests: this.usage.blockedRequests,
            apiErrors: this.usage.apiErrors || 0,
            lastMessageTime: new Date(this.usage.lastMessageTime).toLocaleString(),
            rateLimits: this.rateLimits
        };
    }

    // Reset usage (for testing)
    resetUsage() {
        this.usage = {
            requests: [],
            lastMessageTime: 0,
            blockedRequests: 0,
            apiErrors: 0
        };
        console.log('Usage stats reset');
    }
}

// Initialize the bot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.roniBot = new RoniBot();
    
    // Add debugging commands to console
    console.log('RoniBot loaded! Debug commands:');
    console.log('- roniBot.getUsageStats() - Check usage statistics');
    console.log('- roniBot.resetUsage() - Reset usage counters');
    console.log('- roniBot.rateLimits - View rate limit settings');
});

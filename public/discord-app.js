// Discord Portfolio JavaScript
class RoniBot {
    constructor() {
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
                tools: ["Git", "SonarQube", "Google Test", "SQLite", "Hardware Validation", "System Software"],
                systems: ["Linux/Unix Systems", "Hardware Debugging"]
            },
            projects: {
                fallDetection: {
                    title: "Fall Detection Device",
                    tech: "STM32, J-Link Debugger, Git",
                    year: "2024",
                    description: "99.9% accuracy STM32-based fall detection system using C++ and STM32CubeIDE, integrating I2C accelerometer/gyroscope for real-time sensor data processing"
                },
                lineProduction: {
                    title: "Line Production Control System",
                    tech: "Arduino, PLC, IoT",
                    year: "2024",
                    description: "15% production downtime reduction through Arduino-based control system design, replacing obsolete circuit board with manufacturing systems automation"
                },
                discordBot: {
                    title: "Discord Bot",
                    tech: "Virtual Private Server, Cloud, Python",
                    year: "2023",
                    description: "Deployed and maintained Discord bot for non-profit organization using Oracle Cloud services with 24/7 system availability"
                }
            },
            education: {
                university: "University of Waterloo",
                degree: "Bachelor of Applied Science in Computer Engineering",
                program: "Co-op",
                period: "2023 – Present",
                location: "Waterloo, ON",
                achievement: "Waterloo Engineering Consulting Competition Award"
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

        this.addMessage(message, 'user');
        this.messageInput.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Simulate bot thinking time
        setTimeout(() => {
            this.removeTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 1000 + Math.random() * 2000);
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
        timestamp.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
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
        messageText.textContent = text;

        content.appendChild(header);
        content.appendChild(messageText);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
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
        
        response += "💪 **WHOOP** (Jan 2025 – May 2025) - Manufacturing Test Software Intern in Boston\n";
        response += "• Achieved $100,000+ cost reduction and earned Co-op Student of the Year nomination!\n";
        response += "• Improved cycle time by 80% and yield by 2%\n";
        response += "• Made serial communication 2000x faster! 🚀\n\n";
        
        response += "🚙 **Ford Motor Company** (May 2024 – Aug 2024) - Manufacturing Software Intern\n";
        response += "• Achieved 98% line coverage with 500+ unit tests\n";
        response += "• Ensured 15-25 year runtime stability for embedded systems\n\n";
        
        response += "⚡ **Electrium Mobility** (Aug 2023 – Jan 2024) - Embedded Systems Developer\n";
        response += "• Implemented UART protocols and CAN bus communication\n";
        response += "• Achieved 40km/h motor speed control with PWM algorithms\n\n";
        
        response += "Each role has built his expertise in real-time systems, hardware debugging, and manufacturing optimization!";
        
        return response;
    }

    getSkillsResponse(message) {
        const skills = this.knowledge.skills;
        
        let response = "Roni has an impressive technical skillset! Here's what he's mastered:\n\n";
        
        response += "💻 **Programming Languages:**\n";
        response += skills.languages.join(', ') + "\n\n";
        
        response += "🔌 **Communication Protocols:**\n";
        response += skills.protocols.join(', ') + "\n\n";
        
        response += "🛠️ **Platforms & Systems:**\n";
        response += skills.platforms.join(', ') + "\n\n";
        
        response += "🧪 **Testing & Validation:**\n";
        response += skills.testing.join(', ') + "\n\n";
        
        response += "⚙️ **Tools & Technologies:**\n";
        response += skills.tools.join(', ') + "\n\n";
        
        response += "He's particularly strong in embedded systems, real-time programming, and hardware-software integration!";
        
        return response;
    }

    getProjectsResponse() {
        const projects = this.knowledge.projects;
        
        let response = "Roni has worked on some really cool projects! Check these out:\n\n";
        
        response += "🚨 **Fall Detection Device (2024)**\n";
        response += "• 99.9% accuracy using STM32 and C++\n";
        response += "• Real-time sensor processing with I2C accelerometer/gyroscope\n\n";
        
        response += "🏭 **Line Production Control System (2024)**\n";
        response += "• 15% reduction in production downtime\n";
        response += "• Arduino-based automation replacing obsolete systems\n\n";
        
        response += "🤖 **Discord Bot (2023)**\n";
        response += "• 24/7 system availability using Oracle Cloud\n";
        response += "• Deployed for a non-profit organization\n\n";
        
        response += "Each project showcases his ability to solve real-world problems with embedded systems and automation!";
        
        return response;
    }

    getEducationResponse() {
        const edu = this.knowledge.education;
        
        let response = "🎓 Roni is studying at one of Canada's top engineering schools!\n\n";
        response += `**${edu.university}** (${edu.period})\n`;
        response += `${edu.degree}\n`;
        response += `${edu.program} Program\n`;
        response += `📍 ${edu.location}\n\n`;
        response += `🏆 **Achievement:** ${edu.achievement}\n\n`;
        response += "The co-op program has given him incredible hands-on experience at top companies like Tesla, WHOOP, Ford, and Electrium!";
        
        return response;
    }

    getContactResponse() {
        const contact = this.knowledge.contact;
        
        let response = "📞 Want to get in touch with Roni? Here's how:\n\n";
        response += `📧 **Email:** ${contact.email}\n`;
        response += `💼 **LinkedIn:** ${contact.linkedin}\n\n`;
        response += "He's always open to discussing opportunities, technical projects, or just connecting with fellow engineers!";
        
        return response;
    }

    getCompanyResponse(company) {
        const exp = this.knowledge.experience[company];
        if (!exp) return "I don't have specific information about that company.";
        
        let response = `Here's what Roni did at **${exp.title}**:\n\n`;
        response += `📅 **Period:** ${exp.period}\n`;
        response += `📍 **Location:** ${exp.location}\n\n`;
        
        if (exp.achievements) {
            response += "🎯 **Key Achievements:**\n";
            exp.achievements.forEach(achievement => {
                response += `• ${achievement}\n`;
            });
        } else if (exp.description) {
            response += `📝 **Description:** ${exp.description}\n`;
        }
        
        return response;
    }

    containsAny(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    handleServerClick(serverItem) {
        // Remove active class from all servers
        document.querySelectorAll('.server-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to clicked server
        serverItem.classList.add('active');
        
        const serverId = serverItem.dataset.server;
        
        if (serverId && serverId !== 'home') {
            this.showCompanyModal(serverId);
        }
    }

    showCompanyModal(companyId) {
        const modal = document.getElementById('companyModal');
        const modalContent = document.getElementById('modalContent');
        
        let content = '';
        
        switch(companyId) {
            case 'tesla':
                content = this.getTeslaModalContent();
                break;
            case 'whoop':
                content = this.getWhoopModalContent();
                break;
            case 'ford':
                content = this.getFordModalContent();
                break;
            case 'electrium':
                content = this.getElectriumModalContent();
                break;
            case 'exceed':
                content = this.getExceedModalContent();
                break;
            case 'projects':
                content = this.getProjectsModalContent();
                break;
            default:
                content = '<h2>Coming Soon!</h2><p>This section is under development.</p>';
        }
        
        modalContent.innerHTML = content;
        modal.style.display = 'block';
        
        // Close modal when clicking the X or outside
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = () => modal.style.display = 'none';
        
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

    getTeslaModalContent() {
        const tesla = this.knowledge.experience.tesla;
        return `
            <h2>🚗 Tesla</h2>
            <h3>${tesla.title}</h3>
            <p><strong>Period:</strong> ${tesla.period}</p>
            <p><strong>Location:</strong> ${tesla.location}</p>
            <p><strong>Description:</strong> ${tesla.description}</p>
            <br>
            <p>This upcoming role represents the next step in Roni's journey in manufacturing and software engineering at one of the world's most innovative companies!</p>
        `;
    }

    getWhoopModalContent() {
        const whoop = this.knowledge.experience.whoop;
        return `
            <h2>💪 WHOOP</h2>
            <h3>${whoop.title}</h3>
            <p><strong>Period:</strong> ${whoop.period}</p>
            <p><strong>Location:</strong> ${whoop.location}</p>
            <br>
            <h4>🎯 Key Achievements:</h4>
            <ul>
                ${whoop.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
            </ul>
            <br>
            <p>At WHOOP, Roni made significant impacts in manufacturing optimization and earned recognition as a top co-op student!</p>
        `;
    }

    getFordModalContent() {
        const ford = this.knowledge.experience.ford;
        return `
            <h2>🚙 Ford Motor Company</h2>
            <h3>${ford.title}</h3>
            <p><strong>Period:</strong> ${ford.period}</p>
            <p><strong>Location:</strong> ${ford.location}</p>
            <br>
            <h4>🎯 Key Achievements:</h4>
            <ul>
                ${ford.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
            </ul>
            <br>
            <p>At Ford, Roni focused on embedded systems validation and ensuring long-term reliability of automotive software systems.</p>
        `;
    }

    getElectriumModalContent() {
        const electrium = this.knowledge.experience.electrium;
        return `
            <h2>⚡ Electrium Mobility</h2>
            <h3>${electrium.title}</h3>
            <p><strong>Period:</strong> ${electrium.period}</p>
            <p><strong>Location:</strong> ${electrium.location}</p>
            <br>
            <h4>🎯 Key Achievements:</h4>
            <ul>
                ${electrium.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
            </ul>
            <br>
            <p>At Electrium Mobility, Roni worked on electric vehicle systems, focusing on embedded systems development and motor control.</p>
        `;
    }

    getExceedModalContent() {
        const exceed = this.knowledge.experience.exceed;
        return `
            <h2>🤖 Exceed Robotics</h2>
            <h3>${exceed.title}</h3>
            <p><strong>Period:</strong> ${exceed.period}</p>
            <p><strong>Location:</strong> ${exceed.location}</p>
            <br>
            <h4>🎯 Key Achievements:</h4>
            <ul>
                ${exceed.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
            </ul>
            <br>
            <p>At Exceed Robotics, Roni worked as a Robotics Instructor, designing custom robotics platforms and developing educational curriculum for students.</p>
        `;
    }

    getProjectsModalContent() {
        const projects = this.knowledge.projects;
        return `
            <h2>🚀 Projects</h2>
            <br>
            <div style="margin-bottom: 20px;">
                <h3>🚨 ${projects.fallDetection.title}</h3>
                <p><strong>Technology:</strong> ${projects.fallDetection.tech}</p>
                <p><strong>Year:</strong> ${projects.fallDetection.year}</p>
                <p>${projects.fallDetection.description}</p>
            </div>
            <br>
            <div style="margin-bottom: 20px;">
                <h3>🏭 ${projects.lineProduction.title}</h3>
                <p><strong>Technology:</strong> ${projects.lineProduction.tech}</p>
                <p><strong>Year:</strong> ${projects.lineProduction.year}</p>
                <p>${projects.lineProduction.description}</p>
            </div>
            <br>
            <div style="margin-bottom: 20px;">
                <h3>🤖 ${projects.discordBot.title}</h3>
                <p><strong>Technology:</strong> ${projects.discordBot.tech}</p>
                <p><strong>Year:</strong> ${projects.discordBot.year}</p>
                <p>${projects.discordBot.description}</p>
            </div>
        `;
    }
}

// Initialize the bot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RoniBot();
});

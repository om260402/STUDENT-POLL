let pollData = [0, 0, 0, 0];
        let reactionData = {
            confused: 0,
            thinking: 0,
            happy: 0,
            excited: 0,
            love: 0
        };
        let selectedOption = null;
        let chart = null;
        let totalVotes = 0;
        let totalReactions = 0;

        // Custom poll configuration - EDIT THIS SECTION
        const pollConfig = {
            question: "Do you understand today's lesson?",
            options: [
                "Yes",
                "No"
            ]
        };

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            loadPollContent();
            initializeChart();
            setupEventListeners();
        });

        // Set quick question function
        function setQuickQuestion(question) {
            document.getElementById('customQuestion').value = question;
            updateQuestion();
        }

        // Update question function
        function updateQuestion() {
            const newQuestion = document.getElementById('customQuestion').value.trim();
            if (newQuestion) {
                pollConfig.question = newQuestion;
                document.getElementById('pollQuestion').textContent = newQuestion;
                showFeedback('Question updated successfully!');
                
                // Reset data when question changes
                resetData();
            } else {
                showFeedback('Please enter a valid question!');
            }
        }

        // Load poll content from configuration
        function loadPollContent() {
            // Update question
            document.getElementById('pollQuestion').textContent = pollConfig.question;
            
            // Update options
            const optionsContainer = document.getElementById('pollOptions');
            optionsContainer.innerHTML = '';
            
            pollConfig.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'poll-option';
                optionElement.dataset.option = index;
                optionElement.textContent = option;
                optionsContainer.appendChild(optionElement);
            });
            
            // Reset poll data array to match number of options
            pollData = new Array(pollConfig.options.length).fill(0);
        }

        // Setup event listeners
        function setupEventListeners() {
            // Poll option selection
            document.querySelectorAll('.poll-option').forEach(option => {
                option.addEventListener('click', function() {
                    // Remove previous selection
                    document.querySelectorAll('.poll-option').forEach(opt => opt.classList.remove('selected'));
                    
                    // Add selection to clicked option
                    this.classList.add('selected');
                    selectedOption = parseInt(this.dataset.option);
                    
                    // Enable submit button
                    document.getElementById('submitVote').disabled = false;
                });
            });

            // Submit vote button
            document.getElementById('submitVote').addEventListener('click', function() {
                if (selectedOption !== null) {
                    submitVote(selectedOption);
                }
            });

            // Reaction buttons
            document.querySelectorAll('.reaction-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    // Remove active class from all buttons
                    document.querySelectorAll('.reaction-btn').forEach(b => b.classList.remove('active'));
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // Submit reaction
                    const reaction = this.dataset.reaction;
                    submitReaction(reaction);
                });
            });
        }

        // Initialize Chart.js
        function initializeChart() {
            const ctx = document.getElementById('pollChart').getContext('2d');
            chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: pollConfig.options,
                    datasets: [{
                        label: 'Votes',
                        data: pollData,
                        backgroundColor: [
                            'rgba(102, 126, 234, 0.8)',
                            'rgba(118, 75, 162, 0.8)',
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(255, 206, 86, 0.8)',
                            'rgba(75, 192, 192, 0.8)'
                        ],
                        borderColor: [
                            'rgba(102, 126, 234, 1)',
                            'rgba(118, 75, 162, 1)',
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)'
                        ],
                        borderWidth: 2,
                        borderRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    },
                    animation: {
                        duration: 1000,
                        easing: 'easeInOutQuart'
                    }
                }
            });
        }

        // Submit a vote
        function submitVote(option) {
            pollData[option]++;
            totalVotes++;
            updateChart();
            updateStats();
            
            // Reset selection
            document.querySelectorAll('.poll-option').forEach(opt => opt.classList.remove('selected'));
            document.getElementById('submitVote').disabled = true;
            selectedOption = null;
            
            // Show feedback
            showFeedback('Vote submitted successfully!');
        }

        // Submit a reaction
        function submitReaction(reaction) {
            reactionData[reaction]++;
            totalReactions++;
            updateReactionStats();
            updateStats();
            
            // Show feedback
            showFeedback('Reaction recorded!');
        }

        // Update chart
        function updateChart() {
            chart.data.datasets[0].data = pollData;
            chart.update('active');
        }

        // Update reaction statistics
        function updateReactionStats() {
            Object.keys(reactionData).forEach(reaction => {
                const element = document.getElementById(reaction + '-count');
                if (element) {
                    element.textContent = reactionData[reaction];
                }
            });
        }

        // Update general statistics
        function updateStats() {
            document.getElementById('totalVotes').textContent = totalVotes;
            document.getElementById('totalReactions').textContent = totalReactions;
            document.getElementById('activeStudents').textContent = Math.max(totalVotes, totalReactions);
        }

        // Show feedback message
        function showFeedback(message) {
            // Create temporary feedback element
            const feedback = document.createElement('div');
            feedback.textContent = message;
            feedback.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 15px 25px;
                border-radius: 25px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 1000;
                font-weight: 600;
                transition: all 0.3s ease;
            `;
            
            document.body.appendChild(feedback);
            
            // Remove after 3 seconds
            setTimeout(() => {
                feedback.style.opacity = '0';
                feedback.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    document.body.removeChild(feedback);
                }, 300);
            }, 3000);
        }

        // Simulate student votes
        function simulateVotes(count) {
            for (let i = 0; i < count; i++) {
                setTimeout(() => {
                    // Random vote
                    const randomOption = Math.floor(Math.random() * pollConfig.options.length);
                    pollData[randomOption]++;
                    totalVotes++;
                    
                    // Random reaction
                    const reactions = ['confused', 'thinking', 'happy', 'excited', 'love'];
                    const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
                    reactionData[randomReaction]++;
                    totalReactions++;
                    
                    // Update displays
                    updateChart();
                    updateReactionStats();
                    updateStats();
                }, i * 100); // Stagger the updates for visual effect
            }
            
            showFeedback(`Simulated ${count} student responses!`);
        }

        // Reset all data
        function resetData() {
            pollData = new Array(pollConfig.options.length).fill(0);
            reactionData = {
                confused: 0,
                thinking: 0,
                happy: 0,
                excited: 0,
                love: 0
            };
            totalVotes = 0;
            totalReactions = 0;
            
            updateChart();
            updateReactionStats();
            updateStats();
            
            // Reset UI
            document.querySelectorAll('.poll-option').forEach(opt => opt.classList.remove('selected'));
            document.querySelectorAll('.reaction-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('submitVote').disabled = true;
            selectedOption = null;
            
            showFeedback('All data reset!');
        }
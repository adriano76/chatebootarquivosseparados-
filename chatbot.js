document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    class ChatUI {
        constructor(chatContainer) {
            this.chatContainer = chatContainer;
        }

        appendMessage(content, className) {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${className}`;
            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';
            messageContent.textContent = content;
            messageElement.appendChild(messageContent);
            this.chatContainer.appendChild(messageElement);
            this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        }
    }

    class ChatBot {
        constructor(chatUI) {
            this.chatUI = chatUI;
            this.knownAnswers = {
                "ola": "Olá! Como posso ajudar você hoje?",
                "quem é você": "Eu sou um chatbot inteligente.",
                "o que você faz": "Posso responder perguntas e buscar informações para você."
            };
        }

        processUserMessage(message) {
            this.chatUI.appendMessage(message, 'user-message');
            const response = this.generateResponse(message);
            this.chatUI.appendMessage(response, 'bot-message');

            if (response.includes('Pesquisando na web...')) {
                this.searchWeb(message);
            }
        }

        generateResponse(message) {
            const userQuestion = message.toLowerCase();

            if (this.knownAnswers[userQuestion]) {
                return this.knownAnswers[userQuestion];
            } else if (this.isMathExpression(userQuestion)) {
                return this.evaluateMathExpression(userQuestion);
            } else {
                return `Não sei a resposta para "${message}". Pesquisando na web...`;
            }
        }

        isMathExpression(text) {
            return /^[0-9+\-*/().\s]+$/.test(text);
        }

        evaluateMathExpression(expression) {
            try {
                const result = eval(expression); // Não use `eval` em aplicações reais devido a problemas de segurança
                return `O resultado de "${expression}" é ${result}.`;
            } catch (error) {
                return `Erro ao calcular "${expression}". Verifique a expressão.`;
            }
        }

        async searchWeb(query) {
            try {
                const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;
                const response = await fetch(searchUrl);
                const data = await response.json();
                
                const result = data.AbstractText || data.RelatedTopics[0]?.Text || 'Nenhuma resposta encontrada.';
                this.chatUI.appendMessage(result, 'bot-message');
            } catch (error) {
                console.error('Erro na busca:', error);
                this.chatUI.appendMessage('Erro ao buscar na web.', 'bot-message');
            }
        }
    }

    const chatUI = new ChatUI(chatContainer);
    const chatBot = new ChatBot(chatUI);

    sendButton.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            chatBot.processUserMessage(message);
            userInput.value = '';
        }
    });

    userInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });
});

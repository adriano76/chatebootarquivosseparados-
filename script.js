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
                "como se chama": "Eu sou um bot test 05 pasta 2",
                "o que voce faz": "Eu ajudo a responder perguntas. Se não souber, posso buscar na web."
            };
            this.exampleData = [];
            this.apiKey = 'YOUR_API_KEY'; // Substitua pela sua chave da API
            this.targetLanguage = 'en'; // Idioma alvo (inglês por padrão)
        }

        processUserMessage(message) {
            this.chatUI.appendMessage(message, 'user-message');
            const response = this.generateResponse(message);
            this.chatUI.appendMessage(response, 'bot-message');

            if (response.includes('Pesquisando na web...')) {
                this.searchWeb(message);
            } else if (response.includes('Coletando dados do PubChem...')) {
                this.fetchPubChemData(message);
            } else {
                this.learnNewAnswer(message, response);
            }

            this.translateResponse(response);
        }

        generateResponse(message) {
            const userQuestion = message.toLowerCase();
            if (userQuestion.includes("pubchem")) {
                return `Coletando dados do PubChem...`;
            }
            for (const example of this.exampleData) {
                if (userQuestion === example.question.toLowerCase()) {
                    return example.answer;
                }
            }
            if (this.knownAnswers[userQuestion]) {
                return this.knownAnswers[userQuestion];
            } else if (this.isMathExpression(userQuestion)) {
                return this.evaluateMathExpression(userQuestion);
            } else {
                return `Não tenho certeza da resposta para "${message}". Pesquisando na web...`;
            }
        }

        async fetchPubChemData(message) {
            const cidMatch = message.match(/cid\s*(\d+)/i);
            const nameMatch = message.match(/nome\s*([a-zA-Z]+)/i);
            let url;

            if (cidMatch) {
                const cid = cidMatch[1];
                url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/CID/${cid}/JSON`;
            } else if (nameMatch) {
                const name = nameMatch[1];
                url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${name}/JSON`;
            } else {
                this.chatUI.appendMessage('Por favor, forneça um CID ou nome válido.', 'bot-message');
                return;
            }

            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.PC_Compounds) {
                    const compoundInfo = data.PC_Compounds[0];
                    const name = compoundInfo.props.find(p => p.name === 'IUPAC Name')?.value || 'Não disponível';
                    const cid = compoundInfo.cid || 'Não disponível';
                    const formula = compoundInfo.props.find(p => p.name === 'Molecular Formula')?.value || 'Não disponível';
                    const output = `Informações do composto:\n\nNome: ${name}\nCID: ${cid}\nFórmula: ${formula}`;
                    this.chatUI.appendMessage(output, 'bot-message');
                } else {
                    this.chatUI.appendMessage('Não consegui encontrar informações para esse CID ou nome.', 'bot-message');
                }
            } catch (error) {
                console.error('Erro ao buscar dados do PubChem:', error);
                this.chatUI.appendMessage('Não consegui buscar dados do PubChem. Verifique a conexão com a internet e tente novamente.', 'bot-message');
            }
        }

        learnNewAnswer(question, answer) {
            if (confirm('Essa resposta foi útil?')) {
                this.knownAnswers[question.toLowerCase()] = answer;
                this.exampleData.push({ question, answer });
                alert('Resposta aprendida pelo bot.');
            }
        }

        isMathExpression(text) {
            return /^[0-9+\-*/().^sqrt\s]+$/.test(text);
        }

        evaluateMathExpression(expression) {
            try {
                const result = math.evaluate(expression);
                return `O resultado de "${expression}" é ${result}.`;
            } catch (error) {
                return `Não consegui calcular "${expression}". Verifique a expressão e tente novamente.`;
            }
        }

        async searchWeb(query) {
            try {
                const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;
                const response = await fetch(searchUrl);
                const data = await response.json();
                const result = data.AbstractText || data.RelatedTopics[0]?.Text || 'Não encontrei uma resposta adequada.';
                this.chatUI.appendMessage(result, 'bot-message');
            } catch (error) {
                console.error('Erro na busca:', error);
                this.chatUI.appendMessage('Não consegui buscar a resposta. Verifique a conexão com a internet e tente novamente.', 'bot-message');
            }
        }

        async translateResponse(response) {
            try {
                const url = `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`;
                const params = new URLSearchParams({
                    q: response,
                    target: this.targetLanguage
                });
                const res = await fetch(`${url}&${params.toString()}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                if (!res.ok) {
                    throw new Error(`Erro HTTP ${res.status}`);
                }

                const data = await res.json();
                const translatedText = data.data.translations[0].translatedText;
                this.chatUI.appendMessage(translatedText, 'chatgpt-message');
            } catch (error) {
                console.error('Erro na tradução:', error);
                this.chatUI.appendMessage('Não consegui traduzir a resposta. Verifique a conexão com a internet e tente novamente.', 'chatgpt-message');
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

    // Princípios Básicos da PNL
    const principios = [
        "A mente humana tem uma estrutura específica que pode ser estudada e modificada.",
        "O pensamento, a linguagem e o comportamento estão interligados.",
        "As pessoas têm padrões de pensamento e comportamento que podem ser limitantes.",
        "É possível mudar esses padrões para alcançar objetivos e melhorar a qualidade de vida."
    ];

    // Técnicas da PNL
    const tecnicas = [
        "Reestruturação cognitiva: mudar padrões de pensamento negativos.",
        "Análise de linguagem: entender como a linguagem afeta o pensamento.",
        "Modelagem: aprender com pessoas bem-sucedidas.",
        "Anchoring: associar emoções positivas a experiências.",
        "Reframing: mudar a perspectiva sobre uma situação."
    ];

    // Aplicações da PNL
    const aplicacoes = [
        "Terapia e coaching.",
        "Desenvolvimento pessoal e profissional.",
        "Comunicação eficaz.",
        "Liderança e gestão.",
        "Educação."
    ];

    // Críticas e Controvérsias
    const criticas = [
        {
            titulo: "Falta de evidências científicas robustas",
            descricao: "Diversos estudos têm criticado a falta de uma base científica sólida para a PNL. Muitas das técnicas e princípios da PNL não foram validados por pesquisas revisadas por pares.",
            argumentos: [
                "Muitas técnicas da PNL são baseadas em pressupostos teóricos que não foram comprovados empiricamente.",
                "Estudos controlados falharam em demonstrar resultados consistentes para intervenções baseadas em PNL.",
                "Pesquisadores argumentam que a PNL mistura conceitos psicológicos com pouca base científica."
            ],
            exemplos: [
                "A eficácia das técnicas de 'ancoragem emocional' é amplamente contestada por psicólogos.",
                "O uso de 'modelagem' como método de aprendizagem tem eficácia limitada em estudos controlados."
            ]
        },
        {
            titulo: "Críticas à falta de regulamentação",
            descricao: "Como a PNL não é regulamentada, qualquer pessoa pode praticar ou ensinar PNL, independentemente de qualificação. Isso gera preocupações sobre a qualidade e ética das práticas.",
            argumentos: [
                "A ausência de regulamentação permite práticas não padronizadas e formação de profissionais sem critérios claros.",
                "Pessoas sem treinamento em psicologia ou áreas relacionadas ensinam e aplicam PNL, o que pode levar a abordagens inadequadas."
            ],
            exemplos: [
                "Cursos de PNL online são amplamente acessíveis e oferecidos por instrutores de diversas formações.",
                "Sessões de coaching com técnicas de PNL aplicadas por pessoas sem formação específica têm gerado controvérsias na comunidade psicológica."
            ]
        },
        {
            titulo: "Acusações de pseudociência",
            descricao: "A PNL é frequentemente rotulada como pseudociência, pois utiliza termos científicos de forma simplista e sem comprovação empírica sólida.",
            argumentos: [
                "Técnicas de PNL como 'reframing' e 'modelagem' são vistas como interpretações simplistas de conceitos psicológicos complexos.",
                "A linguagem técnica da PNL, como o uso de termos como 'estrutura mental', é considerada inadequada e pseudocientífica."
            ],
            exemplos: [
                "Estudos mostraram que a PNL não fornece resultados mais eficazes do que outras técnicas de coaching psicológico.",
                "O uso de 'âncoras' e 'gatilhos mentais' foi criticado como uma interpretação errônea do funcionamento neural."
            ]
        }
    ];
    

    // Função para inserir itens na lista
    function inserirItens(lista, elementoId) {
        const listaElemento = document.getElementById(elementoId);
        lista.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            listaElemento.appendChild(li);
        });
    }

    // Inserir os dados nas listas correspondentes no HTML
    inserirItens(principios, 'principios-list');
    inserirItens(tecnicas, 'tecnicas-list');
    inserirItens(aplicacoes, 'aplicacoes-list');
    inserirItens(criticas, 'criticas-list');
});

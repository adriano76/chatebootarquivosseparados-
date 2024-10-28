// neural.js - Rede Neural Simples para aprendizado baseado em prompts

class NeuralNetwork {
    constructor(inputNodes, hiddenNodes, outputNodes) {
        this.inputNodes = inputNodes;
        this.hiddenNodes = hiddenNodes;
        this.outputNodes = outputNodes;

        // Pesos aleatórios para as conexões entre os nós de entrada, escondidos e saída
        this.weightsInputHidden = this.initializeWeights(this.inputNodes, this.hiddenNodes);
        this.weightsHiddenOutput = this.initializeWeights(this.hiddenNodes, this.outputNodes);

        // Função de ativação: Sigmoid
        this.sigmoid = (x) => 1 / (1 + Math.exp(-x));
    }

    // Função para inicializar os pesos aleatoriamente
    initializeWeights(inputNodes, outputNodes) {
        let weights = new Array(outputNodes);
        for (let i = 0; i < outputNodes; i++) {
            weights[i] = new Array(inputNodes);
            for (let j = 0; j < inputNodes; j++) {
                weights[i][j] = Math.random() * 2 - 1; // Pesos entre -1 e 1
            }
        }
        return weights;
    }

    // Propagação para frente (Forward Propagation)
    feedForward(inputArray) {
        // Calcula os valores da camada escondida
        let hiddenOutputs = this.multiplyMatrix(this.weightsInputHidden, inputArray);
        hiddenOutputs = hiddenOutputs.map(this.sigmoid);

        // Calcula os valores da camada de saída
        let outputOutputs = this.multiplyMatrix(this.weightsHiddenOutput, hiddenOutputs);
        outputOutputs = outputOutputs.map(this.sigmoid);

        return outputOutputs;
    }

    // Função para multiplicação de matrizes
    multiplyMatrix(weights, inputs) {
        let result = new Array(weights.length).fill(0);
        for (let i = 0; i < weights.length; i++) {
            for (let j = 0; j < inputs.length; j++) {
                result[i] += weights[i][j] * inputs[j];
            }
        }
        return result;
    }

    // Função de treinamento (apenas um passo simples de backpropagation)
    train(inputArray, targetArray) {
        // Passo de forward propagation
        let hiddenOutputs = this.multiplyMatrix(this.weightsInputHidden, inputArray);
        hiddenOutputs = hiddenOutputs.map(this.sigmoid);

        let outputOutputs = this.multiplyMatrix(this.weightsHiddenOutput, hiddenOutputs);
        outputOutputs = outputOutputs.map(this.sigmoid);

        // Backpropagation - Ajuste dos pesos
        let outputErrors = targetArray.map((target, i) => target - outputOutputs[i]);

        // Ajustar pesos da camada de saída para a camada escondida
        for (let i = 0; i < this.weightsHiddenOutput.length; i++) {
            for (let j = 0; j < this.weightsHiddenOutput[i].length; j++) {
                this.weightsHiddenOutput[i][j] += outputErrors[i] * hiddenOutputs[j];
            }
        }

        // Ajustar pesos da camada de entrada para a camada escondida (treinamento básico)
        let hiddenErrors = new Array(this.hiddenNodes).fill(0);
        for (let i = 0; i < this.hiddenNodes; i++) {
            for (let j = 0; j < this.outputNodes; j++) {
                hiddenErrors[i] += this.weightsHiddenOutput[j][i] * outputErrors[j];
            }
        }

        for (let i = 0; i < this.weightsInputHidden.length; i++) {
            for (let j = 0; j < this.weightsInputHidden[i].length; j++) {
                this.weightsInputHidden[i][j] += hiddenErrors[i] * inputArray[j];
            }
        }
    }
}

// Função para criar uma instância da rede neural e usar prompts como entrada
function executeNeuralNetwork(prompts) {
    // Definir a estrutura da rede neural
    const inputNodes = 3; // Exemplos de tamanho da entrada
    const hiddenNodes = 4; // Nós na camada escondida
    const outputNodes = 2; // Número de saídas

    const neuralNetwork = new NeuralNetwork(inputNodes, hiddenNodes, outputNodes);

    // Simulação de dados de entrada (exemplo de prompt que pode ser numérico ou categórico)
    let inputArray = prompts.map(prompt => parseFloat(prompt) || 0); // Converte strings em números
    if (inputArray.length < inputNodes) {
        console.error("Entrada insuficiente para a rede neural.");
        return;
    }

    // Exemplo de objetivo esperado (target)
    let targetArray = [1, 0]; // Defina conforme a tarefa

    // Treinar a rede neural com os prompts
    neuralNetwork.train(inputArray, targetArray);

    // Obter a resposta da rede neural
    let output = neuralNetwork.feedForward(inputArray);

    console.log("Saída da Rede Neural:", output);
}

// Exemplo de uso com prompts
let userPrompts = ["2", "0.5", "1"];
executeNeuralNetwork(userPrompts);

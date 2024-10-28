document.getElementById('predictButton').addEventListener('click', async () => {
    // Obtenha os valores dos inputs
    const input1 = parseFloat(document.getElementById('input1').value);
    const input2 = parseFloat(document.getElementById('input2').value);

    if (isNaN(input1) || isNaN(input2)) {
        document.getElementById('output').textContent = 'Por favor, insira valores válidos!';
        return;
    }

    // Cria e treina o modelo
    const model = await createModel();
    await trainModel(model);

    // Realiza a previsão com os inputs
    const output = model.predict(tf.tensor2d([[input1, input2]])).dataSync();

    // Exibe o resultado da previsão
    document.getElementById('output').textContent = output;
});

// Função para criar o modelo da rede neural
async function createModel() {
    // Define o modelo sequencial
    const model = tf.sequential();

    // Adiciona uma camada densa de entrada e oculta com 3 neurônios e função de ativação relu
    model.add(tf.layers.dense({
        inputShape: [2],  // Dois parâmetros de entrada
        units: 3,  // Número de neurônios
        activation: 'relu'
    }));

    // Adiciona a camada de saída com 1 neurônio (previsão de um valor) e função de ativação linear
    model.add(tf.layers.dense({
        units: 1,  // Saída com 1 valor
        activation: 'linear'
    }));

    // Compila o modelo usando o otimizador Adam e a função de perda meanSquaredError
    model.compile({
        optimizer: 'adam',
        loss: 'meanSquaredError'
    });

    return model;
}

// Função para treinar o modelo
async function trainModel(model) {
    // Conjunto de dados de treinamento (entradas e saídas)
    const inputs = tf.tensor2d([
        [1, 2],
        [2, 3],
        [3, 4],
        [4, 5]
    ]);

    const outputs = tf.tensor2d([
        [3],
        [5],
        [7],
        [9]
    ]);

    // Treina o modelo
    await model.fit(inputs, outputs, {
        epochs: 100,  // Número de vezes que o modelo verá todos os dados
        verbose: 0  // Oculta os logs de treinamento
    });

    console.log('Modelo treinado');
}

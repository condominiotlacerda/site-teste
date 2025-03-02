// Objeto que armazena os códigos de acesso e informações dos usuários
const accessCodes = {
    'aB9x-Yz!2W': { id: 'apto1', name: 'João Paulo' },
    'cDe5_Fg#H7': { id: 'apto101', name: 'Lizandro' },
    'iJk1$Lm%N3': { id: 'apto102', name: 'Felipe Granja' },
    'oPq8^Rs&T4': { id: 'apto201', name: 'Jorge' },
    'xY7z!aB-cD': { id: 'apto201', name: 'Ângela' },
    'FgH7+iJk=1': { id: 'apto302', name: 'Suzane' },
    'LmN3[oPq]8': { id: 'apto401', name: 'Célia' }
};

// Variável para armazenar o ID do botão do apartamento ativo
let activeApartmentButtonId = null;

// Função para habilitar o botão do apartamento correspondente ao código de acesso inserido
function enableApartment() {
    // Obtém o código de acesso inserido e remove espaços em branco
    const code = document.getElementById('accessCode').value.trim();
    // Obtém os dados do usuário correspondentes ao código de acesso
    const userData = accessCodes[code];

    // Verifica se o código de acesso é válido
    if (userData) {
        // Extrai o ID e o nome do usuário dos dados do usuário
        const { id, name } = userData;

        // Desabilita todos os botões de apartamento
        document.querySelectorAll('.apartment-button').forEach(btn => btn.disabled = true);

        // Limpa a lista de arquivos e oculta os contêineres de arquivos e visualizador
        document.getElementById('file-list').innerHTML = '';
        document.getElementById('file-container').style.display = 'none';
        document.getElementById('viewer-container').style.display = 'none';

        // Habilita o botão do apartamento correspondente ao código de acesso
        const aptButton = document.getElementById(id);
        if (aptButton) {
            aptButton.disabled = false;
        } else {
            // Exibe um alerta se o botão do apartamento não for encontrado
            alert('Erro: botão do apartamento não encontrado.');
            return;
        }

        // Armazena o ID do botão do apartamento ativo
        activeApartmentButtonId = id;

        // Atualiza a mensagem de boas-vindas com o nome do usuário
        document.getElementById('welcome-message').innerHTML = `Seja bem-vindo(a), ${name}. Clique no botão do seu apartamento para acessar seus boletos.`;

        // Limpa o campo de código de acesso
        document.getElementById('accessCode').value = '';

        // Registra o acesso no Firebase
        window.logAccess(code, name, `Acesso ao apartamento ${id.replace('apto', '')}`, id);
    } else {
        // Exibe um alerta se o código de acesso for inválido
        alert('Código de acesso inválido.');
    }
}

// Função para exibir a lista de arquivos do apartamento selecionado
function showFiles(apartment) {
    // Obtém os elementos do contêiner de arquivos, lista de arquivos e visualizador
    const fileContainer = document.getElementById('file-container');
    const fileList = document.getElementById('file-list');
    const viewerContainer = document.getElementById('viewer-container');

    // Oculta o contêiner de arquivos e limpa a lista de arquivos
    fileContainer.style.display = 'none';
    fileList.innerHTML = '';

    // Define o número do apartamento no título do contêiner de arquivos
    document.getElementById('apartment-number').textContent = apartment;
    // Exibe o contêiner de arquivos
    fileContainer.style.display = 'block';

    // Adiciona uma classe para ativar a animação de exibição do contêiner de arquivos
    fileContainer.classList.remove('active');
    setTimeout(() => fileContainer.classList.add('active'), 50);

    // Obtém a lista de arquivos do apartamento
    let files = getFilesForApartment(apartment);

    // Cria os elementos da lista de arquivos
    files.forEach(file => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = "#";
        link.textContent = file.name;

        // Verifica se a tela é de um dispositivo móvel
        const isMobile = window.innerWidth <= 768;

        // Define a função a ser executada ao clicar no link do arquivo
        link.onclick = function (event) {
            event.preventDefault();
            if (isMobile) {
                // Abre o arquivo em uma nova aba se for um dispositivo móvel
                window.open(file.path, "_blank");
            } else {
                // Abre o visualizador de arquivos se não for um dispositivo móvel
                openFileViewer(file.path);
            }

            // Registra o acesso ao arquivo no Firebase
            const userData = Object.values(accessCodes).find(user => user.id === `apto${apartment}`);
            if (userData) {
                window.logAccess(userData.id, userData.name, file.name, apartment);
            }
        };

        // Adiciona o link à lista de arquivos
        listItem.appendChild(link);
        fileList.appendChild(listItem);
    });

    // Oculta o visualizador de arquivos
    viewerContainer.style.display = 'none';
}

// Função para abrir o visualizador de arquivos
function openFileViewer(filePath) {
    // Obtém os elementos do visualizador de arquivos, iframe e botão de download
    const viewerContainer = document.getElementById('viewer-container');
    const fileViewer = document.getElementById('file-viewer');
    const downloadButton = document.getElementById('download-button');

    // Define o caminho do arquivo no iframe e no botão de download
    fileViewer.src = filePath;
    downloadButton.href = filePath;

    // Exibe o visualizador de arquivos
    viewerContainer.style.display = 'block';
    // Adiciona uma classe para ativar a animação de exibição do visualizador
    viewerContainer.classList.remove('active');
    setTimeout(() => viewerContainer.classList.add('active'), 50);
}

// Função para obter a lista de arquivos do apartamento
function getFilesForApartment(apartment) {
    // Define o caminho base dos arquivos
    const baseUrl = 'pdfs/';
    // Define a lista de arquivos padrão
    let files = [
        { name: 'Boleto Condomínio', path: `<span class="math-inline">\{baseUrl\}boletos/2025/3\.mar/boleto\_tx\_condominio\_apto\_</span>{apartment}.pdf` },
        { name: 'Boleto Acordo M2D', path: `<span class="math-inline">\{baseUrl\}boletos/2025/3\.mar/boleto\_tx\_acordo\_m2d\_apto\_</span>{apartment}.pdf` },
        { name: 'Boleto Hidro/Eletr', path: `<span class="math-inline">\{baseUrl\}boletos/2025/3\.mar/boleto\_tx\_hidro\_eletr\_apto\_</span>{apartment}.pdf` }
    ];

    // Verifica se o apartamento é 1 e adiciona arquivos específicos
    if (apartment === "1") {
        files.push({ name: 'Boleto Condomínio 1A', path: `${baseUrl}boletos/2025/3.mar/boleto_tx_condominio_apto_1a.pdf` });
        files.push({ name: 'Boleto Acordo M2D 1A', path: `${baseUrl}boletos/2025/3.mar/boleto_tx_acordo_m2d_apto_1a.pdf` });
        files.push({ name: 'Boleto Hidro/Eletr 1A', path: `${baseUrl}boletos/2025/3.mar/boleto_tx_hidro_eletr_apto_1a.pdf` });

        files.push({ name: 'Boleto Condomínio 1B', path: `${baseUrl}boletos/2025/3.mar/boleto_tx_condominio_apto_1b.pdf` });
        files.push({ name: 'Boleto Acordo M2D 1B', path: `${baseUrl}boletos/2025/3.mar/boleto_tx_acordo_m2d_apto_1b.pdf` });
        files.push({ name: 'Boleto Hidro/Eletr 1B', path: `${baseUrl}boletos/2025/3.mar}_apto_1b.pdf` });
    }

    // Adiciona a prestação de contas uma única vez
    files.push({ name: 'Prestação de Contas', path: `${baseUrl}contas/2025/2.fev/prestacao_contas.pdf` });

    // Retorna a lista de arquivos
    return files;
}

// Evento disparado quando o DOM é totalmente carregado
document.addEventListener("DOMContentLoaded", function () {
    // Desabilita os botões dos apartamentos 202 e 301
    document.getElementById("apto202").disabled = true;
    document.getElementById("apto301").disabled = true;
});

// Função para registrar o download de arquivos no Firebase (ajustada para UTC-3)
window.logAccess = function (userCode, userName, downloadedFile, apartment) {
    // Obtém a instância do banco de dados do Firebase
    const db = getDatabase();

    // Obtém a data e hora atuais e ajusta para UTC-3
    let now = new Date();
    now.setHours(now.getHours() - 3);

    // Cria o objeto de log com os dados do download
    const accessLog = {
        userName: userName,
        apartment: apartment,
        downloadedFile: downloadedFile,
        userCode: userCode,
        accessDateTime: now.toISOString()
    };

    // Cria uma referência para a coleção de logs no Firebase
    const logsRef = ref(db, 'logs/');
    // Adiciona o log ao Firebase
    push(logsRef, accessLog)
        .then(() => console.log('Log registrado com sucesso:', accessLog))
        .catch(error => console.error('Erro ao registrar o log:', error));
};

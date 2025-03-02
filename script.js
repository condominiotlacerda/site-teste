const accessCodes = {
    'aB9x-Yz!2W': { id: 'apto1', name: 'João Paulo' },
    'cDe5_Fg#H7': { id: 'apto101', name: 'Lizandro' },
    'iJk1$Lm%N3': { id: 'apto102', name: 'Felipe Granja' },
    'oPq8^Rs&T4': { id: 'apto201', name: 'Jorge' },
    'xY7z!aB-cD': { id: 'apto201', name: 'Ângela' },
    'FgH7+iJk=1': { id: 'apto302', name: 'Suzane' },
    'LmN3[oPq]8': { id: 'apto401', name: 'Célia' }
};

const accessInput = document.getElementById('accessCode');
const accessButton = document.getElementById('accessButton');
const successCircle = document.getElementById('successCircle');

accessButton.addEventListener('click', () => {
    const code = accessInput.value;
    if (accessCodes[code]) {
        successCircle.style.display = 'block';
        setTimeout(() => {
            successCircle.style.display = 'none';
        }, 5000); // 5000 milissegundos = 5 segundos
    } else {
        alert('Código de acesso inválido.');
    }
});

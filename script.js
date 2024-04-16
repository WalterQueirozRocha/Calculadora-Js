class Calculadora {

    constructor() {
        this.ligada = true;
        this.nrVisor = '0';
        this.ptDecimal = false;
        this.iniciouSegundo = false;
        this.memTemp = '';
        this.estadoErro = false;
        this.memoria = 0;
        this.op = {
            NOP: 0,
            DIV: 1,
            MULT: 2,
            SUB: 3,
            SUM: 4
        };
        this.opAtual = this.op.NOP;
        this.simboloOperacao = ''; //simbolo da operação inicia vazio
    }

    mostrarVisor() {
        if (!this.ligada) {
            return ''; // Retorna '0' se a calculadora estiver desligada
        }
        if (this.estadoErro) {
            this.nrVisor = '0';
            return 'ERRO!';
        }
        if (this.nrVisor.length == 0 || this.nrVisor === '0') { // Verifica se nrVisor está vazio ou igual a '0'
            return '0'; // Retorna '0' se nrVisor estiver vazio ou igual a '0'
        }
        let parsedNrVisor = parseFloat(this.nrVisor);
        let formattedNrVisor;
        if (Number.isInteger(parsedNrVisor)) {
            formattedNrVisor = parsedNrVisor.toString(); // Se for um número inteiro, não há necessidade de formatar as casas decimais
        } else {
            formattedNrVisor = parsedNrVisor.toFixed(9 - Math.floor(Math.log10(Math.abs(parsedNrVisor))) - 1);
            // Formata as casas decimais, mantendo até 9 casas decimais
        }
        formattedNrVisor = formattedNrVisor.replace(/(\.\d*?[1-9])0*$/, '$1');
        // Remove os zeros à direita das casas decimais, exceto se houver dígitos não zero após o ponto decimal
        
        // Adiciona o símbolo da operação se houver uma operação selecionada
        if (this.simboloOperacao !== '') {
            formattedNrVisor += ' ' + this.simboloOperacao;
        }
        
        return formattedNrVisor;
    }
    
    // Função para limpar a seleção da operação e remover o símbolo da operação do visor
    limparSelecaoOperacao = () => {
        // Remove a classe 'selected-operation' de todos os botões de operação
        document.querySelectorAll('.tecla-esp[op]').forEach(opButton => {
            opButton.classList.remove('selected-operation');
        });
        // Remove o símbolo da operação do visor
        this.simboloOperacao = '';
        atualizaVisor();
    }

    // recebe dígito
    digito(dig) {
        if (!calculadora.ligada) return;
        if (this.estadoErro) return;
        if (dig.length != 1) return;
        if ((dig < '0' || dig > '9') && dig != '.') return;
        if (!this.iniciouSegundo && this.opAtual != this.op.NOP) {
            this.iniciouSegundo = true;
            this.ptDecimal = false;
            this.nrVisor = '0';
            this.limparSelecaoOperacao(); // Limpa a seleção da operação e remove o símbolo do visor
        }
        if (this.nrVisor.length == 10) return;
        if (dig == '.') {
            if (this.ptDecimal) return;
            this.ptDecimal = true;
        }
        if (this.nrVisor == '0') {
            this.nrVisor = dig == '.' ?  '0.' : dig;
        } else {
            this.nrVisor += dig;
        }
    }



    // Definir qual a operação atual
    defineOperacao(op) {
        if (!calculadora.ligada) return;
        if (this.estadoErro) return;
        if(this.opAtual != this.op.NOP){
            this.igual();
            this.memTemp = this.nrVisor;
        }
        switch (op) {
            case '+':
                this.opAtual = this.op.SUM;
                this.simboloOperacao = '+'; // Usando o símbolo de mais
                break;
            case '-':
                this.opAtual = this.op.SUB;
                this.simboloOperacao = '-'; // Usando o símbolo de menos
                break;
            case '*':
                this.opAtual = this.op.MULT;
                this.simboloOperacao = '×'; // Usando o símbolo de multiplicação
                break;
            case '/':
                this.opAtual = this.op.DIV;
                this.simboloOperacao = '÷'; // Usando o símbolo de divisão
                break;
        }
        this.memTemp = this.nrVisor;
    }
    
    // Executa operação: tecla IGUAL
    igual() {
        if (!calculadora.ligada) return;
        if (this.estadoErro) return;
        if (this.opAtual == this.op.NOP) return;
        let num1 = parseFloat(this.memTemp);
        let num2 = parseFloat(this.nrVisor);
        let resultado = 0;
        switch (this.opAtual) {
            case this.op.DIV:
                if (num2 == 0) {
                    this.estadoErro = true;
                    return;
                }
                resultado = num1 / num2;
                this.simboloOperacao = '';
                break;
            case this.op.MULT:
                resultado = num1 * num2;
                this.simboloOperacao = '';
                break;
            case this.op.SUB:
                resultado = num1 - num2;
                this.simboloOperacao = '';
                break;
            case this.op.SUM:
                resultado = num1 + num2;
                this.simboloOperacao = '';
                break;
        }
        this.opAtual = this.op.NOP;
        this.iniciouSegundo = false;
        this.ptDecimal = false;
        this.memTemp = '';
        this.nrVisor = resultado; // Manter o valor original sem arredondamento
    }

    // Limpa dados (exceto memória)
    teclaC() {
        if (!calculadora.ligada) return;
        this.nrVisor = '0'; // Define nrVisor como '0' ao pressionar a tecla C
        this.ptDecimal = false;
        this.iniciouSegundo = false;
        this.opAtual = this.op.NOP;
        this.memTemp = '';
        this.estadoErro = false;
        this.simboloOperacao = ''; // Limpa operacoes 
        document.querySelectorAll('.tecla-esp[op]').forEach(opButton => {
            opButton.classList.remove('selected-operation');
        });
    }
    

    // tecla M+ : acrescenta à memória o número no visor
    teclaMmais() {
        if (!calculadora.ligada) return;
        if (this.estadoErro) return;
        this.memoria += parseFloat(this.nrVisor);
    }

    // tecla M- : subtrai da memória o número no visor
    teclaMmenos() {
        if (!calculadora.ligada) return;
        if (this.estadoErro) return;
        this.memoria -= parseFloat(this.nrVisor);
    }

    // tecla RM : recupera o conteúdo da memória -> coloca no visor
    teclaRM() {
        if (!calculadora.ligada) return;
        if (this.estadoErro) return;
        this.nrVisor = String(this.memoria);
    }

    // tecla CLM : limpa totalmente o conteúdo da memória -> atribui 0
    teclaCLM() {
        if (!calculadora.ligada) return;
        if (this.estadoErro) return;
        this.memoria = 0;
    }

    // Tecla on/off
    teclaOnOff() {
        this.ligada = !this.ligada;  // Inverte o estado ligado/desligado
        if (!this.ligada) {  // Se estiver desligada, limpa as informações
            this.teclaC();
        }
    }

    raizQuadrada() {
        if (this.estadoErro) return;

        let num = parseFloat(this.nrVisor);
        if (num < 0) {
            this.estadoErro = true;
            return;
        }

        let resultado = Math.sqrt(num);
        this.nrVisor = String(resultado).slice(0, 10);
    }

    // Função para calcular o inverso (1/x)
    inverso() {
        if (this.estadoErro) return;

        let num = parseFloat(this.nrVisor);
        if (num === 0) {
            this.estadoErro = true;
            return;
        }

        let resultado = 1 / num;
        this.nrVisor = String(resultado).slice(0, 10);
    }

    // Função para calcular a porcentagem
    porcentagem() {
        if (this.estadoErro) return;

        let num = parseFloat(this.nrVisor);
        let resultado = num / 100;
        this.nrVisor = String(resultado).slice(0, 10);
    }

    // Função para trocar o sinal (+/-)
    trocaSinal() {
        if (this.estadoErro) return;

        let num = parseFloat(this.nrVisor);
        this.nrVisor = String(-num).slice(0, 10);
    }

    // Função para calcular o quadrado
    quadrado() {
        if (this.estadoErro) return;

        let num = parseFloat(this.nrVisor);
        let resultado = num * num;
        this.nrVisor = String(resultado).slice(0, 10);
    }

}

// ==================================================================
//  RESPOSTAS A EVENTOS DO HTML
// ==================================================================

// ATUALIZA O VALOR NO VISOR

document.querySelector('#visor-id .memoria-m').style.visibility = 'hidden';

let atualizaVisor = () => {
    let visorAtual = calculadora.mostrarVisor();
    let memoriaM = document.querySelector('#visor-id .memoria-m');

    if (calculadora.memoria == 0) {
        memoriaM.style.visibility = 'hidden';
    } else {
        memoriaM.style.visibility = 'visible';
    }
    
    document.querySelector('#visor-id .visor-conteudo').innerText = visorAtual;
}

// RECEBE UM DÍGITO (OU PONTO)
let digito = (dig) => {
    calculadora.digito(dig);
    atualizaVisor();
}

// RECEBE OPERAÇÃO ATUAL
let defOp = (op) => {
    // Remove a classe 'selected-operation' de todos os botões de operação
    document.querySelectorAll('.tecla-esp[op]').forEach(opButton => {
        opButton.classList.remove('selected-operation');
    });
    
    // Adiciona a classe 'selected-operation' ao botão da operação selecionada
    let selectedOpButton = document.querySelector(`.tecla-esp[op="${op}"]`);
    if (selectedOpButton) {
        selectedOpButton.classList.add('selected-operation');
    }
    
    // Define a operação atual e atualiza o visor
    calculadora.defineOperacao(op);
    atualizaVisor();
}

// CALCULA A OPERAÇÃO
let defIgual = () => {
    calculadora.igual();
    atualizaVisor();
}

// TECLA C: LIMPA TUDO, EXCETO MEMÓRIA
let teclaC = () => {
    calculadora.teclaC();
    atualizaVisor();
}

// M+ ACRESCENTA À MEMÓRIA O NÚMERO ATUAL NO VISOR
let teclaMmais = () => {
    calculadora.teclaMmais();
}

// M- SUBTRAI DA MEMÓRIA O NÚMERO ATUAL NO VISOR
let teclaMmenos = () => {
    calculadora.teclaMmenos();
}

// PÕE NO VISOR O CONTEÚDO DA MEMÓRIA
let teclaRM = () => {
    calculadora.teclaRM();
    atualizaVisor();
}

// APAGA TODO O CONTEÚDO DA MEMÓRIA
let teclaCLM = () => {
    calculadora.teclaCLM();
}

// Função para desligar a calculadora
let teclaOnOff = () => {
    calculadora.teclaOnOff();
    // Se a calculadora estiver desligada, remova a classe de seleção de todos os botões de operação
    if (!calculadora.ligada) {
        document.querySelectorAll('.tecla-esp').forEach(opButton => {
            opButton.classList.remove('selected-operation');
        });
    }
    calculadora.teclaC();
    atualizaVisor();
}


// ========================================================
//  INÍCIO DO PROCESSAMENTO
// ========================================================

let calculadora = new Calculadora();
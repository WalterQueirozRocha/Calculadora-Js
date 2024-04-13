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
    }

    mostrarVisor() {
        if (!this.ligada) {
            return '';
        }
        if (this.estadoErro) {
            this.nrVisor = '0';
            return 'ERRO!';
        }
        if (this.nrVisor.length == 0) {
            this.nrVisor = '0';
        }
        return this.nrVisor;
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
        switch (op) {
            case '+':
                this.opAtual = this.op.SUM;
                break;
            case '-':
                this.opAtual = this.op.SUB;
                break;
            case '*':
                this.opAtual = this.op.MULT;
                break;
            case '/':
                this.opAtual = this.op.DIV;
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
                resultado = num1/num2;
                break;
            case this.op.MULT:
                resultado = num1*num2;
                break;
            case this.op.SUB:
                resultado = num1 - num2;
                break;
            case this.op.SUM:
                resultado = num1 + num2;
                break;
        }
        this.opAtual = this.op.NOP;
        this.iniciouSegundo = false;
        this.ptDecimal = false;
        this.memTemp = '';
        this.nrVisor = String(resultado).slice(0, 10);
    }

    // Limpa dados (exceto memória)
    teclaC() {
        if (!calculadora.ligada) return;
        this.nrVisor = '0';
        this.ptDecimal = false;
        this.iniciouSegundo = false;
        this.opAtual = this.op.NOP;
        this.memTemp = '';
        this.estadoErro = false;
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
    if (calculadora.opAtual != calculadora.op.NOP) {
        defIgual();
        atualizaVisor();
    }
    calculadora.defineOperacao(op);
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

//função on/off
let teclaOnOff = () => {
    calculadora.teclaOnOff();
    calculadora.teclaC();
    atualizaVisor();
}

// ========================================================
//  INÍCIO DO PROCESSAMENTO
// ========================================================

let calculadora = new Calculadora();


const form        = document.getElementById('form-orcamento');
const txtMensagem = document.getElementById('mensagem');
const charAtual   = document.getElementById('char-atual');
const erroMensagem = document.getElementById('erro-mensagem');
const erroNumeros  = document.getElementById('erro-numeros');
const feedbackOk  = document.getElementById('feedback-sucesso');
const feedbackTxt = document.getElementById('feedback-texto');
const btnAbrir    = document.getElementById('btn-abrir');

const inputsNumero = [document.getElementById('numero-1')];

txtMensagem.addEventListener('input', () => {
  charAtual.textContent = txtMensagem.value.length;
});

/**
 * Remove todos os caracteres que não sejam dígitos de uma string.
 * Aceita entradas como: +55 (53) 9 9999-9999 → 5553999999999
 *
 * @param {string} raw - Número digitado pelo usuário.
 * @returns {string} Apenas os dígitos.
 */
function sanitizarNumero(raw) {
  return raw.replace(/\D/g, '');
}

/**
 * Valida se o número possui um tamanho compatível com o formato DDI+DDD+número.
 * @param {string} numero - Número já sanitizado (somente dígitos).
 * @returns {{ valido: boolean, motivo: string }}
 */
function validarNumero(numero) {
  if (numero.length < 10) {
    return { valido: false, motivo: `"${numero}" é curto demais. Inclua DDI e DDD.` };
  }
  if (numero.length > 15) {
    return { valido: false, motivo: `"${numero}" é longo demais (máx. 15 dígitos).` };
  }
  return { valido: true, motivo: '' };
}

/**
 * Exibe ou limpa uma mensagem de erro em um elemento de erro.
 *
 * @param {HTMLElement} el - Elemento onde o erro será exibido.
 * @param {string} msg     - Mensagem de erro. Vazio = limpa o erro.
 */
function setErro(el, msg) {
  el.textContent = msg;
}

/**
 * Marca visualmente um campo como inválido ou válido.
 *
 * @param {HTMLElement} campo - O input ou textarea.
 * @param {boolean} invalido  - true = adiciona classe error, false = remove.
 */
function marcarCampo(campo, invalido) {
  if (invalido) {
    campo.classList.add('error');
  } else {
    campo.classList.remove('error');
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();

  setErro(erroMensagem, '');
  setErro(erroNumeros, '');
  marcarCampo(txtMensagem, false);
  inputsNumero.forEach(i => marcarCampo(i, false));
  feedbackOk.classList.add('hidden');

  let temErro = false;

  const mensagemBase = txtMensagem.value.trim();

  if (!mensagemBase) {
    setErro(erroMensagem, 'Por favor, escreva a mensagem.');
    marcarCampo(txtMensagem, true);
    temErro = true;
  }

  const camposPreenchidos = inputsNumero
    .map((inp, idx) => ({ num: sanitizarNumero(inp.value), idx }))
    .filter(({ num }) => num.length > 0);

  if (camposPreenchidos.length === 0) {
    setErro(erroNumeros, 'Informe pelo menos um número de WhatsApp.');
    inputsNumero.forEach(i => marcarCampo(i, true));
    temErro = true;
  } else {
    const erros = [];

    camposPreenchidos.forEach(({ num, idx }) => {
      const { valido, motivo } = validarNumero(num);
      if (!valido) {
        marcarCampo(inputsNumero[idx], true);
        erros.push(`Campo ${idx + 1}: ${motivo}`);
      }
    });

    if (erros.length > 0) {
      setErro(erroNumeros, erros.join(' | '));
      temErro = true;
    }
  }

  if (temErro) return;

  const mensagemCodificada = encodeURIComponent(mensagemBase);

  const numerosValidos = camposPreenchidos.map(({ num }) => num);

  numerosValidos.forEach((numero) => {
    /**
     * URL oficial do WhatsApp para abrir conversa com mensagem pré-preenchida.
     * Documentação: https://faq.whatsapp.com/425247423114725
     *
     * Formato: https://wa.me/NUMERO?text=MENSAGEM
     * - NUMERO: número no formato E.164 sem o "+" (ex: 5553999999999)
     * - MENSAGEM: texto codificado com encodeURIComponent
     *
     * O WhatsApp abre a conversa com o texto no campo de digitação.
     * O USUÁRIO deve clicar em "Enviar" manualmente.
     */
    const url = `https://wa.me/${numero}?text=${mensagemCodificada}`;
    window.open(url, '_blank');
  });

  const plural = numerosValidos.length > 1 ? 'abas abertas' : 'aba aberta';
  feedbackTxt.textContent =
    `${numerosValidos.length} ${plural}. Revise a mensagem e envie manualmente no WhatsApp.`;
  feedbackOk.classList.remove('hidden');

  btnAbrir.disabled = true;
  setTimeout(() => {
    btnAbrir.disabled = false;
  }, 3000);
});

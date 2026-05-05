# Envio de Mensagens por WhatsApp

Extensão para Chrome que abre uma conversa no WhatsApp Web com uma mensagem pré-preenchida. Útil para enviar mensagens por whatsApp quando não se tem o botão de whatsApp sem precisar salvar o numero para chamar.

> A extensão **não envia nada automaticamente** — ela apenas abre a conversa com o texto pronto. Você revisa e clica em Enviar no WhatsApp.

## Como funciona

1. Você abre o popup da extensão
2. Digita a mensagem e o número do destinatário (com DDI e DDD)
3. Clica em **Abrir conversa no WhatsApp**
4. O WhatsApp Web abre com a mensagem pronta — é só enviar

## Instalação

Por enquanto a extensão não está publicada na Chrome Web Store. Para instalar manualmente:

1. Baixe ou clone este repositório
   ```
   git clone https://github.com/oGustavo-Loper/sendMensageWpp.git
   ```
2. Abra o Chrome e acesse `chrome://extensions`
3. Ative o **Modo do desenvolvedor** (canto superior direito)
4. Clique em **Carregar sem compactação**
5. Selecione a pasta do projeto

Pronto! O ícone da extensão vai aparecer na barra do Chrome.

## Screenshot

[Imagem da extensão](/icons/image.png)

## Formato do número

O campo aceita o número em vários formatos — espaços, parênteses, traços e o `+` são removidos automaticamente:

| Você digita | Vira |
|---|---|
| `+55 (53) 9 9999-9999` | `5553999999999` |
| `5553999999999` | `5553999999999` |

O número precisa ter DDI + DDD + número (mínimo 10 dígitos, máximo 15).

## Tecnologias

- HTML, CSS e JavaScript puro
- Manifest V3 (padrão atual das extensões Chrome)

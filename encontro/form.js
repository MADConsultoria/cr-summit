const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwG4T1w-3xeH1bx-9YsWU753UZVZo6Ne15vUEVbFS3QcJQwut1FTQIPahhj625COwyfgQ/exec';

const leadForm = document.querySelector('#cr-summit-form');

if (leadForm) {
  const submitButton = leadForm.querySelector('button[type="submit"]');
  const statusMessage = leadForm.querySelector('[data-form-status]');

  leadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!leadForm.reportValidity()) {
      return;
    }

    if (!APPS_SCRIPT_URL) {
      statusMessage.textContent = 'Formulario aguardando a URL de implantacao do Apps Script.';
      statusMessage.classList.add('is-error');
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'ENVIANDO...';
    statusMessage.textContent = '';
    statusMessage.classList.remove('is-error');

    const payload = new URLSearchParams(new FormData(leadForm));
    payload.set('pagina', window.location.href);

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: payload.toString()
      });

      window.location.href = './obrigado/index.html';
    } catch (error) {
      statusMessage.textContent = 'Nao foi possivel enviar agora. Tente novamente.';
      statusMessage.classList.add('is-error');
      submitButton.disabled = false;
      submitButton.textContent = 'GARANTIR MINHA VAGA';
    }
  });
}

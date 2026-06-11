const SPREADSHEET_ID = '1cOY3x0N0fNnMAMQUhV7eGhE9a2f7v3jj-cCVLPPoCg4';
const SHEET_NAME = 'Leads';
const FORM_ID = 'cr-summit-27-06-2026';

const HEADERS = [
  'Data',
  'Nome',
  'Email',
  'WhatsApp',
  'Origem',
  'Formulario',
  'Pagina',
  'Consentimento'
];

function doPost(e) {
  try {
    const data = parsePayload_(e);

    if (normalize_(data.formularioId) !== FORM_ID) {
      throw new Error('Formulario nao autorizado.');
    }

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error('Aba nao encontrada: ' + SHEET_NAME);
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      ensureHeaders_(sheet);
      sheet.appendRow([
        new Date(),
        firstValue_(data.nome, data.name),
        firstValue_(data.email),
        firstValue_(data.whatsapp, data.telefone, data.phone),
        firstValue_(data.origem, data.source, 'LP CR Summit 27/06/2026'),
        FORM_ID,
        firstValue_(data.pagina, data.pageUrl),
        consentValue_(data.consentimento)
      ]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse_({ ok: true, formulario: FORM_ID });
  } catch (error) {
    console.error(error);
    return jsonResponse_({ ok: false, error: error.message });
  }
}

function doGet() {
  return jsonResponse_({
    ok: true,
    formulario: FORM_ID,
    destino: SPREADSHEET_ID,
    aba: SHEET_NAME
  });
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  }
}

function parsePayload_(e) {
  if (!e) {
    throw new Error('Requisicao sem dados.');
  }

  if (e.parameter && Object.keys(e.parameter).length) {
    return e.parameter;
  }

  if (!e.postData || !e.postData.contents) {
    throw new Error('Requisicao sem dados.');
  }

  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    throw new Error('Payload invalido.');
  }
}

function firstValue_() {
  for (let index = 0; index < arguments.length; index += 1) {
    const value = arguments[index];

    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }

  return '';
}

function consentValue_(value) {
  const normalized = normalize_(value);
  return value === true || normalized === 'sim' || normalized === 'on'
    ? 'Sim'
    : (value || '');
}

function normalize_(value) {
  return String(value || '').trim().toLowerCase();
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

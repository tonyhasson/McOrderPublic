const { detectIntent } = require('./df');

async function getDialogflowResponse(languageCode, queryText, sessionId) {
  const result = await detectIntent(languageCode, queryText, sessionId);
  return result;
}

module.exports = { getDialogflowResponse };

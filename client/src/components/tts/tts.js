const makeSound = async (text) => {
  const ENDPOINT = 'https://tiktok-tts.weilnet.workers.dev';
  const voice = 'en_us_001';
  try {
    if (text === '') {
      text = 'Next Customer?';
    }
    const response = await fetch(`${ENDPOINT}/api/generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice,
      }),
    });
    const resp = await response.json();
    if (resp.data === null) {
      console.log(resp.error);
    } else {
      return `data:audio/mpeg;base64,${resp.data}`;
    }
  } catch (err) {
    console.log(err);
  }
};

export default makeSound;

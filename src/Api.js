import axios from 'axios';

export async function createSelenoidSession(url, options) {
  try {
    return await axios.post(url, options);
  } catch (err) {
    throw new Error(
      `Selenoid Session creation Failed ${err.toJSON().message} with data ${
        err.toJSON().config.data
      }`,
    );
  }
}

export async function deleteSelenoidSession(url) {
  await axios.delete(url);
}

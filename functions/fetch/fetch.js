/* eslint-disable */
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
exports.handler = async function (event, context) {
  try {
    const response = await fetch("https://discordapp.com/api/users/" + event.queryStringParameters.id, {
      headers: {
        Accept: "application/json",
        Authorization: `Bot ${process.env.DISCORD_API_KEY}`
      }
    });
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: response.statusText
      };
    }
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        msg: data
      })
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        msg: err.message
      })
    };
  }
};
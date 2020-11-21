const request = require("request");
const apikey = "0e5d2c7f52723ef13dde434e89d81d63";
const axios = require("axios");
// const apikey = "aa348f08ebacd25ccb3366ab47d2be1e";
// https://api.theblacklist.click/standard/api/v1/bulkLookup/key/[APIKEY]/response/json

// function callback

async function asyncRequest(phoneList) {
  return new Promise((resolve, reject) => {
    // request(
    //   {
    //     uri: `https://api.theblacklist.click/standard/api/v3/bulkLookup/key/${apikey}/response/json`,

    // json: {
    //   phones: phoneList,
    // },

    //     method: "POST",
    //   },
    //   function (error, response, body) {
    //     if (error) reject(error);
    //     else resolve(body);

    //     // console.log(response.statusCode, 'body');
    //     // console.log(error, 'error');
    //   }
    // );

    axios
      .post(
        `http://api.theblacklist.click/standard/api/v3/bulkLookup/key/${apikey}/response/json`,
        {
          phones: phoneList,
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

(async () => {
  let blackListData = await asyncRequest([
    // '15555555555',
    // '15056703482, 15056703482',

    "14698677688",
  ]);
  console.log(blackListData.carrier["14698677688"].name, "35");
})();

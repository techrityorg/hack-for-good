import { action, mutation } from "./_generated/server";

export const get = action({
  handler: async () => {
    console.log("here");
    const API_KEY = process.env.API_KEY;
    const LIMIT = 20;
    const ACTIVE = true;
    const response = await fetch(
      `https://api.crackeddevs.com/v1/get-jobs?limit=${LIMIT}&active=${ACTIVE}`,
      {
        headers: {
          "api-key": `${API_KEY}`,
        },
      }
    );

    const data = await response.json();
    console.log(data);
    return data;
  },
});

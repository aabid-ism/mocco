import axios from "axios";

async function sendNotification(postIndex) {
  const options = {
    method: "POST",
    url: "https://onesignal.com/api/v1/notifications",
    headers: {
      accept: "application/json",
      Authorization: `${process.env.ONE_SIGNAL_REST_API_KEY}`,
      "content-type": "application/json",
    },
    data: {
      app_id: `${process.env.ONE_SIGNAL_APP_ID}`,
      included_segments: ["Subscribed Users"],
      external_id: "string",
      contents: {
        en: "Test Message from Express Js",
        es: "Spanish Message",
      },
      name: "MOCCO",
      send_after: "",
      delayed_option: "",
      delivery_time_of_day: "",
      throttle_rate_per_minute: 0,
    //   data: { postIndex: postIndex },
    },
  };

  await axios
    .request(options)
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log("one signal notification error");
      console.error(error);
    });
}

export default sendNotification;

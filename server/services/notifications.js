import axios from "axios";

async function sendNotification(postIndex, content, imageUrl) {
  const options = {
    method: "POST",
    url: "https://onesignal.com/api/v1/notifications",
    headers: {
      accept: "application/json",
      Authorization: `Basic ${process.env.ONE_SIGNAL_REST_API_KEY}`,
      "content-type": "application/json",
    },
    data: {
      app_id: `${process.env.ONE_SIGNAL_APP_ID}`,
      included_segments: ["Subscribed Users"],

      contents: {
        en: `${content}`,
        es: "Spanish Message",
      },
      name: "MOCCO",
      big_picture: `${imageUrl}`,
      //   send_after: "",
      //   delayed_option: "",
      //   delivery_time_of_day: "",
      //   throttle_rate_per_minute: 0,
      data: { postIndex: postIndex },
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

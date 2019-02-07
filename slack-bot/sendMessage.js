const { WebClient } = require('@slack/client');

// An access token (from your Slack app or custom integration - xoxa, xoxp, or xoxb)
const token = "xoxb-447711350823-540306733076-cpL0Fu9pR2kRjGwum8v0vAzR";

const web = new WebClient(token);

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const conversationId = 'CFXFT82NB';
const spagehtiimessage = {
    text : "Wie wäre es mit diesem Gericht?",
    attachments : [
      {
        title: "Spaghetti Bolognese",
        color: "#764FA5",
        image_url: "https://cdn.apartmenttherapy.info/image/fetch/f_auto,q_auto:eco,c_fill,g_auto,w_1460/https://storage.googleapis.com/gen-atmedia/3/2018/12/39ee03d747ff0e93c946bdaaf07320e7679f0287.jpeg",
        callback_id: "shuffle_recipe",
        actions: [
              {
                  name: "action",
                  type: "button",
                  text: "Ne, was anderes",
                  value: "shuffle"
              },
              {
                name: "action",
                type: "button",
                text: "Nehm ich",
                value: "select"
            },
            {
              name: "action",
              type: "button",
              style: "danger",
              text: "Doch nicht, danke",
              value: "quit"
          },
          ]
        }
      ]
  }

const message = {
    text: "Hey es ist ganz viel Gemuese reif geworden!",
    attachments: [
            {
                callback_id: "get_recipe",
                fallback: "Hast du Lust auf einen Rezeptvorschlag?",
                author_name: "Tomatenschrank",
                title: "Hast du Lust auf einen Rezeptvorschlag?",
                actions: [
                    {
                        name: "action",
                        type: "button",
                        text: "Ja, gerne",
                        value: "complete"
                    },
                ]
            }
        ]
    }

// See: https://api.slack.com/methods/chat.postMessage
web.chat.postMessage({ channel: conversationId, text: message.text, attachments: message.attachments })
  .then((res) => {
    // `res` contains information about the posted message
    console.log('Message sent: ', res.ts);
  })
  .catch(console.error);
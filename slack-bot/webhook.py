import json
import os
import requests

def post_image(filename, token, channels):
    f = {'file': (filename, open(filename, 'rb'), 'salad_img.jpg', {'Expires':'0'})}
    response = requests.post(url='https://slack.com/api/files.upload', data=
      {'token': token, 'channels': channels, 'media': f}, 
       headers={'Accept': 'application/json'}, files=f)
    return response.text


  
# Set the webhook_url to the one provided by Slack when you create the webhook
webhook_url = 'https://hooks.slack.com/services/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'
slack_data = {
                "text": "Hey es ist ganz viel Gemuese reif geworden!",
                "attachments": [
                        {
                            "callback_id": "get_recipe",
                            "fallback": "Hast du Lust auf einen Rezeptvorschlag?",
                            "author_name": "Tomatenschrank",
                            "title": "Hast du Lust auf einen Rezeptvorschlag?",
                            "actions": [
                                {
                                    "name": "action",
                                    "type": "button",
                                    "text": "Ja, gerne",
                                    "value": "complete"
                                },
                            ]
                        }
                    ]
                }


response = requests.post(
    webhook_url, data=json.dumps(slack_data),
    headers={'Content-Type': 'application/json'}
)
if response.status_code != 200:
    raise ValueError(
        'Request to slack returned an error %s, the response is:\n%s'
        % (response.status_code, response.text)
    )

#!/usr/bin/python
import json
import os
from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer

PORT_NUMBER = 3000

#This class will handles any incoming request from
#the browser 

webhook_url = 'https://hooks.slack.com/services/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'
slack_data = {
                "text": "Hey es ist ganz viel Gemuese reif geworden! :gurke:",
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
                                    "style": "",
                                    "value": "complete"
                                },
                            ]
                        }
                    ]
                }

class myHandler(BaseHTTPRequestHandler):
	
	#Handler for the GET requests
	def do_GET(self):
		self.send_response(200)
		self.send_header('Content-type','application/json')
		self.end_headers()
		# Send the html message
		#self.wfile.write(slack_data)
		return

try:
	#Create a web server and define the handler to manage the
	#incoming request
	server = HTTPServer(('', PORT_NUMBER), myHandler)
	print ('Started httpserver on port ' , PORT_NUMBER)
	
	#Wait forever for incoming htto requests
	server.serve_forever()

except KeyboardInterrupt:
	print ('^C received, shutting down the web server')
	server.socket.close()
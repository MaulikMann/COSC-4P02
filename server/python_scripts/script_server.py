import json #import json utilities
import re #imports regExp
import mysql.connector #for mySQL functionality
from http.server import BaseHTTPRequestHandler, HTTPServer #imports http & server functionality
from summarizer import handle_url
import threading
import time #for sleep and time-based dev functions

sumDB = mysql.connector.connect(
	host="localhost",
	user="cosc4p02",
	password="summarizeme",
	database="4p02"
)

dbCursor = sumDB.cursor()
# evil :3
lock = threading.Lock()

def get_data(request_body):
	fetchCommand = 'SELECT Summary FROM summaries WHERE Url="%s"'
	dbCursor.execute( fetchCommand % str(request_body) )
	result = dbCursor.fetchone()
	return "Invalid query" if (result is None) else result[0]

def process_data(request_body):
    # We need the lock to make sure that there is no double requests of urls. The LLM will struggle if we run more than one query at once.
	lock.acquire()
	try:
		print(request_body)
	
		look_command = "SELECT url FROM summaries WHERE url=%s"
		dbCursor.execute(look_command, (str(request_body),))
	
		# we do not want to be able to queue multiple urls at the same time.
		if (dbCursor.rowcount > 0):
			print("I already have this url SILLY")
			return
	
		begin_command = 'INSERT INTO summaries(url) VALUES (%s)'
		dbCursor.execute( begin_command, (str(request_body),) )
		sumDB.commit()
	
		summary = handle_url(request_body)
	
		sum_text = json.loads(summary)["choices"][0]["text"] 
		
		end_command = 'UPDATE summaries SET summary=%s, end=CURRENT_TIMESTAMP() WHERE url=%s'
		dbCursor.execute( end_command, (str(sum_text), str(request_body)) )
	
		sumDB.commit()
	finally:
		print("Unlocking")
		lock.release()
	print("wrote summary of "+str(request_body)+" to database ["+str(time.ctime())+"]")


class app(BaseHTTPRequestHandler):
	def do_POST(self):
		# vv None of this is optimal or readable code, too bad vv
		if re.search('/s/fetch', self.path):
			self.send_response(200)
			self.send_header('Content-type','text/html')
			self.end_headers()
			content_len = int(self.headers.get('Content-Length',0))
			request_body = self.rfile.read(content_len).decode('UTF-8')
			response = get_data(request_body)
			self.wfile.write(bytes(response,"utf8"))
		elif re.search('/s/request', self.path):
			self.send_response(200) # set response code (200)
			self.send_header('Content-type','text/html') # add header info 'Content-type'
			self.end_headers() # end of header info
			content_len = int(self.headers.get('Content-Length',0)) # <content_len> is the request-data length
			request_body = self.rfile.read(content_len).decode('UTF-8') # read request body
			background_thread = threading.Thread(target=process_data, args=(request_body,))
			background_thread.daemon = True
			background_thread.start()
		else:
			self.send_response(404)
			self.send_header('Content-type','text/html')
			self.end_headers()
			erMsg = "Er 404: Invalid endpoint"
			self.wfile.write(bytes(erMsg, "utf8"))
	def do_GET(self): # test GET, for testing fetching an summary -- using id -- from the db
		self.send_response(200)
		self.send_header('Content-type', 'text/html')
		self.end_headers()
		polled_id = 0
		self.wfile.write(bytes(str(polled_id),"utf8"))

with HTTPServer(('', 42069), app) as server:
	server.serve_forever()

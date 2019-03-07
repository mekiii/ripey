#!/usr/bin/python
import MySQLdb

global plantState

db = MySQLdb.connect(host="localhost",    # your host, usually localhost
                     user="root",         # your username
                     passwd="runmysql",  # your password
                     db="planta")        # name of the data base

# you must create a Cursor object. It will let
#  you execute all the queries you need
cur = db.cursor()

# Use all the SQL you like
cur.execute("SELECT * FROM anbau")
cur.execute("SELECT Status FROM anbau WHERE PrimKey = LAST_INSERT_ID()")


# print all the first cell of all th rows
for row in cur.fetchall():
    print row
    plantState = row
   
    

db.close()
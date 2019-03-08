import MySQLdb


conn = MySQLdb.connect(host="141.100.10.219", user="root", passwd ="", db="planta")
cursor = conn.cursor()

cursor.execute('SELECT * FROM anbau')
row = cursor.fetchone()

conn.close()

print(row)

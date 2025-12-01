#! /bin/bash

psql -h 192.168.1.97 -p 5432 -U postgres -d notesdb 
# \l: list databases
# \c: connect to database
# \dt: show tables
# \dt+: show tables with more detail

npx sequelize-auto -h 192.168.1.97  -d notesdb -u postgres -x postgres -p 5432 --dialect postgres -o "./models"

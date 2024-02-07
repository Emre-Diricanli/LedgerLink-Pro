@echo off
docker build -t ledgerlinkpro-mock-db .
docker run -d --name ledgerlinkpro-mock-db-container -p 5432:5432 ledgerlinkpro-mock-db

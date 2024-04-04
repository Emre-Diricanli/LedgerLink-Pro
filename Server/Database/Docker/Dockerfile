# Use the official PostgreSQL image as a parent image
FROM postgres:latest

# Set environment variables for the database
ENV POSTGRES_DB=ledgerlinkprodb
ENV POSTGRES_USER=DBA
ENV POSTGRES_PASSWORD=SpecialPassword123

# Copy the setup script to the docker-entrypoint-initdb.d directory
COPY Setup.sql /docker-entrypoint-initdb.d/

# Expose the PostgreSQL port
EXPOSE 5432
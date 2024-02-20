#!/bin/bash

# Set environment variables for the Spring Boot application

read -p "Enter the database host (default: localhost): " CRD_DB_HOST
CRD_DB_HOST=${CRD_DB_HOST:-localhost}

read -p "Enter the database port (default: 3306): " CRD_DB_PORT
CRD_DB_PORT=${CRD_DB_PORT:-3306}

read -p "Enter the database name (default: CRD): " CRD_DB_NAME
CRD_DB_NAME=${CRD_DB_NAME:-CRD}

read -p "Enter the database username (default: backend): " CRD_DB_USERNAME
CRD_DB_USERNAME=${CRD_DB_USERNAME:-backend}

read -p "Enter the database password (default: your_password): " CRD_DB_PASSWORD
CRD_DB_PASSWORD=${CRD_DB_PASSWORD:-your_password}

read -p "Enter the super admin: " CRD_SUPER_ADMIN

if [ "$CRD_SUPER_ADMIN" = "" ]; then
    echo A super user must be specified
    exit 1
fi
read -p "Enter the gmail account username (default: partiallyhydrateddevs@gmail.com): " EMAIL_USERNAME
EMAIL_USERNAME=${EMAIL_USERNAME:-partiallyhydrateddevs@gmail.com}

read -p "Enter the gmail account password (default: your_password): " EMAIL_PASSWORD
EMAIL_PASSWORD=${EMAIL_PASSWORD:-your_password}


export CRD_DB_HOST
export CRD_DB_PORT
export CRD_DB_NAME
export CRD_DB_USERNAME
export CRD_DB_PASSWORD
export CRD_SUPER_ADMIN
export EMAIL_USERNAME
export EMAIL_PASSWORD

echo "Environment variables set:"
echo "CRD_DB_HOST=$CRD_DB_HOST"
echo "CRD_DB_PORT=$CRD_DB_PORT"
echo "CRD_DB_NAME=$CRD_DB_NAME"
echo "CRD_DB_USERNAME=$CRD_DB_USERNAME"
echo "CRD_DB_PASSWORD=$CRD_DB_PASSWORD"
echo "CRD_SUPER_ADMIN=$CRD_SUPER_ADMIN"
echo "CRD_DB_PASSWORD=************"
echo "EMAIL_USERNAME=$EMAIL_USERNAME"
echo "EMAIL_PASSWORD=*************"

./gradlew :bootrun
#!/bin/bash

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

sed -i 's/\r$//' backend/.env
set -o allexport
# Filter valid lines before sourcing
grep -E '^[A-Za-z_]+=[^ ]+' "$SCRIPT_DIR/backend/.env" > /tmp/env_cleaned
source /tmp/env_cleaned
set +o allexport


# Debugging: Show MongoDB variables
#echo "Using MongoDB Host: $MONGO_HOST"
#echo "Using MongoDB Database: $MONGO_DATABASE_NAME"
#echo "Port: '$MONGO_PORT'"


# Define backup directory inside the script's folder
BACKUP_DIR="$SCRIPT_DIR/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="iot_server_backup_$TIMESTAMP.tar.gz"
MONGO_BACKUP_DIR="$BACKUP_DIR/mongo_backup"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"
mkdir -p "$MONGO_BACKUP_DIR"

# Backup MongoDB with authentication
mongodump --host "$MONGO_HOST" --port "$MONGO_PORT" \
    --username "$MONGO_USER" --password "$MONGO_PASSWORD" --authenticationDatabase "$MONGO_DATABASE_NAME" \
    --db "$MONGO_DATABASE_NAME" --out "$MONGO_BACKUP_DIR"

# Ensure MongoDB backup exists
if [ "$(ls -A $MONGO_BACKUP_DIR 2>/dev/null)" ]; then
    echo "MongoDB backup successful!"
else
    echo "⚠️ MongoDB backup failed!"
    exit 1
fi

# List of files and directories to backup
FILES_TO_BACKUP=""
[ -d "$SCRIPT_DIR/backend/uploads" ] && FILES_TO_BACKUP+=" $SCRIPT_DIR/backend/uploads"
[ -d "$SCRIPT_DIR/backend/src/data" ] && FILES_TO_BACKUP+=" $SCRIPT_DIR/backend/src/data"
[ -f "$SCRIPT_DIR/web_app/Source_webapp/.env" ] && FILES_TO_BACKUP+=" $SCRIPT_DIR/web_app/Source_webapp/.env"
[ -f "$SCRIPT_DIR/admin_web_app/Source_webapp/.env" ] && FILES_TO_BACKUP+=" $SCRIPT_DIR/admin_web_app/Source_webapp/.env"
[ -f "$SCRIPT_DIR/backend/.env" ] && FILES_TO_BACKUP+=" $SCRIPT_DIR/backend/.env "
[ -d "$MONGO_BACKUP_DIR" ] && FILES_TO_BACKUP+=" $MONGO_BACKUP_DIR "

# Archive the files
tar -czvf "$BACKUP_DIR/$BACKUP_FILE" $FILES_TO_BACKUP

# Cleanup temporary MongoDB backup folder
rm -rf "$MONGO_BACKUP_DIR"

# Notify user
echo "✅ Backup completed: $BACKUP_DIR/$BACKUP_FILE"

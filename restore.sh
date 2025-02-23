#!/bin/bash

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RESTORE_DIR="$SCRIPT_DIR/backups"

# Ensure the restore directory exists
mkdir -p "$RESTORE_DIR"

# List backup files in restore directory
BACKUP_FILES=("$RESTORE_DIR"/*.tar.gz)

# Check if there are backups available
if [ ${#BACKUP_FILES[@]} -eq 0 ]; then
    echo "⚠️ No backup files found in $RESTORE_DIR"
    exit 1
fi

echo "Available backup files:"
for i in "${!BACKUP_FILES[@]}"; do
    echo "$((i+1)). $(basename "${BACKUP_FILES[$i]}")"
done

# Ask user to select a backup file
read -p "Enter the number of the backup file to restore: " CHOICE

# Validate input
if ! [[ "$CHOICE" =~ ^[0-9]+$ ]] || [ "$CHOICE" -lt 1 ] || [ "$CHOICE" -gt "${#BACKUP_FILES[@]}" ]; then
    echo "❌ Invalid choice. Please enter a valid number."
    exit 1
fi

# Get the selected file
SELECTED_FILE="${BACKUP_FILES[$((CHOICE-1))]}"
echo "🔄 Restoring from: $(basename "$SELECTED_FILE")"

# Extract the backup
tar -xzvf "$SELECTED_FILE" -C "/"

# Load environment variables
sed -i 's/\r$//' backend/.env
set -o allexport
# Filter valid lines before sourcing
grep -E '^[A-Za-z_]+=[^ ]+' "$SCRIPT_DIR/backend/.env" > /tmp/env_cleaned
source /tmp/env_cleaned
set +o allexport


# Restore MongoDB
MONGO_BACKUP_DIR="$RESTORE_DIR/mongo_backup"
if [ -d "$MONGO_BACKUP_DIR" ]; then
    mongorestore --host "$MONGO_HOST" --port "$MONGO_PORT" \
        --username "$MONGO_USER" --password "$MONGO_PASSWORD" --authenticationDatabase "$MONGO_DATABASE_NAME" \
        --db "$MONGO_DATABASE_NAME" "$MONGO_BACKUP_DIR/fidesinnova"
    
    echo "✅ MongoDB restore completed!"
else
    echo "⚠️ No MongoDB backup found in the archive."
fi

# Cleanup extracted MongoDB backup folder
rm -rf "$MONGO_BACKUP_DIR"

echo "✅ Restore process completed!"

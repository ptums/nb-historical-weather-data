#!/bin/bash

# Exit with 1 if there are no changes in the web directory
# Exit with 0 if there are changes

# Get the latest commit hash
LATEST_COMMIT=$(git rev-parse HEAD)

# Get the latest commit hash that modified the web directory
LAST_CHANGE=$(git log -1 --format=format:%H --full-diff web)

# Compare the two hashes
if [ $LATEST_COMMIT = $LAST_CHANGE ]; then
    # There are changes in the web directory
    echo "Build can proceed"
    exit 0
else
    # No changes in the web directory
    echo "No changes in web, build cancelled"
    exit 1
fi
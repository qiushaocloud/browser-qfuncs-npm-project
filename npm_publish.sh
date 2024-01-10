#!/bin/bash

# Default values
DEFAULT_MAX_RETRIES=10
DEFAULT_TIMEOUT_SECONDS=60

# Parse command line arguments or use default values
MAX_RETRIES=${1:-$DEFAULT_MAX_RETRIES}
TIMEOUT_SECONDS=${2:-$DEFAULT_TIMEOUT_SECONDS}

# Function to publish npm package with timeout and retries
publish_with_timeout_and_retries() {
  local retries=0
  local exit_code=0

  while [ $retries -lt $MAX_RETRIES ]; do
    echo "Publishing attempt $((retries + 1))"
    
    # Run npm publish command with timeout
    timeout $TIMEOUT_SECONDS npm publish --access=public

    # Capture the exit code of the npm publish command
    exit_code=$?

    # Check if the npm publish command was successful (exit code 0)
    if [ $exit_code -eq 0 ]; then
      echo "Publish successful!"
      break
    elif [ $exit_code -eq 124 ]; then
      # Check if the exit code indicates a timeout (124 is the exit code for timeout command)
      echo "Publish timed out. Retrying in 5 seconds..."
      sleep 5
      retries=$((retries + 1))
    else
      # Other non-timeout errors, exit without retrying
      echo "Publish failed with exit code $exit_code. Exiting..."
      exit $exit_code
    fi
  done

  # Check if all retries failed
  if [ $retries -eq $MAX_RETRIES ]; then
    echo "All publish attempts failed. Exiting..."
    exit $exit_code
  fi
}

# Run the function to publish with timeout and retries
publish_with_timeout_and_retries

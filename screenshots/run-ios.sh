#!/bin/bash
set -e

APP_ID="dev.titanium.headache-tracker"

# Find the booted iOS simulator
DEVICE_ID=$(xcrun simctl list devices booted | grep -oE '[A-F0-9-]{36}' | head -1)
if [ -z "$DEVICE_ID" ]; then
  echo "Error: No booted iOS simulator found. Start one first."
  exit 1
fi
echo "Using iOS simulator: $DEVICE_ID"

LOCALES=(
  de
  en
  es
  fr
  hi
  it
  ja
  ko
  nl
  pl
  pt
  ro
  ru
  th
  tr
  uk
  vi
  zh
)
OUTPUT_DIR=".screenshots"
FLOWS_DIR="screenshots/maestro/flows"

mkdir -p "$OUTPUT_DIR"

MAX_RETRIES=3

for locale in "${LOCALES[@]}"; do
  echo "--- Taking screenshots for: $locale ---"
  mkdir -p "$OUTPUT_DIR/$locale"
  attempt=1
  while [ $attempt -le $MAX_RETRIES ]; do
    if maestro --device "$DEVICE_ID" test "$FLOWS_DIR/full-run.yaml" --env LOCALE="$locale" --env APP_ID="$APP_ID" --output "$OUTPUT_DIR/$locale"; then
      echo "--- Done: $locale ---"
      break
    else
      echo "--- Attempt $attempt/$MAX_RETRIES failed for $locale ---"
      if [ $attempt -eq $MAX_RETRIES ]; then
        echo "--- SKIPPING $locale after $MAX_RETRIES failed attempts ---"
      fi
      attempt=$((attempt + 1))
      sleep 3
    fi
  done
done

echo ""
echo "All screenshots saved to $OUTPUT_DIR/"

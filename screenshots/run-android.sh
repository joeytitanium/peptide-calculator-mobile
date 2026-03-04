#!/bin/bash
set -e

APP_ID="dev.titanium.peptide_calculator"

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
OUTPUT_DIR=".screenshots/android"
FLOWS_DIR="screenshots/maestro/flows"

mkdir -p "$OUTPUT_DIR"

MAX_RETRIES=3

for locale in "${LOCALES[@]}"; do
  echo "--- Taking screenshots for: $locale ---"
  mkdir -p "$OUTPUT_DIR/$locale"
  attempt=1
  while [ $attempt -le $MAX_RETRIES ]; do
    if maestro test "$FLOWS_DIR/full-run.yaml" --env LOCALE="$locale" --env APP_ID="$APP_ID" --env OUTPUT_DIR="$OUTPUT_DIR" --output "$OUTPUT_DIR/$locale"; then
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

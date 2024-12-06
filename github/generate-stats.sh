#!/bin/bash

echo "Starting stats generation..."

# Create data directory if it doesn't exist
echo "Creating data directory..."
mkdir -p data

echo "Running gh-lang-stats.sh..."
STATS_OUTPUT=$(./github/gh-lang-stats.sh)
echo "Raw output:"
echo "$STATS_OUTPUT"

echo "Converting to JSON..."
echo "$STATS_OUTPUT" | jq -R -s '
  split("\n") | 
  map(select(length > 0)) |
  . as $lines |
  def clean_percentage:
    if . then
      capture("• (?<lang>.*?): (?<pct>.*?)%") | 
      {name: .lang, percentage: .pct}
    else 
      null 
    end;

  {
    web: {
      total: ($lines | map(select(contains("Web Development Stack"))) | .[0] | 
             capture("Web Development Stack \\((?<lines>.*?) lines\\)").lines),
      frameworks: {
        frontend: [
          ($lines | map(select(contains("React/Next.js"))) | .[0] | clean_percentage),
          ($lines | map(select(contains("Remix"))) | .[0] | clean_percentage)
        ] | map(select(.)),
        mobile: [
          ($lines | map(select(contains("React Native"))) | .[0] | clean_percentage)
        ] | map(select(.)),
        backend: [
          ($lines | map(select(contains("NestJS"))) | .[0] | clean_percentage)
        ] | map(select(.))
      }
    },
    systems: {
      total: ($lines | map(select(contains("Systems Programming"))) | .[0] | 
              capture("Systems Programming \\((?<lines>.*?) lines\\)").lines),
      languages: [
        ($lines | map(select(contains("• Rust:"))) | .[0] | clean_percentage),
        ($lines | map(select(contains("• C:"))) | .[0] | clean_percentage),
        ($lines | map(select(contains("• Go:"))) | .[0] | clean_percentage)
      ] | map(select(.))
    },
    backend: {
      total: ($lines | map(select(contains("Backend Development"))) | .[0] | 
              capture("Backend Development \\((?<lines>.*?) lines\\)").lines),
      languages: [
        ($lines | map(select(contains("• Ruby:"))) | .[0] | clean_percentage),
        ($lines | map(select(contains("• Python:"))) | .[0] | clean_percentage),
        ($lines | map(select(contains("• Elixir:"))) | .[0] | clean_percentage)
      ] | map(select(.))
    }
  }
' > data/github-stats.json

JSON_STATUS=$?
echo "JSON conversion status: $JSON_STATUS"

if [ -f data/github-stats.json ]; then
    echo "JSON file created successfully"
    echo "File size: $(wc -c < data/github-stats.json) bytes"
    echo "File contents:"
    cat data/github-stats.json | jq '.'
else
    echo "Error: JSON file was not created"
fi

echo "Script completed"
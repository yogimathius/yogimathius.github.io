#!/bin/bash

echo "1. Fetching first 100 GitHub repositories..."
first_query='
  query {
    viewer {
      repositories(first: 100, ownerAffiliations: [OWNER], isFork: false) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          languages(first: 100, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node {
                name
              }
            }
          }
          object(expression: "HEAD:package.json") {
            ... on Blob {
              text
            }
          }
        }
      }
    }
  }
'
gh api graphql -f query="$first_query" > temp1.json

# Get the endCursor for the next page
end_cursor=$(jq -r '.data.viewer.repositories.pageInfo.endCursor' temp1.json)

echo "2. Fetching second 100 GitHub repositories..."
second_query='
  query {
    viewer {
      repositories(first: 100, after: "'$end_cursor'", ownerAffiliations: [OWNER], isFork: false) {
        nodes {
          languages(first: 100, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node {
                name
              }
            }
          }
          object(expression: "HEAD:package.json") {
            ... on Blob {
              text
            }
          }
        }
      }
    }
  }
'
gh api graphql -f query="$second_query" > temp2.json

echo "3. Combining results..."
jq -s '.[0].data.viewer.repositories.nodes + .[1].data.viewer.repositories.nodes' temp1.json temp2.json > temp.json

# Process language data
jq -r '.[] | .languages.edges[] | {
  name: .node.name, 
  size: .size
}' temp.json > step1.json

mkdir -p data

echo "Web Development (Primary Stack):"
cat step1.json | \
jq -s '
  map(select(.name == "TypeScript" or .name == "JavaScript")) |
  . as $all_web |
  ($all_web | map(.size) | add) as $web_total |
  group_by(.name) | map({
    name: .[0].name,
    percentage: ((map(.size | numbers) | add) / ($web_total|tonumber) * 100)
  }) | sort_by(-.percentage) | .[] |
  "• \(.name): \(.percentage | . * 1 | tostring | .[0:5])%"
'

echo -e "\nSystems Programming ($(cat step1.json | jq -s 'map(select(.name == "Rust" or .name == "C" or .name == "Go")) | map(.size) | add | . / 30 | floor' ) lines):"
cat step1.json | \
jq -s '
  map(select(.name == "Rust" or .name == "C" or .name == "Go")) |
  . as $data |
  ($data | map(.size) | add) as $sys_total |
  group_by(.name) | map({
    name: .[0].name,
    percentage: ((map(.size | numbers) | add) / ($sys_total|tonumber) * 100)
  }) | sort_by(-.percentage) | .[] |
  "• \(.name): \(.percentage | . * 1 | tostring | .[0:5])%"
'

echo -e "\nBackend Development ($(cat step1.json | jq -s 'map(select(.name == "Ruby" or .name == "Python" or .name == "Elixir")) | map(.size) | add | . / 30 | floor' ) lines):"
cat step1.json | \
jq -s '
  map(select(.name == "Ruby" or .name == "Python" or .name == "Elixir")) |
  . as $data |
  ($data | map(.size) | add) as $backend_total |
  group_by(.name) | map({
    name: .[0].name,
    percentage: ((map(.size | numbers) | add) / ($backend_total|tonumber) * 100)
  }) | sort_by(-.percentage) | .[] |
  "• \(.name): \(.percentage | . * 1 | tostring | .[0:5])%"
'

echo -e "\nTotal Code Distribution (lines):"
cat step1.json | \
jq -s '
  . as $all |
  map(select(.name == "TypeScript" or .name == "JavaScript")) | map(.size) | add as $web |
  $all | map(select(.name == "Rust" or .name == "C" or .name == "Go")) | map(.size) | add as $sys |
  $all | map(select(.name == "Ruby" or .name == "Python" or .name == "Elixir")) | map(.size) | add as $backend |
  "Web: \($web/30 | floor) lines\nSystems: \($sys/30 | floor) lines\nBackend: \($backend/30 | floor) lines"
'

# Create JSON file with the same data
jq -n --slurpfile data step1.json '
{
  web: {
    total: ($data | map(select(.name == "TypeScript" or .name == "JavaScript")) | map(.size) | add | . / 30),
    languages: ($data | 
      map(select(.name == "TypeScript" or .name == "JavaScript")) |
      group_by(.name) | 
      map({
        name: .[0].name,
        percentage: ((map(.size) | add) / 
          ($data | map(select(.name == "TypeScript" or .name == "JavaScript")) | map(.size) | add) * 100)
      })
    )
  },
  systems: {
    total: ($data | map(select(.name == "Rust" or .name == "C" or .name == "Go")) | map(.size) | add | . / 30),
    languages: ($data |
      map(select(.name == "Rust" or .name == "C" or .name == "Go")) |
      group_by(.name) |
      map({
        name: .[0].name,
        percentage: ((map(.size) | add) /
          ($data | map(select(.name == "Rust" or .name == "C" or .name == "Go")) | map(.size) | add) * 100)
      }) |
      sort_by(-.percentage)
    )
  },
  backend: {
    total: ($data | map(select(.name == "Ruby" or .name == "Python" or .name == "Elixir")) | map(.size) | add | . / 30),
    languages: ($data |
      map(select(.name == "Ruby" or .name == "Python" or .name == "Elixir")) |
      group_by(.name) |
      map({
        name: .[0].name,
        percentage: ((map(.size) | add) /
          ($data | map(select(.name == "Ruby" or .name == "Python" or .name == "Elixir")) | map(.size) | add) * 100)
      }) |
      sort_by(-.percentage)
    )
  }
}' > data/github-stats.json

# Cleanup
rm temp.json temp1.json temp2.json step1.json

echo -e "\nJSON file created successfully at data/github-stats.json"
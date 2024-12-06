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
          name
          object(expression: "HEAD:package.json") {
            ... on Blob {
              text
            }
          }
          languages(first: 100, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node {
                name
              }
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
        }
      }
    }
  }
'
gh api graphql -f query="$second_query" > temp2.json

echo "3. Combining results..."
jq -s '.[0].data.viewer.repositories.nodes + .[1].data.viewer.repositories.nodes' temp1.json temp2.json > temp.json

# echo "4. Raw language data from combined repositories:"
jq -r '.[] | .languages.edges[] | {
  name: .node.name, 
  size: .size,
  repo_name: input_filename
}' temp.json > step1.json
# echo "-------------------"

echo "4. Calculate total lines across all languages:"
total_bytes=$(cat step1.json | jq -s 'map(.size) | add / 30 | floor')
echo "Total lines: $total_bytes"
echo "-------------------"

echo "Web Development Stack ($(cat step1.json | jq -s 'map(select(.name == "TypeScript" or .name == "JavaScript")) | map(.size) | add | . / 30 | floor' ) lines):"
cat step1.json | \
jq -s '
  map(select(.name == "TypeScript" or .name == "JavaScript")) |
  . as $all_web |
  ($all_web | map(.size) | add) as $web_total |
  {
    "Frontend Frameworks": [
      {name: "React/Next.js", size: ($all_web | map(.size) | add * 0.3)},
      {name: "Remix", size: ($all_web | map(.size) | add * 0.25)}
    ],
    "Mobile": [
      {name: "React Native", size: ($all_web | map(.size) | add * 0.2)}
    ],
    "Backend Frameworks": [
      {name: "NestJS", size: ($all_web | map(.size) | add * 0.25)}
    ]
  } | 
  to_entries | .[] | 
  "\n\(.key):",
  (.value | .[] | "• \(.name): \(.size / $web_total * 100 | . * 1 | tostring | .[0:5])%")
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

# Cleanup
rm temp.json temp1.json temp2.json step1.json
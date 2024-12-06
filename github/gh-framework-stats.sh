#!/bin/bash

echo "1. Fetching first 100 JavaScript/TypeScript repositories..."
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

echo "2. Fetching second 100 repositories..."
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

echo "3. Processing JavaScript/TypeScript frameworks..."
mkdir -p data

# Combine results and create framework stats
jq -s '
.[0].data.viewer.repositories.nodes + .[1].data.viewer.repositories.nodes |
. as $all_repos |
{
  total: ([.[] | .languages.edges[] | select(.node.name | test("JavaScript|TypeScript")) | .size] | add),
  languages: (
    [.[] | .languages.edges[] | select(.node.name | test("JavaScript|TypeScript"))] |
    group_by(.node.name) |
    map({
      name: .[0].node.name,
      percentage: (([.[].size] | add) * 100.0 / 
        ([.[] | .size] | add))
    })
  ),
  frameworks: {
    frontend: (
      . as $repos |
      [.[] | select(.object.text != null) | .object.text | fromjson? // {} | .dependencies // {} | to_entries[] |
       select(.key | test("react|next|remix|vue|svelte|angular")) |
       .key |
       if test("^react$|next|gatsby") then "React/Next.js"
       elif test("@remix-run|remix") then "Remix"
       elif test("@angular|angular") then "Angular"
       elif test("vue") then "Vue"
       elif test("svelte") then "Svelte"
       else empty
       end
      ] | group_by(.) |
      map({
        name: .[0],
        percentage: (length * 100.0 / ($all_repos | length))
      }) | sort_by(-.percentage)
    ),
    mobile: (
      . as $repos |
      [.[] | select(.object.text != null) | .object.text | fromjson? // {} | .dependencies // {} | to_entries[] |
       select(.key | test("react-native|expo|ionic")) |
       .key |
       if test("react-native") then "React Native"
       elif test("expo") then "Expo"
       elif test("ionic") then "Ionic"
       else empty
       end
      ] | group_by(.) |
      map({
        name: .[0],
        percentage: (length * 100.0 / ($all_repos | length))
      }) | sort_by(-.percentage)
    ),
    backend: (
      . as $repos |
      [.[] | select(.object.text != null) | .object.text | fromjson? // {} | .dependencies // {} | to_entries[] |
       select(.key | test("@nestjs|^express$|fastify|koa")) |
       .key |
       if test("@nestjs") then "NestJS"
       elif test("^express$") then "Express"
       elif test("fastify") then "Fastify"
       elif test("koa") then "Koa"
       else empty
       end
      ] | group_by(.) |
      map({
        name: .[0],
        percentage: (length * 100.0 / ($all_repos | length))
      }) | sort_by(-.percentage)
    )
  }
}' temp1.json temp2.json > data/framework-stats.json

# Cleanup
rm temp1.json temp2.json

echo "Framework stats created successfully at data/framework-stats.json" 
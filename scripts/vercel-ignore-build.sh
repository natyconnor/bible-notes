#!/usr/bin/env bash
set -euo pipefail

branch="${VERCEL_GIT_COMMIT_REF:-}"
author="${VERCEL_GIT_COMMIT_AUTHOR_LOGIN:-}"

echo "Branch: $branch"
echo "Author: $author"

# Skip release-please PR previews
if [[ "$branch" == release-please--branches--* ]]; then
  echo "Skipping build for release-please branch"
  exit 0
fi

# Skip Dependabot PR previews
if [[ "$branch" == dependabot/* ]]; then
  echo "Skipping build for Dependabot branch"
  exit 0
fi

# Extra safety if author info is available
if [[ "$author" == "dependabot[bot]" ]]; then
  echo "Skipping build for Dependabot bot"
  exit 0
fi

echo "Proceeding with build"
exit 1
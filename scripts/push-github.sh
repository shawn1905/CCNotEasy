#!/usr/bin/env bash
# Push current branch to GitHub remote `github` without prompts.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
if [ -z "${GH_TOKEN:-}" ] && [ -f "$HOME/.config/ccnoteasy/GH_TOKEN" ]; then
  export GH_TOKEN
  GH_TOKEN="$(cat "$HOME/.config/ccnoteasy/GH_TOKEN")"
  export GH_TOKEN
fi
if [ -z "${GH_TOKEN:-}" ]; then
  echo "GH_TOKEN missing. Put PAT in Cursor Secrets as GH_TOKEN or $HOME/.config/ccnoteasy/GH_TOKEN" >&2
  exit 1
fi
BRANCH="$(git branch --show-current)"
git push -u github "$BRANCH"
echo "Pushed $BRANCH -> github.com/shawn1905/CCNotEasy"

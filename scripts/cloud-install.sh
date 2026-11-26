#!/usr/bin/env bash
# Cloud Agent install: concept-phase docs repo (no app runtime yet).
set -euo pipefail

if [ -d '/agent/repos/CCNotEasy' ]; then
  cd '/agent/repos/CCNotEasy' || exit $?
elif [ -d '/agent/repos/tmp-829be75d40381161' ]; then
  cd '/agent/repos/tmp-829be75d40381161' || exit $?
else
  echo "CCNotEasy checkout not found under /agent/repos" >&2
  exit 1
fi

test -f PLAN.md
test -f README.md
test -f LICENSE
test -f docs/research/comparable-games.md
echo "CCNotEasy docs checkout OK: $(pwd)"

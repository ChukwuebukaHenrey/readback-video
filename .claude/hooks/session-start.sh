#!/bin/bash
# Installs Python tooling (edge-tts) when running in Claude Code on the web.
set -euo pipefail
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi
cd "$CLAUDE_PROJECT_DIR"
python3 -m pip install --quiet -r video/requirements.txt

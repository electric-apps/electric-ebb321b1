#!/bin/bash
# Forward AskUserQuestion hook events to Electric Agent studio.
# Blocks until the user answers in the web UI.
BODY="$(cat)"
RESPONSE=$(curl -s -X POST "http://host.docker.internal:4400/api/sessions/ebb321b1-2ad5-42fc-bfe0-bde2a3298729/hook-event" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer d373489930843dba947a62566eefc82ab1087522524ee0b3edc2b3f085beb9c7" \
  -d "${BODY}" \
  --max-time 360 \
  --connect-timeout 5 \
  2>/dev/null)
if echo "${RESPONSE}" | grep -q '"hookSpecificOutput"'; then
  echo "${RESPONSE}"
fi
exit 0
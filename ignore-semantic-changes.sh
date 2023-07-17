#!/bin/bash

echo "ignoring changes to sentry build files"

cd src/semantic/
find . -maxdepth 1 -type d \( ! -name . \) -exec bash -c "cd '{}' && pwd && git ls-files -z ${pwd} | xargs -0 git update-index --skip-worktree" \;

echo "sentry build files ignored"
#!/bin/bash

echo "ignoring changes to sentry build files"

git update-index --skip-worktree src/semantic/dist/components/*.css
git update-index --skip-worktree src/semantic/dist/*.css

echo "sentry build files ignored"
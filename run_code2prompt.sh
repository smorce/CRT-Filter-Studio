#!/bin/sh

# https://github.com/mufeedvh/code2prompt

# chmod +x run_code2prompt.sh
# パーミッションを755に変更しないと実行できなかった
chmod 755 run_code2prompt.sh

docker run -it --rm \
  -v "$(pwd):/work" \
  rust:latest \
  /bin/bash -c "cd /work && cargo install code2prompt && code2prompt . --output-file=codebase.txt --exclude=**/uppercase/*,frontend/docs/**"
#!/bin/bash
docker run \
    --rm \
    --volume ${PWD}:/project \
    --volume ~/.cache/electron:/root/.cache/electron \
    --volume ~/.cache/electron-builder:/root/.cache/electron-builder \
    electronuserland/builder:wine \
    /bin/bash -c "npm run package && chown -R ${UID}:${UID} build/ dist/"

<p align="center"><img src="https://raw.githubusercontent.com/orbis-hub/orbis/main/brand/logo-dark.svg" alt="" width="64"></p>

# orbis flash

the web flasher for the [orbis e-ink firmware](https://github.com/orbis-hub/orbis/tree/main/firmware): https://orbis-hub.github.io/flash/

pick a board, plug it in, click install. built on [esp web tools](https://esphome.github.io/esp-web-tools/). the binaries in `firmware/` are mirrored from the `fw-v*` releases of the main repo by `sync.mjs` (runs every 6 h and on demand), so they are served from this origin and web serial can read them.

# GNOME Orientation-Aware Tiling

A small GNOME Shell extension that makes `Super+Up` and `Super+Down` behave according to the orientation of the monitor containing the focused window.

## Behavior

| Monitor orientation | `Super+Up` | `Super+Down` |
| --- | --- | --- |
| Portrait (`height > width`) | Tile to top half | Tile to bottom half |
| Landscape | Maximize | Unmaximize |

The extension detects orientation from the focused window's current monitor work area. No monitor name, connector, or fixed display configuration is required.

## Compatibility

- GNOME Shell 50
- Tested with GNOME Shell 50.1 on Ubuntu
- Wayland

The extension uses GNOME Shell / Mutter APIs directly and does not depend on `wmctrl`, `xdotool`, or X11-specific behavior.

## Installation

Clone the repository and install the extension into your user GNOME Shell extensions directory:

```bash
git clone https://github.com/sekai013/gnome-orientation-aware-tiling.git
cd gnome-orientation-aware-tiling
make install
```

GNOME Shell may not discover a newly installed extension until the next login. If `gnome-extensions enable` reports that the extension does not exist, log out and back in once.

Then enable it:

```bash
make enable
```

The extension UUID is:

```text
orientation-aware-tiling@sekai013.dev
```

## Ubuntu / Tiling Assistant

Ubuntu's Tiling Assistant may already own `Super+Up` and `Super+Down`. This extension does **not** modify Tiling Assistant settings automatically.

Check the current bindings with:

```bash
gsettings get org.gnome.shell.extensions.tiling-assistant tile-maximize
gsettings get org.gnome.shell.extensions.tiling-assistant restore-window
```

If they are assigned to `Super+Up` / `Super+Down`, release those keys before enabling this extension:

```bash
make configure-ubuntu
```

`configure-ubuntu` preserves `Super+KP_5` for Tiling Assistant while removing its `Super+Up` and `Super+Down` bindings:

```bash
gsettings set org.gnome.shell.extensions.tiling-assistant tile-maximize "['<Super>KP_5']"
gsettings set org.gnome.shell.extensions.tiling-assistant restore-window '[]'
```

To restore the Ubuntu bindings used by this project's tested setup:

```bash
make restore-ubuntu-bindings
```

This sets:

```text
tile-maximize = ['<Super>Up', '<Super>KP_5']
restore-window = ['<Super>Down']
```

If you had customized these bindings before installation, restore your own previous values instead.

## Other targets

```bash
make disable
make reinstall
make uninstall
```

`make uninstall` removes only this extension. It intentionally does not change Tiling Assistant settings.

## Notes

- Portrait tiling uses the usable work area of the current monitor, including panel and dock exclusions.
- `Super+Down` on a non-maximized landscape window is a no-op.
- Fullscreen windows are left unchanged.
- Monitor orientation is evaluated when the shortcut is pressed, so moving a window between portrait and landscape displays changes the shortcut behavior automatically.

## License

MIT

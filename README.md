# GNOME Monitor-Aware Keybindings

A small GNOME Shell extension that changes `Super+Up` / `Super+Down` behavior based on the orientation of the monitor containing the focused window.

## Behavior

| Monitor orientation | `Super+Up` | `Super+Down` |
| --- | --- | --- |
| Portrait (`height > width`) | Tile to top half | Tile to bottom half |
| Landscape | Maximize | Unmaximize |

The orientation is detected from the focused window's current monitor work area, so no monitor name or connector needs to be configured.

## Requirements

- GNOME Shell 50
- `gnome-extensions`
- `glib-compile-schemas`

This extension does not depend on Tiling Assistant. On Ubuntu, however, Tiling Assistant commonly owns `Super+Up` and `Super+Down`, so those conflicting bindings need to be released before enabling this extension.

## Install

```bash
make install
```

If GNOME Shell does not immediately discover a newly installed extension, log out and back in once. Then enable it:

```bash
make enable
```

## Ubuntu / Tiling Assistant

Check the current bindings first:

```bash
gsettings get org.gnome.shell.extensions.tiling-assistant tile-maximize
gsettings get org.gnome.shell.extensions.tiling-assistant restore-window
```

For Ubuntu's default-style bindings, release `Super+Up` while preserving `Super+KP_5`, and release `Super+Down`:

```bash
make configure-ubuntu
```

Equivalent commands:

```bash
gsettings set org.gnome.shell.extensions.tiling-assistant tile-maximize "['<Super>KP_5']"
gsettings set org.gnome.shell.extensions.tiling-assistant restore-window '[]'
```

To restore the bindings used before this extension was introduced:

```bash
make restore-ubuntu-bindings
```

which restores:

```text
tile-maximize = ['<Super>Up', '<Super>KP_5']
restore-window = ['<Super>Down']
```

## Other targets

```bash
make disable
make uninstall
make reinstall
```

`uninstall` removes only this extension. It intentionally does not modify Tiling Assistant settings; use `make restore-ubuntu-bindings` separately if desired.

## Notes

- Portrait tiling uses the usable work area of the current monitor, including GNOME panel/dock exclusions.
- `Super+Down` on a non-maximized landscape window is a no-op.
- Fullscreen windows are left unchanged.
- The extension operates through GNOME Shell / Mutter APIs and does not use `wmctrl`, `xdotool`, or X11-specific behavior.

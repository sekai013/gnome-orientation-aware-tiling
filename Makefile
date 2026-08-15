UUID := monitor-aware-keybindings@sekai013.dev
SOURCE_DIR := $(UUID)
EXTENSIONS_DIR := $(HOME)/.local/share/gnome-shell/extensions
DEST_DIR := $(EXTENSIONS_DIR)/$(UUID)

.PHONY: install enable disable reinstall uninstall configure-ubuntu restore-ubuntu-bindings

install:
	rm -rf "$(DEST_DIR)"
	mkdir -p "$(DEST_DIR)"
	cp -a "$(SOURCE_DIR)/." "$(DEST_DIR)/"
	glib-compile-schemas "$(DEST_DIR)/schemas"
	@echo "Installed $(UUID). If GNOME does not see it yet, log out and back in once."

enable:
	gnome-extensions enable "$(UUID)"

disable:
	-gnome-extensions disable "$(UUID)"

reinstall: uninstall install

uninstall: disable
	rm -rf "$(DEST_DIR)"

configure-ubuntu:
	gsettings set org.gnome.shell.extensions.tiling-assistant tile-maximize "['<Super>KP_5']"
	gsettings set org.gnome.shell.extensions.tiling-assistant restore-window '[]'

restore-ubuntu-bindings:
	gsettings set org.gnome.shell.extensions.tiling-assistant tile-maximize "['<Super>Up', '<Super>KP_5']"
	gsettings set org.gnome.shell.extensions.tiling-assistant restore-window "['<Super>Down']"

import Meta from 'gi://Meta';
import Shell from 'gi://Shell';

import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

export default class OrientationAwareTilingExtension extends Extension {
    enable() {
        this._settings = this.getSettings();

        const flags = Meta.KeyBindingFlags.IGNORE_AUTOREPEAT;
        const modes = Shell.ActionMode.NORMAL;

        Main.wm.addKeybinding(
            'window-up',
            this._settings,
            flags,
            modes,
            () => this._handleUp()
        );

        Main.wm.addKeybinding(
            'window-down',
            this._settings,
            flags,
            modes,
            () => this._handleDown()
        );
    }

    disable() {
        Main.wm.removeKeybinding('window-up');
        Main.wm.removeKeybinding('window-down');
        this._settings = null;
    }

    _focusedWindow() {
        return global.display.focus_window;
    }

    _isPortrait(window) {
        const area = window.get_work_area_current_monitor();
        return area.height > area.width;
    }

    _canTile(window) {
        return window.allows_move() && window.allows_resize();
    }

    _moveToHalf(window, top) {
        const area = window.get_work_area_current_monitor();
        const topHeight = Math.floor(area.height / 2);
        const height = top ? topHeight : area.height - topHeight;
        const y = top ? area.y : area.y + topHeight;

        window.move_resize_frame(
            true,
            area.x,
            y,
            area.width,
            height
        );
    }

    _tileHalf(window, top) {
        if (!this._canTile(window))
            return;

        if (window.get_maximize_flags() === 0) {
            this._moveToHalf(window, top);
            return;
        }

        let applied = false;
        const signalIds = [];

        const applyWhenUnmaximized = () => {
            if (applied || window.get_maximize_flags() !== 0)
                return;

            applied = true;
            for (const signalId of signalIds)
                window.disconnect(signalId);

            this._moveToHalf(window, top);
        };

        signalIds.push(
            window.connect('notify::maximized-horizontally', applyWhenUnmaximized)
        );
        signalIds.push(
            window.connect('notify::maximized-vertically', applyWhenUnmaximized)
        );

        window.unmaximize();
        applyWhenUnmaximized();
    }

    _handleUp() {
        const window = this._focusedWindow();

        if (!window || window.is_fullscreen())
            return;

        if (this._isPortrait(window)) {
            this._tileHalf(window, true);
            return;
        }

        if (window.can_maximize())
            window.maximize();
    }

    _handleDown() {
        const window = this._focusedWindow();

        if (!window || window.is_fullscreen())
            return;

        if (this._isPortrait(window)) {
            this._tileHalf(window, false);
            return;
        }

        if (window.is_maximized())
            window.unmaximize();
    }
}

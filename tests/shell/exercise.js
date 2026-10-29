import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {UnlockDialog} from 'resource:///org/gnome/shell/ui/unlockDialog.js';

let dialog;
let originalInit;
let originalBackground;
export async function exercise(extension, {wait, expect}) {
    expect(extension._customizer, 'The real lock-screen customizer did not initialize');
    extension._settings.set_boolean('weather-enabled', false);
    originalInit = extension._customizer._origInit;
    originalBackground = extension._customizer._origCreateBackground;
    dialog = new UnlockDialog(Main.uiGroup);
    await wait(300);
    expect(dialog._lssCustomized && dialog._lssClock?.get_parent(), 'The real UnlockDialog did not load the custom clock');
    expect(dialog._lssAtmosphere?.get_parent(), 'The real UnlockDialog did not attach its atmosphere');
    expect(extension._customizer._liveDialogs.has(dialog), 'The dialog was not registered for lifecycle cleanup');
}

export async function disabled({expect}) {
    expect(UnlockDialog.prototype._init === originalInit, 'Disabling did not restore the upstream dialog constructor');
    expect(UnlockDialog.prototype._createBackground === originalBackground, 'Disabling did not restore the upstream background method');
    expect(!dialog._lssCustomized && !dialog._lssClock, 'Disabling did not remove widgets from the live dialog');
    dialog.destroy();
    dialog = null;
}

const $ = (e) => { return document.getElementById(e) }

const resetFactOps = () => {
    $('grp').checked = false;
    $('per-sq').checked = false;
    $('tri').checked = false;
    $('general-form').checked = false;
}

const VERSION_CODE = "0.1.3"

// Set up onclick listeners
$('more-info').onclick = () => {
    const dialog = $('more-info-dialog').MDCDialog;
    dialog.open();
    dialog.listen('MDCDialog:closed', e => {
        switch (e.detail.action) {
            case 'credits':
                $('credits-dialog').MDCDialog.open();
                break;
            case 'settings':
                $('settings-dialog').MDCDialog.open();
                break;
        }
    })
}

// Display app version
$('app-ver').textContent = `App version: v${VERSION_CODE}`;
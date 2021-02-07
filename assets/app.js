const $ = (e) => { return document.getElementById(e) }

const VERSION_CODE = "0.1.2"

// Set up onclick listeners
$('more-info').onclick = () => {
    const dialog = $('more-info-dialog').MDCDialog;
    dialog.open();
    dialog.listen('MDCDialog:closed', e => {
        console.log(e.detail.action);
    })
}

// Display app version
$('app-ver').textContent = `App version: v${VERSION_CODE}`;
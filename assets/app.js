const $ = (e) => { return document.getElementById(e) }

const VERSION_CODE = "0.1.0"

// Set up onclick listeners
$('more-info').onclick = () => {
    $('more-info-dialog').MDCDialog.open();
}

// Display app version
$('app-ver').textContent = `App version: v${VERSION_CODE}`;
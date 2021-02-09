const $ = (e) => { return document.getElementById(e) }

const checkboxClickListener = (e) => {
    console.log('event')
    $('grp-mdc').MDCCheckbox.disabled = true;
    $('per-sq-mdc').MDCCheckbox.disabled = true;
    $('tri-mdc').MDCCheckbox.disabled = true;
    $('general-form-mdc').MDCCheckbox.disabled = true;
    if (e.target.checked) {
        e.target.disabled = false;
    }
}

const showMSG = (msg) => {
    const snackbar = $('msg-snackbar')  .MDCSnackbar;
    snackbar.labelText = msg;
    snackbar.open();
}

const resetFactOps = () => {
    $('c-factor').checked = false;
    $('grp').checked = false;
    $('per-sq').checked = false;
    $('tri').checked = false;
    $('general-form').checked = false;
}

$('reset-methods').onclick = resetFactOps;

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

// Generate button onclick
$('start_gen').onclick = () => {
    // Set config vars based on user input
    // Check validity of input
    const minRange = $('ans-min').MDCTextField.value;
    const maxRange = $('ans-max').MDCTextField.value;
    if (maxRange <= minRange || Math.abs(maxRange - minRange) < 2) {
        showMSG('Invalid minimum or maximum range');
        return;
    }

    const start = new Date();
    let results = [];
    if ($('grp').checked) {
        for (let i = 0; i < 100; i++) {
            const {a, b, x, y, use_vars} = _grouping();
            results.push(grouping(a, b, x, y, use_vars).qn);
        }
    }
    else if ($('per-sq').checked) {
        for (let i = 0; i < 100; i++) {
            const {a, b, c, use_vars, two_var} = _perfect_square();
            results.push(perfect_square(a, b, c, use_vars, two_var).qn);
        }
    }
    else if ($('tri').checked) {
        for (let i = 0; i < 100; i++) {
            const {a, b, c, use_vars, x1, x2} = _trinomial();
            results.push(trinomial(a, b, c, use_vars, x1, x2).qn);
        }
    }
    else if ($('c-factor').checked) {
        for (let i = 0; i < 100; i++) {
            results.push(common_factor().qn);
        }
    }
    else {
        for (let i = 0; i < 100; i++) {
            const {a, b, c, use_vars, x1, x2} = _general_formula();
            results.push(general_formula(a, b, c, use_vars, x1, x2).qn);
        }
    }
    $('qns_output').textContent = results.join('\n');
    $('results-dialog').MDCDialog.open();
    console.log('Time:', new Date() - start);
    // console.log('Done')
}
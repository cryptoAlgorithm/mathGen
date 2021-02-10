const $ = (e) => { return document.getElementById(e) }

// Select contents of elem for copying
function copyElemContents(el) {
    // Add copy class to elem
    el.classList.add('copy');
    let body = document.body, range, sel;
    if (document.createRange && window.getSelection) {
        range = document.createRange();
        sel = window.getSelection();
        sel.removeAllRanges();
        try {
            range.selectNodeContents(el);
            sel.addRange(range);
        } catch (e) {
            range.selectNode(el);
            sel.addRange(range);
        }
        document.execCommand("copy");
    } else if (body.createTextRange) {
        range = body.createTextRange();
        range.moveToElementText(el);
        range.select();
        range.execCommand("Copy");
    }
    el.classList.remove('copy');
}

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

const VERSION_CODE = "0.1.5";

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

// ------
// Creates a table with questions and add it to the target elem
const constructQnTable = (targetElem, qns, options) => {
    let tableContent = '';

    // Header
    tableContent += '<h2><b>NUSH Skool (Test header)</b></h2>';

    // Add name field
    tableContent +=
        '<p class="margin-no">Name: <span style="text-decoration:underline;white-space:pre">                                                     </span></p>';
    // Class field
    tableContent +=
        '<p style="display:inline-block;margin-top:2px">Class: <span style="text-decoration:underline;white-space:pre">                  </span></p>';
    // Date field
    tableContent +=
        '<p style="float:right;margin-top:2px">Date: <span style="text-decoration:underline;white-space:pre">                  </span></p>';

    tableContent += '<table>';
    let i = 1;
    qns.forEach((eqn) => {
        if ((i - 1) % options.rows === 0 && i !== 0) tableContent += '</tr><tr>';
        tableContent += `<td>${i}. </td><td>${eqn}</td>`;
        i++;
    });
    tableContent += '</tr><td></td>';

    // Footer
    // tableContent += '<h2><b>Explore, explode, expel (test footer)</b></h2>';

    // Add class to parent
    targetElem.classList.add('qnOutput');

    // Add html content to the target element
    targetElem.innerHTML = tableContent;
}

// Generate button onclick
$('start_gen').onclick = () => {
    // Set config vars based on user input
    // Check validity of input
    const minTextField = $('ans-min').MDCTextField;
    const maxTextField = $('ans-max').MDCTextField;
    const minRange = minTextField.value;
    const maxRange = maxTextField.value;
    if (Math.abs(maxRange - minRange) < 2 || !maxTextField.valid || !minTextField.valid) {
        showMSG('Invalid minimum or maximum range');
        return;
    }
    // Validate number of qns to generate
    const numQnsField = $('num-gen').MDCTextField;
    if (!numQnsField.valid) {
        showMSG('Invalid number of questions to generate');
        return;
    }

    const numGen = numQnsField.value;
    const start = new Date();
    let results = [];
    if ($('grp').checked) {
        for (let i = 0; i < numGen; i++) {
            const {a, b, x, y, use_vars} = _grouping();
            results.push(grouping(a, b, x, y, use_vars).qn);
        }
    }
    else if ($('per-sq').checked) {
        for (let i = 0; i < numGen; i++) {
            const {a, b, c, use_vars, two_var} = _perfect_square();
            results.push(perfect_square(a, b, c, use_vars, two_var).qn);
        }
    }
    else if ($('tri').checked) {
        for (let i = 0; i < numGen; i++) {
            const {a, b, c, use_vars, x1, x2} = _trinomial();
            results.push(trinomial(a, b, c, use_vars, x1, x2).qn);
        }
    }
    else if ($('c-factor').checked) {
        for (let i = 0; i < numGen; i++) {
            results.push(common_factor().qn);
        }
    }
    else if ($('general-form').checked) {
        for (let i = 0; i < numGen; i++) {
            const {a, b, c, use_vars, x1, x2} = _general_formula();
            results.push(general_formula(a, b, c, use_vars, x1, x2).qn);
        }
    }
    else {
        showMSG('No factorisation method(s) selected');
        return;
    }

    constructQnTable($('results-content'), results, {
        rows: 2
    });

    // Open the dialog
    const dialog = $('results-dialog').MDCDialog
    dialog.open();
    dialog.listen('MDCDialog:closed', e => {
        switch (e.detail.action) {
            case 'print':
                const win = window.open('printResults.html', 'Print Questions',
                    'toolbars=0,width=720,height=640,left=200,top=200,scrollbars=1,resizable=1,modal=1,alwaysRaised=1');

                win.onload = () => { // Add questions after page has loaded
                    constructQnTable(win.document.body, results, {
                        rows: 2
                    });

                    // Set afterprint event
                    window.onafterprint = () => {
                        // Close window after a delay
                        setTimeout(() => win.close(), 500);
                    };

                    win.print(); // Trigger print dialog
                }
                break;
        }
    });

    console.log('Time:', new Date() - start);
    // console.log('Done')
}

// Copy question onclick listener
$('copy-questions').onclick = () => {
    copyElemContents($('results-content'));
    showMSG('Questions copied to clipboard');
    $('results-dialog').MDCDialog.close(); // Auto-close dialog
}
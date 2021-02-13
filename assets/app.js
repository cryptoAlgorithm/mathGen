// *----------------------------* //
// ====== Really Important ====== //
// ############################## //

// Returns the document with the specified ID
// (shortens the getElementById function)
const $ = (e) => { return document.getElementById(e) }

// ----------------------- //
// ====== Constants ====== //
// ----------------------- //

// Application version
const VERSION_CODE = "0.1.5";

// Input fields
const numGen = $('num-gen').MDCTextField;
const minField = $('ans-min').MDCTextField;
const maxField = $('ans-max').MDCTextField;


// ------------------------------- //
// ====== Utility Functions ====== //
// ------------------------------- //


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

// Show a snackbar with a message
const showMSG = (msg) => {
    const snackbar = $('msg-snackbar').MDCSnackbar;
    snackbar.labelText = msg;
    snackbar.open();
}

// Creates a table with questions and add it to the target elem
const constructQnTable = (targetElem, qns, options, print = false) => {
    let tableContent = '';

    if (print) tableContent += '<div class="printMsg">Reloading this window will cause generated questions to be lost</div>'

    if (options.noFormat) tableContent = `<pre>${qns.map((qn, i) => {
        if (options.qnNos) return `${i}. ${qn}`;
        else return qn;
    }).join('\n')}</pre>`
    else {
        // Header
        if (options.header != null) tableContent += `<h2><b>${options.header}</b></h2>`;

        // Name field
        if (options.name) tableContent +=
            '<p style="margin:0">Name: <u>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</u></p>';
        // Class field
        if (options.class) tableContent +=
            '<p style="margin:8px 0 0 0">Class: <u>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</u></p>';
        // Date field
        if (options.date) tableContent +=
            '<p style="margin-top:8px">Date: <u>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</u></p>';

        tableContent += '<table>';
        let i = 1;
        qns.forEach((eqn) => {
            if ((i - 1) % options.rows === 0 && i !== 0) tableContent += '</tr><tr>';
            if (options.qnNos) tableContent += `<td>${i}. </td>`;
            else tableContent += '<td></td>'; // I don't know why an extra td is required else the layout gets wonky
            tableContent += `<td class="qn">${eqn}</td>`;
            i++;
        });
        tableContent += '</tr><td></td>';

        // Footer
        // tableContent += '<h2><b>Explore, explode, expel (test footer)</b></h2>';
    }

    // Add class to parent
    targetElem.classList.add('qnOutput');

    // Add html content to the target element
    targetElem.innerHTML = tableContent;
}


// ----------------------------------- //
// ====== User Input Validation ====== //
// ----------------------------------- //

function inputValid() {
    // Check validity of min-max values
    const minRange = minField.value;
    const maxRange = maxField.value;
    if (maxRange === minRange || !maxField.valid || !minField.valid) return false;

    // Validate number of qns to generate
    if (!numGen.valid) return false;

    // If the execution reached this point, everything is valid
    return true;
}

const genBtn = $('start_gen');
function inputChangeListener() {
    genBtn.disabled = !inputValid();
    console.log('called');
}


// ----------------------- //
// ====== Init Code ====== //
// ----------------------- //

// Display app version
$('app-ver').textContent = `App version: v${VERSION_CODE}`;

// Validate input for the first time
inputChangeListener();


// ------------------------------------- //
// ====== Various event listeners ====== //
// ------------------------------------- //

// Reset factorisation options
const resetFactOps = () => {
    $('c-factor').checked = false;
    $('grp').checked = false;
    $('per-sq').checked = false;
    $('tri').checked = false;
    $('general-form').checked = false;
}

// .......................................... //
// ------ Input field change listeners ------ //
// .......................................... //

numGen.input_.oninput = inputChangeListener;
maxField.input_.oninput = inputChangeListener;
minField.input_.oninput = inputChangeListener;

// ............................... //
// ------ Onclick listeners ------ //
// ............................... //

// Reset factorisation methods button onclick listener
$('reset-methods').onclick = resetFactOps;

// More info FAB onclick listener
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
            case 'help':
                window.open('help.html', 'Help',
                    'toolbars=0,width=580,height=720,left=200,top=200,scrollbars=1,resizable=1,modal=1,alwaysRaised=1');
                break;
        }
    })
}

// Generate button onclick listener
genBtn.onclick = () => {
    // Set config vars based on user input
    MIN_RANGE = parseInt(minField.value);
    MAX_RANGE = parseInt(maxField.value);

    const n = numGen.value; // Number of questions to generate

    let results = [];
    if ($('grp').checked) {
        for (let i = 0; i < n; i++) {
            const {a, b, x, y, use_vars} = _grouping();
            results.push(grouping(a, b, x, y, use_vars).qn);
        }
    }
    else if ($('per-sq').checked) {
        for (let i = 0; i < n; i++) {
            const {a, b, c, use_vars, two_var} = _perfect_square();
            results.push(perfect_square(a, b, c, use_vars, two_var).qn);
        }
    }
    else if ($('tri').checked) {
        for (let i = 0; i < n; i++) {
            const {a, b, c, use_vars, x1, x2} = _trinomial();
            results.push(trinomial(a, b, c, use_vars, x1, x2).qn);
        }
    }
    else if ($('c-factor').checked) {
        for (let i = 0; i < n; i++) {
            results.push(common_factor().qn);
        }
    }
    else if ($('general-form').checked) {
        for (let i = 0; i < n; i++) {
            const {a, b, c, use_vars, x1, x2} = _general_formula();
            results.push(general_formula(a, b, c, use_vars, x1, x2).qn);
        }
    }
    else {
        showMSG('No factorisation method(s) selected');
        return;
    }

    const selectedChips = $('out-items-chips').MDCChipSet.selectedChipIds; // Selected chips

    console.log({MIN_RANGE, MAX_RANGE});

    const options = {
        rows: 2,
        name: selectedChips.includes('out-name-field'),
        date: selectedChips.includes('out-date-field'),
        class: selectedChips.includes('out-class-field'),
        qnNos: selectedChips.includes('out-qn-nos'),
        header: 'This is a test',
        noFormat: $('no-format').checked
    }

    constructQnTable($('results-content'), results, options);

    // Open the dialog
    const dialog = $('results-dialog').MDCDialog
    dialog.open();
    dialog.listen('MDCDialog:closed', e => {
        switch (e.detail.action) {
            case 'print':
                const win = window.open('printResults.html', 'Print Questions',
                    'toolbars=0,width=720,height=640,left=200,top=200,scrollbars=1,resizable=1,modal=1,alwaysRaised=1');

                win.onload = () => { // Add questions after page has loaded
                    constructQnTable(win.document.body, results, options, true);

                    // Set afterprint event
                    win.onafterprint = () => {
                        // Close window after a delay
                        setTimeout(() => win.close(), 500);
                    };

                    win.print(); // Trigger print dialog
                }
                break;
        }
    });
}

// Copy question onclick listener
$('copy-questions').onclick = () => {
    copyElemContents($('results-content'));
    showMSG('Questions copied to clipboard');
    $('results-dialog').MDCDialog.close(); // Auto-close dialog
}
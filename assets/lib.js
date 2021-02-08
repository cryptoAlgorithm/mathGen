// General.py

function isInt(value) {
    let x;
    if (isNaN(value)) {
        return false;
    }
    x = parseFloat(value);
    return (x | 0) === x;
}

function sample(arr, n) {
    let result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        const x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

const isSquare = function (n) {
    return n > 0 && Math.sqrt(n) % 1 === 0;
};

function randrange(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function gcd(x, y) {
    if ((typeof x !== 'number') || (typeof y !== 'number'))
        return false;
    x = Math.abs(x);
    y = Math.abs(y);
    while(y) {
        const t = y;
        y = x % y;
        x = t;
    }
    return x;
}

function format_coeff1(x) {
    if (x === -1) x = '-';
    else if (x === 1) x = '';
    else x = x.toString();
    return x;
}


function format_coeff2(y) {
    let r = '';
    if (y === -1) r = ' - ';
    else if (y === 1) r = " + "
    else if (y === 0) r = ''
    else if (y < -1) r = " - " + Math.abs(y).toString();
    else r = " + " + y.toString();
    return r;
}


function format_coeff3(y) {
    if (y === 0) y = '';
    else if (y < 0) y = " - " + Math.abs(y).toString();
    else y = " + " + y.toString();
    return y;
}

const MIN_RANGE = -10;
const MAX_RANGE = 11;

const COMMON_MIN_RANGE = 2;
const COMMON_MAX_RANGE = 6;

const LENGTH_MIN_RANGE = 2;
const LENGTH_MAX_RANGE = 6;

const vars = ['a', 'b', 'c', 'd', 'm', 'n', 'p', 'q', 's', 't', 'x', 'y'];

// ========================
// general_formula.py
function _general_formula() {
    let a = 0;
    let b = 0;
    let c = 0;
    while (b ** 2 - 4 * a * c < 0 ||
    b === 0 ||
    c === 0 ||
    gcd(a, gcd(b, c)) !== 1) {
        a = randrange(MIN_RANGE, MAX_RANGE)
        b = randrange(MIN_RANGE, MAX_RANGE)
        c = randrange(MIN_RANGE, MAX_RANGE)
    }
    let x1 = (-b + Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
    let x2 = (-b - Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
    while (!isInt(x1) || !isInt(x2)) {

        a = randrange(MIN_RANGE, MAX_RANGE)
        b = randrange(MIN_RANGE, MAX_RANGE)
        c = randrange(MIN_RANGE, MAX_RANGE)
        x1 = (-b + Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
        x2 = (-b - Math.sqrt(b ** 2 - 4 * a * c)) / (2 * a);
    }
    let use_vars = vars[randrange(0, vars.length)];

    return {a, b, c, use_vars, x1, x2};
}



function general_formula(a, b, c, use_vars, x1, x2) {
    a = format_coeff1(a)
    b = format_coeff2(b)
    c = format_coeff3(c)

    const question = `${a}${use_vars[0]}²${b}${use_vars[0]}${c} = 0`;

    return {qn: question, x1: x1, x2: x2};
}



// Testing
for (let i = 0; i < 10; i++) {
    const {a, b, c, use_vars, x1, x2} = _general_formula();
    console.log(general_formula(a, b, c, use_vars, x1, x2))
}

// ========================
// common_formula.py

function common_factor() {
    const length = randrange(LENGTH_MIN_RANGE, LENGTH_MAX_RANGE);
    const factor = randrange(COMMON_MIN_RANGE, COMMON_MAX_RANGE);
    const use_vars = sample(vars, length);
    let qn = '';
    for (let i = 0; i < length; i++) {
        let r = randrange(MIN_RANGE, MAX_RANGE);
        while (r === 0) r = randrange(MIN_RANGE, MAX_RANGE);
        if (i === 0) qn += format_coeff1(r * factor) + use_vars[i];
        else qn += format_coeff2(r *factor) + use_vars[i];
    }

    return qn
}

// Testing
for (let i = 0; i < 10; i++) console.log(common_factor());


// ========================
// trinomial.py

function _trinomial() {
    let a = 0; let b = 0; let c = 0; let x1 = 0; let x2 = 0;

    while (gcd(a, gcd(b, c)) !== 1) {
        x1 = randrange(MIN_RANGE, MAX_RANGE)
        x2 = randrange(MIN_RANGE, MAX_RANGE)
        a = 0;
        while (a === 0) a = randrange(MIN_RANGE, MAX_RANGE)

        b = -(x1 + x2) * a;
        c = x1 * x2 * a;

        while (b === 0 || c === 0) {
            x1 = randrange(MIN_RANGE, MAX_RANGE)
            x2 = randrange(MIN_RANGE, MAX_RANGE)
            b = -(x1 + x2) * a
            c = x1 * x2 * a
        }

    }

    const use_vars = sample(vars, 1);

    return { a, b, c, use_vars, x1, x2 }
}



function trinomial(a, b, c, use_vars, x1, x2) {
    a = format_coeff1(a)
    b = format_coeff2(b)
    c = format_coeff2(c)

    const question = `${a}${use_vars[0]}²${b}${use_vars[0]}${c} = 0`

    return { question, x1, x2 };
}



// Testing
for (let i = 0; i < 10; i++) {
    const {a, b, c, use_vars, x1, x2} = _trinomial();
    console.log(trinomial(a, b, c, use_vars, x1, x2));
}


// ========================
// grouping.py

function _grouping() {
    // generate an expression to be factorised in the form (x-a)(y-b)
    let a = 0; let b = 0; let x = 0; let y = 0;
    while (gcd(a * x, gcd(a * y, gcd(b * x, b * y))) !== 1) {
        a = randrange(MIN_RANGE, MAX_RANGE);
        b = randrange(MIN_RANGE, MAX_RANGE);
        x = randrange(MIN_RANGE, MAX_RANGE);
        y = randrange(MIN_RANGE, MAX_RANGE);

        while (a === 0) a = randrange(MIN_RANGE, MAX_RANGE);
        while (b === 0) b = randrange(MIN_RANGE, MAX_RANGE);
        while (x === 0) x = randrange(MIN_RANGE, MAX_RANGE);
        while (y === 0) y = randrange(MIN_RANGE, MAX_RANGE);
    }


    const use_vars = sample(vars, 4);
    return {a, b, x, y, use_vars};
}


function grouping(a, b, x, y, use_vars) {
    const a1 = a; const b1 = b; const x1 = x; const y1 = y;
    a = format_coeff1(a);
    b = format_coeff2(b);
    x = format_coeff1(x);
    y = format_coeff2(y);
    const qn = `${format_coeff1(a1 * x1)}${use_vars[0]}${use_vars[1]}${format_coeff2(a1 * y1)}${use_vars[0]}${use_vars[3]}${format_coeff2(b1 * x1)}${use_vars[2]}${use_vars[1]}${format_coeff2(b1 * y1)}${use_vars[2]}${use_vars[3]}`;
    const ans = `(${a}${use_vars[0]}${b}${use_vars[2]})(${x}${use_vars[1]}${y}${use_vars[3]})`
    return {qn, ans};
}


// Testing
for (let i = 0; i < 10; i++) {
    const {a, b, x, y, use_vars} = _grouping();
    console.log(grouping(a, b, x, y, use_vars));
}


// ========================
// stack_common_factor.py

function common_grouping() {
    const {a, b, x, y, use_vars} = _grouping();
    const factor = randrange(COMMON_MIN_RANGE, COMMON_MAX_RANGE);
    return grouping(a * factor, b * factor, x * factor, y * factor, use_vars);
}


function common_general_formula() {
    const {a, b, c, use_vars, x1, x2} = _general_formula();
    const factor = randrange(COMMON_MIN_RANGE, COMMON_MAX_RANGE);
    return general_formula(a * factor, b * factor, c * factor, use_vars, x1, x2);
}


function common_trinomial() {
    const {a, b, c, use_vars, x1, x2} = _trinomial();
    const factor = randrange(COMMON_MIN_RANGE, COMMON_MAX_RANGE);
    return trinomial(a * factor, b * factor, c * factor, use_vars, x1, x2);
}


// Testing
for (let i = 0; i < 10; i++) console.log(common_trinomial());

// ========================
// perfect_square.py

function _perfect_square() {
    let a = 0; let b = 0; let c = 0;
    while (a === 0 || b === 0 || c === 0 || gcd(a, gcd(b, c)) !== 1) {
        const x = randrange(MIN_RANGE, MAX_RANGE);
        const y = randrange(MIN_RANGE, MAX_RANGE);
        a = x ** 2;
        b = 2 * x * y;
        c = y ** 2;
    }

    let two_var = false;
    let use_vars;
    if (randrange(2) === 1) {
        use_vars = sample(vars, 2);
        two_var = true;
    }
    else {
        use_vars = sample(vars, 1);
        use_vars.push(randrange(0, 10).toString());
    }

    return {a, b, c, use_vars, two_var};
}


function perfect_square(a, b, c, use_vars, two_var) {
    a = format_coeff1(a);
    b = format_coeff2(b);
    let qn = ""
    if (two_var) {
        c = format_coeff2(c);
        qn = `${a}${use_vars[0]}²${b}${use_vars[0]}${use_vars[1]}${c}${use_vars[1]}² = 0`;
    }
    else  {
        c = format_coeff3(c);
        qn = `${a}${use_vars[0]}²${b}${use_vars[0]}${c} = 0`;
    }

    return qn
}

for (let i = 0; i < 10; i++) {
    const {a, b, c, use_vars, two_var} = _perfect_square();
    console.log(perfect_square(a, b, c, use_vars, two_var));
}
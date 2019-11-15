var express = require('express');
var router = express.Router();

// Mail type enum (poor man's)
const MailTypeStampedLetter = 0;
const MailTypeMeteredLetter = 1;
const MailTypeEnvelopeLarge = 2;
const MailTypeFirstClassRetail = 3;

// Prices (per lb)
const StampedLetterPrice = 0.55;
const MeteredLetterPrice = 0.5;
const EnvelopeLargePrice = 1.00;
const FirstClassRetailPrice = 1.25; // base of about 3.60

/* GET home page. */
router.get('/', function(_, res) {
    res.render('index', { title: 'Express' });
});

router.get('/rate', calculateRateEndpoint);

function calculateRateEndpoint(req, res) {
    console.dir(req.query);
    const mailType = Number(req.query.mailType);
    const oz = Number(req.query.oz);
    let rate, error = null;
    try {
        rate = formatCurrency(calculateRate(mailType, oz));
    } catch (e) {
        error = e;
    }
    res.render('index', { error, rate, mailType, oz });
}

function calculateRate(mailType, oz) {
    switch (mailType) {
        case MailTypeStampedLetter:
            return calculateStampedLetter(oz);
        case MailTypeMeteredLetter:
            return calculateMeteredLetter(oz);
        case MailTypeEnvelopeLarge:
            return calculateLargeEnvelope(oz);
        case MailTypeFirstClassRetail:
            return calculatePackageService(oz);
        default:
            return 0;
    }
}

function calculateStampedLetter(oz) {
    if (oz <= 1) return 0.55;
    else if (oz <= 2) return 0.70;
    else if (oz <= 3) return 0.85;
    else if (oz <= 3.5) return 1.00;
    else 
        throw 'Weight too heavy for a stamped letter. ' +
            'Letters must be 3.5 ounces or lighter.';
}

function calculateMeteredLetter(oz) {
    let rate;
    try {
        rate = calculateStampedLetter(oz) - 0.05;
    } catch (_) {
        throw 'Weight too heavy for a metered letter. ' +
            'Letters must be 3.5 ounces or lighter.';
    }

    return rate;
}

function calculateLargeEnvelope(oz) {
    if (oz <= 1) return 1.00;
    else if (oz <= 2) return 1.15;
    else if (oz <= 3) return 1.30;
    else if (oz <= 4) return 1.45;
    else if (oz <= 5) return 1.60;
    else if (oz <= 6) return 1.75;
    else if (oz <= 7) return 1.90;
    else if (oz <= 8) return 2.05;
    else if (oz <= 9) return 2.20;
    else if (oz <= 10) return 2.35;
    else if (oz <= 11) return 2.50;
    else if (oz <= 12) return 2.65;
    else if (oz <= 13) return 2.80;
    else
        throw 'Weight too heavy for a large envelope. ' +
            'Large envelopes must be 13 ounces or lighter.';
}

function calculatePackageService(oz) {
    if (oz > 0 && oz <= 4) return 3.66;
    else if (oz > 4 && oz <= 8) return 4.39;
    else if (oz > 8 && oz <= 12) return 5.19;
    else if (oz <= 13) return 5.71;
    else
        throw 'Weight too heavy for first-class package service. ' +
            'Packages must be 13 ounces or lighter.';
}

function formatCurrency(price) {
    return '$' + price.toFixed(2);
}

module.exports = router;

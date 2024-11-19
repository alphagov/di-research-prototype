const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/driving-licence-auth'

// Add your routes here

// Choose DL authority
router.post(`${parentDir}/driving-licence-cri/dl-choice`, function (req, res) {
	var dlAuth = req.session.data['which-dl']
	if (dlAuth == "dvla") {
		res.redirect('enter-dvla-licence-details')
	} else if (dlAuth == "dva") {
		res.redirect('enter-dva-licence-details')
	} else {
		res.redirect('../ipv-core/page-multiple-doc-check')
	}
})

// DL auth check specific routes (NOT TO BE COPIED TO BASELINE)
router.post(`${parentDir}/driving-licence-cri/dl-correct`, (req, res) => {
	const dlCorrect = req.body['dl-correct'];
	if (dlCorrect == 'yes') {
		res.redirect('auth-consent');
	} else {
		res.redirect('dl-details-incorrect');
	}
});

// DL auth check specific routes (NOT TO BE COPIED TO BASELINE)
router.post(`${parentDir}/driving-licence-cri/dl-incorrect`, (req, res) => {
	const dlIncorrect = req.body['dl-incorrect'];
	if (dlIncorrect == 'again') {
		res.redirect('../ipv-core/triage/computer-tablet');
	} else {
		res.redirect('../ipv-core/pyi-another-way-dl-auth');
	}
});

// DL auth check specific routes (NOT TO BE COPIED TO BASELINE)
router.post(`${parentDir}/driving-licence-cri/auth-consent`, (req, res) => {
	let consent = req.body.consent;

	// Resolve multiple values (if present)
	if (Array.isArray(consent)) {
		// Prioritize "yes" if present, otherwise use "no"
		consent = consent.includes('yes') ? 'yes' : 'no';
	}

	console.log('Resolved Consent value:', consent);

	if (consent === 'yes') {
		res.redirect('../ipv-core/app-success');
	} else {
		res.redirect('auth-consent-error');
	}
});

module.exports = router;
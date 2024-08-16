const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/baseline'

// Add your routes here

// Routes depending on what type of ID to expiry page or dates
router.post(`${parentDir}/f2f-cri/f2f-id-select`, function (req, res) {
	if (req.session.data['f2f-id'] === "UK passport") {
		res.redirect('id-expire')
	} else if (req.session.data['f2f-id'] === "UK photocard driving licence") {
		res.redirect('id-expire')
	} else if (req.session.data['f2f-id'] === "Biometric residence permit (BRP)") {
		res.redirect('id-expire')
	} else if (req.session.data['f2f-id'] === "f2f-no-document") {
		res.redirect('')
	} else {
		res.redirect('non-uk-id-expiry-date')
	}
})

// Routes depending on whether there is an expiry on document
router.post(`${parentDir}/f2f-cri/id-expiry-select`, function (req, res) {
	if (req.session.data['haveExpiryDate'] === "yes") {
		res.redirect('id-expire');
	} else if (req.session.data['haveExpiryDate'] === "no") {
		if (req.session.data['f2f-id'] === "Non-UK passport") {
			res.redirect('select-country');
		}
		else {
			res.redirect('non-uk-id-current-address');
		}
	}
})

// Routes based on whether we need to select country for ID
router.post(`${parentDir}/f2f-cri/id-expiry-date`, function (req, res) {
	if (req.session.data['f2f-id'] === "UK passport") {
		res.redirect('find-post-office-prove-identity');
	} else if (req.session.data['f2f-id'] === "Biometric residence permit (BRP)") {
		res.redirect('find-post-office-prove-identity');
	} else if (req.session.data['f2f-thin-file'] === "yes") {
		res.redirect('find-post-office-prove-identity');
	} else if (req.session.data['f2f-id'] === "UK photocard driving licence") {
		res.redirect('non-uk-id-current-address');
	} else {
		res.redirect('select-country');
	}
})

// ID expiry buffer page
router.post(`${parentDir}/f2f-cri/f2f-id-drop-off`, function (req, res) {
	if (req.session.data['f2f-id-drop-off'] === "back") {
		res.redirect('id-expire')
	} else if (req.session.data['f2f-id-drop-off'] === "different ID") {
		res.redirect('choose-photo-id-post-office')
	} else {
		res.redirect('../ipv-core/pyi-another-way')
	}
})

// Current address on ID?
router.post(`${parentDir}/f2f-cri/id-current-address`, function (req, res) {
	if (req.session.data['id-current-address'] == "no") {
		res.redirect('choose-photo-id-post-office-biometric')
	} else if (req.session.data['f2f-id'] == "UK photocard driving licence") {
		res.redirect('find-post-office-prove-identity')
	} else {
		res.redirect('select-country')
	}
})

// Thin file - UK passport?
router.post(`${parentDir}/f2f-cri/f2f-thin-file`, function (req, res) {
	if (req.session.data['f2f-thin-file'] === "no") {
		res.redirect('../ipv-core/pyi-another-way')
	} else {
		res.redirect('id-expire')
	}
})

// Email or post
router.post(`${parentDir}/f2f-cri/customer-letter`, function (req, res) {
	if (req.session.data['customer-letter'] === "Email only") {
		res.redirect('check-answers')
	} else {
		res.redirect('post-office-customer-letter-check-address')
	}
})


module.exports = router;
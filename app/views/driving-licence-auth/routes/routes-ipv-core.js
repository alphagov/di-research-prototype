const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/driving-licence-auth'
const express = require('express');
const app = express();

// Add your routes here

// Online photo ID screener, checks for confidence level before redirecting
router.post(`${parentDir}/ipv-core/triage/online-photoid`, function (request, response) {
	var photoID = request.session.data['photo-id']
	var confidence = request.session.data['confidence']
	if (photoID === "Yes") {
		response.redirect("computer-tablet")
	} else if (photoID === "No" && confidence === "medium") {
		response.redirect("../page-multiple-doc-check")
	} else if (photoID === "No" && confidence === "low") {
		response.redirect("../prove-identity-no-photo-id")
	} else {
		response.redirect("../page-multiple-doc-check")
	}
})

// App drop off buffer
router.post(`${parentDir}/ipv-core/app-drop-off-buffer`, function (request, response) {
	var photoID = request.session.data['app-drop-off-buffer']
	if (photoID == "another way") {
		response.redirect("page-multiple-doc-check")
	} else {
		response.redirect("app-download")
	}
})

// App drop off / F2F ID screener
router.post(`${parentDir}/ipv-core/eligibility-drop-off`, function (request, response) {
	var photoID = request.session.data['eligibility-drop-off']
	if (photoID == "driving-licence") {
		response.redirect("../driving-licence-cri/photocard-authority")
	} else if (photoID == "passport") {
		response.redirect("../passport-cri/enter-passport-details")
	} else if (photoID == "nino") { // No photo ID route
		response.redirect("../claimed-identity-cri/enter-name")
	} else {
		response.redirect("pyi-post-office")
	}
})

// Low confidence nino screener
router.post(`${parentDir}/ipv-core/niNumber`, function (request, response) {
	var niNumber = request.session.data['niNumber']
	if (niNumber == "yes") {
		response.redirect("../claimed-identity-cri/enter-name") // no photo ID route
	} else {
		response.redirect("page-ipv-identity-postoffice-start")
	}
})

// F2F ID screener low/medium confidence
router.post(`${parentDir}/ipv-core/f2f-screener`, function (request, response) {
	var f2fID = request.session.data['f2f-screener']
	var confidence = request.session.data['confidence']
	if (f2fID == "yes") {
		response.redirect("../f2f-cri/prove-identity-post-office")
	} else if (f2fID == "no" && confidence == "low") {
		response.redirect("pyi-escape")
	} else if (f2fID == "no" && confidence == "medium") {
		response.redirect("pyi-another-way")
	}
})

// Medium confidence bank account screener
router.post(`${parentDir}/ipv-core/bank-account`, function (request, response) {
	var account = request.session.data['bank-account']
	if (account == "yes") {
		response.redirect("../claimed-identity-cri/enter-name") // no photo ID route
	} else {
		response.redirect("no-photo-id-start-find-another-way")
	}
})

// F2F ID screener
router.post(`${parentDir}/ipv-core/pyiPO`, function (request, response) {
	var pyiPO = request.session.data['pyiPO']
	var confidence = request.session.data['confidence']
	if (pyiPO == "yes") {
		response.redirect("../f2f-cri/prove-identity-post-office")
	} else if (pyiPO == "no" && confidence == "medium") {
		response.redirect("prove-identity-bank-account")
	} else if (pyiPO == "no" && confidence == "low") {
		response.redirect("pyi-escape")
	}
})

// Device screener EDITED FOR DL AUTH
router.post(`${parentDir}/ipv-core/triage/device-check`, function (request, response) {
	var appDeviceCheck = request.session.data['app-device-check']
	if (appDeviceCheck == "yes") {
		response.redirect("smartphone-access")
	} else {
		response.redirect("comupter-tablet")
	}
})

// MAM smartphone type
router.post(`${parentDir}/ipv-core/triage/app-download-smartphone`, function (request, response) {
	var appDeviceCheck = request.session.data['app-download-smartphone']
	if (appDeviceCheck == "iphone") {
		response.redirect("../app-download-smartphone")
	} else if (appDeviceCheck == "android") {
		response.redirect("../app-download-smartphone")
	} else {
		response.redirect("smartphone-access")
	}
})

// Driving licence fail
router.post(`${parentDir}/ipv-core/dl-fail`, function (request, response) {
	var dlFail = request.session.data['dl-fail']
	if (dlFail == "passport") {
		response.redirect("../passport-cri/enter-passport-details")
	} else {
		response.redirect("../service/service-start")
	}
})

// Passport fail
router.post(`${parentDir}/ipv-core/passport-fail`, function (request, response) {
	var passportFail = request.session.data['passport-fail']
	if (passportFail == "driving licence") {
		response.redirect("../driving-licence-cri/photocard-authority")
	} else {
		response.redirect("../service/service-start")
	}
})

// KBV fail
router.post(`${parentDir}/ipv-core/kbv-fail`, function (req, res) {
	var kbvFail = req.session.data['kbv-fail']
	if (kbvFail == "return") {
		res.redirect('../service/service-start')
	} else if (kbvFail == "app") {
		res.redirect('app-download')
	} else {
		res.redirect('../f2f-cri/prove-identity-post-office')
	}
})

// KBV drop off
router.post(`${parentDir}/ipv-core/kbv-drop-off`, function (req, res) {
	var kbvDropOff = req.session.data['kbv-drop-off']
	if (kbvDropOff == "return") {
		res.redirect('../service/service-start')
	} else if (kbvDropOff == "app") {
		res.redirect('app-download')
	} else {
		res.redirect('../f2f-cri/prove-identity-post-office')
	}
})

// bank account drop off
router.post(`${parentDir}/ipv-core/bank-drop-off`, function (req, res) {
	var account = req.session.data['bank-drop-off']
	if (account == "return") {
		res.redirect('../service/service-start')
	} else if (account == "app") {
		res.redirect('app-download')
	} else {
		res.redirect('prove-identity-bank-account')
	}
})

// Escape/back to service
router.post(`${parentDir}/ipv-core/pyi-escape`, function (req, res) {
	var pyiEscape = req.session.data['pyi-escape']
	if (pyiEscape == "return") {
		res.redirect('../service/service-start')
	} else {
		res.redirect('../ipv-core/triage/online-photoid-screener')
	}
})

// PIP payment pre-KBV question
router.post(`${parentDir}/ipv-core/pip`, function (request, response) {
	var pip = request.session.data['pip']
	if (pip == "yes") {
		response.redirect("page-pre-dwp-kbv-transition")
	} else {
		response.redirect("../kbv-cri/experian-kbv-start")
	}
})

// Buffer page to go back to Nino or try another way
router.post(`${parentDir}/ipv-core/nino-drop-off-buffer`, function (req, res) {
	var ninoChoice = req.session.data['nino-drop-off-buffer']
	var photoID = req.session.data['photo-id']
	if (ninoChoice == "another way") {
		if (photoID == "yes") {
			res.redirect('../kbv-cri/experian-kbv-start')
		} else {
			res.redirect('pyi-another-way')
		}
	} else {
		res.redirect('../nino-cri/enter-national-insurance-number')
	}
})

// Routing for the 'Do you live in the UK, the Channel Islands or the Isle of Man?' page 
router.post(`${parentDir}/ipv-core/triage/live-in-uk-post`, function (req, res) {
	if (req.session.data['live-in-uk-choose'] === "yes") {
		res.redirect('online-photoid-screener');
	} else if (req.session.data['live-in-uk-choose'] === "no") {
		res.redirect('non-uk-passport');
	}
});

// Route for new page international-address-passport
router.post(`${parentDir}/ipv-core/triage/non-uk-passport-post`, (req, res) => {
	const passportChoice = req.body['non-uk-passport'];
	if (passportChoice === 'yes') {
		// Redirect to the page for users who have a biometric passport
		res.redirect('computer-tablet');
	} else if (passportChoice === 'no') {
		// Redirect to the page for users who do not have a biometric passport
		res.redirect('../non-uk-no-passport');
	}
});

// Routing for new page non-uk-no-app
router.post(`${parentDir}/ipv-core/international-app-dropoff-post`, function (req, res) {
	if (req.session.data['international-app-dropoff-choice'] == "yes") {
		res.redirect('../service/service-start')
	}
	else if (req.session.data['international-app-dropoff-choice'] == "no") {
		res.redirect('app-download')
	}
})

// Routing for new page non-uk-no-passport
router.post(`${parentDir}/ipv-core/international-passport-dropoff-post`, function (req, res) {
	if (req.session.data['international-passport-dropoff-choice'] == "yes") {
		res.redirect('../service/service-start')
	}
	else if (req.session.data['international-passport-dropoff-choice'] == "no") {
		res.redirect('../ipv-core/triage/computer-tablet')
	}
})

//Routing on the app download page. Users will see if a different page if they select "no" based on whether they are in the UK or not 
router.post(`${parentDir}/ipv-core/triage/app-download`, function (req, res) {
	const phone = req.body['app-download-check'];
	if (phone === 'no') {
		// Redirect to the page for users who have a biometric passport
		res.redirect('smartphone-access');
	} else {
		// Redirect to the page for users who do not have a biometric passport
		res.redirect('valid-passport');
	}
});

// COI routing - COI
router.post(`${parentDir}/ipv-core/continuity-of-identity/update-details`, function (request, response) {
	var details = request.session.data['updateDetails']
	var continuityIdentity = request.session.data['continuityIdentity']
	if (details.includes("Given names") && details.includes("Last name")) {
		response.redirect("update-name-date-birth")
	} else if (details.includes("Date of birth")) {
		response.redirect("update-name-date-birth")
	} else if (details == "Address") {
		response.redirect("../../address-cri/what-country")
	} else if (details.includes("Given names") || details.includes("Last name") || details.includes("Address")) {
		if (continuityIdentity == "coi") {
			response.redirect("page-update-name-coi")
		} else if (continuityIdentity == "fraud") {
			response.redirect("page-update-name-6mfc")
		}
	} else {
		response.redirect("../../service/service-start")
	}
})

// COI routing - 6MFC
router.post(`${parentDir}/ipv-core/continuity-of-identity/confirm-your-details`, function (request, response) {
	var detailsCorrect = request.session.data['details-correct']
	var details = request.session.data['updateDetails']
	var continuityIdentity = request.session.data['continuityIdentity']
	if (detailsCorrect === 'No') {
		if (details.includes("Given names") && details.includes("Last name")) {
			response.redirect("update-name-date-birth")
		} else if (details.includes("Date of birth")) {
			response.redirect("update-name-date-birth")
		} else if (details == "Address") {
			response.redirect("../../address-cri/what-country")
		} else if (details.includes("Given names") || details.includes("Last name") || details.includes("Address")) {
			if (continuityIdentity == "coi") {
				response.redirect("page-update-name-coi")
			} else if (continuityIdentity == "fraud") {
				response.redirect("page-update-name-6mfc")
			}
		}
	} else if (detailsCorrect === 'Yes') {
		response.redirect("../../fraud-cri/fraud-check")
	}
})

// COI delete your account buffer routing
router.post(`${parentDir}/ipv-core/continuity-of-identity/delete-buffer`, (req, res) => {
	const updateDetails = req.body['updateDetails'];
	if (updateDetails === 'delete') {
		res.redirect('delete-handover');
	} else if (updateDetails === 'continue') {
		res.redirect('../../service/service-start');
	} else {
		res.redirect('confirm-your-details');
	}
});

// COI/6MFC app abandon
router.post(`${parentDir}/ipv-core/coi-fraud-app-abandon`, (req, res) => {
	const cantUseApp = req.body['cantUseApp'];
	if (cantUseApp === 'delete') {
		res.redirect('../ipv-core/continuity-of-identity/delete-handover');
	} else if (cantUseApp === 'service') {
		res.redirect('../service/service-start');
	}
});

// COI/6MFC update name
router.post(`${parentDir}/ipv-core/continuity-of-identity/update-name`, (req, res) => {
	const updateName = req.body['updateName'];
	var continuityIdentity = req.session.data['continuityIdentity']
	if (updateName == 'app') {
		res.redirect('../triage/computer-tablet');
	} else if (updateName == 'service') {
		res.redirect('../../service/service-start');
	} else if (updateName == 'back') {
		if (continuityIdentity == "coi") {
			res.redirect("update-details")
		} else if (continuityIdentity == "fraud") {
			res.redirect("confirm-your-details")
		}
	}
});

// app success routing (COI/6MFC and normal)
router.post(`${parentDir}/ipv-core/app-success-page`, function (request, response) {
	var details = request.session.data['updateDetails']
	var continuityIdentity = request.session.data['continuityIdentity']
	const liveInUK = request.session.data['live-in-uk-choose']
	if (continuityIdentity) {
		if (details.includes("Address") && details.includes("Last name")) {
			response.redirect("../ipv-core/continuity-of-identity/page-dcmaw-success-coi-name-address")
		} else if (details.includes("Address") && details.includes("Given names")) {
			response.redirect("../ipv-core/continuity-of-identity/page-dcmaw-success-coi-name-address")
		} else if (details.includes("Given names") || details.includes("Last name")) {
			response.redirect("../ipv-core/continuity-of-identity/page-dcmaw-success-coi-name")
		}
	} else if (liveInUK == "no") {
		response.redirect("../address-cri/what-country")
	} else {
		response.redirect("../address-cri/find-current-address")
	}
})

// DL auth check specific routes (NOT TO BE COPIED TO BASELINE)
router.post(`${parentDir}/ipv-core/triage/passport-check`, (req, res) => {
	const passportCheck = req.body['passport-check'];
	if (passportCheck == 'no') {
		res.redirect('brp');
	} else {
		res.redirect('valid-passport'); // goes nowhere, for testing purposes
	}
});

// DL auth check specific routes (NOT TO BE COPIED TO BASELINE)
router.post(`${parentDir}/ipv-core/triage/brp-check`, (req, res) => {
	const brpCheck = req.body['brp-check'];
	if (brpCheck == 'no') {
		res.redirect('valid-dl');
	} else {
		res.redirect('brp'); // goes nowhere, for testing purposes
	}
});

// DL auth check specific routes (NOT TO BE COPIED TO BASELINE)
router.post(`${parentDir}/ipv-core/triage/dl-check`, (req, res) => {
	const dlCheck = req.body['dl-check'];
	if (dlCheck == 'yes') {
		res.redirect('id-check-app-dl');
	} else {
		res.redirect('valid-dl'); // goes nowhere, for testing purposes
	}
});

module.exports = router;

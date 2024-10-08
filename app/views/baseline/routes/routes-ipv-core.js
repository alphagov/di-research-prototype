const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/baseline'
const express = require('express');
const app = express();

// Add your routes here

// Online photo ID screener
router.post(`${parentDir}/ipv-core/triage/online-photoid`, function (request, response) {
	var photoID = request.session.data['photo-id']
	if (photoID == "Yes") {
		response.redirect("computer-tablet")
	} else {
		response.redirect("../app-drop-off")
	}
})

// App drop off buffer
router.post(`${parentDir}/ipv-core/app-drop-off-buffer`, function (request, response) {
	var photoID = request.session.data['app-drop-off-buffer']
	if (photoID == "another way") {
		response.redirect("app-drop-off")
	} else {
		response.redirect("app-download")
	}
})

// App drop off / F2F ID screener
router.post(`${parentDir}/ipv-core/app-drop-off`, function (request, response) {
	var photoID = request.session.data['app-drop-off']
	if (photoID == "driving-licence") {
		response.redirect("../driving-licence-cri/photocard-authority")
	} else if (photoID == "passport") {
		response.redirect("../passport-cri/enter-passport-details")
	} else {
		response.redirect("f2f-screener")
	}
})

// F2F ID screener
router.post(`${parentDir}/ipv-core/f2f-screener`, function (request, response) {
	var f2fID = request.session.data['f2f-screener']
	if (f2fID == "yes") {
		response.redirect("../f2f-cri/prove-identity-post-office")
	} else {
		response.redirect("../nino-cri/enter-ni-number")
	}
})

// Device screener
router.post(`${parentDir}/ipv-core/triage/device-check`, function (request, response) {
	var appDeviceCheck = request.session.data['app-device-check']
	if (appDeviceCheck == "yes") {
		response.redirect("smartphone-access")
	} else {
		response.redirect("smartphone-type")
	}
})

// DAD smartphone access
router.post(`${parentDir}/ipv-core/triage/app-download`, function (request, response) {
	var appDeviceCheck = request.session.data['app-download-check']
	if (appDeviceCheck == "iphone") {
		response.redirect("../app-download")
	} else if (appDeviceCheck == "android") {
		response.redirect("../app-download")
	} else {
		response.redirect("../app-drop-off-buffer")
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

// PIP payment pre-KBV question
router.post(`${parentDir}/ipv-core/pip`, function (request, response) {
	var pip = request.session.data['pip']
	if (pip == "yes") {
		response.redirect("page-pre-dwp-kbv-transition")
	} else {
		response.redirect("../nino-cri/enter-ni-number") // Temporary before f2f route
	}
})

// Buffer page to go back to Nino or try another way
router.post(`${parentDir}/ipv-core/nino-drop-off-buffer`, function (req, res) {
	var ninoChoice = req.session.data['nino-drop-off-buffer']
	var photoID = req.session.data['photo-id']
	if (ninoChoice == "another way") {
		if (photoID == "yes") {
			res.redirect('../kbv-cri/experian-question1')
		} else {
			res.redirect('pyi-another-way')
		}
	} else {
		res.redirect('../nino-cri/enter-ni-number')
	}
})

// COI update details
router.post(`${parentDir}/ipv-core/continuity-of-identity/update-details`, function (request, response) {
	var updateDetails = request.session.data['update-details']
	if (updateDetails == "none") {
		response.redirect("page-ipv-reuse")
	} else {
		response.redirect("#")
	}
})

// COI confirm details
router.post(`${parentDir}/ipv-core/continuity-of-identity/confirm-your-details`, function (request, response) {
	var correctDetails = request.session.data['details-correct']
	if (correctDetails == "Yes") {
		response.redirect("../../fraud-cri/coi-fraud-check")
	} else {
		response.redirect("#")
	}
})

module.exports = router;
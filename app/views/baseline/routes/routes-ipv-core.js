const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/baseline'
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
		response.redirect("../app-drop-off")
	} else if (photoID === "No" && confidence === "low") {
		response.redirect("../prove-identity-no-photo-id")
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
	} else if (photoID == "nino") {
		response.redirect("../passport-cri/enter-passport-details")
	} else {
		response.redirect("pyi-post-office")
	}
})

// F2F ID screener
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

// F2F ID screener
router.post(`${parentDir}/ipv-core/pyiPO`, function (request, response) {
	var pyiPO = request.session.data['pyiPO']
	if (pyiPO == "yes") {
		response.redirect("../f2f-cri/prove-identity-post-office")
	} else {
		response.redirect("pyi-escape")
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
		res.redirect('../nino-cri/enter-ni-number')
	}
})

module.exports = router;
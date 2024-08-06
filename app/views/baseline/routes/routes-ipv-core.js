const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/baseline'

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
		response.redirect("../app-cri/app-download")
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
		response.redirect("../../app-cri/app-download")
	} else if (appDeviceCheck == "android") {
		response.redirect("../../app-cri/app-download")
	} else {
		response.redirect("../app-drop-off-buffer")
	}
})

// MAM smartphone type
router.post(`${parentDir}/ipv-core/triage/app-download-smartphone`, function (request, response) {
	var appDeviceCheck = request.session.data['app-download-smartphone']
	if (appDeviceCheck == "iphone") {
		response.redirect("../../app-cri/app-download-smartphone")
	} else if (appDeviceCheck == "android") {
		response.redirect("../../app-cri/app-download-smartphone")
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

module.exports = router;
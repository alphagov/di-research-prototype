const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/baseline'

// Add your routes here

// Photo ID screener
router.post(`${parentDir}/pyi/online-photoid`, function (request, response) {
	var photoID = request.session.data['photo-id']
	if (photoID == "Yes") {
		response.redirect("computer-tablet")
	} else {
		response.redirect("buffer-online")
	}
})

// Device screener
router.post(`${parentDir}/pyi/device-check`, function (request, response) {
	var appDeviceCheck = request.session.data['app-device-check']
	if (appDeviceCheck == "yes") {
		response.redirect("smartphone-access")
	} else {
		response.redirect("smartphone-type")
	}
})

// DAD App download screener
router.post(`${parentDir}/pyi/app-download`, function (request, response) {
	var appDeviceCheck = request.session.data['app-download-check']
	if (appDeviceCheck == "iphone") {
		response.redirect("../app-cri/app-download")
	} else if (appDeviceCheck == "android") {
		response.redirect("../app-cri/app-download")
	} else {
		response.redirect("#")
	}
})

// MAM App download screener
router.post(`${parentDir}/pyi/app-download-smartphone`, function (request, response) {
	var appDeviceCheck = request.session.data['app-download-smartphone']
	if (appDeviceCheck == "iphone") {
		response.redirect("../app-cri/app-download-smartphone")
	} else if (appDeviceCheck == "android") {
		response.redirect("../app-cri/app-download-smartphone")
	} else {
		response.redirect("#")
	}
})

module.exports = router;
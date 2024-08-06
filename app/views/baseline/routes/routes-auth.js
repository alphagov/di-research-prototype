const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/baseline'

// Add your routes here

router.post(`${parentDir}/authentication/create-email-sms`, function (req, res) {
	res.redirect('create-checkemail')
})

// choose how to get security codes in the create account journey
router.post(`${parentDir}/authentication/choose-otp-method`, function (req, res) {
	var otpMethod = req.session.data['security-code']
	if (otpMethod == "otp-sms") {
		// Send user to this page
		res.redirect('create-otpsms')
	} else if (otpMethod == "otp-voice") {
		// Or send user to this page
		res.redirect('create-otp-voice')
	} else {
		// Or send user to this page
		res.redirect('create-otp-auth')
	}
})

module.exports = router;
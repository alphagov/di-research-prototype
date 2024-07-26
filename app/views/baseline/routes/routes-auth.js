const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/baseline'

// Add your routes here

router.post(`${parentDir}/authentication/create-email-sms`, function (req, res) {
	res.redirect('create-checkemail')
})

// choose how to get security codes in the create account journey

// The content in the "" is the page where the radio buttons are
router.post(`${parentDir}/authentication/choose-otp-method`, function (req, res) {

	// The content in the "" is the name of the radio button
	var otpMethod = req.session.data['security-code']

	// The content in the "" is the value of the radio button
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
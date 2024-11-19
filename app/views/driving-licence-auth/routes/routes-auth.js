const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/driving-licence-auth'

// Add your routes here

router.post(`${parentDir}/authentication/signin-success`, function (req, res) {
	var continuityIdentity = req.session.data['continuityIdentity']
	if (continuityIdentity === "coi") {
		res.redirect('../ipv-core/continuity-of-identity/page-ipv-reuse')
	} else if (continuityIdentity === "fraud") {
		res.redirect('../ipv-core/continuity-of-identity/confirm-your-details')
	} else {
		res.redirect('signin-success')
	}
})

router.post(`${parentDir}/authentication/create-email-sms`, function (req, res) {
	res.redirect('create-checkemail')
})

// choose how to get security codes in the create account journey
router.post(`${parentDir}/authentication/choose-otp-method`, function (req, res) {
	var otpMethod = req.session.data['security-code']
	if (otpMethod == "otp-sms") {
		res.redirect('create-otpsms')
	} else if (otpMethod == "otp-voice") {
		res.redirect('create-otp-voice')
	} else {
		res.redirect('create-otp-auth')
	}
})

module.exports = router;
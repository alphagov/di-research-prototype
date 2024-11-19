const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/driving-licence-auth'

// Add your routes here

router.post(`${parentDir}/claimed-identity-cri/confirm-details`, function (req, res) {
	var confidence = req.session.data['confidence']
	if (confidence === "low") {
		res.redirect('../nino-cri/enter-national-insurance-number')
	} else {
		res.redirect('../bank-account-cri/continue-enter-bank-account-details')
	}
})

module.exports = router;
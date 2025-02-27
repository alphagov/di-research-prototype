const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/open-banking'

// Add your routes here

router.post(`${parentDir}/claimed-identity-cri/confirm-details`, function (req, res) {
	var confidence = req.session.data['confidence']
	if (confidence === "low") {
		res.redirect('../claimed-identity-cri/confirm-details')
	} else {
		res.redirect('../claimed-identity-cri/confirm-details')
	}
})

module.exports = router;
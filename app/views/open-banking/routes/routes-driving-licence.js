const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/open-banking'

// Add your routes here

// Choose DL authority
router.post(`${parentDir}/driving-licence-cri/dl-choice`, function (req, res) {
	var dlAuth = req.session.data['which-dl']
	if (dlAuth == "dvla") {
		res.redirect('enter-dvla-licence-details')
	} else if (dlAuth == "dva") {
		res.redirect('enter-dva-licence-details')
	} else {
		res.redirect('../driving-licence-cri/photocard-authority')
	}
})

module.exports = router;
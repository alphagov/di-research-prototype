const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/open-banking'

// Add your routes here

// Routes depending on whether they have selected photo ID or not
router.post(`${parentDir}/nino-cri/ni-details-post`, function (req, res) {
	if (req.session.data['photo-id'] === "No") {
		res.redirect('../address-cri/find-current-address')
	} else {
		res.redirect('../address-cri/find-current-address')
	}
})

// Retry entering NINO or try another way
router.post(`${parentDir}/nino-cri/nino-retry`, function (req, res) {
	var ninoRetry = req.session.data['nino-retry']
	var photoID = req.session.data['photo-id']
	if (ninoRetry == "another way") {
		if (photoID == "yes") {
			res.redirect('../kbv-cri/experian-question1')
		} else {
			res.redirect('../ipv-core/pyi-another-way')
		}
	} else {
		res.redirect('enter-national-insurance-number')
	}
})

module.exports = router;
const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/baseline'

// Add your routes here

router.post(`${parentDir}/bank-account-cri/bank-escape`, function (req, res) {
	var bankEscape = req.session.data['bank-escape']
	if (bankEscape == "return") {
		res.redirect('../service/service-start')
	} else {
		res.redirect('continue-enter-bank-account-details')
	}
})

router.post(`${parentDir}/bank-account-cri/bank-fail`, function (req, res) {
	var bankFail = req.session.data['bank-fail']
	if (bankFail == "options") {
		res.redirect('../ipv-core/pyi-suggest-other-options')
	} else {
		res.redirect('check-details')
	}
})

module.exports = router;
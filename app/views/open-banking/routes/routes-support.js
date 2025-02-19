const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/baseline'

// Add your routes here

router.post(`${parentDir}/support/support-start-post`, function (req, res) {

	// routing depends on category selected
	const category = req.session.data['support-main-cat']
	if (category === 'suggestion-feedback') {
		res.redirect('support-feedback')
	} else if (category === 'problem-creating-account') {
		res.redirect('support-problem-account')
	} else if (category === 'problem-signing-in') {
		res.redirect('support-problem-account-sign')
	} else if (category === 'problem-another') {
		res.redirect('support-another-problem')
	} else if (category === 'problem-identity-app') {
		res.redirect('support-problem-pyi-app')
	} else if (category === 'problem-identity-f2f') {
		res.redirect(' ')
	} else if (category === 'problem-identity') {
		res.redirect('support-problem-pyi')
	} else if (category === 'email-subscriptions') {
		res.redirect('support-problem')
	} else {
		res.redirect('support-feedback')
	}
})

// route from account
router.post(`${parentDir}/support/support-account-post`, function (req, res) {

	// routing depends on category selected
	const account = req.session.data['support-account']
	if (account === 'sign') {
		res.redirect('support-problem-account-sign')
	} else {
		res.redirect('support-problem-account-create')
	}
})

module.exports = router;
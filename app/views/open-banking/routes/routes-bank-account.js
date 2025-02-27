const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/open-banking'

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

// choose banking method in open banking
router.post(`${parentDir}/banking-cri/banking-method`, function (req, res) {
	var otpMethod = req.session.data['bank-login']
	if (otpMethod == "qr-code") {
		res.redirect('open-banking-qr-code')
	} else {
		res.redirect('fake-bank-desktop-login')
	}
})

// routing for the research screener for Open banking
// Route for banking method selection (bank-screener)
router.post(`${parentDir}/banking-cri/bank-screener`, function (req, res) {
    var deviceType = req.session.data['screener']
    if (deviceType == "Desktop") {
        res.redirect('../ipv-core/triage/online-photoid-screener')
    } else {
        res.redirect('../ipv-core/triage/online-photoid-screener')
    }
})
router.post(`${parentDir}/banking-cri/consent`, function (req, res) {
    var deviceType = req.session.data['screener']
    if (deviceType == "Desktop") {
        res.redirect('/choose-bank-sign-in')
    } else {
        res.redirect('https://www.figma.com/proto/YKOLpZnSqWhzXIig0B1ATN/Open-banking-app-prototype?node-id=1-6414&t=AtpTZHKi8D7KdnVc-8&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A5847&hide-ui=1')
    }
})

router.post(`${parentDir}/claimed-identity-cri/confirm-details`, function (req, res) {
	var confidence = req.session.data['confidence']
	if (confidence === "low") {
		res.redirect('../claimed-identity-cri/confirm-details')
	} else {
		res.redirect('../claimed-identity-cri/confirm-details')
	}
})


module.exports = router;
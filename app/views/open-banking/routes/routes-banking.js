const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/open-banking'
const postcodeLookup = require("../../../api/postcode-lookup");

// Add your routes here



router.post('/banking-cri/country-answer', function(request, response) {

    var country = request.session.data['country']
    if (country == "How do you want to sign in to your HSBC account?"){
        response.redirect("/age")
    } else {
        response.redirect("/ineligible-country")
    }
})

module.exports = router;
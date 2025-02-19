const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const parentDir = '/open-banking'
const postcodeLookup = require("../../../api/postcode-lookup");

// Add your routes here



module.exports = router;
//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// BASELINE ROUTES

// pull in support routes
router.use('/', require('./views/baseline/routes/routes-support.js'))

// pull in auth routes
router.use('/', require('./views/baseline/routes/routes-auth.js'))

// pull in ipv core routes
router.use('/', require('./views/baseline/routes/routes-ipv-core.js'))

// pull in driving licence routes
router.use('/', require('./views/baseline/routes/routes-driving-licence.js'))

module.exports = router;
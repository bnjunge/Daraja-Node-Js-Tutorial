const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.get('/', (req, res) => {
    res.send("You're home. Welcome")
})

app.get('/access_token', access, (req, res) => {
    res.status(200).json({ access_token: req.access_token })
})

app.get('/register', access, (req, resp) => {
    let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
    let auth = "Bearer " + req.access_token

    request(
        {
            url: url,
            method: "POST",
            headers: {
                "Authorization": auth
            },
            json: {
                "ShortCode": "600383",
                "ResponseType": "Complete",
                "ConfirmationURL": "{{your_url}}/confirmation",
                "ValidationURL": "{{your_url}}/validation"
            }
        },
        function (error, response, body) {
            if (error) { console.log(error) }
            resp.status(200).json(body)
        }
    )
})

app.post('/confirmation', (req, res) => {
    console.log('....................... confirmation .............')
    console.log(req.body)
})

app.post('/validation', (req, resp) => {
    console.log('....................... validation .............')
    console.log(req.body)
})


app.get('/simulate', access, (req, res) => {
    let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate"
    let auth = "Bearer " + req.access_token

    request(
        {
            url: url,
            method: "POST",
            headers: {
                "Authorization": auth
            },
            json: {
                "ShortCode": "600383",
                "CommandID": "CustomerPayBillOnline",
                "Amount": "100",
                "Msisdn": "254708374149",
                "BillRefNumber": "TestAPI"
            }
        },
        function (error, response, body) {
            if (error) {
                console.log(error)
            }
            else {
                res.status(200).json(body)
            }
        }
    )
})

app.get('/balance', access, (req, resp) => {
    let url = "https://sandbox.safaricom.co.ke/mpesa/accountbalance/v1/query"
    let auth = "Bearer " + req.access_token

    request(
        {
            url: url,
            method: "POST",
            headers: {
                "Authorization": auth
            },
            json: {
                "Initiator": "testapi",
                "SecurityCredential": "O2sME0p8tySNAZ7wDeUqKAnnG8UDH1CTaLWg13/0p/tRfVnDo8pHUZEMVjDS0E1EWgWLA32p16YIcepMhVU7el7g6QN2mj1ahVEqhjjd9hhufl9jPOs8O4j5GwWZ/iBvJmqqgBWYWvAFZEwBOPFcyMJM/p5YeS0M/ENU+jpUG1h1LZkL56I8OClZwTok3bmKDyYR8uZpnKFR1tkrgDOp7C/WIf5qLUreZLCsXuOPajeWGkmeaxmaoqnfdUPXO7NoTpvDijQaI/sm/cekSNwS3BVs5YlqbzekWpYZ6dNkK6tfKr4ZfamBaLIcJHmqL0LNgQjiSrPfaWKNjkW5u7/iKg==",
                "CommandID": "AccountBalance",
                "PartyA": "600383",
                "IdentifierType": "4",
                "Remarks": "TestAPIBal",
                "QueueTimeOutURL": "{{your_url}}/bal_timeout",
                "ResultURL": "{{your_url}}/bal_result"
            }
        },
        function (error, response, body) {
            if (error) {
                console.log(error)
            }
            else {
                resp.status(200).json(body)
            }
        }
    )
})

app.post('/bal_result', (req, resp) => {
    console.log('.......... Account Balance ..................')
    console.log(req)
})

app.post('/bal_timeout', (req, resp) => {
    console.log('.......... Timeout..................')
    console.log(req.body)
})


function access(req, res, next) {
    // access token
    let url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    let auth = new Buffer("85MRpefVx4EdgWshx8cTrBt16ssYRxTg:JE9GqoasQcKL9e2W").toString('base64');

    request(
        {
            url: url,
            headers: {
                "Authorization": "Basic " + auth
            }
        },
        (error, response, body) => {
            if (error) {
                console.log(error)
            }
            else {
                // let resp = 
                req.access_token = JSON.parse(body).access_token
                next()
            }
        }
    )
}

app.listen(80, (err, live) => {
    if (err) {
        console.error(err)
    }
    console.log("Server running on port 80")
});

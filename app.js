const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

const urls = {
    'stk': "",
    "simulate": "",
    "b2c": "",
    "base_url": ""
}
const maker = access_token()
const headers = {
    "Authorization": "Bearer " + maker
}


app.get('/', (req, res) => {
    let date = new Date()
    let timestamp = date.getDate() + "" + "" + date.getMonth() + "" + "" + date.getFullYear() + "" + "" + date.getHours() + "" + "" + date.getMinutes() + "" + "" + date.getSeconds()

    res.status(200).json({ message: "We're up and running. Happy Coding", time: new Buffer.from(timestamp).toString('base64'), token: headers })
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
                "ConfirmationURL": "http://197.248.86.122:801/confirmation",
                "ValidationURL": "http://197.248.86.122:801/validation"
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
                "Initiator": "apitest342",
                "SecurityCredential": "Q9KEnwDV/V1LmUrZHNunN40AwAw30jHMfpdTACiV9j+JofwZu0G5qrcPzxul+6nocE++U6ghFEL0E/5z/JNTWZ/pD9oAxCxOik/98IYPp+elSMMO/c/370Joh2XwkYCO5Za9dytVmlapmha5JzanJrqtFX8Vez5nDBC4LEjmgwa/+5MvL+WEBzjV4I6GNeP6hz23J+H43TjTTboeyg8JluL9myaGz68dWM7dCyd5/1QY0BqEiQSQF/W6UrXbOcK9Ac65V0+1+ptQJvreQznAosCjyUjACj35e890toDeq37RFeinM3++VFJqeD5bf5mx5FoJI/Ps0MlydwEeMo/InA==",
                "CommandID": "AccountBalance",
                "PartyA": "601342",
                "IdentifierType": "4",
                "Remarks": "bal",
                "QueueTimeOutURL": "http://197.248.86.122:801/bal_timeout",
                "ResultURL": "http://197.248.86.122:801/bal_result"
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

app.get('/stk', access, (req, res) => {
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        auth = "Bearer " + req.access_token
    let date = new Date()
    const timestamp = date.getFullYear() + "" + "" + date.getMonth() + "" + "" + date.getDate() + "" + "" + date.getHours() + "" + "" + date.getMinutes() + "" + "" + date.getSeconds()
    const password = new Buffer.from('174379' + 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919' + timestamp).toString('base64')

    request(
        {
            url: url,
            method: "POST",
            headers: {
                "Authorization": auth
            },
            json: {
                "BusinessShortCode": "174379",
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": "1",
                "PartyA": "254716437799",
                "PartyB": "174379",
                "PhoneNumber": "254716437799",
                "CallBackURL": "http://197.248.86.122:801/stk_callback",
                "AccountReference": "Test",
                "TransactionDesc": "TestPay"
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

app.get('/b2c', access, (req, res) => {
    const url = 'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest',
        auth = 'Bearer ' + req.access_token

    request({
        method: "POST",
        url: url,
        headers: {
            "Authorization": auth
        },
        json: {
            "InitiatorName": "apitest342",
            "SecurityCredential": "Q9KEnwDV/V1LmUrZHNunN40AwAw30jHMfpdTACiV9j+JofwZu0G5qrcPzxul+6nocE++U6ghFEL0E/5z/JNTWZ/pD9oAxCxOik/98IYPp+elSMMO/c/370Joh2XwkYCO5Za9dytVmlapmha5JzanJrqtFX8Vez5nDBC4LEjmgwa/+5MvL+WEBzjV4I6GNeP6hz23J+H43TjTTboeyg8JluL9myaGz68dWM7dCyd5/1QY0BqEiQSQF/W6UrXbOcK9Ac65V0+1+ptQJvreQznAosCjyUjACj35e890toDeq37RFeinM3++VFJqeD5bf5mx5FoJI/Ps0MlydwEeMo/InA==",
            "CommandID": "BusinessPayment",
            "Amount": "200",
            "PartyA": "601342",
            "PartyB": "254708374149",
            "Remarks": "please pay",
            "QueueTimeOutURL": "http://197.248.86.122:801/b2c_timeout_url",
            "ResultURL": "http://197.248.86.122:801/b2c_result_url",
            "Occasion": "endmonth"
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

app.get('/reverse', access, (req, res) => {
    const url = 'https://sandbox.safaricom.co.ke/mpesa/reversal/v1/request',
        auth = 'Bearer ' + req.access_token

        request({
            method: "POST",
            url: url,
            headers: {
                "Authorization": auth
            },
            json: {
                "Initiator": "apitest342",
                "SecurityCredential":"Q9KEnwDV/V1LmUrZHNunN40AwAw30jHMfpdTACiV9j+JofwZu0G5qrcPzxul+6nocE++U6ghFEL0E/5z/JNTWZ/pD9oAxCxOik/98IYPp+elSMMO/c/370Joh2XwkYCO5Za9dytVmlapmha5JzanJrqtFX8Vez5nDBC4LEjmgwa/+5MvL+WEBzjV4I6GNeP6hz23J+H43TjTTboeyg8JluL9myaGz68dWM7dCyd5/1QY0BqEiQSQF/W6UrXbOcK9Ac65V0+1+ptQJvreQznAosCjyUjACj35e890toDeq37RFeinM3++VFJqeD5bf5mx5FoJI/Ps0MlydwEeMo/InA==",
                "CommandID":"TransactionReversal",
                "TransactionID":"NLJ11HAY8V",
                "Amount":"100",
                "ReceiverParty":"601342",
                "RecieverIdentifierType":"11",
                "ResultURL":"http://197.248.86.122:801/reverse_result_url",
                "QueueTimeOutURL":"http://197.248.86.122:801/reverse_timeout_url",
                "Remarks":"Wrong Num",
                "Occasion":"sent wrongly"
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

app.post('/reverse_result_url', (req, res) => {
    console.log("--------------------Reverse Result -----------------")
    console.log(JSON.stringify(req.body.Result.ResultParameters))
})

app.post('/reverse_timeout_url', (req, res) => {
    console.log("-------------------- Reverse Timeout -----------------")
    console.log(req.body)
})

app.post('/b2c_result_url', (req, res) => {
    console.log("-------------------- B2C Result -----------------")
    console.log(JSON.stringify(req.body.Result))
})

app.post('/b2c_timeout_url', (req, res) => {
    console.log("-------------------- B2C Timeout -----------------")
    console.log(req.body)
})

app.post('/stk_callback', (req, res) => {
    console.log('.......... STK Callback ..................')
    console.log(JSON.stringify(req.body.Body.stkCallback))
})

app.post('/bal_result', (req, resp) => {
    console.log('.......... Account Balance ..................')
    console.log(req.body)
})

app.post('/bal_timeout', (req, resp) => {
    console.log('.......... Timeout..................')
    console.log(req.body)
})

function access(req, res, next) {
    // access token
    let url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    let auth = new Buffer.from("85MRpefVx4EdgWshx8cTrBt16ssYRxTg:JE9GqoasQcKL9e2W").toString('base64');

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


function access_token() {
    // access token
    let url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    let auth = new Buffer.from("85MRpefVx4EdgWshx8cTrBt16ssYRxTg:JE9GqoasQcKL9e2W").toString('base64');

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
               return JSON.parse(body).access_token
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

//Create by matt as an example only
//connects to the Genesys Cloud WebMessaging API
//https://developer.genesys.cloud/api/digital/webmessaging/websocketapi

const gc_region = getParameterByName('gc_region')
const gc_deploymentId = getParameterByName('gc_deploymentId')

//Getting and setting the GC details from dynamic URL
if (gc_region) {
    document.getElementById('region').innerText = gc_region
} else {
    alert('you need to set the region in the URL')
}
if (gc_deploymentId) {
    document.getElementById('deploymentId').innerText = gc_deploymentId
} else {
    alert('you need to set the deploymentId in the URL')
}

function clearToken() {
    localStorage.removeItem('gc_webtoken')
    window.location.reload()
}

function openChat() {
    document.getElementById('widget').className = 'toast show'
    document.getElementById('chatButton').className = 'toast hide'
    document.getElementById('messages').scrollTo(0, document.getElementById('messages').scrollHeight)
}
function closeChat() {
    document.getElementById('widget').className = 'toast hide'
    document.getElementById('chatButton').className = 'toast show'
}
function openEmojis() {
    document.getElementById('emojis').className = 'toast show'
}
function closeEmojis() {
    document.getElementById('emojis').className = 'toast hide'
}
function fileStatus() {
    console.log('fileStatus changed')
    if (document.getElementById('formFileSm').files.length > 0) {
        document.getElementById('imageAttachedName').innerText = document.getElementById('formFileSm').files[0].name
        document.getElementById('imageAttached').hidden = false
    }
}

function fileRemove() {
    document.getElementById('formFileSm').value = ''
    document.getElementById('imageAttached').hidden = true
}

async function requestPresignedUrl() {
    document.getElementById('progressbar').style = "width: 25%"
    socket.send(JSON.stringify({
        action: "onAttachment",
        fileName: document.getElementById('formFileSm').files[0].name,
        fileSize: document.getElementById('formFileSm').files[0].size,
        fileType: document.getElementById('formFileSm').files[0].type,
        token: localStorage.getItem('gc_webtoken')
    }))
}

function createCustomerMsg(message) {

    //Build out HTML Elements for customer
    console.log('customer message: ', message)

    //Image
    if (message.startsWith('https://api.' + gc_region + '/api/v2/downloads/')) {
        var card = document.createElement("div")
        var body = document.createElement("div")
        var name = document.createElement("h5")
        var img = document.createElement("img")
        card.className = "card text-end end-0 m-2 bg-light"
        body.className = "card-body"
        name.className = "card-title"
        img.className = "card-img-bottom"
        name.innerHTML = 'Customer'
        img.src = message
        body.appendChild(name)
        card.appendChild(body)
        card.appendChild(img)
        document.getElementById("messages").appendChild(card)
        document.getElementById('messages').scrollTo(0, document.getElementById('messages').scrollHeight)
    }

    //Text
    if (!message.startsWith('https://api.' + gc_region + '/api/v2/downloads/')) {
        var card = document.createElement("div")
        var body = document.createElement("div")
        var name = document.createElement("h5")
        var text = document.createElement("p")
        card.className = "card text-end end-0 m-2 bg-light"
        body.className = "card-body"
        name.className = "card-title"
        text.className = "card-text"
        name.innerHTML = 'Customer'
        text.innerHTML = message
        body.appendChild(name)
        body.appendChild(text)
        card.appendChild(body)
        document.getElementById("messages").appendChild(card)
        document.getElementById('messages').scrollTo(0, document.getElementById('messages').scrollHeight)
    }
}

function createAgentMsg(from, message) {
    //Build out HTML Elements for agent
    console.log('agent message: ', message)

    //Image
    if (message.startsWith('https://api.' + gc_region + '/api/v2/downloads/')) {
        var card = document.createElement("div")
        var body = document.createElement("div")
        var name = document.createElement("h5")
        var img = document.createElement("img")
        card.className = "card m-2 bg-secondary"
        body.className = "card-body"
        name.className = "card-title"
        img.className = "card-img-bottom"
        name.innerHTML = from
        img.src = message //marked(body) //enables markdown support
        body.appendChild(name)
        card.appendChild(body)
        card.appendChild(img)
        document.getElementById("messages").appendChild(card)
        document.getElementById('messages').scrollTo(0, document.getElementById('messages').scrollHeight)
    }

    //Text
    if (!message.startsWith('https://api.' + gc_region + '/api/v2/downloads/')) {
        var card = document.createElement("div")
        var body = document.createElement("div")
        var name = document.createElement("h5")
        var text = document.createElement("p")
        card.className = "card m-2 bg-secondary"
        body.className = "card-body"
        name.className = "card-title"
        text.className = "card-text"
        name.innerHTML = from
        text.innerHTML = message //marked(body) //enables markdown support
        body.appendChild(name)
        body.appendChild(text)
        card.appendChild(body)
        document.getElementById("messages").appendChild(card)
        document.getElementById('messages').scrollTo(0, document.getElementById('messages').scrollHeight)
    }
}

async function wssSend(message) {
    //to stop blank messages being sent
    if (message === '' && document.getElementById('formFileSm').value === '') {
        document.getElementById('message').placeholder = 'Please enter a msg...'
    }
    if (document.getElementById('formFileSm').value !== '') {
        requestPresignedUrl()
    }

    if (message !== '') {
        let json = {
            action: "onMessage",
            token: localStorage.getItem('gc_webtoken'),
            message: {
                type: "Text",
                text: message
            }
        }
        socket.send(JSON.stringify(json))
        document.getElementById('message').value = ''
    }
    if (!localStorage.getItem('gc_webtoken')) {
        console.error('No gc_webtoken how did you even get here??')
    }
}
try {
    var socket = new WebSocket('wss://webmessaging.' + gc_region + '/v1?deploymentId=' + gc_deploymentId)

    socket.onopen = async function (event) {
        console.log('open')
        if (localStorage.getItem('gc_webtoken')) {
            document.getElementById('currentToken').innerText = localStorage.getItem('gc_webtoken')
            var connection = {
                action: "configureSession",
                deploymentId: gc_deploymentId,
                token: localStorage.getItem('gc_webtoken')
            }
            socket.send(JSON.stringify(connection))
        }
        if (!localStorage.getItem('gc_webtoken')) {
            localStorage.setItem('gc_webtoken', uuidv4())
            document.getElementById('currentToken').innerText = localStorage.getItem('gc_webtoken')
            var connection = {
                action: "configureSession",
                deploymentId: gc_deploymentId,
                token: localStorage.getItem('gc_webtoken')
            }
            socket.send(JSON.stringify(connection))
        }
    }

    socket.onmessage = async function (event) {
        let details = JSON.parse(event.data)
        if (details.type !== 'response' && details.body.text !== 'ping') console.log(details)

        if (details.body.connected) {
            console.log('wss connected ok')

            setInterval(function () {
                let heart = {
                    action: "echo",
                    message: {
                        type: "Text",
                        text: "ping"
                    }
                }
                socket.send(JSON.stringify(heart))
            }, 60000)

            if (!details.body.newSession && document.getElementById('messages').innerText === '') {
                //GET any old messages
                console.log('getting old messages...')
                document.getElementById('progressbar').style = "width: 25%"
                socket.send(JSON.stringify({
                    action: "getJwt",
                    token: localStorage.getItem('gc_webtoken')
                }))
            }
        }

        if (details.class === 'JwtResponse') {
            //GETTING old messages
            let response = await fetch('https://api.' + gc_region + '/api/v2/webmessaging/messages?pageNumber=1', {
                headers: {
                    Authorization: 'Bearer ' + details.body.jwt,
                    Origin: document.domain
                }
            })
            let history = await response.json()
            console.log(history)
            document.getElementById('progressbar').style = "width: 75%"

            if (history.total > 0) {
                //go through each message and append it to the widget
                for (const message of history.entities.reverse()) {
                    //Receive text message
                    if (message.type === 'Text' && message.direction === "Outbound" && message.text !== undefined) {
                        createAgentMsg('Genesys', message.text)
                    }
                    if (message.type === 'Text' && message.direction === "Inbound" && message.text !== undefined) {
                        createCustomerMsg(message.text)
                    }
                    if (message.type === 'Text' && message.direction === "Inbound" && message.text === undefined) {
                        createCustomerMsg(message.content[0].attachment.url)
                    }
                    //Receive image message
                    if (message.type === 'Text' && message.direction === "Outbound" && message.text === undefined) {
                        createAgentMsg('Genesys', message.content[0].attachment.url)
                    }
                }
                document.getElementById('progressbar').style = "width: 100%"
                setTimeout(function () {
                    document.getElementById('progressbar').style = "width: 0%"
                    document.getElementById('messages').scrollTo(0, document.getElementById('messages').scrollHeight)
                }, 2000)
            }

            if (history.total === 0) {
                console.log('no existing messages for token: ', localStorage.getItem('gc_webtoken'))
                document.getElementById('progressbar').style = "width: 100%"
                setTimeout(function () {
                    document.getElementById('progressbar').style = "width: 0%"
                    document.getElementById('messages').scrollTo(0, document.getElementById('messages').scrollHeight)
                }, 2000)
            }

        }

        if (details.class === 'PresignedUrlResponse') {
            //PUT message to presignedUrl
            console.log(details.body.url)
            document.getElementById('progressbar').style = "width: 50%"
            let file = document.getElementById('formFileSm').files[0]
            let reader = new FileReader()

            reader.onload = async function (e) {
                content = reader.result
                console.log(content)

                await fetch(details.body.url, {
                    method: 'PUT',
                    headers: {
                        'x-amz-tagging': details.body.headers['x-amz-tagging'],
                        'Content-Type': document.getElementById('formFileSm').files[0].type
                    },
                    body: content
                })
            }
            reader.readAsArrayBuffer(file)
        }

        if (details.class === 'UploadSuccessEvent') {
            if (details.code === 200) {
                //Send The Image
                document.getElementById('progressbar').style = "width: 100%"
                console.log('uploadSuccessEvent: ', details)
                socket.send(JSON.stringify({
                    action: "onMessage",
                    message: {
                        type: "Text",
                        text: document.getElementById('message').innerText
                    },
                    attachmentIds: [
                        details.body.attachmentId
                    ],
                    token: localStorage.getItem('gc_webtoken')
                }))
                setTimeout(function () {
                    document.getElementById('progressbar').style = "width: 0%"
                    fileRemove()
                }, 2000)
            }
            if (details.code !== 200) {
                //log an error
                console.error(details)
            }
        }

        if (details.type === 'message') {
            //Receive text message
            if (details.body.type === 'Text' && details.body.direction === "Outbound" && details.body.text !== undefined) {
                createAgentMsg(details.body.originatingEntity, details.body.text)
                console.log('Text message: ', details.body.text)
            }
            if (details.body.type === 'Text' && details.body.direction === "Inbound" && details.body.text !== undefined) {
                createCustomerMsg(details.body.text)
                console.log('Text message: ', details.body.text)
            }
            //Receive image message
            if (details.body.type === 'Text' && details.body.direction === "Outbound" && details.body.text === undefined) {
                createAgentMsg(details.body.originatingEntity, details.body.content[0].attachment.url)
                console.log('Text message: ', details.body.content[0].attachment.url)
            }
            if (details.body.type === 'Text' && details.body.direction === "Inbound" && details.body.text === undefined) {
                createCustomerMsg(details.body.content[0].attachment.url)
                console.log('Text message: ', details.body.content[0].attachment.url)
            }
            //RichMedia Message QuickReply
            if (details.body.type === 'Structured' && details.body.direction === "Outbound") {
                createAgentMsg(details.body.originatingEntity, details.body.text)
                let card = document.createElement("div")
                let body = document.createElement("div")
                card.className = "card m-2 border-light"
                card.id = "quickReplies"
                for (const quick of details.body.content) {
                    if (quick.contentType === 'QuickReply') {
                        let button = document.createElement("button")
                        body.className = "card-body"
                        button.className = "m-1 btn btn-outline-secondary btn-sm"
                        button.innerHTML = quick.quickReply.text
                        button.onclick = function () {
                            wssSend(quick.quickReply.text)
                        }
                        body.appendChild(button)
                        card.appendChild(body)
                    }
                }
                document.getElementById("messages").appendChild(card)
                document.getElementById('messages').scrollTo(0, document.getElementById('messages').scrollHeight)
                console.log('Structured message: ', details.body.text)
            }
            if (document.getElementById('widget').className === 'toast hide') {
                openChat()
            }
        }
    }
} catch (err) {
    console.error(err)
}

//Capture Enter key to send message
var enter = document.getElementById("message")
enter.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Trigger the button element with a click
        document.getElementById("sendButton").click();
    }
});

//JavaScript Native way to generate uuidv4
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//JavaScript Native way to get Url Parameters for config
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
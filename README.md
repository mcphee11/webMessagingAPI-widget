# webMessagingAPI-widget

The second example is still relevant if you want to build your own Widget based on the RAW RESTful API endpoints... BUT a while back Genesys Cloud enabled a `Headless SDK` so it much easier to then build out your own widget.

Details on the Headless SDK can be found [HERE](https://developer.genesys.cloud/commdigital/digital/webmessaging/messengersdk/messengerHeadlessmodeSDK) this is also configured in the configuration of the messenger config.

# Headless SDK

I have created a `Basic` html example file with only the core functions you need to send and recieve text messages. This jsut renders them into a div and basic HTML only your job is to make it look nicer and add richmedia support if you want.

```
gc_deploymentId= 'ENTER_YOUR_DEPLOYMENT_ID'
```
In the `headlessSDKbasic.html` file you will need to update the deploymentId as well as the region and environment if your not in the APSE2 region like I am.

Id `STRONGLY` recommend using the headless SDK method over the below legacy way with the raw API endpoints as teh SDK handles the WSS and gives an easy to use JavaScript SDK to interact with the service.

# Older method of RAW API

This is designed as an example on how you can build out your own "widget" to connect to the [Genesys Cloud WebMessaging Guest API](https://developer.genesys.cloud/api/digital/webmessaging/websocketapi). The example is also using [Bootstrap](https://getbootstrap.com/docs/5.0/getting-started/introduction/) for rendering the CSS elements, the rest is native JavaScript there is no Genesys SDK used in this example.

    I would recommend looking at the Genesys API listed above before trying to use this example.

Ok so, the feature I have put into the widget is as the APi supports today
* Text - Send
* Text - Receive
* Image - Send
* Image - Receive
* Emoji - Send
* Emoji - Receive
* BOT - [Quick Replies](https://help.mypurecloud.com/articles/work-with-quick-replies-in-bot-conversations/)
* Async - History pulled in

Once other features come in such as Carousels etc if I get time I will add them into this example. I have also added in a "loading bar" to show when both history is being loaded as well as when an image is being uploaded. As otherwise this can look like the UI is slow to the customer.

The Example HTML page is designed to work with your existing Genesys Cloud WebMessaging "DeploymentId" you need to of already set this up in Genesys as well as the "Flow" this readMe is NOT going to cover these setup items.

To connect the HTML to your environment simply put parameters in the URL to pass them into the code

    gc_region
    gc_deploymentId

for example:

# https://localhost:8080/webMessagingAPI.html?gc_region=mypurecloud.com.au&gc_deploymentId=1234567890987654321

You need to enter your own region im based in Australia so I have used the mypurecloud.com.au region a list of regions can be found [here](https://developer.genesys.cloud/api/rest/). The deploymentId needs to be that of YOUR webMessaging deployment in your Genesys Cloud ORG.

Once you have don that you should be good to go... here are some example screen shots of the functions of the widget.

## Chat Icon:

![](/docs/images/icon.png?raw=true)

## History with blue loading bar:

![](/docs/images/history.png?raw=true)

## emojis

![](/docs/images/image1.png?raw=true)

## Quick Replies

![](/docs/images/quickReplies.png?raw=true)
## Bot to Agent

![](/docs/images/botToAgent.png?raw=true)

This widget can then of course be changed to suit themes, logos and complete CSS look and feel as required.

## I have now also added an "Emoji Picker" to send emojis:

![](/docs/images/emojiButton.png?raw=true)

![](/docs/images/emojiPicker.png?raw=true)

The emojis that appear in the list can be easily changed in the HTML file. The Button Group will dynamically adjust to suit the changes in emojis.

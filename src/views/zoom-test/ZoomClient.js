import React, { useEffect } from 'react'
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';

import { ZoomMtg } from '@zoomus/websdk';

ZoomMtg.setZoomJSLib('https://source.zoom.us/2.4.5/lib', '/av');

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
// loads language files, also passes any error messages to the ui
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');


export default function ZoomClient() {
  const client = ZoomMtgEmbedded.createClient();

  // setup your signature endpoint here: https://github.com/zoom/meetingsdk-sample-signature-node.js
  var signatureEndpoint = 'http://199.91.69.155:4000/'
  // This Sample App has been updated to use SDK App type credentials https://marketplace.zoom.us/docs/guides/build/sdk-app
  var sdkKey = 'JlY0w5XWHkfAVjM0Ee4R0617nE5ZVlpLZ7AL'
  var meetingNumber = '99106021895'
  var role = 0
  var leaveUrl = '/'
  var userName = 'React'
  var userEmail = ''
  var passWord = '5w3nQZ'
  // pass in the registrant's token if your meeting or webinar requires registration. More info here:
  // Meetings: https://marketplace.zoom.us/docs/sdk/native-sdks/web/client-view/meetings#join-registered
  // Webinars: https://marketplace.zoom.us/docs/sdk/native-sdks/web/client-view/webinars#join-registered
  var registrantToken = ''

  useEffect(() => {
    getSignature()
  }, [])
  

  function getSignature() {
    console.log("Getting signature")
    // e.preventDefault();

    fetch(signatureEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: role
      })
    }).then(res => res.json())
    .then(response => {
      console.log({response})
      console.log("starting meeting")
      startMeeting(response.signature)
    }).catch(error => {
      console.log("error")
      console.error(error)
    })
  }

  function startMeeting(signature) {
    // console.log({signature})
    // console.log("Starting meeting")

    // document.getElementById('zmmtg-root').style.display = 'block'

    // ZoomMtg.init({
    //   leaveUrl: leaveUrl,
    //   success: (success) => {
    //     console.log(success)

    //     ZoomMtg.join({
    //       signature: signature,
    //       meetingNumber: meetingNumber,
    //       userName: userName,
    //       sdkKey: sdkKey,
    //       userEmail: userEmail,
    //       passWord: passWord,
    //       tk: registrantToken,
    //       success: (success) => {
    //         console.log(success)
    //       },
    //       error: (error) => {
    //         console.log(error)
    //       }
    //     })

    //   },
    //   error: (error) => {
    //     console.log(error)
    //   }
    // })


    let meetingSDKElement = document.getElementById('meetingSDKElement');

    client.init({
      debug: true,
      zoomAppRoot: meetingSDKElement,
      language: 'en-US',
      customize: {
        meetingInfo: ['topic', 'host', 'mn', 'pwd', 'telPwd', 'invite', 'participant', 'dc', 'enctype'],
        toolbar: {
          buttons: [
            {
              text: 'Custom Button',
              className: 'CustomButton',
              onClick: () => {
                console.log('custom button');
              }
            }
          ]
        }
      }
    });

    client.join({
    	sdkKey: sdkKey,
    	signature: signature,
    	meetingNumber: meetingNumber,
    	password: passWord,
    	userName: userName,
      userEmail: userEmail,
      tk: registrantToken
    })
  }

  return (
    <div id="meetingSDKElement" style={{position: 'absolute', top: 0}}>
      {/* Zoom Meeting SDK Component View Rendered Here */}
    </div>
  );
}

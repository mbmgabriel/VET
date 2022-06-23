import React, { useContext, useEffect } from 'react'
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';

import { ZoomMtg } from '@zoomus/websdk';
import { UserContext } from '../../context/UserContext';
import ClassesAPI from '../../api/ClassesAPI';

ZoomMtg.setZoomJSLib('https://source.zoom.us/2.4.5/lib', '/av');

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
// loads language files, also passes any error messages to the ui
ZoomMtg.i18n.load('en-US');
ZoomMtg.i18n.reload('en-US');


export default function ZoomClient() {
  const client = ZoomMtgEmbedded.createClient();
  const {user, selectedClassId} = useContext(UserContext).data

  var signatureEndpoint = 'http://199.91.69.155:4000/'
  var sdkKey = 'JlY0w5XWHkfAVjM0Ee4R0617nE5ZVlpLZ7AL'
  var role = 0
  var leaveUrl = '/'
  var userName = user?.name || "No Name"
  var userEmail = ''
  var meetingNumber = '99106021895'
  var passWord = '5w3nQZ'
  var registrantToken = ''


  const getClassInformation = async() => {
    let response = await new ClassesAPI().getClassInformation(selectedClassId)
    if(response.ok){
      console.log({response})
      meetingNumber = response.data?.meeting_Id
      passWord = response.data?.password
      if(meetingNumber && passWord){
        getSignature()
      }
    }
  }

  useEffect(() => {
    console.log({selectedClassId, user})
    if(selectedClassId != null && user.isStudent) {
      getClassInformation()
    }
  }, [selectedClassId])

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

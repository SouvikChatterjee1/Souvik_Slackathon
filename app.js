const { App } = require('@slack/bolt');
const https = require("https");
const jobID = require("./salesforceJobID.json");

//global variables
authToken = process.env.SLACK_AUTH_TOKEN;
orchURL = process.env.ORCH_URL;
orchTenant = process.env.ORCH_TENANT;
orchUserName = process.env.ORCH_USERNAME;
orchPwd = process.env.ORCH_PWD;

//Initialize APP
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  endpoints: {
    events: '/slack/events',
    commands: '/slack/commands' 
  }
});

//SC - You Asked, When Delivered?
app.command('/sprbt-yawd', ({ body, ack, context }) => {
  ack();
  try {
      const result = app.client.dialog.open({
      token: context.botToken,
      dialog: {
        "callback_id": "yawd-0186",
        "title": "You Asked When Delivered",
        "submit_label": "Request",
        "state": "Limo",
        "elements": [
          {
            label: "Look ahead Version",
            type: "select",
            name: 'version',
            options: [
                        { label: 'All', value: 'all' },{ label: '2019.4.4', value: '2019.4.4' },{ label: '2019.4.3', value: '2019.4.3' },{ label: '2019.4.2', value: '2019.4.2' },{ label: '2018.4.6', value: '2018.4.6' },{ label: '2018.4.5', value: '2018.4.5' },{ label: '2018.4.4', value: '2018.4.4' },{ label: '2018.4.3', value: '2018.4.3' },{ label: '2018.4.2', value: '2018.4.2' },{ label: '2018.4.1', value: '2018.4.1' },{ label: '2018.3.3', value: '2018.3.3' },{ label: '2018.3.2', value: '2018.3.2' },{ label: '2018.3.1', value: '2018.3.1' },{ label: '2018.2.6', value: '2018.2.6' },{ label: '2018.2.4', value: '2018.2.4' },{ label: '2018.2.3', value: '2018.2.3' },{ label: '2018.2.2', value: '2018.2.2' },{ label: '2018.1.7', value: '2018.1.7' },{ label: '2018.1.6', value: '2018.1.6' },{ label: '2018.1.5', value: '2018.1.5' },{ label: '2018.1.4', value: '2018.1.4' },{ label: '2018.1.3', value: '2018.1.3' },{ label: '2018.1.2', value: '2018.1.2' },{ label: '2018.1.1', value: '2018.1.1' },{ label: '2017.1.6682', value: '2017.1.6682' },{ label: '2017.1.6656', value: '2017.1.6656' },{ label: '2017.1.6612', value: '2017.1.6612' },{ label: '2017.1.6547', value: '2017.1.6547' },{ label: '2017.1.6522', value: '2017.1.6522' },{ label: '2017.1.6435', value: '2017.1.6435' },{ label: '2016.2.6655', value: '2016.2.6655' },{ label: '2016.2.6442', value: '2016.2.6442' },{ label: '2016.2.6393', value: '2016.2.6393' },{ label: '2016.2.6379', value: '2016.2.6379' },{ label: '2016.2.6344', value: '2016.2.6344' },{ label: '2016.2.6302', value: '2016.2.6302' },{ label: '2016.2.6274', value: '2016.2.6274' },{ label: '2016.2.6232', value: '2016.2.6232' },{ label: '2016.2.6192', value: '2016.2.6192' }
                    ]
        },
        {
              label: "Feature to search",
              type: "text",
              name: "search_string",
              placeholder: "Please enter the feature to search.."
        }
        ]
      },
      trigger_id: body.trigger_id
    });
  }
  catch (error) {
    console.log(error.message);
  }
});

app.action({ callback_id: 'yawd-0186' }, ({ body, ack, respond }) => {
  ack();
  var strResponse = {
    "response_type": "in_channel",
    "attachments": [
        {
            "color": "#FF6900",
            "text": " _ *Hmm, search started by :uipath: - :robot_face:. Sit and Relaxxxxx!!!... :smiley:* _ ",
            "image_url": "https://cdn.dribbble.com/users/1138875/screenshots/4432385/roboto_animation_dribbble.gif"
        }
    ]
  } 
  respond(strResponse);
  createServiceRequest("f73c909b-e795-439c-8370-11bb379f370e"+"---"+body.submission.version+"|||"+body.submission.search_string+"|||"+body.response_url);
});


//SC - Get Date Based Shift Details
app.command('/sprbt-datebasedshiftdetails', ({ ack, say }) => {
  ack();
  say({blocks:[
    {
      "type": "section",
      "block_id": "section1234",
      "text": {
        "type": "mrkdwn",
        "text": "Pick a date for the shift details."
      },
      "accessory": {
        "type": "datepicker",
        "action_id": "datepicker123",
        "placeholder": {
          "type": "plain_text",
          "text": "Select a date"
        }
      }
    }
  ]});
});

app.action({ action_id: 'datepicker123' }, ({ body, ack, respond }) => {
  ack();
  var strResponse = {
    "response_type": "in_channel",
    "attachments": [
        {
            "color": "#002855",
            "text": " _ *Eaaaaah, my :uipath: friend :robot_face: is on it! He will be back in a few mins... :smiley:* _ ",
            "image_url": "https://cdn.dribbble.com/users/287797/screenshots/3366795/robot.gif"
        }
    ]
}
  respond(strResponse);
  createServiceRequest("53ae1f8d-b3e9-4c30-a13a-f37755cbde3a"+"---"+body.actions[0].selected_date+"|||"+body.response_url);
});


//Emoji - PushMessages
app.event('reaction_added', async ({ event, say}) => {
  if (event.reaction === 'push-to-support-team')
  {
    const strText = "https://testing-135.slack.com/archives/"+event.item.channel+"/p"+(event.item.ts).replace(".","");
    const outputReactions = await app.client.reactions.get({
      token: authToken,
      channel: event.item.channel,
      timestamp: event.item.ts
    });
    var jsonReactions=JSON.parse(JSON.stringify(outputReactions));
    var arrayReactionsResult = JSON.parse(JSON.stringify(jsonReactions.message.reactions));
    arrayReactionsResult.forEach(function(x)
    {
      if(x.name==="push-to-support-team" && x.count===1)
      {
          PushMessageOnEmoji(strText,event.user);
      }
    });
  }
});

async function PushMessageOnEmoji(inputText,userId){
  try {
    const result = await app.client.chat.postMessage({
      token: authToken,
      channel: "GF2SQSNHG",
      attachments: [
        {
            "color": "#00ff00",
            "pretext": "_ * :book:  Team, an informative thread FYI* _  | Shared by:<@"+userId+">",
            "text": inputText
        }
           ]
    });
  }
  catch (error) {
    console.error(error);
  }
}

//SC - SalesforceIntegration

app.command('/sprbt-sfdcintegration', ({ body, ack, context }) => {
  ack();
  try {
      const result = app.client.dialog.open({
      token: context.botToken,
      dialog: {
        "callback_id": "sfdc-1145",
        "title": "Salesforce Integration",
        "submit_label": "Request",
        "state": "Limo",
        "elements": [
          {
            label: "Report Name",
            type: "select",
            name: 'report_name',
            options: [
              { label: 'SLKTHN_PersonalQueue', value: 'SLKTHN_PersonalQueue' },{ label: 'SLKTHN_Personal_Urgent', value: 'SLKTHN_Personal_Urgent' },{ label: 'SLKTHN_Personal_SubComponent', value: 'SLKTHN_Personal_SubComponent' },{ label: 'SLKTHN_Personal_Resolved', value: 'SLKTHN_Personal_Resolved' },{ label: 'SLKTHN_Personal_Queue_CA', value: 'SLKTHN_Personal_Queue_CA' },{ label: 'SLKTHN_Personal_Premium', value: 'SLKTHN_Personal_Premium' },{ label: 'SLKTHN_GlobalQueue_Premium', value: 'SLKTHN_GlobalQueue_Premium' },{ label: 'SLKTHN_GlobalIncidentQueue', value: 'SLKTHN_GlobalIncidentQueue' },{ label: 'SLKTHN_GlobalIncident_Urgent', value: 'SLKTHN_GlobalIncident_Urgent' },{ label: 'SLKTHN_FRMissing_Personal', value: 'SLKTHN_FRMissing_Personal' },{ label: 'SLKTHN_FRBreached_Team', value: 'SLKTHN_FRBreached_Team' },{ label: 'SLKTHN_ComBreach_Personal', value: 'SLKTHN_ComBreach_Personal' },{ label: 'SLKTHN_Case_Details', value: 'SLKTHN_Case_Details' },{ label: 'SLKTHN_Aging_Team', value: 'SLKTHN_Aging_Team' },{ label: 'SLKTHN_Aging_Personal', value: 'SLKTHN_Aging_Personal' },{ label: 'SLKTHN_Audit_Case', value: 'SLKTHN_Audit_Case' }
                    ]
        },
        {
              label: "Input",
              type: "text",
              optional: true,
              name: "search_string",
              placeholder: "MANDATE: Enter the mail Id for personal queue and case number for audit!!!"
        }
        ]
      },
      trigger_id: body.trigger_id
    });
  }
  catch (error) {
    console.log(error.message);
  }
});

app.action({ callback_id: 'sfdc-1145' }, ({ body, ack, respond }) => {
  ack();
  var strResponse = {
    "response_type": "in_channel",
    "attachments": [
        {
            "color": "#FF6900",
            "text": " _ *Hmm, search started by :uipath: - :robot_face:. Sit and Relaxxxxx!!!... :smiley:* _ ",
            "image_url": "https://cdn.dribbble.com/users/1138875/screenshots/4432385/roboto_animation_dribbble.gif"
        }
    ]
  } 
  respond(strResponse);
  const jsonJobId = JSON.parse(JSON.stringify(jobID));
  createServiceRequest(jsonJobId[body.submission.report_name]+"---"+body.submission.search_string);
});


//Start APP
(async () => {
  await app.start(process.env.PORT || 3000);
})();


//Orch API
function getAuthenticationToken(){
  var authenticationToken = '';
  var options = {
    host: orchURL,
    path: "/api/account/authenticate",
    method: "POST",
    headers: {
        "Content-Type": "application/json"
             }
}
return new Promise((resolve,reject)=>{
var req = https.request(options, function (res) {
    var responseString = "";

    res.on("data", function (data) {
        responseString += data;
       });
    res.on("end", function () {
        var resJSON=JSON.parse(responseString);
        authenticationToken = resJSON.result;
        resolve(authenticationToken);
        });
});
var inputData = {
"tenancyName" : orchTenant,
"usernameOrEmailAddress" : orchUserName,
"password" : orchPwd
};
req.write(JSON.stringify(inputData));
req.end();
});
  
}
async function createServiceRequest(receiveData){
  var authToken=await getAuthenticationToken();

  var authorizedString="Bearer "+authToken;
  var options = {
    host: "erictestorch.azurewebsites.net",
    path: "/odata/Jobs/UiPath.Server.Configuration.OData.StartJobs",
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": authorizedString
    }
}
var req = https.request(options, function (res) {
    var responseString = "";

    res.on("data", function (data) {
        responseString += data;
        });
    res.on("end", function () {
        //console.log(responseString);
       });
});
var entityItem = {
  "startInfo": {
      "ReleaseKey": receiveData.toString().split("---")[0],
      "Strategy": "2",
      "RobotIds": [],
      "NoOfRobots": 1,
      "JobsCount": 0,
      "Source": "Manual",
      "InputArguments": "{'inputarg':'"+receiveData.toString().split("---")[1]+"'}"
      }
};
req.write(JSON.stringify(entityItem));
req.end();
}
//------------------------------------------------------------------------------------------------
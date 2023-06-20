const twilioConfig  = require('../config').TWILIO;
const Twilio = require("twilio")(twilioConfig.accountSID, twilioConfig.authToken);
module.exports = async (dialCode,number,message)=>{
    const sent = await Twilio.messages.create({
      body: message,
      messagingServiceSid: twilioConfig.messageServiceId,
      to: dialCode + number,
    });
    if(sent){
        return sent;
    }
    return false;
}
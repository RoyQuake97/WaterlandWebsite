# WhatsApp Notifications for Waterland Resort & Waterpark

This document explains how to configure and use the WhatsApp notification system for the Waterland Resort & Waterpark website.

## Overview

The notification system sends alerts to resort management whenever a new reservation is made on the website. The system:

1. Sends WhatsApp messages for reservation notifications
2. Uses rich text formatting to highlight important information
3. Gracefully handles errors without disrupting the reservation process

## Required Environment Variables

The following environment variables must be set for the notification system to work:

| Variable | Description |
|----------|-------------|
| `TWILIO_ACCOUNT_SID` | Your Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Your Twilio auth token |
| `TWILIO_WHATSAPP_NUMBER` | Your Twilio phone number enabled for WhatsApp |
| `RECIPIENT_WHATSAPP_NUMBER` | The resort manager's phone number that will receive notifications |

## Setting Up Twilio for WhatsApp

### Trial Mode Limitations

In Twilio trial mode:
- WhatsApp messages can only be sent to numbers that have opted in to your sandbox
- SMS messages can only be sent to verified numbers
- You must use the Twilio sandbox for WhatsApp

### Production Setup

To use WhatsApp in production:

1. Upgrade to a paid Twilio account
2. Apply for a WhatsApp Business Profile through Twilio
3. Follow Twilio's verification process for your WhatsApp Business account
4. Once approved, you can send WhatsApp messages to any number

### WhatsApp Sandbox Setup (Trial Mode)

If using the sandbox:

1. Go to the [Twilio Console](https://console.twilio.com/)
2. Navigate to Messaging > Try it out > Send a WhatsApp message
3. Follow the instructions to join your sandbox
4. Have the recipient (resort manager) send the provided code to your Twilio WhatsApp number
5. Only after this opt-in can you send them WhatsApp messages

## Testing the Notification System

You can test the notification system by running:

```bash
npx tsx server/send-test-whatsapp.ts
```

This will:
1. Attempt to send a WhatsApp message to the configured recipient
2. Log the results of the attempt
3. Provide error information if the message fails

## Troubleshooting

Common issues:

1. **"Channel not found" error**: Your Twilio account is not properly set up for WhatsApp. Make sure your Twilio phone number is WhatsApp-enabled.

2. **"Unverified number" error**: In trial mode, you can only send to verified numbers. Verify the recipient's number in your Twilio console or upgrade to a paid account.

3. **No message received**: Check that the recipient has opted into your WhatsApp sandbox by sending the required code.

## Custom Development

The notification system can be extended in several ways:

1. **Email notifications**: Add email sending capabilities as another fallback option
2. **Staff notifications**: Send notifications to multiple staff members
3. **Customized templates**: Modify message templates in the `notifications.ts` file

## Security Notes

1. Never commit your Twilio credentials to the repository
2. Use environment variables for all sensitive information
3. In production, ensure your environment variables are securely stored
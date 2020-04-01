export const pushInAppMessageReq = `{
  "audience": {
    "named_user": customerId
  },
  "notification": {
    "alert": notes
  },
  "message": {
    "title": "P2P Request Response",
    "body": notes,
    "content_type": "text/html"
  },
  "in_app": {
    "alert": notes,
    "display_type": "banner",
    "expiry": expiry,
    "display": {
      "position": "top"
    }
  },
  "device_types": ["ios", "android"]
}`;

export const pushMessageReq = `{
  "device_types": ["ios", "android"],
  "audience": {
    "named_user": customerId
  },
  "merge_data": {
    "template_id": templateId,
    "substitutions": {
      "Name": email,
      "Amount": amount
    }
  }
}`;

export const customEventReq = `{
  'occurred': $fromMillis($millis(), '[Y0001]-[M01]-[D01]T[H01]:[m01]:[s01]'),
  'user': {
    'channel': channelId
  },
  'body': {
    'name': 'bank_application',
    'transaction': contextId,
    'properties': {
      'application_status': applicationStatus,
      'bank': bank,
      'language': language
    }
  }
}`;

export const emailLookupRes = `{
  'channelId': channel and channel.channel_id ? channel.channel_id : ''
}`;

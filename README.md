# EAS Build Notifier

Can be used to get notifications for the following npm scripts `eas-build-post-install` and `eas-build-pre-upload-artifacts` in combination with the Expo EAS build.

If there is an `app.json` file present then this will also be used to get more information.

## Installing

`npm install eas-build-notifier --save-dev`

## Configuration File

The configuration file holds an array of services. Configure only the services you want to use.

```json
{
  "services": [
    {
      "name": "telegram",
      "config": {
        "token": "token",
        "chatID": "chatID",
        "appFullName": "@test/testApp"
      }
    },
    {
      "name": "discord",
      "config": {
        "webhookUrl": "url"
      }
    },
    {
      "name": "slack",
      "config": {
        "webhookUrl": "url"
      }
    },
    {
      "name": "teams",
      "config": {
        "webhookUrl": "url"
      }
    }
  ]
}
```

### Telegram Notification Example

<img src="/assets/example_telegram.png" alt="Telegram Example" style="width: 50%;">

## Supported platforms

- [x] Telegram
- [x] Slack
- [x] Discord
- [x] Teams

## Telegram Prerequisites

### Retrieve chatId

If you have the HTTP API Token use the following Link to get the chatId:
https://codesandbox.io/s/get-telegram-chat-id-q3qkk

## Slack

Create a webhook URL

## Teams

Create a webhook URL:
[See Documentation](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook)

## Example

See [example](example) folder.

## Roadmap

### Add support for the following services

- [x] Slack
- [x] Teams
- [x] Discord
- [ ] Markdown support in addition to HTML support
- [ ] Customizable messages

## License

[MIT](LICENSE.md)

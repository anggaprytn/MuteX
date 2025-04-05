# MuteX Chrome Extension

MuteX is a Chrome extension that automatically mutes tweets containing affiliate links such as `s.shopee.co.id`, `s.lazada.co.id`, and others you define.

## Features

- Automatically detect and mute affiliate tweets
- Option to blur content instead of deleting
- Configurable blocked keywords via popup
- Works on both `x.com` and `twitter.com`

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked" and select the project folder
5. Done

## Usage

1. Click the extension icon
2. Enable or disable the blocker
3. Edit the list of blocked keywords (comma separated)
4. Choose between "Blur" or "Delete" mode
5. Tweets matching any keyword will be automatically muted

## Customization

You can edit the default blocked domains in `popup.js` or from the popup interface after loading the extension.

## Notes

- The extension monitors dynamic tweet loading while scrolling
- Tweets are never permanently deleted from your account or Twitter
- This only affects tweets _you_ see on your timeline

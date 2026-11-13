[nishantdesai1306.github.io](https://nishantdesai1306.github.io/)

Personal portfolio built using React and designed as [PWA](https://web.dev/progressive-web-apps/) so people can install it as an app on their smartphones and computers.

## Source and development

This repository contains the published build. The editable application lives in
[`NishantDesai1306/personal-website`](https://github.com/NishantDesai1306/personal-website)
(locally, the sibling `../personal-website` directory).

Make source changes there rather than editing the minified bundles here:

```sh
cd ../personal-website
npm ci
CI=true npm run check
```

The verified production output is written to `../personal-website/build/`.
Publishing that output here is a separate, explicitly approved step; the source
project's verification workflow does not automatically deploy the website.

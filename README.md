# Quote & Invoice

Make professional quotes and invoices in your browser. Free, no sign-up, and nothing leaves your device.

An example app made by the Kodeby team and listed on [kodeby.app](https://kodeby.app).

## What it does

- Quotes and invoices with line items, several VAT rates, and any common currency
- Turn an accepted quote into an invoice in one click
- Your business details and logo are remembered for the next document
- Download as PDF (uses the browser's print dialog: choose "Save as PDF")
- English and Norwegian
- Backup and restore as a JSON file

## Privacy

Everything is stored in your browser's local storage. There is no server, no account, no analytics and no cookies.
The Content Security Policy in `vercel.json` blocks all network requests from the page (`connect-src 'none'`).

## Run locally

It is plain HTML, CSS and JavaScript with no build step:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

Import the repository in Vercel with the default settings (Framework preset: Other, no build command).

## License

MIT

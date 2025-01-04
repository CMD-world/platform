# Emails

To send emails to your users, follow the email section in the [Production guide](../1-tutorials/2-production.md#setup-email-with-resend).
After Resend is set up, you can send emails like this on server side:

```ts
import { resend } from "$lib/email";

resend.emails.send({
  from: "info@svelterust.com",
  to: "you@gmail.com",
  subject: "Welcome to the club!",
  html: "<p>Thanks for subscribing</p>",
});
```

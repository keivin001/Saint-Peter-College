# EmailJS Setup Guide — St Peter College Website
## Receiving email at: keivinishimwe8@gmail.com

Follow these steps once. It takes about 10 minutes.

---

## Step 1 — Create a free EmailJS account

1. Go to https://www.emailjs.com
2. Click **Sign Up** → use your Google account (keivinishimwe8@gmail.com)
3. Verify your email

---

## Step 2 — Add an Email Service

1. In your EmailJS dashboard, click **Email Services** → **Add New Service**
2. Choose **Gmail**
3. Click **Connect Account** → sign in with keivinishimwe8@gmail.com
4. Name it: `St Peter College`
5. Click **Create Service**
6. Copy the **Service ID** — it looks like: `service_xxxxxxx`

---

## Step 3 — Create TWO Email Templates

### Template 1 — Contact Form (`template_contact`)

1. Click **Email Templates** → **Create New Template**
2. Set **Template ID** to: `template_contact`
3. Set **Subject**: `New Contact Message: {{contact_subject}}`
4. Set **To Email**: `keivinishimwe8@gmail.com`
5. Set **From Name**: `{{contact_name}}`
6. Set **Reply To**: `{{contact_email}}`
7. **Body** (paste this):

```
You have received a new contact message from the St Peter College website.

Name:    {{contact_name}}
Email:   {{contact_email}}
Phone:   {{contact_phone}}
Subject: {{contact_subject}}

Message:
{{contact_message}}

---
Sent from: stpetercollege.rw Contact Form
```

8. Click **Save**

---

### Template 2 — Application Form (`template_application`)

1. Click **Email Templates** → **Create New Template**
2. Set **Template ID** to: `template_application`
3. Set **Subject**: `New Application: {{app_name}} — {{app_program}}`
4. Set **To Email**: `keivinishimwe8@gmail.com`
5. Set **From Name**: `{{app_name}}`
6. Set **Reply To**: `{{app_email}}`
7. **Body** (paste this):

```
A new student application has been submitted on the St Peter College website.

APPLICANT DETAILS
-----------------
Full Name:      {{app_name}}
Email:          {{app_email}}
Phone:          {{app_phone}}
Date of Birth:  {{app_dob}}

ACADEMIC DETAILS
----------------
Program:        {{app_program}}
Previous School:{{app_school}}
District:       {{app_district}}
Mode of Study:  {{app_mode}}

Additional Info:
{{app_message}}

---
Sent from: stpetercollege.rw Application Form
```

8. Click **Save**

---

## Step 4 — Get your Public Key

1. In EmailJS dashboard → click your account name (top right) → **Account**
2. Copy your **Public Key** — it looks like: `aBcDeFgHiJkLmNoP`

---

## Step 5 — Paste your IDs into the website files

Open these 2 files and replace the placeholder values:

### In `contact.html` (line in `<head>`):
```html
<!-- BEFORE -->
<script>emailjs.init("YOUR_PUBLIC_KEY");</script>

<!-- AFTER (use your real key) -->
<script>emailjs.init("aBcDeFgHiJkLmNoP");</script>
```

### In `admissions.html` (same line in `<head>`):
```html
<script>emailjs.init("aBcDeFgHiJkLmNoP");</script>
```

### In `assets/js/main.js` — find BOTH occurrences of:
```js
emailjs.send('YOUR_SERVICE_ID', 'template_contact', params)
emailjs.send('YOUR_SERVICE_ID', 'template_application', params)
```
Replace `YOUR_SERVICE_ID` with your real Service ID, e.g.:
```js
emailjs.send('service_abc123', 'template_contact', params)
emailjs.send('service_abc123', 'template_application', params)
```

---

## Step 6 — Test it

1. Open `contact.html` in your browser
2. Fill in the form and click **Send Message**
3. Check keivinishimwe8@gmail.com — you should receive the email within seconds
4. Do the same on `admissions.html`

---

## Free Plan Limits
- **200 emails/month** — free forever, no credit card needed
- More than enough for a college website

---

## Summary of IDs to replace

| Placeholder         | Replace with              | Files                              |
|---------------------|---------------------------|------------------------------------|
| `YOUR_PUBLIC_KEY`   | Your EmailJS Public Key   | contact.html, admissions.html      |
| `YOUR_SERVICE_ID`   | Your EmailJS Service ID   | assets/js/main.js (2 occurrences)  |

Both template IDs (`template_contact`, `template_application`) are already correct
as long as you set them exactly as shown in Step 3.

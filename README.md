# S3 Link Agent

S3 link agent: password protect S3 download links for static sites like GitHub Pages. No extra generator plugins needed.

Configure and deploy this Node server to a free Heroku instance. The server provides a JS widget: include it in your static site. That's it.

* user visits your site, clicks on the download link and is directed to the Heroku server
* Heroku server asks user for Auth0 login / simple email + PIN
* Heroku server signs a temporary private S3 link and returns a 302 redirect

In addition, the user can be prompted for login right away, before clicking on a download link. This gives a sense of a restricted area "login wall" although the initial content page is still served up and semi-visible behind the login popup. See below for pre-login popup setup.

Two modes of authentication are supported: [Auth0 lock-screen](https://auth0.com/docs/libraries/lock) (preferred) or simple email + PIN (very insecure and basic). See below for email + PIN mode config.

Content whitelist - `content.yaml` - is a list of allowed downloadable bucket paths:

```yaml
- myfile1.png
- some/other/file2.pdf
- example*.*
```

Required Heroku configuration variables (do not commit these into the repo!):

- Auth0 settings (skip if using local email + PIN auth): `AUTH0_DOMAIN`, `AUTH0_AUDIENCE`, `AUTH0_SECRET`
- AWS key ID and secret: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- AWS bucket: `S3_BUCKET`

Setting up download links from your webpages:

* either point download links directly at `http://<heroku-server>/go/<your-file-path>`
* or add the widget script `http://<heroku-server>/s3-link-agent.js` and then point links to `#s3/<your-file-path>`

Ensure that Auth0 app settings include `http://<heroku-server>` in the CORS origin list, otherwise logins will fail.

Don't forget to disable signups in Auth0! Go to **Connections**, find your database or social connection settings and turn on **Disable Sign Ups**. Otherwise, any anonymous visitor can choose to sign up and access your restricted links.

That's it.

## Pre-login Popup

Edit and commit the CORS site list - `sites.yaml` - to contain the site where the auth popup will show:

```yaml
- http://mysite.example.com
```

Don't forget to add the same site to the Auth0 CORS origin set.

Then include `http://<heroku-server>/s3-link-agent-login.js` as a script on your site (*instead* of `http://<heroku-server>/s3-link-agent.js`).

## Simple Local Email + PIN Auth

Use of Auth0 for user sign-in is strongly recommended. This is the insecure local user list alternative.

Edit and commit the user list - `users.yaml` - set of allowed emails with their PINs:

```yaml
user1@example.com:
    pin: 1234
user2@example.com:
    pin: 01134
```

If there is at least one local user defined, the login screen will stop showing Auth0 prompt and ask for local email + PIN instead.

**SECURITY WARNING:** please do not use this for anything with real security needs. PINs are restricted to only being numeric, to discourage any real passwords being used. These PINs are stored in plaintext, committed to your local repo clone and pushed to Heroku, so anyone who can read the repo source code can read the PINs and gain access to the whitelisted files.

## Development

```sh
cat <<EOF > test-env.sh
export PORT=3020 # for testing only
export AUTH0_DOMAIN=...
export AUTH0_AUDIENCE=...
export AUTH0_SECRET=...
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export S3_BUCKET=...
EOF

. test-env.sh

npm install
serve & # any background static server for the example page
supervisor index.js
```

Then http://localhost:3000/example.html in browser.

## To Do

- glob matching on file path whitelist

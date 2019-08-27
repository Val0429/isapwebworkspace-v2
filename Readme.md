# Install step

```bash
cd src
npm install
cd ..
cd containers/CoreUI/
npm install
npm audit fix --force
cd ../..
npm install
npm start
```

# Buazila

```bash
<Fix Version>
Fix Version: v1.00.01

<Actual Result>
CRMS web page cannot log in with port 6061.

<Reason>
Because first time try 2 web connect 1 server

<Solution>
Update production port always 6060
```
# Nuxt Serve

## Get Started

### Install

```
npm i --save https://github.com/Chris-Brighton/nuxt-serve
```

### Scripts

Add the following scripts to you package.json for access to the file helper scripts

```
"scripts" : {
  "init-nuxt-serve": "node ./node_modules/nuxt-serve/scripts/init.js",
  "add-service": "node ./node_modules/nuxt-serve/scripts/service.js"
}
```

### Config

Update your nuxt.config.js

```
serverMiddleware: ['~/server/index.js'],
plugins: ['~/plugins/queryString.js']
```

## Init

After adding the scripts run the init command to add a basic project template

```
$ npm run init-nuxt-serve
```

---

## Add Service

```
$ npm run add-service <service-name>
```

Set Time
========

## Development
* Install NodeJS
* Run `npm i`
* Run `npm run dev`

## Deployment

### 1. Create Cloudflare Secret:

```yml
apiVersion: v1
kind: Secret
metadata:
  name: cloudflare-secret
  annotations:
  namespace: set-time
type: Opaque
data:
  api-token: 'see https://dash.cloudflare.com/profile/api-tokens'
```

### 2. Create Issuer

```yml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt-settime
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: willpe@outlook.com
    privateKeySecretRef:
      name: letsencrypt-settime
    solvers:
    - dns01:
        cloudflare:
          email: willpe@outlook.com
          apiTokenSecretRef:
            name: cloudflare-secret
            key: api-token
```
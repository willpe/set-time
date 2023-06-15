# Deployment

Host: [Vultr](https://www.vultr.com/)
Kubernetes Config: [set-time](https://my.vultr.com/kubernetes/manage/?id=efe11f39-d454-40b2-984d-0b4852e7537e)

## Create Namespace

```sh
kubectl create namespace set-time
kubectl config set-context –current –namespace=set-time
```

## Create Image Pull Secret

Create a new access token in [GitLab](https://git.willperry.net/groups/set-time/-/settings/access_tokens)

- No expiration
- Developer Role
- Read Repository
- Read Registry

Create a secret in kubernetes

See: [Secret in 1Password](https://start.1password.com/open/i?a=74FPY646G5HDBPADZDW4WN755E&v=gr4f7dcd6azz7ljwzhvvhth7g4&i=6euyaizlpb2q5vw55sy2xxlqmy&h=my.1password.com)

```sh
kubectl create secret docker-registry registry-secret --docker-server=registry.git.willperry.net --docker-username=set-time-vultr --docker-password=<<PASSWORD>>
```

## Create CloudFlare DNS Challenge Secret

Store Cloudflare DNS Challenge Secret

See: [Secret in 1Password](https://start.1password.com/open/i?a=74FPY646G5HDBPADZDW4WN755E&v=gr4f7dcd6azz7ljwzhvvhth7g4&i=ut3y4dka5higfuviun6byajyx4&h=my.1password.com)

```sh
kubectl create secret generic cloudflare-secret --type=Opaque --from-literal=api-token=<API-TOKEN>
```

## Install Cert Manager

```sh
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install \
  cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.12.0 \
  --set installCRDs=true
```

Add Staging and Prod Issuers

issuers.yaml:

```yaml
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt-staging
  namespace: set-time
spec:
  acme:
    email: willpe@outlook.com
    privateKeySecretRef:
      name: letsencrypt-staging
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    solvers:
      - dns01:
          cloudflare:
            apiTokenSecretRef:
              name: cloudflare-secret
              key: api-token
---
apiVersion: cert-manager.io/v1
kind: Issuer
metadata:
  name: letsencrypt-prod
  namespace: set-time
spec:
  acme:
    email: willpe@outlook.com
    privateKeySecretRef:
      name: letsencrypt
    server: https://acme-v02.api.letsencrypt.org/directory
    solvers:
      - dns01:
          cloudflare:
            apiTokenSecretRef:
              name: cloudflare-secret
              key: api-token
```

Install certificate issuers

```sh
kubectl apply -f issuers.yaml
```

### Request Certificates

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: web-cert
  namespace: set-time
spec:
  issuerRef:
    name: letsencrypt-prod
  secretName: web-cert
  commonName: setti.me
  dnsNames:
    - setti.me
    - "*.setti.me"
```

## Install Traefik

Configure [Permissions and Access](https://doc.traefik.io/traefik/getting-started/quick-start-with-kubernetes/)

```yaml
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: traefik-role

rules:
  - apiGroups:
      - ""
    resources:
      - services
      - endpoints
      - secrets
    verbs:
      - get
      - list
      - watch
  - apiGroups:
      - extensions
      - networking.k8s.io
    resources:
      - ingresses
      - ingressclasses
    verbs:
      - get
      - list
      - watch
  - apiGroups:
      - extensions
      - networking.k8s.io
    resources:
      - ingresses/status
    verbs:
      - update
```

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: traefik-account
---
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: traefik-role-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: traefik-role
subjects:
  - kind: ServiceAccount
    name: traefik-account
    namespace: default # Using "default" because we did not specify a namespace when creating the ClusterAccount.
```

See: [Install Traefik using Helm](https://doc.traefik.io/traefik/getting-started/install-traefik/#use-the-helm-chart)

```sh
helm repo add traefik https://traefik.github.io/charts
helm repo update
helm install traefik traefik/traefik
```

Verify the Traefik installation using the Dashboard:

```sh
kubectl port-forward $(kubectl get pods --selector "app.kubernetes.io/name=traefik" --output=name) 9000:9000
```

It can then be reached at: `http://127.0.0.1:9000/dashboard/`

## Create Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
spec:
  ingressClassName: traefik
  rules:
    - host: setti.me
      http:
        paths:
          - backend:
              service:
                name: web-service
                port:
                  number: 8080
            path: /
            pathType: Prefix
  tls:
    - hosts:
        - setti.me
      secretName: web-cert
```

## Configure DNS

Go to [CloudFlare](https://dash.cloudflare.com) and add the relevant DNS records.

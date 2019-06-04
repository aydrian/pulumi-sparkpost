# SparkPost Provider for Pulumi

This is a custom provider to allow managing [Events](https://developers.sparkpost.com/api/webhooks/) and [Relay](https://developers.sparkpost.com/api/relay-webhooks/) Webhooks in [SparkPost](https://www.sparkpost.com/) with [Pulumi](https://pulumi.com).

The package is published on NPM, as `@aydrian/pulumi-sparkpost`.

## Configure SparkPost API Key

1. [Create a SparkPost API Key](https://www.sparkpost.com/docs/getting-started/create-api-keys/) with the appropriate permissions.

1. Set the `sparkpost:api-key` Pulumi config variable

```bash
$ pulumi config set sparkpost:api-key --secret <YOUR-API-KEY>
```

## Configure SparkPost API Endpoint _(Optional)_

If you are using SparkPost from the [EU](https://developers.sparkpost.com/api/#header-sparkpost-eu) or have an Enterprise account, you'll need to set the appropriate endpoint. Otherwise, the default will be used.

1. Set the `sparkpost:endpoint` Pulumi config variable

```bash
$ pulumi config set sparkpost:endpoint https://api.eu.sparkpost.com:443
```

## Examples

### Event Webhook

```ts
import { SparkPostWebhookResource } from "@aydrian/pulumi-sparkpost";

const url = "https://some.endpoint.com";
const webhook = new SparkPostWebhookResource("sparkpost-webhook", {
  name: "My Event Webhook",
  target: url,
  events: ["delivery", "initial_open", "click"]
});
```

### Relay Webhook

```ts
import {
  SparkPostInboundDomainResource,
  SparkPostRelayWebhookResource
} from "@aydrian/pulumi-sparkpost";

const domain = "inbound.domain.com";
const target = "https://some.endpoint.com";

const inbound_domain = new SparkPostInboundDomainResource(
  "sparkpost-inbound-domain",
  {
    domain
  }
);

const relay_webhook = new SparkPostRelayWebhookResource(
  "sparkpost-rely-webhook",
  {
    domain: inbound_domain.domain,
    target
  }
);
```

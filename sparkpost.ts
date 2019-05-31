import * as SparkPost from "sparkpost";
import * as pulumi from "@pulumi/pulumi";
import * as dynamic from "@pulumi/pulumi/dynamic";

const spApiKey = new pulumi.Config("sparkpost").require("api-key");

enum authTypes {
  none,
  basic,
  oauth2
}

class SparkPostInboundDomainProvider implements dynamic.ResourceProvider {
  check = (olds: any, news: any) => {
    const failedChecks: dynamic.CheckFailure[] = [];

    if (news["domain"] === undefined) {
      failedChecks.push({
        property: "domain",
        reason: "required property 'domain' missing"
      });
    }

    return Promise.resolve({ inputs: news, failedChecks });
  };

  diff = (id: pulumi.ID, olds: any, news: any) => {
    const replaces: string[] = [];

    if (olds["domain"] !== news["domain"]) {
      replaces.push("domain");
    }
    return Promise.resolve({ replaces });
  };

  create = async (inputs: any) => {
    const client = new SparkPost(spApiKey);
    const { domain } = inputs;

    try {
      const res = await client.inboundDomains.create({
        domain
      });

      return {
        id: `${domain}`
      };
    } catch (err) {
      throw new Error(`SparkPost Error: ${JSON.stringify(err.errors)}`);
    }
  };

  delete = async (id: pulumi.ID, props: any) => {
    const client = new SparkPost(spApiKey);

    try {
      await client.inboundDomains.delete(id);
    } catch (err) {
      throw new Error(`SparkPost Error: ${JSON.stringify(err.errors)}`);
    }
  };
}

interface SparkPostInboundDomainResourceArgs {
  domain: pulumi.Input<string>;
}

export class SparkPostInboundDomainResource extends dynamic.Resource {
  constructor(
    name: string,
    args: SparkPostInboundDomainResourceArgs,
    opts?: pulumi.ResourceOptions
  ) {
    super(new SparkPostInboundDomainProvider(), name, args, opts);
  }
}

class SparkPostRelayWebhookProvider implements dynamic.ResourceProvider {
  check = (olds: any, news: any) => {
    const failedChecks: dynamic.CheckFailure[] = [];

    if (news["domain"] === undefined) {
      failedChecks.push({
        property: "domain",
        reason: "required property 'domain' missing"
      });
    }

    if (news["target"] === undefined) {
      failedChecks.push({
        property: "target",
        reason: "required property 'target' missing"
      });
    }

    return Promise.resolve({ inputs: news, failedChecks });
  };

  diff = (id: pulumi.ID, olds: any, news: any) => {
    return Promise.resolve({});
  };

  create = async (inputs: any) => {
    const client = new SparkPost(spApiKey);

    try {
      const res = await client.relayWebhooks.create({
        target: inputs.target,
        match: {
          domain: inputs.domain
        },
        ...(inputs.name && { name: inputs.name }),
        ...(inputs.authType && { auth_type: inputs.authType }),
        ...(typeof inputs.authRequestDetails !== undefined && {
          auth_request_details: inputs.authRequestDetails
        }),
        ...(inputs.authToken && { auth_token: inputs.authToken }),
        ...(typeof inputs.customHeaders !== undefined && {
          custom_headers: inputs.custom_headers
        })
      });

      return {
        id: `${res.results.id}`
      };
    } catch (err) {
      throw new Error(`SparkPost Error: ${JSON.stringify(err.errors)}`);
    }
  };

  update = async (id: string, olds: any, news: any) => {
    const client = new SparkPost(spApiKey);

    try {
      let res = await client.webhooks.update(id, {
        ...(news.name && { name: news.name }),
        ...(news.target && { target: news.target }),
        ...(news.domain && { match: { domain: news.domain } }),
        ...(news.authToken && { auth_token: news.authToken }),
        ...(news.authType && { auth_type: news.authType }),
        ...(typeof news.authRequestDetails !== undefined && {
          auth_request_details: news.authRequestDetails
        }),
        ...(typeof news.customHeaders !== undefined && {
          custom_headers: news.custom_headers
        })
      });

      return { outs: { id: res.results.id } };
    } catch (err) {
      throw new Error(`SparkPost Error: ${JSON.stringify(err.errors)}`);
    }
  };

  delete = async (id: pulumi.ID, props: any) => {
    const client = new SparkPost(spApiKey);

    try {
      await client.relayWebhooks.delete(id);
    } catch (err) {
      throw new Error(`SparkPost Error: ${JSON.stringify(err.errors)}`);
    }
  };
}

interface SparkPostRelayWebhookResourceArgs {
  name?: pulumi.Input<string>;
  target: pulumi.Input<string>;
  domain: pulumi.Input<string>;
  authToken?: pulumi.Input<string>;
  authType?: pulumi.Input<authTypes>;
  authRequestDetails?: pulumi.Input<object>;
  customHeaders?: pulumi.Input<object>;
}

export class SparkPostRelayWebhookResource extends dynamic.Resource {
  constructor(
    name: string,
    args: SparkPostRelayWebhookResourceArgs,
    opts?: pulumi.ResourceOptions
  ) {
    super(new SparkPostRelayWebhookProvider(), name, args, opts);
  }
}

class SparkPostWebhookProvider implements dynamic.ResourceProvider {
  check = (olds: any, news: any) => {
    const failedChecks: dynamic.CheckFailure[] = [];

    if (news["name"] === undefined) {
      failedChecks.push({
        property: "name",
        reason: "required property 'name' missing"
      });
    }

    if (news["target"] === undefined) {
      failedChecks.push({
        property: "target",
        reason: "required property 'target' missing"
      });
    }

    if (news["events"] === undefined) {
      failedChecks.push({
        property: "events",
        reason: "required property 'events' missing"
      });
    }

    return Promise.resolve({ inputs: news, failedChecks });
  };

  diff = (id: pulumi.ID, olds: any, news: any) => {
    return Promise.resolve({});
  };

  create = async (inputs: any) => {
    const client = new SparkPost(spApiKey);

    try {
      const res = await client.webhooks.create({
        name: inputs.name,
        target: inputs.target,
        events: inputs.events,
        ...(typeof inputs.active !== undefined && {
          active: inputs.active
        }),
        ...(typeof inputs.customHeaders !== undefined && {
          custom_headers: inputs.custom_headers
        }),
        ...(inputs.authType && { auth_type: inputs.authType }),
        ...(typeof inputs.authRequestDetails !== undefined && {
          auth_request_details: inputs.authRequestDetails
        }),
        ...(typeof inputs.authCredentials !== undefined && {
          auth_credentials: inputs.authCredentials
        })
      });

      return {
        id: `${res.results.id}`
      };
    } catch (err) {
      throw new Error(`SparkPost Error: ${JSON.stringify(err.errors)}`);
    }
  };

  update = async (id: string, olds: any, news: any) => {
    const client = new SparkPost(spApiKey);

    try {
      const res = await client.webhooks.update(id, {
        ...(news.name && { name: news.name }),
        ...(news.target && { target: news.target }),
        ...(typeof news.events !== undefined && {
          events: news.events
        }),
        ...(typeof news.active !== undefined && {
          active: news.active
        }),
        ...(typeof news.customHeaders !== undefined && {
          custom_headers: news.custom_headers
        }),
        ...(news.authType && { auth_type: news.authType }),
        ...(typeof news.authRequestDetails !== undefined && {
          auth_request_details: news.authRequestDetails
        }),
        ...(typeof news.authCredentials !== undefined && {
          auth_credentials: news.authCredentials
        })
      });

      return { outs: { id: res.results.id } };
    } catch (err) {
      throw new Error(`SparkPost Error: ${JSON.stringify(err.errors)}`);
    }
  };

  delete = async (id: pulumi.ID, props: any) => {
    const client = new SparkPost(spApiKey);

    try {
      await client.webhooks.delete(id);
    } catch (err) {
      throw new Error(`SparkPost Error: ${JSON.stringify(err.errors)}`);
    }
  };
}

interface SparkPostWebhookResourceArgs {
  name: pulumi.Input<string>;
  target: pulumi.Input<string>;
  events: pulumi.Input<Array<string>>;
  active?: pulumi.Input<boolean>;
  customHeaders?: pulumi.Input<object>;
  authType?: pulumi.Input<authTypes>;
  authRequestDetails?: pulumi.Input<object>;
  authCredentials?: pulumi.Input<object>;
}

export class SparkPostWebhookResource extends dynamic.Resource {
  constructor(
    name: string,
    args: SparkPostWebhookResourceArgs,
    opts?: pulumi.ResourceOptions
  ) {
    super(new SparkPostWebhookProvider(), name, args, opts);
  }
}

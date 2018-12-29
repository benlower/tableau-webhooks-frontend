<template>
  <div>
    <app-nav></app-nav>
    <!-- <h4>Webhooks On Tableau Server</h4> -->
    <div class="col-md-3">
      <label for="inputBaseURL">Base URL:</label>
      <input type="text" class="form-control" id="inputBaseURL" aria-describedby="baseURLHelp">
      <small id="baseURLHelp" class="form-text text-muted">Base URL for Tableau REST API. e.g. http://18.223.178.66/</small>
      <label for="inputSiteID">Site ID:</label>
      <input type="text" class="form-control" id="inputSiteID" aria-describedby="siteIDHelp">
      <small id="siteIDHelp" class="form-text text-muted">Site ID. e.g. 2a629901-4690-4028-b350-771fd3127168</small>
      <label for="inputAuthToken">Auth Token:</label>
      <input type="text" class="form-control" id="inputAuthToken" aria-describedby="authTokenHelp">
      <small id="authTokenHelp" class="form-text text-muted">Auth Token for the Tableau REST API. e.g.</small>
    </div>



<!-- const TABLEAU_BASE_URL = "http://18.223.178.66/";
const REST_API_VERSION = "api/exp/";
const SITE_ID = "2a629901-4690-4028-b350-771fd3127168";
const AUTH_TOKEN = "-mJ6xPrNS9upmHe1QfHAbw|8kl3OlcLR8sQJv0wva7DUpOnjOHww0vx"; -->

    <hr />
    <div class="col-md-6" v-for="webhook in configuredWebhooks" :key="webhook.id">
      <div class="card">
        <div class="card-header">Webhook Name:  {{ webhook.name }} </div>
        <div class="card-body">
          <p class="card-text">Webhook Event:  {{ webhook["webhook-source"] }} </p>
          <p class="card-text">Webhook URL:  {{ webhook["webhook-destination"]["webhook-destination-http"].url }} </p>
          <font-awesome-icon icon="trash-alt" v-on:click="deleteWebhook(webhook)" />
        </div>
      </div>
      <br />
    </div>
    <br />

    <p>
      <a class="" data-toggle="collapse" href="#newWebhook" role="button" aria-expanded="false" aria-controls="newWebhook">
      <h4>New Webhook <font-awesome-icon icon="plus-square"/></h4>
      </a>
    </p>
    <div class="collapse" id="newWebhook">
      <hr />
      <form v-on:submit.prevent="createWebhook()">
        <div class="col-md-4 form-group">
          <div class="form-group">
            <label for="selectWebhookEventType">Webhook Event Type:</label>
            <select class="form-control" id="selectWebhookEventType" aria-describedby="webhookEventTypeHelp" >
              <option selected>Choose...</option>
              <option value="webhook-source-event-datasource-refresh-started">Datasource Refresh Started</option>
              <option value="webhook-source-event-datasource-refresh-succeeded">Datasource Refresh Succeeded</option>
              <option value="webhook-source-event-datasource-refresh-failed">Datasource Refresh Failed</option>
              <option value="webhook-source-event-datasource-updated">Datasource Updated</option>
              <option value="webhook-source-event-datasource-created">Datasource Created</option>
              <option value="webhook-source-event-datasource-deleted">Datasource Deleted</option>
              <option value="webhook-source-event-workbook-updated">Workbook Updated</option>
              <option value="webhook-source-event-workbook-created">Workbook Created</option>
              <option value="webhook-source-event-workbook-deleted">Workbook Deleted</option>
            </select>
            <small id="webhookEventTypeHelp" class="form-text text-muted">The type of event that will trigger the webhook.</small>
          </div> 
          <br />
          <label for="inputWebhookName">Webhook Name:</label>
          <input type="text" class="form-control" id="inputWebhookName" aria-describedby="webhookNameHelp" placeholder="Enter name of the webhook">
          <small id="webhookNameHelp" class="form-text text-muted">Name your webhook something descriptive.</small>
          <br />
          <label for="inputWebhookURL">Webhook URL:</label>
          <input type="text" class="form-control" id="inputWebhookURL" aria-describedby="webhookURLHelp" placeholder="Enter URL for the webhook">
          <small id="webhookURLHelp" class="form-text text-muted">Destination URL for the webhook events.</small>
        </div>
        <button type="submit" class="btn btn-primary" >Create</button>
      </form>
    </div>
  </div>
</template>

<script>
import AppNav from "./AppNav";
import axios from "axios";

const REST_API_VERSION = "api/exp/";

// Set-up our Tableau REST API variables
const TABLEAU_BASE_URL = inputBaseURL.value.trim();
const SITE_ID = inputSiteID.value.trim();
const AUTH_TOKEN = inputAuthToken.value.trim();

let REST_LIST_WEBHOOKS = `${TABLEAU_BASE_URL}${REST_API_VERSION}sites/${SITE_ID}/webhooks`;
const CONFIG = {
  headers: { "X-Tableau-Auth": `${AUTH_TOKEN}`, Accept: "application/json" }
};
const ax = axios.create({ baseURL: REST_LIST_WEBHOOKS }, { timeout: 1000 });

export default {
  name: "configuredWebhooks",
  components: {
    AppNav
  },
  data() {
    return {
      configuredWebhooks: ""
    };
  },
  methods: {
    isLoggedIn() {
      return isLoggedIn();
    },
    getHooks() {
      axios.get(REST_LIST_WEBHOOKS, CONFIG).then(response => {
        this.configuredWebhooks = response.data.webhooks.webhook;
      });
    },
    deleteWebhook(webhook) {
      let indexOfWebhook = this.configuredWebhooks.indexOf(webhook);
      let webhooks = this.configuredWebhooks;

      // make sure that we don't delete the wrong thing
      if (indexOfWebhook >= 0) {
        axios.delete(`${REST_LIST_WEBHOOKS}/${webhook.id}`, CONFIG)
          .then(function(response) {
            webhooks.splice(indexOfWebhook, 1);
          })
          .catch(function(error) {
            console.log("error: " + error);
          });
      }
    },
    createWebhook() {
      let eventType, webhookName, webhookURL = null;
      let webhooks = this.configuredWebhooks;

      // Make sure we have an event
      if(selectWebhookEventType.value && selectWebhookEventType.value != 'Choose...') {
        eventType = selectWebhookEventType.value;
      }
      // Make sure we have a name
      if(inputWebhookName.value && inputWebhookName.value.trim() != '') {
        webhookName = inputWebhookName.value.trim();
      }
      // Make sure we have a URL
      if(inputWebhookURL.value && inputWebhookURL.value.trim() != '') {
        webhookURL = inputWebhookURL.value.trim();
      }
      
      if(eventType && webhookName && webhookURL) {
        // Create the new webhook
        let whSource = {};
        whSource[eventType] = {};

        let newWebhook = {
          "webhook": {
            "webhook-source": {},
            "webhook-destination": {
              "webhook-destination-http": {
                "method": "POST",
                "url": webhookURL
              }
            },
            "name": webhookName
          }
        };

        newWebhook["webhook"]["webhook-source"] = whSource;

        axios.post(REST_LIST_WEBHOOKS, newWebhook, CONFIG).then(function(response){
          webhooks.push(response.data.webhook);

        })

        // Reset our creation form
        selectWebhookEventType.value = 'Choose...';
        inputWebhookName.value = '';
        inputWebhookURL.value = '';
      }
    }
  },
  mounted() {
    this.getHooks();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

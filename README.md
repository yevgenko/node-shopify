# node-shopify

A Node.js Shopify helper library

## Installation

To install via npm:

    npm install shopify

## Usage

### Requirements

All API usage happens through Shopify applications, created by
either shop owners for their own shops, or by Shopify Partners for
use by other shop owners:

* Shop owners can create applications for themselves through their
  own admin (under the Apps > Manage Apps).
* Shopify Partners create applications through their admin:
  <http://app.shopify.com/services/partners>

For more information and detailed documentation about the API visit
<http://api.shopify.com>

### Getting Started

1.  First create a new application in either the partners admin or
    your store admin and write down your `API_KEY` and `SHARED_SECRET`.

2.  You will need to supply two parameters to the Session class
    before you instantiate it:

    ```javascript
    var express = require('sys')
      , shopify = require('shopify');

    var session = new shopify.Session(
        API_KEY
      , SHARED_SECRET
    );
    ```

3.  For application to access a shop via the API, they first need a
    "token" specific to the shop, which is obtained from Shopify after
    the owner has granted the application access to the shop. This can
    be done by redirecting the shop owner to permission URL obtained
    as follows:

    ```javascript
    var permission_url = session.createPermissionURL(req.query['shop']);
    ```

4.  After visiting this URL, the shop redirects the owner to a custom
    URL of your application where the `token` gets sent to (it's param
    name is just `t`) along with other parameters to ensure it was sent
    by Shopify. That token is used to instantiate the session so that it
    is ready to make calls to that particular shop.

    ```javascript
    session.auth(req.query['shop'], req.query['t'], req.query);
    req.session.shopify = {url: session.url, token: session.token}; // save token both URL and token with the session middleware
    ```

5.  Now you can finally get the fully authorized URL for that shop. Use that URL to make request to the ShopifyAPI:

    ```javascript
    var site_url = shopify.site();
    ```

6.  To get data from that shop you might consider one of the following libraries:

    * https://github.com/danwrong/restler
    * https://github.com/mikeal/request


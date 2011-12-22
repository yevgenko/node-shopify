var crypto = require('crypto');

function Session(apikey, secret) {
  if (! (this instanceof arguments.callee)) {
    return new arguments.callee(arguments);
  }

  var self = this;
  self.protocol = 'https';
  self.apikey = apikey;
  self.secret = secret;
}

Session.prototype.auth = function(url, token, query) {
  if(!url || !token) {
    throw new Error('url, token are required');
  }

  var self = this;

  if (query) {
    //TODO: validate timestamp parameter first
    if (!self.validateSignature(query)) {
      throw new Error('Invalid Signature: Possible malicious login');
    }
  }

  self.url = self.prepareURL(url);
  self.token = token;

  return self.isAuthenticated();
};

Session.prototype.isAuthenticated = function() {
  var self = this;

  return self.url && self.token;
};

Session.prototype.prepareURL = function(url) {
  var self = this;

  url = url.replace(/https?:\/\//, '');
  if (!~url.indexOf('.')) {
    url = url+'.myshopify.com';
  }

  return url;
};

Session.prototype.createPermissionURL = function(url) {
  if(!url) {
    throw new Error('url are required');
  }

  var self = this;

  return 'http://'+self.prepareURL(url)+'/admin/api/auth?api_key='+self.apikey;
};

Session.prototype.validateSignature = function(query) {
  var self = this
  , sortedQuery = new Array()
  , signature;

  if (!query['signature']) {
    return false;
  }
  signature = query['signature'];
  delete query['signature'];

  for (var i in query) {
    sortedQuery.push(i+'='+query[i]);
  }
  sortedQuery.sort();

  return crypto.createHash('md5').update(self.secret+sortedQuery.join('')).digest("hex") == signature;
};

Session.prototype.computedPassword = function() {
  var self = this;

  return crypto.createHash('md5').update(self.secret+self.token).digest("hex");
};

Session.prototype.site = function() {
  var self = this;

  return self.protocol+'://'+self.apikey+':'+self.computedPassword()+'@'+self.url+'/admin';
};

module.exports = Session;

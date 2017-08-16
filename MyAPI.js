/*
MyAPI

 - - CONSTRUCTOR
MyAPI(URL: string, METHOD: string, CALLID: string, CALLS (optional): object);
URL: the url of the API file to access via AJAX
METHOD: the API method to use (Either "get" or "post")
CALLID: the string you use to identify the call (or action) you are requesting
to be carried out by the API
CALLS: an object containing call names (key) associated with functions (value);

PROPERTIES

call(CALLNAME)
returns the function associated with the call name OR
returns a function that attaches the call onto the given data and uses
MyAPI.fetch to fetch the response: (DATA, CALLBACK, FAILSAFE)

fetch(DATA: object, CALLBACK: function, FAILSAFE: function);
DATA defines the keys and values to send to the API
CALLBACK(response) defines what to do when the call was successfull and you got a response
FAILSAFE(response) defines what to do when the call was unsucessfull.

Example Code:
var API = new MyAPI("./API/API.php","GET","call" {
  get: (where,is,callback,failsafe) => {
    myAPI.fetch({
      call: "get",
      where: where,
      is: is
    }, callback, failsafe);
  }
});
myAPI.call("get")("name", "seth",
  response => {
    console.log("Success!",response);
  },
  response2 => {
    console.log("API CALL FAILED",response2);
  }
);
*/

function MyAPI(url,method,callId,calls) {
  if (!url || typeof url != "string") {
    console.error("MyAPI -> URL must be a string.");
    return null;
  }
  if (method.toLowerCase() != "post" || method.toLowerCase() != "get") {
    method = "post";
  } else {
    method = method.toLowerCase();
  }
  if (!callId || typeof callId != "string") {
    this.callId = "call";
  } else {
    this.callId = callId;
  }
  this.calls = calls;
  this.AJAX = {
      url: url,
      post: function(data, onPost, failsafe) {
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                  onPost?onPost(JSON.parse(this.responseText)):
                      console.warn("No callback was given");
              } else {
                  failsafe?failsafe():console.warn("XHR request failed, and had no defined failsafe function");
              }
          };
          xhttp.open("POST", this.url, true);
          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          data = this.toURL(data).substring(1,this.toURL(data).length);
          xhttp.send(data);
      },
      get: function(data, onGet, failsafe) {
          var xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                  onGet?onGet(JSON.parse(this.responseText)):console.warn("No callback was given");
              } else {
                  failsafe?failsafe():console.warn("XHR request failed, and had no defined failsafe function");
              }
          };
          xhttp.open("GET", this.url+this.toURL(data), true);
          xhttp.send();

      }
  };
  this.encode = data => {
    var str = "";
    for (var k in data) {
      str += k+"="+data[k]+"&";
    }
    return str.substring(0,str.length-1);
  };
  this.fetch = (data,callback,failsafe) => {
    this.AJAX[method](this.encode(data),callback,failsafe);
    return this;
  };
  this.call = (name) => {
    if (this.calls[name]) {
      return this.calls[name];
    }
    return (data,callback,failsafe) => {
      data[this.callId] = name;
      this.fetch(data,callback,failsafe);
    };
  };
}

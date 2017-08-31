# MyAPI

CONSTRUCTOR
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
```js
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
```

var ResponsePayload = function(code, payload) {
  this.code = code;
  this.payload = payload;
}

exports.respondWithCode = function(code, payload) {
  return new ResponsePayload(code, payload);
}

var writeJson = exports.writeJson = function(response, arg1, arg2) {

  var code;
  var payload;

  if(arg1 && arg1 instanceof ResponsePayload) {
    writeJson(response, arg1.payload, arg1.code);
    return;
  }

  if(arg2 && Number.isInteger(arg2)) {
    code = arg2;
  }
  else {
    if(arg1 && Number.isInteger(arg1)) {
      code = arg1;
    }
  }
  if(code && arg1) {
    payload = arg1;
  }
  else if(arg1) {
    payload = arg1;
  }

  if(code != 200 && code != 201)
    payload = getErrorObject(code)
  
  payload = JSON.stringify(payload, null, 4);
  response.writeHead(code, {'Content-Type': 'application/json'});
  response.end(payload);
}


function getErrorObject(code) {
  switch (code) {
    case 400:
      return {"code": "400", "title": "Bad Request", "description" : "The server could not understand the request due to invalid syntax."}
    case 401:
      return {"code": "401", "title": "Unauthenticated", "description" : "The client must authenticate itself to get the requested response."}
    case 404:
      return {"code": "404", "title": "Not found", "description" : "The server can not find the requested resource."}
    case 409:      
      return {"code": "409", "title": "Conflict", "description" : "This response is sent when a request conflicts with the current state of the server."}
    default:
      return {"code": "500", "title": "Internal server error", "description": "The server has encountered a situation it doesn't know how to handle."}
  }
}
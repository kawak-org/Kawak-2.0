import Types "types";

import Blob "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import Float "mo:base/Float";

import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";

module {

    public class Outcall(state : Types.State) {

        // let pages = TrieMap.TrieMap<Text, T.Page>(Text.equal, Text.hash);

        // public func http_request(request : T.HttpRequest) : T.HttpResponse {

        //     if ((request.method, request.url) == ("GET", "/")){
        //         return {
        //             status_code = 200;
        //             header = [("content-type", "text/plugin"), certification_header()];
        //             body = main_page();
        //         }
        //     }
        // }

        // public func proxy(url : Text) : T.CanisterHttpResponsePayload {

        //     let transform_context : T.TransformContext = {
        //     function = transform;
        //     context = Blob.fromArray([]);
        //     };

        //     // Construct canister request
        //     let request : T.CanisterHttpRequestArgs = {
        //     url = url;
        //     max_response_bytes = null;
        //     headers = [];
        //     body = null;
        //     method = #get;
        //     transform = ?(#function(transform));
        //     };
        //     Cycles.add(220_000_000_000);
        //     let ic : T.IC = actor ("aaaaa-aa");
        //     let response : T.CanisterHttpResponsePayload = await ic.http_request(request);
        //     response;
        // };


        public query func transform(raw : Types.TransformArgs) : async Types.CanisterHttpResponsePayload {
      let transformed : Types.CanisterHttpResponsePayload = {
          status = raw.response.status;
          body = raw.response.body;
          headers = [
              {
                  name = "Content-Security-Policy";
                  value = "default-src 'self'";
              },
              { 
                name = "Referrer-Policy"; 
                value = "strict-origin" 
              },
              { 
                name = "Permissions-Policy"; 
                value = "geolocation=(self)" },
              {
                  name = "Strict-Transport-Security";
                  value = "max-age=63072000";
              },
              { 
                name = "X-Frame-Options"; 
                value = "DENY" 
              },
              { 
                name = "X-Content-Type-Options"; 
                value = "nosniff" 
              },
          ];
      };
      transformed;
  };

  public func send_http_post_request() : async Text {

    let ic : Types.IC = actor ("aaaa-aa");

    let host : Text = "";
    let url = "";

    
    let request_body_json : Text = "{}";
    let request_body_as_Blob : Blob = Text.encodeUtf8(request_body_json);
    let request_body_as_nat8 : [Nat8] = Blob.toArray(request_body_as_Blob); 

    let transform_context : Types.TransformContext = {
      function = transform;
      context = Blob.fromArray([]);
    };

    let idempotency_key: Text = generateUUID();
    let request_headers = [
        { name = "Host"; value = host # ":443" },
        { name = "User-Agent"; value = "http_post_sample" },
        { name= "Content-Type"; value = "application/json" },
        { name= "Idempotency-Key"; value = idempotency_key }
    ];


    let http_request : Types.HttpRequestArgs = {
        url = url;
        max_response_bytes = null; //optional for request
        headers = request_headers;
        //note: type of `body` is ?[Nat8] so we pass it here as "?request_body_as_nat8" instead of "request_body_as_nat8"
        body = ?request_body_as_nat8; 
        method = #post;
        transform = ?transform_context;
    };

    Cycles.add(230_850_258_000);

    let http_response : Types.HttpResponsePayload = await ic.http_request(http_request);

    let response_body: Blob = Blob.fromArray(http_response.body);
    let decoded_text: Text = switch (Text.decodeUtf8(response_body)) {
        case (null) { "No value returned" };
        case (?y) { y };
    };

    //6. RETURN RESPONSE OF THE BODY
    let result: Text = decoded_text # ". See more info of the request sent at: " # url # "/inspect";
    return result;


  };

   func generateUUID() : Text {
    "UUID-123456789";
    }



       


    };
};
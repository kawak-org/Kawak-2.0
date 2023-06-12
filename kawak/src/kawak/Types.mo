import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";

module Types {
    public type Timestamp = Nat64;
    public type Rate = Text;

    public type TimeRange = {
        start : Timestamp;
        end : Timestamp;
    };

    public type RatesWithInterval = {
        interval : Nat64;
        rates : [(Timestamp, Rate)];
    };

    public type HttpHeader = {
        name : Text;
        value : Text;
    };

    public type HttpMethod = {
        #get;
        #post;
        #head;
    };

    public type TransformContext = {
        function : shared query TransformArgs -> async CanisterHttpResponsePayload;
        context : Blob;
    };

    public type CanisterHttpRequestArgs = {
        url : Text;
        max_response_bytes : ?Nat64;
        headers : [HttpHeader];
        body : ?[Nat8];
        method : HttpMethod;
        transform : ?TransformContext;
    };

    public type CanisterHttpResponsePayload = {
        status : Nat;
        headers : [HttpHeader];
        body : [Nat8];
    };

    public type TransformArgs = {
        response : CanisterHttpResponsePayload;
        context : Blob;
    };

    public type IC = actor {
        http_request : Types.CanisterHttpRequestArgs -> async Types.CanisterHttpResponsePayload;
    };
};




// const axios = require('axios');
// const FormData = require('form-data');

// const data = new FormData();
// data.append('file', );
// data.append('page', '1');

// const options = {
//   method: 'POST',
//   url: 'https://pdf-to-text-converter.p.rapidapi.com/api/pdf-to-text/convert',
//   headers: {
//     'X-RapidAPI-Key': '1ca5540949mshb48054b141d9090p1efb5ejsn8ffe56cb85e1',
//     'X-RapidAPI-Host': 'pdf-to-text-converter.p.rapidapi.com',
//     ...data.getHeaders(),
//   },
//   data: data
// };

// try {
// 	const response = await axios.request(options);
// 	console.log(response.data);
// } catch (error) {
// 	console.error(error);
// }
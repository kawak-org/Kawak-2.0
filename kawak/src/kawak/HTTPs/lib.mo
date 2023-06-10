import T "types";

import Blob "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import Float "mo:base/Float";

import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";

module {

    public class Outcall(state : T.State) {

        let pages = TrieMap.TrieMap<Text, T.Page>(Text.equal, Text.hash);

        // public func http_request(request : T.HttpRequest) : T.HttpResponse {

        //     if ((request.method, request.url) == ("GET", "/")){
        //         return {
        //             status_code = 200;
        //             header = [("content-type", "text/plugin"), certification_header()];
        //             body = main_page();
        //         }
        //     }
        // }

        // public func proxy(url : Text) : async T.CanisterHttpResponsePayload {

        //     // let transform_context : T.TransformContext = {
        //     // function = transform;
        //     // context = Blob.fromArray([]);
        //     // };

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

       


    };
};
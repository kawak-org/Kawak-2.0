import T "types";

import Text "mo:base/Text";
import TrieMap "mo:base/TrieMap";

module {

    public class Outcall(state : T.State) {

        let ages = TrieMap.TrieMap<Text, T.Page>(Text.equal, Text.hash);

        // public func http_request(request : T.HttpRequest) : T.HttpResponse {

        //     if ((request.method, request.url) == ("GET", "/")){
        //         return {
        //             status_code = 200;
        //             header = [("content-type", "text/plugin"), certification_header()];
        //             body = main_page();
        //         }
        //     }
        // }


    };
};
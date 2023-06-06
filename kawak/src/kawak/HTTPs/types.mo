module {

    public type State = {
        cid : Principal;
    };

    public type HeaderField = (Text, Text);

    public type Page = {
        text : Text;
        content_type : Text;
    };

    public type HttpResponse = {
        status_code : Nat16;
        headers : [HeaderField];
        body    : Blob;
    };

    public type HttpRequest = {
        method : Text;
        url     : Text;
        headers : [HeaderField];
        blob : Blob;
    };

    public type Hash = Blob;
    public type Key = Blob;
    public type Value = Blob;

    public type HashTree = {
        #empty;
        #pruned : Hash;
        #fork : (HashTree, HashTree);
        #labeled : (Key, HashTree);
        #leaf : Value;

    };
    
}
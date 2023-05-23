import Int "mo:base/Int";
import Admins "../Admins";
import Users "../Users";
import UsersTypes "../Users/types";

module {

    public type State = {
        _Admins : Admins.Admins;
        _Users  : Users.User;
        essays  : [EssayEntry];
        drafts  : [DraftEntry];
        annotations : [AnnotationEntry];
    };

    public type DraftEntry = {
        id : Nat;
        owner : Text;   // username
        title : Text;
        text    : Text;
        draftedAT   : Int;
    };

    public type EssayEntry = {
        id : Nat;
        aid : Principal;
        owner : Text;
        title : Text;
        topic : Text;
        //createdAt : Time;
        wordCount : Nat;
        reviewTimes : Nat32;
        reviewed     : Bool;
        essayCost : Nat;
        submittedAt : Int;
        text : Text;
        userDetails : UsersTypes.UserEntry;
    };

    public type AnnotationEntry = {
        id : Nat;
        user : Principal;
        comments : Text;
        quote : Text;
        rated   : Bool;
        //accepted : Bool;
    };


}
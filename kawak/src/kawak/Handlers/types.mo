import Int "mo:base/Int";
import Admins "../Admins";
import Users "../Users";
import Dip "../Dip";
import UsersTypes "../Users/types";

module {

    public type EssayLocalStableState = {
        EssayEntries  : [(Nat, EssayEntry)];
        UserEssayEntries : [(Principal, EssayEntry)];
        essayPK     : Nat;
    };

    public type AnnotationsLocalStableState = {
        AnnotationEntries : [(Nat, AnnotationEntry)];
    };

    public type State = {
        // caller     : Principal;
        _Admins : Admins.Admins;
        _Users  : Users.User;
        _Brew_DIP20    : Dip.Brew_DIP20;
        EssayEntries : [(Nat, EssayEntry)];
        UserEssayEntries : [(Principal, EssayEntry)];
        essayPK     : Nat;
        draftEntries : [(Nat, DraftEntry)];
        AnnotationEntries : [(Nat, AnnotationEntry)];
    };

    public type EssayState = {
        _Admins : Admins.Admins;
        _Users  : Users.User;
        _Brew_DIP20    : Dip.Brew_DIP20;
        EssayEnntires  : [(Nat, EssayEntry)];
        UserEssayEntries : [(Principal, EssayEntry)];
        essayPK         : Nat;

    };


    public type DraftsLocalStableState = {
        draftEntries : [(Nat, DraftEntry)];
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
        topic : [Text];
        //createdAt : Time;
        wordCount : Nat;
        reviewTimes : Nat32;
        reviewed     : Bool;
        essayCost : Nat;
        submittedAt : Int;
        text : Text;
        userDetails : UsersTypes.UserEntry;
        reviews : [AnnotationEntry];
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
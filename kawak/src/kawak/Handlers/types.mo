import Int "mo:base/Int";
import Nat "mo:base/Nat";
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
        owner : Text;   // username of user
        title : Text;
        text    : Text;
        draftedAT   : Int;
    };

    public type ReviewStatus = {
        essayID : Nat;
        // essay : ?EssayEntry;
        status : Bool;
    };

    public type Rated = {
        essayID : Nat;
        reviewId : Nat;
        rated : Bool;
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
        rated    : Bool;
        essayCost : Nat;
        submittedAt : Int;
        text : Text;
        userDetails : UsersTypes.UserEntry;
        reviews : [AnnotationEntry];
        _public : Bool;
        description : Text;
    };

    public type AnnotationEntry = {
        id : Nat;
        essayID : Nat;
        user : Principal;
        comments : Text;
        quote : Text;
        rated   : Bool;
        //accepted : Bool;
    };


}
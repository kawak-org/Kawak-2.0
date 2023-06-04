import Int "mo:base/Int";
import Time "mo:base/Time";

module {

    public type LocalStableState = {
        ProfileEntries : [(Principal, UserEntry)];
    };

    public type  UserEntry = {
        userName : Text;
        token_balance  : Nat;
        userRating  : Nat;
        myEssays : [Nat];
        myDrafts : [Nat];
        createdAt : Int;
        role     : ?Text;
        avatar      : Text;
        reviewingEssay : Nat;
        pastRatedFeedbacks : [Nat];
        onBoarding : Bool;
        isAdmin : Bool;
    };

    public type State = {
        // cid  : Principal;
        ProfileEntries  : [(Principal, UserEntry)];
    };

    

}
import UsersTypes "../Users/types";
import Admins "../Admins";
import Users "../Users";
import Dip "../Dip";
import DipTypes "../Dip/types";

module {

    public type State = {
        _Admins : Admins.Admins;
        _Users  : Users.User;
        _Brew_DIP721    : Dip.Brew_DIP721;
        _Brew_DIP20     : Dip.Brew_DIP20;
        items   : [Listing];
        MarketListingEntries : [(Principal, Listing)];
    };

    public type LocalStableState = {
        items   : [Listing];
        MarketListingEntries : [(Principal, Listing)];
    };
   
    public type Status = {
        listed      : Bool;
        locked        : Bool;
        cancelled   : Bool;
    };

     public type MarketItem  = {
        itemId      : Nat;
        tokenId     : Nat;
        seller      : Principal;
        price       : Nat64; 
        sold        : Bool;
    };

    public type Request =  {
        from       : Principal;
        to         : Principal;
        token      : Nat;
        amount     : Nat;
        memo       : Text;
        notify     : Bool;
        subaccount : ?Principal;
    };

    public type Listing = {
        itemId      : Nat;
        seller      : Principal;
        tokenId     : Nat;
        metadata    : DipTypes.TokenMetadata;
        price       : Nat64;
        locked      : Bool;
        status      : Status;
        listedAt    : Nat64;
    };

    public type Sale = {
        itemId      : Nat;
        buyer       : Principal;
        tokenId     : Nat32;
        price       : Nat64;
    };

    public type Cancel = {
        itemId      : Nat;
        seller      : Principal;
    };

}
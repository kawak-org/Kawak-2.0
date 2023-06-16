import Admins "../Admins";
import Users "../Users";
import UserTypes "../Users/types";

import Time "mo:base/Time";

module {
    public type State = {
        _Admins : Admins.Admins;
        _Users  : Users.User; 
        caller  : Principal;
        ledger  : [TokenMetadata];
        balanceEntries : [(Principal, Nat)];
        allowanceEntries : [(Principal, [(Principal, Nat)])];
    };

    public type DIP721_LocalStableState = {
        ledger : [TokenMetadata];
    };

    public type DIP20_LocalStableState = {
        balanceEntries : [(Principal, Nat)];
        allowanceEntries : [(Principal, [(Principal, Nat)])];
    };

    public type TokenMetadata = {
        token_identifier    : Nat;
        owner               : Principal;
        userEntry           : ?UserTypes.UserEntry;
        title               : Text;
        content             : Text;
        minted_at           : Nat64;
        minted_by           : Principal;
        operator            : ?Principal;
        transferred_at      : ?Nat64;
        transferred_by      : ?Principal;
        listed              : Bool;
        locked              : Bool;
    };

    public type GenericValue = {
        #BoolContent    : Bool;
        #TextContent    : Text;
        #BlobContent    : [Nat8];
        #Principal      : Principal;
        #NatContent     : Nat;
        #Nat8Content    : Nat8;
        #Nat16Content   : Nat16;
        #Nat32Content   : Nat32;
        #Nat64Content   : Nat64;
        #IntContent     : Int;
        #Int8Content    : Int8;
        #Int16Content   : Int16;
        #Int32Content   : Int32;
        #Int64Content   : Int64;
    };

    public type NftError = {
        #Unauthorized;
        #OwnerNotFound;
        #OperatorNotFound;
        #TokenNotFound;
        #ExistedNFT;
        #SelfApprove;
        #SelfTransfer;
        #TxNotFound;
        #Other : Text;     
    };

    public type Operation = {
        #mint;
        #burn;
        #transfer;
        #transferFrom;
        #approve;
    };

    public type TransactionStatus = {
        #succeeded;
        #inprogress;
        #failed;
    };
    /// Update call operation record fields
    public type TxRecord = {
        caller : ?Principal;
        op : Operation;
        index : Nat;
        from : Principal;
        to : Principal;
        amount : Nat;
        fee : Nat;
        timestamp : Time.Time;
        status : TransactionStatus;
    };
    

    public type Metadata = {
        logo : Text;
        name : Text;
        symbol : Text;
        decimals : Nat8;
        totalSupply : Nat;
        owner : Principal;
        fee : Nat;
    };
    // returns tx index or error msg
    public type TxReceipt = {
        #Ok : Nat;
        #Err : {
            #InsufficientAllowance;
            #InsufficientBalance;
            #ErrorOperationStyle;
            #Unauthorized;
            #LedgerTrap;
            #ErrorTo;
            #Other : Text;
            #BlockUsed;
            #AmountTooSmall;
        };
    };


    


}
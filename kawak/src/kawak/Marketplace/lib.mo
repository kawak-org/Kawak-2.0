import Array "mo:base/Array";
import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";

import Types "types";

module {

    public class Market (state : Types.State) {

        public type TokenIndex = Nat;
        public type MarketItem = Types.MarketItem;


        var MarketListingEntries : [(Principal, Types.Listing)] = [];
        var item : [var Types.Listing] = [var];


        var marketListings : HashMap.HashMap<Principal, Types.Listing> = HashMap.fromIter<Principal, Types.Listing>(
            MarketListingEntries.vals(),
            10,
            Principal.equal,
            Principal.hash,
        );

        // For stableness purposes.
        public func toStable() : Types.LocalStableState {
            // items := Array.freeze(item);
            MarketListingEntries := Iter.toArray(marketListings.entries());
            {
                items = Array.freeze(item);
                MarketListingEntries;
            };
        };

        public func postStable(_marketListingEntries : [(Principal, Types.Listing)], _item : [Types.Listing]){
            marketListings := HashMap.fromIter<Principal, Types.Listing>(_marketListingEntries.vals(), 10, Principal.equal, Principal.hash);
            item := Array.thaw(_item);

        };

        // Restore local state from backup.
        public func _restore(backup : Types.LocalStableState) :  () {
            item := Array.thaw(backup.items);
            MarketListingEntries := backup.MarketListingEntries;
        };

        // Restore local state on init.
        _restore(state);

        //
        //
        //

        private func setStatus(listed : Bool, locked : Bool, cancelled : Bool) : Types.Status {
            {
            listed : Bool;
            locked : Bool;
            cancelled : Bool;
            };
        };

        private func makeTransferRequest(
            from : Principal,
            to : Principal,
            token : Nat,
            amount : Nat,
            memo : Text,
            notify : Bool,
            subaccount : ?Principal,
        ) : Types.Request {
            {
            from : Principal;
            to : Principal;
            token : Nat;
            amount : Nat;
            memo : Text;
            notify : Bool;
            subaccount : ?Principal;
            };
        };

        // Retruns the total number of NFTs on the market
        public func mp_totalListed() :  Nat {
            item.size();
        };

        // Return the number of the total NFTs listed by a caller
        public func mp_myListedItems(caller : Principal) :  Nat {
            Array.filter<Types.Listing>(
            Array.freeze(item),
            func(i) {
                // let _seller = AccountIdentifier.toText(AccountIdentifier.fromPrincipal(caller, null));
                i.seller == caller;
            },
            ).size();
        };

        // View the marketplace meta of a listed item
        public func mp_viewListedNFT(itemId : Nat) :  Result.Result<Types.Listing, Text> {
            if (itemId < item.size()) {
            #ok(item[itemId]);
            } else {
            #err("Item doesn't exist! ");
            };
        };

        // Returns an array of a users listed NFTs
        public func mp_viewSellerListedNFTs(caller : Principal) :  Result.Result<[Types.Listing], Text> {
            #ok(
            Array.filter<Types.Listing>(
                Array.freeze(item),
                func(i) {
                // let _seller = AccountIdentifier.toText(AccountIdentifier.fromPrincipal(caller, null));
                i.seller == caller;
                },
            ),
            );
        };

        public func mp_viewMarket() :  [Types.Listing] {
            Array.freeze(item);
        };

        // List Item to the marketplace
        public func mp_ListItem(
            caller : Principal,
            tokenId : Nat,
            price : Nat64
        ) : Nat {
            // if (state._Brew_DIP721.ledger[tokenId].listed == true) {
            //     throw Error.reject("$ This NFT has already been listed #");
            // };
            state._Brew_DIP721.listNFT(tokenId, state._Brew_DIP721.Metadata(tokenId));
            item := Array.tabulateVar<Types.Listing>(
            item.size() + 1,
            func(i) {
                if (i < item.size()) {
                item[i];
                } else {
                let meta = state._Brew_DIP721.Metadata(tokenId);
                // let _seller = AccountIdentifier.toText(AccountIdentifier.fromPrincipal(caller, null));
                {
                    seller = caller;
                    itemId = i;
                    tokenId = tokenId;
                    metadata = meta;
                    price = price;
                    locked = false;
                    status = setStatus(true, false, false);
                    listedAt = Nat64.fromNat(Int.abs(Time.now()));
                };
                };
            },
            );
            item.size() - 1;
        };

        //  Checks if an NFT is listed
        public func mp_amIlisted(tokenId : Nat) :  Bool {
            var iExist = false;
            for (_item in item.vals()) {
            if (_item.tokenId == tokenId) {
                iExist := true;
            };
            };
            return iExist;
        };

        // This function unlists an item from the marketplace
        public func mp_unListItem(caller : Principal, tokenId : Nat) :  Result.Result<Text, Text> {
            var tempArr : [var Types.Listing] = [var];
            for (_item : Types.Listing in item.vals()) {
            // let _lister = AccountIdentifier.toText(AccountIdentifier.fromPrincipal(caller, null));
            assert (caller == _item.seller);
            if (_item.tokenId != tokenId) {
                tempArr := Array.thaw(Array.append<Types.Listing>(Array.freeze(tempArr), [_item]));
                item := tempArr;
            };
            };
            #ok("You have successfully unlisted your item from the marketplace");
        };


        public func mp_getNFTSeller(itemId : Nat) :  Principal {
            item[itemId].seller;
        };

        // Purchases an NFT with KAWAK Tokens.
        // public  shared ({caller}) func mp_purchaseNFT(itemId : Nat) : (){
        //     let balance = state._Brew_DIP20.getBalanceOf(caller);
        //     let price = Nat64.toNat(item[itemId].price);
        //     let token = state._Brew_DIP721.Metadata(itemId);
        //     // if (item[itemId].seller == caller) {
        //     //     throw Error.reject("$ You cannot purchase your own NFT #");
        //     // };
        //     // if (balance < price){
        //     //     throw Error.reject("$ Your balance is low, try reviewing essays to get tokens #");
        //     // };
        //     if(item[itemId].seller != caller and balance >= price){
        //         _transfer(caller, item[itemId].seller, price);
        //         var _buyer = state._Users.getUser(caller);
        //         switch(_buyer) {
        //             case(null){};
        //             case (?_buyer){
        //             var updateBuyer = state._Users._updateUserProfile(caller, updatedVirtualBalance(_buyer, price, true));
        //             }
        //         };
        //         var _seller = state._Users.getUser(item[itemId].seller);
        //         switch(_seller) {
        //             case(null){};
        //             case (?_seller){
        //             var updateBuyer = ProfileHashMap.replace(caller, updatedVirtualBalance(_seller, price, false));
        //             }
        //         };
        //         if(token.owner != item[itemId].seller){
        //             throw Error.reject("$ We cannot proceed with the purchase there is an error #");
        //         };
        //         let unlist = mp_unListItem(item[itemId].seller, itemId);
        //         _transferNFTto(caller, itemId, token);
        //     };
        // };

        public func mp_getListedNFTPrice(itemId : Nat) :  Result.Result<Nat64, Text> {
            if (itemId >= item.size()) {
            return #err("Item doesn't exist");
            } else {
            return #ok(item[itemId].price);  
            };
        };


    }

}
// import Nat "mo:base/Nat";

// import Dip

// module {


//     public type TokenIndex = Nat;
//     public type MarketItem = Types.MarketItem;

//     var MarketListingEntries : [(Principal, Types.Listing)] = [];
//     var item : [var Types.Listing] = [var];

//     var marketListings : HashMap.HashMap<Principal, Types.Listing> = HashMap.fromIter<Principal, Types.Listing>(
//         MarketListingEntries.vals(),
//         10,
//         Principal.equal,
//         Principal.hash,
//     );

//     // For stableness purposes.
//     // public func toStable() : async Types.LocalStableState {
//     //     {
//     //     items = Array.freeze(item);
//     //     MarketListingEntries;
//     //     };
//     // };

//     // Restore local state from backup.
//     public func _restore(backup : Types.LocalStableState) : async () {
//         item := Array.thaw(backup.items);
//         MarketListingEntries := backup.MarketListingEntries;
//     };

//     // Restore local state on init.
//     // _restore(state);

//     //
//     //
//     //

//     private func setStatus(listed : Bool, locked : Bool, cancelled : Bool) : Types.Status {
//         {
//         listed : Bool;
//         locked : Bool;
//         cancelled : Bool;
//         };
//     };

//     private func makeTransferRequest(
//         from : Principal,
//         to : Principal,
//         token : Nat,
//         amount : Nat,
//         memo : Text,
//         notify : Bool,
//         subaccount : ?Principal,
//     ) : Types.request {
//         {
//         from : Principal;
//         to : Principal;
//         token : Nat;
//         amount : Nat;
//         memo : Text;
//         notify : Bool;
//         subaccount : ?Principal;
//         };
//     };

//     // Retruns the total number of NFTs on the market
//     public func mp_totalListed() : async Nat {
//         item.size();
//     };

//     // Return the number of the total NFTs listed by a caller
//     public func mp_myListedItems(caller : Principal) : async Nat {
//         Array.filter<Types.Listing>(
//         Array.freeze(item),
//         func(i) {
//             // let _seller = AccountIdentifier.toText(AccountIdentifier.fromPrincipal(caller, null));
//             i.seller == caller;
//         },
//         ).size();
//     };

//     // View the marketplace meta of a listed item
//     public func mp_viewListedNFT(itemId : Nat) : async Result.Result<Types.Listing, Text> {
//         if (itemId < item.size()) {
//         #ok(item[itemId]);
//         } else {
//         #err("Item doesn't exist! ");
//         };
//     };

//     // Returns an array of a users listed NFTs
//     public func mp_viewSellerListedNFTs(caller : Principal) : async Result.Result<[Types.Listing], Text> {
//         #ok(
//         Array.filter<Types.Listing>(
//             Array.freeze(item),
//             func(i) {
//             // let _seller = AccountIdentifier.toText(AccountIdentifier.fromPrincipal(caller, null));
//             i.seller == caller;
//             },
//         ),
//         );
//     };

//     public func mp_viewMarket() : async [Types.Listing] {
//         Array.freeze(item);
//     };

//     // List Item to the marketplace
//     public shared ({caller}) func mp_ListItem(
//         tokenId : Nat,
//         price : Nat64
//     ) : async Nat {
//         if (ledger[tokenId].listed == true) {
//             throw Error.reject("$ This NFT has already been listed #");
//         };
//         listNFT(tokenId, ledger[tokenId]);
//         item := Array.tabulateVar<Types.Listing>(
//         item.size() + 1,
//         func(i) {
//             if (i < item.size()) {
//             item[i];
//             } else {
//             let meta = NFTTokenMetadata_(tokenId);
//             // let _seller = AccountIdentifier.toText(AccountIdentifier.fromPrincipal(caller, null));
//             {
//                 seller = caller;
//                 itemId = i;
//                 tokenId = tokenId;
//                 metadata = meta;
//                 price = price;
//                 locked = false;
//                 status = setStatus(true, false, false);
//                 listedAt = Nat64.fromNat(Int.abs(Time.now()));
//             };
//             };
//         },
//         );
//         item.size() - 1;
//     };

//     //  Checks if an NFT is listed
//     public func mp_amIlisted(tokenId : Nat) : async Bool {
//         var iExist = false;
//         for (_item in item.vals()) {
//         if (_item.tokenId == tokenId) {
//             iExist := true;
//         };
//         };
//         return iExist;
//     };

//     // This function unlists an item from the marketplace
//     public func mp_unListItem(caller : Principal, tokenId : Nat) : async Result.Result<Text, Text> {
//         var tempArr : [var Types.Listing] = [var];
//         for (_item : Types.Listing in item.vals()) {
//         // let _lister = AccountIdentifier.toText(AccountIdentifier.fromPrincipal(caller, null));
//         assert (caller == _item.seller);
//         if (_item.tokenId != tokenId) {
//             tempArr := Array.thaw(Array.append<Types.Listing>(Array.freeze(tempArr), [_item]));
//             item := tempArr;
//         };
//         };
//         #ok("You have successfully unlisted your item from the marketplace");
//     };


//     public func mp_getNFTSeller(itemId : Nat) : async Principal {
//         item[itemId].seller;
//     };

//     // Purchases an NFT with KAWAK Tokens.
//     public  shared ({caller}) func mp_purchaseNFT(itemId : Nat) : (){
//         let balance = _balanceOf(caller);
//         let price = Nat64.toNat(item[itemId].price);
//         let token = ledger[itemId];
//         if (item[itemId].seller == caller) {
//             throw Error.reject("$ You cannot purchase your own NFT #");
//         };
//         if (balance < price){
//             throw Error.reject("$ Your balance is low, try reviewing essays to get tokens #");
//         };
//         if(item[itemId].seller != caller and balance >= price){
//             _transfer(caller, item[itemId].seller, price);
//             var _buyer = ProfileHashMap.get(caller);
//             switch(_buyer) {
//                 case(null){};
//                 case (?_buyer){
//                    var updateBuyer = ProfileHashMap.replace(caller, updatedVirtualBalance(_buyer, price, true));
//                 }
//             };
//             var _seller = ProfileHashMap.get(item[itemId].seller);
//             switch(_seller) {
//                 case(null){};
//                 case (?_seller){
//                    var updateBuyer = ProfileHashMap.replace(caller, updatedVirtualBalance(_seller, price, false));
//                 }
//             };
//             if(token.owner != item[itemId].seller){
//                 throw Error.reject("$ We cannot proceed with the purchase there is an error #");
//             };
//             let unlist = mp_unListItem(item[itemId].seller, itemId);
//             _transferNFTto(caller, itemId, token);
//         };
//     };

//     public func mp_getListedNFTPrice(itemId : Nat) : async Result.Result<Nat64, Text> {
//         if (itemId >= item.size()) {
//         return #err("Item doesn't exist");
//         } else {
//         return #ok(item[itemId].price);  
//         };
//     };

// }
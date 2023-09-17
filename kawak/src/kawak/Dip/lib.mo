import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Option "mo:base/Option";
import P "mo:base/Prelude";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";

import Types "types";
import Users "../Users";

module {

    public type state = Types.State;

    public class Brew_DIP721(state : Types.State) {

        var ledger : [var Types.TokenMetadata] = [var];

        public func toStable() : Types.DIP721_LocalStableState {
            {
                ledger = Array.freeze(ledger);
            };
        };

        public func postStable(_ledger : [Types.TokenMetadata]) {
            ledger := Array.thaw(_ledger);
        };

        /// Query methods

        // Function allows the canister to be queried
        // About the total number of NFts that exist in the contract
        public func TotalSupplyofNFT() : Nat {
            ledger.size();
        };

        public func BalanceOfNFTs(caller : Principal) : Nat {
            Array.filter<Types.TokenMetadata>(
                Array.freeze(ledger),
                func(t) {
                    t.owner == caller;
                },
            ).size();
        };

        public func OwnerOfNFT(tokenId : Nat) : Result.Result<?Principal, Types.NftError> {
            if (tokenId < ledger.size()) {
                #ok(?ledger[tokenId].owner);
            } else {
                #err(#TokenNotFound);
            };
        };

        public func NftOwnerTokenMetadata(caller : Principal) : Result.Result<[Types.TokenMetadata], Types.NftError> {
            #ok(
                Array.filter<Types.TokenMetadata>(
                    Array.freeze(ledger),
                    func(t) {
                        t.owner == caller;
                    },
                )
            );
        };

        // independent APIs

        public func _transferNFTto(to : Principal, tokenId : Nat, token : Types.TokenMetadata) {
            ledger[tokenId] := {
                owner = to;
                token_identifier = token.token_identifier;
                title = token.title;
                userEntry = state._Users.getUser(to);
                content = token.content;
                minted_at = token.minted_at;
                minted_by = token.minted_by;
                operator = token.operator;
                transferred_at = token.transferred_at;
                transferred_by = token.transferred_by;
                listed = false;
                locked = false;
            };
        };

        // Brews/Utils

        public func MintNFT(title : Text, content : Text, caller : Principal) : Nat {
            ledger := Array.tabulateVar<Types.TokenMetadata>(
                ledger.size() + 1,
                func(i) {
                    if (i < ledger.size()) {
                        ledger[i];
                    } else {
                        {
                            token_identifier = i;
                            owner = caller;
                            title = title;
                            userEntry = state._Users.getUser(caller);
                            content = content;
                            minted_at = Nat64.fromNat(Int.abs(Time.now()));
                            minted_by = caller;
                            operator = null;
                            transferred_at = null;
                            transferred_by = null;
                            listed = false;
                            locked = false;
                        };
                    };
                },
            );
            ledger.size() - 1;
        };

        public func isListed(caller : Principal, tokenId : Nat) : Bool {
            ledger[tokenId].listed;
        };

        public func Metadata(tokenId : Nat) : Types.TokenMetadata {
            ledger[tokenId];
        };

        public func TransferNFTto(to : Principal, caller : Principal, tokenId : Nat) : Result.Result<Nat, Types.NftError> {
            if (tokenId >= ledger.size()) {
                return #err(#TokenNotFound);
            };
            let token = ledger[(tokenId - 1)];
            if (token.owner != caller) {
                return #err(#Unauthorized);
            };
            _transferNFTto(to, tokenId, token);
            #ok(0);
        };

        public func listNFT(tokenId : Nat, meta : Types.TokenMetadata) {
            ledger[tokenId -1] := {
                owner = meta.owner;
                token_identifier = meta.token_identifier;
                title = meta.title;
                userEntry = meta.userEntry;
                content = meta.content;
                minted_at = meta.minted_at;
                minted_by = meta.minted_by;
                operator = meta.operator;
                transferred_at = meta.transferred_at;
                transferred_by = meta.transferred_by;
                listed = true;
                locked = false;
            };
        };

    };

    // Credits: https://github.com/Psychedelic/DIP20/blob/main/motoko/src/token.mo

    public class Brew_DIP20(state : Types.State) {

        var owner_ : Principal = state.caller;
        var logo_ : Text = "";
        var decimals_ : Nat8 = 2;
        var name_ : Text = "KawakCoin";
        var totalSupply_ : Nat = 10;
        var symbol_ : Text = "kwk";
        var fee_ : Nat = 0;

        var blackhole : Principal = Principal.fromText("aaaaa-aa");
        var feeTo : Principal = owner_;
        var fee : Nat = fee_;
        var balanceEntries : [(Principal, Nat)] = [];
        var allowanceEntries : [(Principal, [(Principal, Nat)])] = [];
        var balances : HashMap.HashMap<Principal, Nat> = HashMap.fromIter<Principal, Nat>(balanceEntries.vals(), 10, Principal.equal, Principal.hash);
        var allowances = HashMap.HashMap<Principal, HashMap.HashMap<Principal, Nat>>(1, Principal.equal, Principal.hash);
        balances.put(owner_, totalSupply_);
        let genesis : Types.TxRecord = {
            caller = ?owner_;
            op = #mint;
            index = 0;
            from = blackhole;
            to = owner_;
            amount = totalSupply_;
            fee = 0;
            timestamp = Time.now();
            status = #succeeded;
        };
        private var ops : [Types.TxRecord] = [genesis];

        public func toStable() : Types.DIP20_LocalStableState {
            balanceEntries := Iter.toArray(balances.entries());
            {
                balanceEntries;
                allowanceEntries;
            };
        };

        public func postStable(_balanceEntries : [(Principal, Nat)], _allowanceEntries : [(Principal, [(Principal, Nat)])]) {
            balances := HashMap.fromIter<Principal, Nat>(_balanceEntries.vals(), 10, Principal.equal, Principal.hash);
            for ((k, v) in _allowanceEntries.vals()) {
                let allowed_temp = HashMap.fromIter<Principal, Nat>(v.vals(), 10, Principal.equal, Principal.hash);
                allowances.put(k, allowed_temp);
            };
        };

        private func _unwrap<T>(x : ?T) : T {
            switch x {
                case null { P.unreachable() };
                case (?x_) { x_ };
            };
        };

        private func addRecord(caller : ?Principal, op_ : Types.Operation, from : Principal, to : Principal, amount : Nat, fee : Nat, timestamp : Time.Time, status : Types.TransactionStatus) : Nat {
            let index = ops.size();
            let op : Types.TxRecord = {
                caller = caller;
                op = op_;
                index = index;
                from = from;
                to = to;
                amount = amount;
                fee = fee;
                timestamp = timestamp;
                status = status;
            };
            ops := Array.append(ops, [op]);
            return index;
        };

        private func _chargeFee(
            from : Principal,
            fee : Nat,
        ) {
            if (fee > 0) {
                _transfer(from, feeTo, fee);
            };
        };

        private func _transfer(
            from : Principal,
            to : Principal,
            value : Nat,
        ) {
            let from_balance = _balanceOf(from);
            let from_balance_new : Nat = from_balance - value;
            if (from_balance_new != 0) { balances.put(from, from_balance_new) } else {
                balances.delete(from);
            };

            let to_balance = _balanceOf(to);
            let to_balance_new : Nat = to_balance + value;
            if (to_balance_new != 0) { balances.put(to, to_balance_new) };
        };

        private func _balanceOf(who : Principal) : Nat {
            switch (balances.get(who)) {
                case (?balance) { return balance };
                case (_) { return 0 };
            };
        };

        public func getBalanceOf(who : Principal) : Nat {
            _balanceOf(who);
        };

        private func _allowance(
            owner : Principal,
            spender : Principal,
        ) : Nat {
            switch (allowances.get(owner)) {
                case (?allowance_owner) {
                    switch (allowance_owner.get(spender)) {
                        case (?allowance) { return allowance };
                        case (_) { return 0 };
                    };
                };
                case (_) { return 0 };
            };
        };

        public func burn(amount : Nat, caller : Principal) : async Types.TxReceipt {
            let from_balance = _balanceOf(caller);
            if (from_balance < amount) {
                return #Err(#InsufficientBalance);
            };
            totalSupply_ -= amount;
            balances.put(caller, from_balance - amount);
            let txid = addRecord(
                ?caller,
                #burn,
                caller,
                blackhole,
                amount,
                0,
                Time.now(),
                #succeeded,
            );
            return #Ok(txid);
        };

        /// Transfers value amount of tokens to Principal to.
        public func transfer(caller : Principal, to : Principal, value : Nat) : async Types.TxReceipt {
            if (_balanceOf(caller) < value + fee) {
                return #Err(#InsufficientBalance);
            };
            _chargeFee(caller, fee);
            _transfer(caller, to, value);
            let txid = addRecord(
                null,
                #transfer,
                caller,
                to,
                value,
                fee,
                Time.now(),
                #succeeded,
            );
            return #Ok(txid);
        };

        /// Allows spender to withdraw from your account multiple times, up to the value amount.
        /// If this function is called again it overwrites the current allowance with value.
        public func approve(
            caller : Principal,
            spender : Principal,
            value : Nat,
        ) : async Types.TxReceipt {
            if (_balanceOf(caller) < fee) { return #Err(#InsufficientBalance) };
            _chargeFee(caller, fee);
            let v = value + fee;
            if (value == 0 and Option.isSome(allowances.get(caller))) {
                let allowance_caller = _unwrap(allowances.get(caller));
                allowance_caller.delete(spender);
                if (allowance_caller.size() == 0) { allowances.delete(caller) } else {
                    allowances.put(caller, allowance_caller);
                };
            } else if (value != 0 and Option.isNull(allowances.get(caller))) {
                var temp = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
                temp.put(spender, v);
                allowances.put(caller, temp);
            } else if (value != 0 and Option.isSome(allowances.get(caller))) {
                let allowance_caller = _unwrap(allowances.get(caller));
                allowance_caller.put(spender, v);
                allowances.put(caller, allowance_caller);
            };
            let txid = addRecord(
                null,
                #approve,
                caller,
                spender,
                v,
                fee,
                Time.now(),
                #succeeded,
            );
            return #Ok(txid);
        };

    };
};

import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Types "types";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";

module {

    public class User (state : Types.State) {

        // Iter.toArray(map.entries())

        var ProfileEntries : [(Principal, Types.UserEntry)] = [];

        var ProfileHashMap : HashMap.HashMap<Principal, Types.UserEntry> = HashMap.fromIter<Principal, Types.UserEntry>(ProfileEntries.vals(), 10, Principal.equal, Principal.hash);

        
        public func toStable() : Types.LocalStableState {
            ProfileEntries := Iter.toArray(ProfileHashMap.entries());
            {
                ProfileEntries = Iter.toArray(ProfileHashMap.entries());
            }
        };

        public func postStable(_profileEntries : [(Principal, Types.UserEntry)]) {
            ProfileHashMap := HashMap.fromIter<Principal, Types.UserEntry>(_profileEntries.vals(), 10, Principal.equal, Principal.hash);    
        };

        public func _restore(backup : Types.LocalStableState) : () {
            ProfileEntries          := backup.ProfileEntries;
        };

        _restore(state);

        func isEq (x : Principal, y : Principal) : Bool {
            x == y;
        };

        func isEqUsername (x : Text, y : Text) : Bool {
            x == y;
        };

        func makeProfile(userName : Text, role : ?Text, token_balance : Nat, avatar : Text, userRating : Nat, myEssays : [Nat], myDrafts : [Nat], createdAt : Int, reviewingEssay : Nat, pastRatedFeedbacks : [Nat], onBoarding : Bool, isAdmin : Bool) : Types.UserEntry {
            {
                userName : Text;
                token_balance : Nat;
                userRating : Nat;
                myEssays : [Nat];
                myDrafts;
                avatar;
                createdAt : Int;
                role;
                reviewingEssay : Nat;
                pastRatedFeedbacks : [Nat];
                onBoarding : Bool;
                isAdmin : Bool;
            };
        };

        private func createOneProfile(caller : Principal, userName : Text, token_balance : Nat, avatar : Text) {
            ProfileHashMap.put(caller, makeProfile(userName, ?"regular", token_balance, avatar, 0, [], [], Time.now(), 0, [], false, false));
        };

        private func usernameChecker(username : Text) : Bool {
            var unique = true;
            for ((i, j) in ProfileHashMap.entries()) {
                if (j.userName == username) {
                    unique := false;
                };
            };
            unique;
        };

        public func logIn(caller : Principal) : Bool {
            var result = ProfileHashMap.get(caller);

            switch (result) {
                case null {
                    return false;
                };
                case (?(_)) {
                    return true;
                };
            };
        };

        public func getUser(caller : Principal) : ?Types.UserEntry {
            ProfileHashMap.get(caller);
        };

        // public func getProfiles(caller : Principal) : [Types.UserEntry] {
            
        // };

        public func getUserTokenBalance(caller : Principal) : Nat {
            var temp = 0;
            
                let user = getUser(caller);
                switch(user){
                    case(null){
                    }; case (?user) {
                        temp := user.token_balance;
                    };
                };
                temp; 
        };

        public func updateOnboarding(onBoarding : Bool, caller : Principal) : ?() {
            do ? {
                let user = getUser(caller)!;
                // let life = await mint(msg.caller);
                // balance := await tokenBalanceOf(msg.caller);
                ProfileHashMap.put(
                    caller,
                    makeProfile(
                        user.userName,
                        user.role,
                        user.token_balance,
                        user.avatar,
                        user.userRating,
                        user.myEssays,
                        user.myDrafts,
                        user.createdAt,
                        user.reviewingEssay,
                        user.pastRatedFeedbacks,
                        onBoarding,
                        user.isAdmin,
                    ),
                );
            };
        };

        

        public func createprofile(userName : Text, avatar : Text, caller : Principal ) : Result.Result<Text, Text> {
            // call the balnce function to get and set the balance of newly registered users
            let balance = 10;
            let checkUsername = usernameChecker(userName);
            if (checkUsername == false) {
                #err("This username exist! Please enter another")
            } else {
                createOneProfile(caller, userName, balance, avatar);
                #ok("You have successfully created an account with Kawak");
            };
        };

        private func updateUserProfile(caller : Principal, userEntry : Types.UserEntry) : ?Types.UserEntry {
            ProfileHashMap.replace(caller, userEntry);
        };

        public func _updateUserProfile(caller : Principal, userEntry : Types.UserEntry) : ?Types.UserEntry {
            updateUserProfile(caller, userEntry)
        };

        public func makeUserAdmin(accountId : Principal) : () {
            let user = ProfileHashMap.get(accountId);
            switch(user) {
                case(null) {};
                case (?user) {
                    var makeAdmin = {
                        userName = user.userName;
                        role = ?"admin";
                        token_balance = user.token_balance;
                        avatar = user.avatar;
                        userRating = user.userRating;
                        myEssays = user.myEssays;
                        myDrafts = user.myDrafts;
                        createdAt = user.createdAt;
                        reviewingEssay = user.reviewingEssay;
                        pastRatedFeedbacks = user.pastRatedFeedbacks;
                        onBoarding = user.onBoarding;
                        isAdmin = true;
                    };
                    let update = updateUserProfile(accountId, makeAdmin);
                };
            };
        };

        public func updateUserBoolTokenBalance(user : Types.UserEntry, amount : Nat, status : Bool, essayPk : Nat) : Types.UserEntry{
            if (status){
                {
                    userName = user.userName;
                    role = user.role;
                    token_balance = user.token_balance - amount;
                    avatar = user.avatar;
                    userRating = user.userRating;
                    myEssays = Array.append(user.myEssays, [essayPk]);
                    myDrafts = user.myDrafts;
                    createdAt = user.createdAt;
                    reviewingEssay = user.reviewingEssay;
                    pastRatedFeedbacks = user.pastRatedFeedbacks;
                    onBoarding = user.onBoarding;
                    isAdmin = user.isAdmin;
                };
            } else {
                {
                    userName = user.userName;
                    role = user.role;
                    token_balance = user.token_balance;
                    avatar = user.avatar;
                    userRating = user.userRating;
                    myEssays = user.myEssays;
                    myDrafts = user.myDrafts;
                    createdAt = user.createdAt;
                    reviewingEssay = essayPk;
                    pastRatedFeedbacks = user.pastRatedFeedbacks;
                    onBoarding = user.onBoarding;
                    isAdmin = user.isAdmin;
                };
            }
        };

        
        






    }

}
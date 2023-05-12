import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import iter "mo:base/Iter";
import Result "mo:base/Result";
import Time "mo:base/Time";
import Types "types";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";

module {

    public class User (state : Types.State) {

        var profileHashMap = HashMap.HashMap<Principal, Types.UserEntry>(10, Principal.equal, Principal.hash);

        func isEq (x : Principal, y : Principal) : Bool {
            x == y;
        };

        func isEqUsername (x : Text, y : Text) : Bool {
            x == y;
        };

        func makeProfile(userName : Text, token_balance : Nat, avatar : Text, userRating : Nat, myEssays : [Nat], myDrafts : [Nat], createdAt : Int, reviewingEssay : Nat, pastRatedFeedbacks : [Nat], onBoarding : Bool, isAdmin : Bool) : Types.UserEntry {
            {
                userName : Text;
                token_balance : Nat;
                userRating : Nat;
                myEssays : [Nat];
                myDrafts;
                avatar;
                createdAt : Int;
                reviewingEssay : Nat;
                pastRatedFeedbacks : [Nat];
                onBoarding : Bool;
                isAdmin : Bool;
            };
        };

        private func createOneProfile(caller : Principal, userName : Text, token_balance : Nat, avatar : Text) {
            profileHashMap.put(caller, makeProfile(userName, token_balance, avatar, 0, [], [], Time.now(), 0, [], false, false));
        };

        private func usernameChecker(username : Text) : Bool {
            var unique = true;
            for ((i, j) in profileHashMap.entries()) {
                if (j.userName == username) {
                    unique := false;
                };
            };
            unique;
        };

        public func logIn(caller : Principal) : Bool {
            var result = profileHashMap.get(caller);

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
            profileHashMap.get(caller);
        };

        // public func getProfiles(caller : Principal) : [Types.UserEntry] {
            
        // };

        public func updateOnboarding(onBoarding : Bool, caller : Principal) : ?() {
            do ? {
                let user = getUser(caller)!;
                // let life = await mint(msg.caller);
                // balance := await tokenBalanceOf(msg.caller);
                profileHashMap.put(
                    caller,
                    makeProfile(
                        user.userName,
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
            let balance = 0;
            let checkUsername = usernameChecker(userName);
            if (checkUsername == false) {
                #err("This username exist! Please enter another")
            } else {
                createOneProfile(caller, userName, balance, avatar);
                #ok("You have successfully created an account with Kawak");
            };
        };

        private func updateUserProfile(caller : Principal, userEntry : Types.UserEntry) : ?Types.UserEntry {
            profileHashMap.replace(caller, userEntry);
        };

        public func _updateUserProfile(caller : Principal, userEntry : Types.UserEntry) : ?Types.UserEntry {
            updateUserProfile(caller, userEntry)
        };

        public func makeUserAdmin(accountId : Principal) : () {
            let user = profileHashMap.get(accountId);
            switch(user) {
                case(null) {};
                case (?user) {
                    var makeAdmin = {
                        userName = user.userName;
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
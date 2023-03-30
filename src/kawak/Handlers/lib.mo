import Types "types";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Hash "mo:base/Hash";
import Buffer "mo:base/Buffer";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import UsersTypes "../Users/types";

module {

    public type state = Types.State;
    // var essayPK : Nat = 0;


    public class Essays(state : Types.State) {

        public type EssayEntry = Types.EssayEntry;

        public var essayPK : Nat = 0;

        var essayHashMap = HashMap.HashMap<Nat, EssayEntry>(10, Nat.equal, Hash.hash);
    
        var essays : Buffer.Buffer<EssayEntry> = Buffer.Buffer(0);

        for (essay in state.essays.vals()) {
            essays.add(essay);
        };

        public func toStable () : [EssayEntry] {
            return essays.toArray();
        };

        func makeEssay(
                id : Nat,
                aid : Principal,
                owner : Text,
                title : Text,
                topic : [Text],
                wordCount : Nat,
                reviewTimes : Nat32,
                reviewed : Bool,
                essayCost : Nat,
                submittedAt : Int,
                text : Text,
            ) : EssayEntry {
            {
                id : Nat;
                aid : Principal;
                owner : Text;
                title : Text;
                topic : [Text];
                // createdAt : Time;
                wordCount : Nat;
                reviewTimes : Nat32;
                reviewed : Bool;
                essayCost : Nat;
                submittedAt : Int;
                text : Text;
            };
        };

        private func createOneEssay(caller : Principal, id : Nat, owner : Text, title : Text, topic : [Text], wordCount : Nat, essayCost : Nat, text : Text) {
            essays.put(id, makeEssay(id, caller, owner, title, topic, wordCount, 0, false, essayCost, Time.now(), text));
        };

        public func createEssays(title : Text, caller : Principal, topic : [Text], essay_word_count : Nat, essayCost : Nat, text : Text) : Nat {
            var user = state._Users.getUser(caller);
            switch(user){
                case(null){
                };
                case(?user){
                    let username = user.userName;
                    // if(essay_word_count < 100)
                    let essay = makeEssay(essayPK, caller, username, title, topic, essay_word_count, 0, false, essayCost, Time.now(), text);
                    essayPK += 1;
                    essays.add(essay);

                };
            };
            essayPK;
        };

        public func createEssay(title : Text, topic : [Text], essay_word_count : Nat, essayCost : Nat, text : Text, caller : Principal) : Result.Result<(Nat, Text), Text> {
            var user = state._Users.getUser(caller);
            switch (user){
                case(null){};
                case(?user){
                    let username = user.userName;
                    if (essay_word_count < 100) {
                        return #err("The essay is less than 100, minimun essay should be 100")
                    };
                    if ((essayCost < user.token_balance) and (essayCost >= (essay_word_count / 100))){
                        createOneEssay(caller, essayPK, username, title, topic, essay_word_count, essayCost, text);
                        essayPK += 1;
                        var updated = state._Users.updateUserBoolTokenBalance(user, essayCost, true, essayPK);
                        var _updated = state._Users._updateUserProfile(caller, updated);
                    } else {
                        return #err("Something wrong happended, you maybe out of tokens. Contact us for advice!!! ")
                    };

                };
            };
            return #ok(essayPK, "You have successfully created an Essay!");
        };


        // public shared ({ caller }) func createEssay(title : Text, topic : Text, essay_word_count : Nat, essayCost : Nat, text : Text) : async Result.Result<Text, Text> {
        //     var user = state._Users.getUser(caller);
        //     switch (user){
        //         case (null){
        //             #err("")
        //         }; case (?user) {
        //             let userName = user.userName;
        //             if (essay_word_count < 100) {
        //                 #err("$ Oooops! Minimum number of words should be 100. # ")
        //                 // throw Error.reject("$ Oooops! Minimum number of words should be 100. # ");
        //             };
        //             if (essayCost < user.token_balance and (essayCost >= (essay_word_count / 100))) {
        //                 createOneEssay(msg.caller, currentNextId, userName, title, topic, essay_word_count, essayCost, text);
        //                 currentNextId += 1;
        //                 var updatedUser = setEssayId(user, true, currentNextId, essayCost);
        //                 var replaced = profileHashMap.replace(msg.caller, updatedUser);
    
        //             }
        //         }
        //     }
        // }




    };

    public class Drafts(state : Types.State) {

        // public type DraftEntry = Types.draftEntry;
        var _essayPK : Nat = Essays(state).essayPK;

        private var draftEntries : [(Nat, Types.DraftEntry)] = [];

        var draftHashMap : HashMap.HashMap<Nat, Types.DraftEntry> = HashMap.fromIter<Nat, Types.DraftEntry>(draftEntries.vals(), 10, Nat.equal, Hash.hash);
        
        var drafts : Buffer.Buffer<Types.DraftEntry> = Buffer.Buffer(0);

        for (draft in state.drafts.vals()) {
            drafts.add(draft)
        };

        public func toStable () : [Types.DraftEntry] {
            return drafts.toArray();
        };

        private func _draftAnEssay(id : Nat, owner : Text, title : Text, text : Text, draftedAT : Int) : Types.DraftEntry {
            {id; owner; title; text; draftedAT;}
        };

        private func createDraft(id : Nat, owner : Text, title : Text, text : Text) {
            draftHashMap.put(id, _draftAnEssay(id, owner, title, text, Time.now()));
        };

        private func updateDraft (newTitle : Text, newText : Text, userDraft : Types.DraftEntry) : Types.DraftEntry {
            {
                id = userDraft.id;
                owner = userDraft.owner;
                title   = newTitle;
                text    = newText;
                draftedAT   = Time.now();
            };
        };

        private func setDraftedEssays(user : UsersTypes.UserEntry, id : Nat) : UsersTypes.UserEntry {
            {
                userName = user.userName;
                token_balance = user.token_balance;
                avatar = user.avatar;
                userRating = user.userRating;
                myEssays = user.myEssays;
                myDrafts = Array.append(user.myDrafts, [id]);
                createdAt = user.createdAt;
                reviewingEssay = user.reviewingEssay;
                pastRatedFeedbacks = user.pastRatedFeedbacks;
                onBoarding = user.onBoarding;
                isAdmin = user.isAdmin;
            };
        };

        public func draftEssay(title : Text, text : Text, caller : Principal) :  Nat {

            var paid = false;
            var user = state._Users.getUser(caller);

            switch (user) {
                case (null) {};
                case (?user) {
                    let userName = user.userName;
                    createDraft(_essayPK, userName, title, text);
                    let updated = setDraftedEssays(user, _essayPK);
                    var _updated = state._Users._updateUserProfile(caller, updated);
                    _essayPK += 1;
                };
            };
            return _essayPK;
        };

        public func getMyDrafts(userName : Text) : ?[Types.DraftEntry] {
            do ? {
                var buffer = Buffer.Buffer<Types.DraftEntry>(0);
                for ((i, j) in draftHashMap.entries()) {
                    if (j.owner == userName) {
                        buffer.add(j);
                    };
                };
                buffer.toArray();
            };
        };

        // Get a single draft of a user using the id.
        public func getDraft(id : Nat) :  ?Types.DraftEntry {
            draftHashMap.get(id);
        };

        // Edit draft is called after the getaadrsft function is called and the parameters are passsed.
        public func editDraft(id : Nat, newTitle : Text, newText : Text) : () {
            var draft = draftHashMap.get(id);
            switch (draft) {
                case (null) {
                }; 
                case (?draft) {
                    var updatedDraft = updateDraft(newTitle, newText, draft);
                    var replaced = draftHashMap.replace(id, updatedDraft)
                };
            };
            return ();
        };

        // Deletes a draft.
        public func deleteDraft(id : Nat, caller : Principal) : () {
            var user = state._Users.getUser(caller);
            var replacementArray : [Nat] = [];

            switch (user) {
                case (null) {
                };
                case (?user) {
                    for (val in user.myDrafts.vals()) {
                        if (val == id) {
                        } else {
                            replacementArray := Array.append(replacementArray, [val]);
                        };
                    };
                    var updatedUser = {
                        userName = user.userName;
                        token_balance = user.token_balance;
                        avatar = user.avatar;
                        userRating = user.userRating;
                        myEssays = user.myEssays;
                        myDrafts = replacementArray;
                        createdAt = user.createdAt;
                        reviewingEssay = user.reviewingEssay;
                        pastRatedFeedbacks = user.pastRatedFeedbacks;
                        onBoarding = user.onBoarding;
                        isAdmin = user.isAdmin;
                    };
                    var replaced = state._Users._updateUserProfile(caller, updatedUser);
                    draftHashMap.delete(id);
                };
            };
        };

    };

    

}
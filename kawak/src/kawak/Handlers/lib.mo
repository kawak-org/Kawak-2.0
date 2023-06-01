import Types "types";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Order "mo:base/Order";
import Buffer "mo:base/Buffer";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Prim "mo:⛔";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import UsersTypes "../Users/types";
import DIP "../Dip";

module {

    public type state = Types.State;
    // var essayPK : Nat = 0;


    public class Essays(state : Types.State) {

        public type EssayEntry = Types.EssayEntry;

        public var essayPK : Nat = 0;

        var EssayHashMap = HashMap.HashMap<Nat, EssayEntry>(1, Nat.equal, Hash.hash);
        var UserEssayHashMap = HashMap.HashMap<Principal, EssayEntry>(10, Principal.equal, Principal.hash); 
    
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
            userDetails : UsersTypes.UserEntry,
            reviews : [Types.AnnotationEntry]
        ) : EssayEntry {
            {
                id : Nat;
                aid : Principal;
                owner : Text;
                title : Text;
                topic : [Text];
                //createdAt : Time;
                wordCount : Nat;
                reviewTimes : Nat32;
                reviewed : Bool;
                essayCost : Nat;
                submittedAt : Int;
                text : Text;
                userDetails;
                reviews;
            };
        };

        private func CreateOneEssay(caller : Principal, id : Nat, owner : Text, title : Text, topic : [Text], wordCount : Nat, essayCost : Nat, text : Text, userDetails : UsersTypes.UserEntry, reviews : [Types.AnnotationEntry]) {
            essays.put(id, makeEssay(id, caller, owner, title, topic, wordCount, 0, false, essayCost, Time.now(), text, userDetails, []));
        };

        private func createOneEssay(caller : Principal, id : Nat, owner : Text, title : Text, topic : [Text], wordCount : Nat, essayCost : Nat, text : Text, userDetails : UsersTypes.UserEntry) {
            EssayHashMap.put(id, makeEssay(id, caller, owner, title, topic, wordCount, 0, false, essayCost, Time.now(), text, userDetails, []));
            UserEssayHashMap.put(caller, makeEssay(id, caller, owner, title, topic, wordCount, 0, false, essayCost, Time.now(), text, userDetails, []));
        };



        // public func createEssays(title : Text, caller : Principal, topic : Text, essay_word_count : Nat, essayCost : Nat, text : Text) : Nat {
        //     var user = state._Users.getUser(caller);
        //     switch(user){
        //         case(null){
        //         };
        //         case(?user){
        //             let username = user.userName;
        //             // if(essay_word_count < 100)
        //             let essay = makeEssay(essayPK, caller, username, title, topic, essay_word_count, 0, false, essayCost, Time.now(), text);
        //             essayPK += 1;
        //             essays.add(essay);
        //         };
        //     };
        //     essayPK;
        // };

        public func createEssay(title : Text, topic : [Text], essay_word_count : Nat, essayCost : Nat, text : Text, caller : Principal) : Result.Result<(Nat, Text), Text> {
            var user = state._Users.getUser(caller);
            switch (user){
                case(null){};
                case(?user){
                    let username = user.userName;
                        createOneEssay(caller, essayPK, username, title, topic, essay_word_count, essayCost, text, user, );
                        essayPK += 1;
                        var updated = state._Users.updateUserBoolTokenBalance(user, essayCost, true, essayPK);
                        var _updated = state._Users._updateUserProfile(caller, updated);
                };
            };
            return #ok(essayPK, "You have successfully created an Essay!");
        };



        public func GetUserEssays(userName : Text) : ?[EssayEntry] {
            do ? {
                var b = Buffer.Buffer<EssayEntry>(0);
                for ((x, v) in EssayHashMap.entries()) {
                    if (v.owner == userName) {
                        b.add(v);
                    };
                };
                b.toArray();
            };
        };

        public func GetAllEssays() : ([(Nat, EssayEntry)]) {
            Iter.toArray(EssayHashMap.entries());
        };

        // public func GetAllEssays() : [Types.EssayEntry] {
        //     essays.toArray();
        // };

        public func IsEssayOwner(id : Nat, caller : Principal) : Bool {
            var decision = false;
            for (essay in essays.vals()) {
                if (essay.id == id) {
                    if ( essay.aid == caller){
                        decision := true;
                    };
                };
            };
            return decision;
        };

        // @deprecated function
        // public func GetUserEssays(userName : Text) : ?[Types.EssayEntry] {
        //     do ? {
        //         var temp = Buffer.Buffer<Types.EssayEntry>(0);
        //         for (i in essays.vals()) {
        //             if (i.owner == userName) {
        //                 temp.add(i);
        //             };
        //         };
        //         // Prim.Array_tabulate<EssayEntry>(
        //         //     essayPK,
        //         //     func(i : Nat) : EssayEntry { get i }
        //         // )
        //         temp.toArray();
        //     };
        // };

        public func GetEssay(id : Nat) : ?Types.EssayEntry {
            EssayHashMap.get(id);
        };

        public func GetFilteredEssays(topics : [Text]) : [Types.EssayEntry] {
            var filteredEssays : [Types.EssayEntry] = [];
            for ((i, j) in EssayHashMap.entries()) {
                for (topic in topics.vals()) {
                    if (j.topic == topic) {
                        filteredEssays := Array.append(filteredEssays, [j]);
                    };
                };
            };
            return filteredEssays;  
        };

        public func UpdateEssay(id : Nat, update : Types.EssayEntry) : ?Types.EssayEntry {
            EssayHashMap.replace(id, update);
        };

        // public func UpdateEssayReview(id : Nat, update)

        // public func UpdateEssay(id : Nat, title : Text, caller : Principal, owner : Text, topic : Text, wordCount : Nat, reviewTimes : Nat32, reviewed : Bool, essayCost : Nat, submittedAt : Int, text : Text) : () {
        //     let status = IsEssayOwner(id, caller);
        //     if (status == true){             
        //         let update = makeEssay(id, caller, owner, title, topic, wordCount, reviewTimes, reviewed, essayCost, submittedAt, text);
        //         essays.put(id, update);
        //     };
        // };

        public func DeleteEssay(id : Nat, caller : Principal) : Result.Result<Text, Text> {
            if (IsEssayOwner(id, caller) == false){
                return #err("You are not the owner of this essay")
            };
            let newEssays = Array.filter(
                essays.toArray(),
                func ( a : Types.EssayEntry) : Bool {
                    a != GetEssay(id);
                },
            );
            essays.clear();
            for (essay in newEssays.vals()) {
                essays.add(essay)
            };
            return #ok("You have successfully deleted the essay")
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

    public class Annotations(state : Types.State) {
        public type AnnotationEntry = Types.AnnotationEntry;

        var AnnotationHashMap = HashMap.HashMap<Nat, AnnotationEntry>(1, Nat.equal, Hash.hash);
        var annotations : Buffer.Buffer<AnnotationEntry> = Buffer.Buffer(0);

        for (annotation in state.annotations.vals()) {
            annotations.add(annotation)
        };

        public func toStable() : [AnnotationEntry] {
            return annotations.toArray();
        };

        // public func make 

        public func AddAnnotation(id : Nat, caller : Principal, comments : Text, quote : Text) : () {
            var user = state._Users.getUser(caller);
            switch (user) {
                case(null) {
                };
                case (?user) {
                    var reviewUpdate = {
                        id = id;
                        user = caller;
                        comments = comments;
                        quote = quote;
                        rated = false;
                    };
                    AnnotationHashMap.put(id, reviewUpdate);
                    var essay = Essays(state).GetEssay(id);
                    switch(essay) {
                        case(null){
                        };
                        case (?essay) {
                            var update = {
                                id = essay.id;
                                aid = essay.aid;
                                owner = essay.owner;
                                title = essay.title;
                                topic = [essay.title];
                                wordCount = essay.wordCount;
                                //createdAt : Time;
                                reviewTimes = essay.reviewTimes + 1;
                                reviewed = true;
                                essayCost = essay.essayCost;
                                submittedAt = essay.submittedAt;
                                text = essay.text;
                                userDetails = essay.userDetails;
                                reviews = Array.append(essay.reviews, [reviewUpdate]);
                            };
                            var updated = Essays(state).UpdateEssay(id, update);
                        };
                    };
                };
            }

        };

        public func GetAnnotations(id : Nat) : ?AnnotationEntry {
            var hahs = AnnotationHashMap.get(id);

            switch (hahs) {
                case (null) {
                    return null;
                };
                case (?hahs) {
                    return ?hahs;
                };
            };
        };

        public func GetAnnotator(id : Nat) : ?Principal{
            var annotator = AnnotationHashMap.get(id);
            switch(annotator){
                case(null){null};
                case(?annotator){
                    ?annotator.user;
                };
            };
        };

        public func AddRating(id : Nat, rating : Nat, caller : Principal) : ?() {
            var annotator = AnnotationHashMap.get(id);
            switch(annotator){
                case(null){
                    null;
                };case (?annotator){
                    var user = state._Users.getUser(annotator.user);
                    switch(user){
                        case(null){
                            null;
                        }; case(?user){
                            var updatedArray = Array.append(user.pastRatedFeedbacks, [rating]);
                            var i = 0;
                            var iterator = 0;
                            for (x in updatedArray.vals()) {
                                iterator := iterator + 1;
                                i := i + x; 
                            };
                            var annotatorUpdate = {
                                userName = user.userName;
                                role = user.role;
                                token_balance = user.token_balance;
                                avatar = user.avatar;
                                userRating = Nat.div(i, iterator);
                                myEssays = user.myEssays;
                                myDrafts = user.myDrafts;
                                createdAt = user.createdAt;
                                reviewingEssay = user.reviewingEssay;
                                pastRatedFeedbacks = user.pastRatedFeedbacks;
                                onBoarding = user.onBoarding;
                                isAdmin =user.isAdmin;
                            };
                            // var userEssayDetails  = Essays(state).UpdateEssay(id, replace);
                            var userEssayDetails = Essays(state).GetEssay(id);
                            switch(userEssayDetails){
                                case(null){null};
                                case(?userEssayDetails) {
                                    do ? {
                                        var cost = userEssayDetails.essayCost;
                                        var annotatorPrincipal = GetAnnotator(id)!;
                                        var _annotation = state._Users.getUser(annotatorPrincipal)!;
                                        var _annotatorUpdate = {
                                            userName = _annotation.userName;
                                            role = _annotation.role;
                                            token_balance = _annotation.token_balance + cost;
                                            avatar= _annotation.avatar;
                                            userRating = _annotation.userRating;
                                            myEssays = _annotation.myEssays;
                                            myDrafts = _annotation.myDrafts;
                                            createdAt = _annotation.createdAt;
                                            reviewingEssay = _annotation.reviewingEssay;
                                            pastRatedFeedbacks = _annotation.pastRatedFeedbacks;
                                            onBoarding = _annotation.onBoarding;
                                            isAdmin = _annotation.isAdmin;
                                        };
                                        var replaced = state._Users._updateUserProfile(annotator.user, annotatorUpdate);
                                        var __replaced = state._Users._updateUserProfile(annotatorPrincipal, _annotatorUpdate);
                                        var transfer = state._Brew_DIP20.transfer(caller, annotatorPrincipal, cost);

                                        var annotated = AnnotationHashMap.get(id);
                                        switch(annotated){
                                            case(null){
                                               return null
                                            }; case (?annotated) {
                                                var update = {
                                                    id = annotated.id;
                                                    user = annotated.user;
                                                    comments = annotated.comments;
                                                    quote = annotated.quote;
                                                    rated = true;
                                                };
                                                var updated = AnnotationHashMap.replace(id, update);
                                            };
                                        }



                                    };
                                };
                            };

                        };
                    };
                };
            };
        };





    };

    // public func AddRating

    public class Drafts(state : Types.State) {

        // public type DraftEntry = Types.draftEntry;
        var _essayPK : Nat = Essays(state).essayPK;

        private var draftEntries : [(Nat, Types.DraftEntry)] = [];

        var DraftHashMap : HashMap.HashMap<Nat, Types.DraftEntry> = HashMap.fromIter<Nat, Types.DraftEntry>(draftEntries.vals(), 1, Nat.equal, Hash.hash);
        
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
            DraftHashMap.put(id, _draftAnEssay(id, owner, title, text, Time.now()));
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
                role = user.role;
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
                for ((i, j) in DraftHashMap.entries()) {
                    if (j.owner == userName) {
                        buffer.add(j);
                    };
                };
                buffer.toArray();
            };
        };

        // Get a single draft of a user using the id.
        public func getDraft(id : Nat) :  ?Types.DraftEntry {
            DraftHashMap.get(id);
        };

        // Edit draft is called after the getaadrsft function is called and the parameters are passsed.
        public func editDraft(id : Nat, newTitle : Text, newText : Text) : () {
            var draft = DraftHashMap.get(id);
            switch (draft) {
                case (null) {
                }; 
                case (?draft) {
                    var updatedDraft = updateDraft(newTitle, newText, draft);
                    var replaced = DraftHashMap.replace(id, updatedDraft)
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
                        role = user.role;
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
                    DraftHashMap.delete(id);
                };
            };
        };

    };

    

}
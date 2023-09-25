import Types "types";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Order "mo:base/Order";
import Buffer "mo:base/Buffer";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import TrieMap "mo:base/TrieMap";
import Float "mo:base/Float";
// import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Int64 "mo:base/Int64";
import Prim "mo:⛔";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import UsersTypes "../Users/types";
import DIP "../Dip";

module {

    // public type state = Types.State;
    // var essayPK : Nat = 0;

    public class Essays(state : Types.State) {

        public type EssayEntry = Types.EssayEntry;

        public var essayPK : Nat = 0;
        public var annotationPK : Nat = 0;

        var EssayEntries : [(Nat, EssayEntry)] = [];
        var UserEssayEntries : [(Principal, EssayEntry)] = [];
        var ReviewStatusEntries : [(Nat, Types.ReviewStatus)] = [];
        var Rated : [(Nat, Types.Rated)] = [];

        var EssayHashMap : HashMap.HashMap<Nat, EssayEntry> = HashMap.fromIter<Nat, EssayEntry>(EssayEntries.vals(), 1, Nat.equal, Hash.hash);
        var UserEssayHashMap : HashMap.HashMap<Principal, EssayEntry> = HashMap.fromIter<Principal, EssayEntry>(UserEssayEntries.vals(), 10, Principal.equal, Principal.hash);
        var ReviewStatusHash : HashMap.HashMap<Nat, Types.ReviewStatus> = HashMap.fromIter<Nat, Types.ReviewStatus>(ReviewStatusEntries.vals(), 1, Nat.equal, Hash.hash);
        var RatingMap : TrieMap.TrieMap<Nat, Types.Rated> = TrieMap.fromEntries<Nat, Types.Rated>(Rated.vals(), Nat.equal, Hash.hash);
        

        var essays : Buffer.Buffer<EssayEntry> = Buffer.Buffer(0);

        var Rstatus : Buffer.Buffer<Types.ReviewStatus> = Buffer.Buffer(0);

        func makeReview(essayID : Nat, status : Bool) : Types.ReviewStatus {
            {
                essayID;
                status;
            };
        };

        // for ((i, j) in state.EssayEntries.vals()){
        //     ReviewStatusHash.put(i, makeReview(j.id, true))
        // };

        public func updateReviewStatus(id : Nat, bool : Bool) {
            var rev = ReviewStatusHash.get(id);
            switch (rev) {
                case (null) {};
                case (?rev) {
                    var replaced = ReviewStatusHash.replace(id, makeReview(id, bool));
                };
            };
        };

        // for (essay in state.essays.vals()) {
        //     essays.add(essay);
        // };

        public func toStable() : Types.EssayLocalStableState {

            EssayEntries := Iter.toArray(EssayHashMap.entries());
            UserEssayEntries := Iter.toArray(UserEssayHashMap.entries());
            essayPK := essayPK;
            return {
                EssayEntries;
                UserEssayEntries;
                essayPK;
            };
        };

        public func postStable(_essayEntries : [(Nat, EssayEntry)], _userEssayEntries : [(Principal, EssayEntry)], _essayPK : Nat) {
            EssayHashMap := HashMap.fromIter<Nat, EssayEntry>(_essayEntries.vals(), 10, Nat.equal, Hash.hash);
            UserEssayHashMap := HashMap.fromIter<Principal, EssayEntry>(_userEssayEntries.vals(), 10, Principal.equal, Principal.hash);
            essayPK := _essayPK;
        };

        // Restore local state from backup.
        public func _restore(backup : Types.EssayLocalStableState) : () {
            EssayEntries := backup.EssayEntries;
            UserEssayEntries := backup.UserEssayEntries;
            essayPK := backup.essayPK;
        };

        // Restore essay local state init.
        _restore(state);

        func makeEssay(
            id : Nat,
            aid : Principal,
            owner : Text,
            title : Text,
            topic : [Text],
            wordCount : Nat,
            reviewTimes : Nat32,
            reviewed : Bool,
            rated : Bool,
            essayCost : Nat,
            submittedAt : Int,
            text : Text,
            userDetails : UsersTypes.UserEntry,
            reviews : [Types.AnnotationEntry],
            _public : Bool,
            description : Text,
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
                rated : Bool;
                essayCost : Nat;
                submittedAt : Int;
                text : Text;
                userDetails;
                reviews;
                _public;
                description;
            };
        };

        private func CreateOneEssay(caller : Principal, id : Nat, owner : Text, title : Text, topic : [Text], wordCount : Nat, essayCost : Nat, text : Text, userDetails : UsersTypes.UserEntry, reviews : [Types.AnnotationEntry], _public : Bool, description : Text) {
            essays.put(id, makeEssay(id, caller, owner, title, topic, wordCount, 0, false, false, essayCost, Time.now(), text, userDetails, [], _public, description));
        };

        private func createOneEssay(caller : Principal, id : Nat, owner : Text, title : Text, topic : [Text], wordCount : Nat, essayCost : Nat, text : Text, userDetails : UsersTypes.UserEntry, _public : Bool, description : Text) {
            EssayHashMap.put(id, makeEssay(id, caller, owner, title, topic, wordCount, 0, false, false, essayCost, Time.now(), text, userDetails, [], _public, description));
            UserEssayHashMap.put(caller, makeEssay(id, caller, owner, title, topic, wordCount, 0, false, false, essayCost, Time.now(), text, userDetails, [], _public, description));
        };

        public func setReviewStatus(essayID : Nat, status : Bool) {
            var essay = GetEssay(essayID);
            var reviewStatus : Types.ReviewStatus = {
                essayID;
                essay;
                status;
            };
            ReviewStatusHash.put(essayID, reviewStatus);
        };

        public func getReviewStatus(essayID : Nat) : ?Types.ReviewStatus {
            ReviewStatusHash.get(essayID);
        };

        public func getAllReviewStatus() : [(Nat, Types.ReviewStatus)] {
            Iter.toArray(ReviewStatusHash.entries());
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

        public func createEssay(title : Text, topic : [Text], essay_word_count : Nat, essayCost : Nat, text : Text, caller : Principal, description : Text, _public : Bool) : Result.Result<(Nat, Text), Text> {
            var user = state._Users.getUser(caller);
            switch (user) {
                case (null) {};
                case (?user) {
                    let username = user.userName;
                    createOneEssay(caller, essayPK, username, title, topic, essay_word_count, essayCost, text, user, _public, description);
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

        

        // public func getAnnotationID() : Nat{
        //     annotationPK;
        // };

        // Get all the essays in the forge
        public func GetAllEssays() : [EssayEntry] {
            var buffer = Buffer.Buffer<EssayEntry>(0);
            for ((i, j) in EssayHashMap.entries()) {
                if (j._public == true) {
                    buffer.add(j);
                };
            };
            buffer.toArray();
        };

        public func GetPageEssay(page : Nat) : [EssayEntry] {
            var buffer = Buffer.Buffer<EssayEntry>(0);
            var chunk = Buffer.Buffer<EssayEntry>(0);
            var temp_pk = 0;
            var TemporaryHash = HashMap.HashMap<Nat, EssayEntry>(10, Nat.equal, Hash.hash);
            for ((i, j) in EssayHashMap.entries()) {
                if (j._public == true) {
                    buffer.add(j);
                    TemporaryHash.put(temp_pk, j);
                    temp_pk += 1;
                };
            };
            // var TemporaryHash = HashMap.HashMap<Nat, EssayEntry>(5, Nat.equal, Hash.hash);
            var init : Nat = ((page * 8) - 8);
            var dest : Nat = (page * 8);
            for ((pk, payload) in TemporaryHash.entries()) {
                if ((init <= pk) and pk < dest) {
                    chunk.add(payload);
                };
            };
            // while (init < dest){
            //     if (buffer.toArray()[init] )
            //     chunk.add(buffer.toArray()[init]);
            //     init += 1;
            // };
            return chunk.toArray();
            // for (vals in Iter.range(mutable[((page * 8) - 8)])){
            //     // if (vals in )
            //     // for ( )
            //     chunks.add(mutable[])
            //     // if ((((page * 8) - 8) <= mutable[8]) and (vals.id < (page * 8))){
            //     //     chunk.add(vals);
            //     // };
            // };
            // return  chunk.toArray();
        };

        // @deprecated
        // public func GetAllEssays_() : [Types.EssayEntry] {
        //     // EssayHashMap.entries().toArray();
        // };

        public func IsEssayOwner(id : Nat, caller : Principal) : Bool {
            var decision = false;
            for (essay in essays.vals()) {
                if (essay.id == id) {
                    if (essay.aid == caller) {
                        decision := true;
                    };
                };
            };
            return decision;
        };

        public func updatePastRating(essayID : Nat, reviewID : Nat, rating : Nat) {
            var annotation = GetAnnotation(essayID);
            for (vals in Iter.fromArray(annotation)) {
                if (vals.id == reviewID) {
                    var user = state._Users.getUser(vals.user);
                    switch (user) {
                        case (null) {};
                        case (?user) {
                            var updatedArray = Array.append(user.pastRatedFeedbacks, [rating]);
                            var i = 0;
                            var iterator = 0;
                            for (j in updatedArray.vals()) {
                                iterator := iterator + 1;
                                i := i + j;
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
                                isAdmin = user.isAdmin;
                            };
                            var replaced = state._Users._updateUserProfile(vals.user, annotatorUpdate);
                        };
                    };
                };
            };
        };

        public func UpdateReview(essayID : Nat, review : [Types.AnnotationEntry]) : () {
            var essay = EssayHashMap.get(essayID);
            switch (essay) {
                case (null) {};
                case (?essay) {
                    var update = {
                        id = essay.id;
                        aid = essay.aid;
                        owner = essay.owner;
                        title = essay.title;
                        topic = essay.topic;
                        wordCount = essay.wordCount;
                        //createdAt : Time;
                        reviewTimes = essay.reviewTimes;
                        reviewed = essay.reviewed;
                        rated = essay.rated;
                        essayCost = essay.essayCost;
                        submittedAt = essay.submittedAt;
                        text = essay.text;
                        userDetails = essay.userDetails;
                        reviews = review;
                        _public = essay._public;
                        description = essay.description;
                    };
                    var updated = UpdateEssay(essayID, update);
                };
            };
        };

        private func updateRating(bool : Bool, essayID : Nat, reviewID : Nat) : () {
            var annotation = GetAnnotation(essayID);
            for (vals in Iter.fromArray(annotation)) {
                if (vals.id == reviewID) {
                    var uptReview = {
                        id = vals.id;
                        essayID = vals.essayID;
                        user = vals.user;
                        comments = vals.comments;
                        quote = vals.quote;
                        rated = bool;
                    };
                    var thawed = Array.thaw<Types.AnnotationEntry>(annotation);
                    thawed[reviewID] := uptReview;
                    var frozen = Array.freeze<Types.AnnotationEntry>(thawed);
                    UpdateReview(essayID, frozen);
                    // vals.rated := true;
                };
            };
        };

        public func getAnnotatorPrincipal(essayID : Nat, reviewID : Nat) : ?Principal {
            var annotation = GetAnnotation(essayID);
            var user : ?Principal = null;
            for (vals in Iter.fromArray(annotation)) {
                if (vals.id == reviewID) {
                    user := ?vals.user;
                };
            };
            return user;
        };

        public func UpdateRate(essayID : Nat) {
            var essay = EssayHashMap.get(essayID);
            switch (essay) {
                case (null) {};
                case (?essay) {
                    var update = {
                        id = essay.id;
                        aid = essay.aid;
                        owner = essay.owner;
                        title = essay.title;
                        topic = essay.topic;
                        wordCount = essay.wordCount;
                        //createdAt : Time;
                        reviewTimes = essay.reviewTimes;
                        reviewed = essay.reviewed;
                        rated = true;
                        essayCost = essay.essayCost;
                        submittedAt = essay.submittedAt;
                        text = essay.text;
                        userDetails = essay.userDetails;
                        reviews = essay.reviews;
                        _public = essay._public;
                        description = essay.description;
                    };
                    var updated = UpdateEssay(essayID, update);
                };
            };
        };

        private func actualCost(rating : Nat, cost : Nat) : async  Nat {
            var rating_ = Float.fromInt64(Int64.fromNat64(Nat64.fromNat(rating)));
            var cost_ = Float.fromInt64(Int64.fromNat64(Nat64.fromNat(cost)));
            return Nat64.toNat(Int64.toNat64(Float.toInt64(Float.nearest((rating_ / 5) * cost_))));

};

        public func Rate(essayID : Nat, reviewID : Nat, rating : Nat, aid : Principal) : async ?() {
            var essay = GetEssay(essayID);
            // var annotation = GetAnnotation(essayID);
            // var unknown = updatePastRating(essayID, reviewID, rating);
            switch (essay) {
                case (null) { null };
                case (?essay) {
                    do ? {
                        var cost = essay.essayCost;
                        var annotatorPrincipal = getAnnotatorPrincipal(essayID, reviewID)!;
                        var _annotation = state._Users.getUser(annotatorPrincipal)!;
                        var cost_ = await actualCost(rating, cost);
                        var remainder : Nat = cost - cost_;
                        // var actual_cost = ((rating/5) * cost);
                        var _annotatorUpdate = {
                            userName = _annotation.userName;
                            role = _annotation.role;
                            token_balance = _annotation.token_balance + cost_;
                            avatar = _annotation.avatar;
                            userRating = _annotation.userRating;
                            myEssays = _annotation.myEssays;
                            myDrafts = _annotation.myDrafts;
                            createdAt = _annotation.createdAt;
                            reviewingEssay = _annotation.reviewingEssay;
                            pastRatedFeedbacks = _annotation.pastRatedFeedbacks;
                            //Array.append(_annotation.pastRatedFeedbacks, [rating]);
                            onBoarding = _annotation.onBoarding;
                            isAdmin = _annotation.isAdmin;
                        };
                        var replaced = state._Users._updateUserProfile(annotatorPrincipal, _annotatorUpdate);
                        var transfer = await state._Brew_DIP20.transfer(aid, annotatorPrincipal, cost);
                        if (remainder != 0){
                          var finalize = await state._Brew_DIP20.burn(remainder, aid);
                        };
                        UpdateRate(essayID);
                        
                        // updateRating(true, essayID, reviewID);
                    };
                };
                // var annotation = GetAnnotation(essayID);
            };
        };

        // @deprecated function
        // public func GetUserEssays(userName : Text) : ?[Types.EssayEntry] {
        //     do ? {
        //         var temp = Buffer.Buffer<Types.EssayEntry>(0);f
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

        // returns an essay of the id
        public func GetEssay(id : Nat) : ?Types.EssayEntry {
            EssayHashMap.get(id);
        };

        public func EssayAnnotate(caller : Principal, essayID : Nat, comments : Text, quote : Text) : () {
            var user = state._Users.getUser(caller);
            switch (user) {
                case (null) {};
                case (?user) {
                    var reviewUpdate = {
                        id = annotationPK;
                        essayID = essayID;
                        user = caller;
                        comments = comments;
                        quote = quote;
                        rated = false;
                    };
                    annotationPK += 1;
                    var essay = GetEssay(essayID);
                    switch (essay) {
                        case (null) {};
                        case (?essay) {
                            var update = {
                                id = essayID;
                                aid = essay.aid;
                                owner = essay.owner;
                                title = essay.title;
                                topic = essay.topic;
                                wordCount = essay.wordCount;
                                //createdAt : Time;
                                reviewTimes = essay.reviewTimes + 1;
                                reviewed = true;
                                rated = essay.rated;
                                essayCost = essay.essayCost;
                                submittedAt = essay.submittedAt;
                                text = essay.text;
                                userDetails = essay.userDetails;
                                reviews = Array.append(essay.reviews, [reviewUpdate]);
                                _public = essay._public;
                                description = essay.description;
                            };
                            var updated = EssayHashMap.replace(essayID, update);
                        };
                    };
                };
            };
        };

        public func GetAnnotation(id : Nat) : [Types.AnnotationEntry] {
            var tempAnnotation : [Types.AnnotationEntry] = [];
            for ((i, j) in EssayHashMap.entries()) {
                if (i == id) {
                    tempAnnotation := Array.append(tempAnnotation, j.reviews);
                    
                };
            };
            return tempAnnotation;
        };

        // public func GetAnnotation2(reviewID : Nat) : Types.AnnotationEnt

        // filter function to search for essay
        public func GetFilteredEssays(topics : [Text]) : [Types.EssayEntry] {
            var filteredEssays : [Types.EssayEntry] = []; //Temporay array that returns the filtered array

            for ((i, j) in EssayHashMap.entries()) {
                for (topic in topics.vals()) {
                    // Iterates through the topics argument
                    for (_topic in j.topic.vals()) {
                        if (_topic == topic) {
                            filteredEssays := Array.append(filteredEssays, [j]);
                        };
                    };
                    // if (j.topic == topics) {
                    //     filteredEssays := Array.append(filteredEssays, [j]);
                    // };
                };
            };
            return filteredEssays;
        };

        public func deleteReview(essayId : Nat) : () {
            var essay = EssayHashMap.get(essayId);
            switch (essay) {
                case (null) {};
                case (?essay) {
                    var update = {
                        id = essay.id;
                        aid = essay.aid;
                        owner = essay.owner;
                        title = essay.title;
                        topic = essay.topic;
                        wordCount = essay.wordCount;
                        //createdAt : Time;
                        reviewTimes : Nat32 = 0;
                        reviewed = false;
                        rated = essay.rated;
                        essayCost = essay.essayCost;
                        submittedAt = essay.submittedAt;
                        text = essay.text;
                        userDetails = essay.userDetails;
                        reviews = [];
                        _public = essay._public;
                        description = essay.description;
                    };
                    var updated = UpdateEssay(essayId, update);
                };
            };
        };

        // temp independent func
        public func UpdateEssay(id : Nat, update : Types.EssayEntry) : ?Types.EssayEntry {
            EssayHashMap.replace(id, update);
        };

        // public func checkStatus(id : Nat) : Bool {
        //     var essay = EssayHashMap.get(id);
        //     switch(essay){
        //         case(null){
        //             false;
        //         };
        //         case(?essay){

        //         }
        //     }
        // };

        public func UpdatePublicStatus(pub : Bool, id : Nat) : () {
            var essay = EssayHashMap.get(id);
            switch (essay) {
                case (null) {};
                case (?essay) {
                    var update = {
                        id = essay.id;
                        aid = essay.aid;
                        owner = essay.owner;
                        title = essay.title;
                        topic = essay.topic;
                        wordCount = essay.wordCount;
                        //createdAt : Time;
                        reviewTimes = essay.reviewTimes;
                        reviewed = essay.reviewed;
                        rated = essay.rated;
                        essayCost = essay.essayCost;
                        submittedAt = essay.submittedAt;
                        text = essay.text;
                        userDetails = essay.userDetails;
                        reviews = essay.reviews;
                        _public = pub;
                        description = essay.description;
                    };
                    var updated = UpdateEssay(id, update);
                };
            };
        };

        public func UpdateDescription(desc : Text, id : Nat) : () {
            var essay = EssayHashMap.get(id);
            switch (essay) {
                case (null) {};
                case (?essay) {
                    var update = {
                        id = essay.id;
                        aid = essay.aid;
                        owner = essay.owner;
                        title = essay.title;
                        topic = [essay.title];
                        wordCount = essay.wordCount;
                        //createdAt : Time;
                        reviewTimes = essay.reviewTimes;
                        reviewed = essay.reviewed;
                        rated = essay.rated;
                        essayCost = essay.essayCost;
                        submittedAt = essay.submittedAt;
                        text = essay.text;
                        userDetails = essay.userDetails;
                        reviews = essay.reviews;
                        _public = essay._public;
                        description = desc;
                    };
                    var updated = UpdateEssay(id, update);
                };
            };
        };

        // public func UpdateEssayReview(id : Nat, update)

        // public func UpdateEssay(id : Nat, title : Text, caller : Principal, owner : Text, topic : Text, wordCount : Nat, reviewTimes : Nat32, reviewed : Bool, essayCost : Nat, submittedAt : Int, text : Text) : () {
        //     let status = IsEssayOwner(id, caller);
        //     if (status == true){
        //         let update = makeEssay(id, caller, owner, title, topic, wordCount, reviewTimes, reviewed, essayCost, submittedAt, text);
        //         essays.put(id, update);
        //     };
        // };

        //  @Deprecated Function
        public func DeleteEssay(id : Nat, caller : Principal) : Result.Result<Text, Text> {
            if (IsEssayOwner(id, caller) == false) {
                return #err("You are not the owner of this essay");
            };
            let newEssays = Array.filter(
                essays.toArray(),
                func(a : Types.EssayEntry) : Bool {
                    ?a != GetEssay(id);
                },
            );
            essays.clear();
            for (essay in newEssays.vals()) {
                essays.add(essay);
            };
            return #ok("You have successfully deleted the essay");
        };

        public func deleteEssay(id : Nat, caller : Principal) : () {
            var user = state._Users.getUser(caller);
            var essay = GetAllEssays();
            var tempoRary : [Nat] = [];
            switch (user) {
                case (null) {};
                case (?user) {
                    for (val in user.myEssays.vals()) {
                        if ((val == id)) {} else {
                            tempoRary := Array.append(tempoRary, [val]);
                        };
                    };
                    var updateUser = {
                        userName = user.userName;
                        role = user.role;
                        token_balance = user.token_balance;
                        avatar = user.avatar;
                        userRating = user.userRating;
                        myEssays = tempoRary;
                        myDrafts = user.myDrafts;
                        createdAt = user.createdAt;
                        reviewingEssay = user.reviewingEssay;
                        pastRatedFeedbacks = user.pastRatedFeedbacks;
                        onBoarding = user.onBoarding;
                        isAdmin = user.isAdmin;
                    };
                    var replaced = state._Users._updateUserProfile(caller, updateUser);
                    EssayHashMap.delete(id);

                };
            };
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

        var AnnotationEntries : [(Nat, AnnotationEntry)] = [];

        var AnnotationHashMap : HashMap.HashMap<Nat, AnnotationEntry> = HashMap.fromIter(AnnotationEntries.vals(), 1, Nat.equal, Hash.hash);
        var annotations : Buffer.Buffer<AnnotationEntry> = Buffer.Buffer(0);

        public var annotationPK : Nat = 0;

        // for (annotation in state.annotations.vals()) {
        //     annotations.add(annotation)
        // };

        public func toStable() : Types.AnnotationsLocalStableState {
            AnnotationEntries := Iter.toArray(AnnotationHashMap.entries());
            {
                AnnotationEntries;
            };
        };

        public func postStable(_annotationEntries : [(Nat, AnnotationEntry)]) {
            AnnotationHashMap := HashMap.fromIter<Nat, AnnotationEntry>(_annotationEntries.vals(), 10, Nat.equal, Hash.hash);

        };

        public func _restore(backup : Types.AnnotationsLocalStableState) : () {
            AnnotationEntries := backup.AnnotationEntries;
        };

        _restore(state);

        // @deprecated function
        public func AddAnnotation(id : Nat, caller : Principal, comments : Text, quote : Text) : () {
            var user = state._Users.getUser(caller);
            switch (user) {
                case (null) {};
                case (?user) {
                    // var current =
                    var reviewUpdate = {
                        id = annotationPK;
                        essayID = id;
                        user = caller;
                        comments = comments;
                        quote = quote;
                        rated = false;
                    };
                    AnnotationHashMap.put(id, reviewUpdate);
                    // var essay = Essays(state).GetEssay(id);
                    // switch(essay) {
                    //     case(null){
                    //     };
                    //     case (?essay) {
                    //         var update = {
                    //             id = essay.id;
                    //             aid = essay.aid;
                    //             owner = essay.owner;
                    //             title = essay.title;
                    //             topic = [essay.title];
                    //             wordCount = essay.wordCount;
                    //             //createdAt : Time;
                    //             reviewTimes = essay.reviewTimes + 1;
                    //             reviewed = true;
                    //             essayCost = essay.essayCost;
                    //             submittedAt = essay.submittedAt;
                    //             text = essay.text;
                    //             userDetails = essay.userDetails;
                    //             reviews = Array.append(essay.reviews, [reviewUpdate]);
                    //             _public = essay._public;
                    //             description = essay.description;
                    //         };
                    //         var updated = Essays(state).UpdateEssay(id, update);
                    //     };
                    // };
                };
            };

        };

        public func UpdateAnnoatation(updated : AnnotationEntry, id : Nat) : ?AnnotationEntry {
            AnnotationHashMap.replace(id, updated);
        };

        public func GetAnnotations(annotationPK : Nat) : ?AnnotationEntry {
            var hahs = AnnotationHashMap.get(annotationPK);

            switch (hahs) {
                case (null) {
                    return null;
                };
                case (?hahs) {
                    return ?hahs;
                };
            };
        };

        public func GetAnnotation_EssayID(id : Nat) : [AnnotationEntry] {
            var buffer = Buffer.Buffer<AnnotationEntry>(0);
            for ((i, j) in AnnotationHashMap.entries()) {
                if (j.essayID == id) {
                    buffer.add(j);
                };
            };
            buffer.toArray();
        };

        public func GetAnnotator(id : Nat) : ?Principal {
            var annotator = AnnotationHashMap.get(id);
            switch (annotator) {
                case (null) { null };
                case (?annotator) {
                    ?annotator.user;
                };
            };
        };

        // @deprecated function
        public func AddRating(id : Nat, rating : Nat, caller : Principal) : async ?() {
            var annotator = AnnotationHashMap.get(id);
            switch (annotator) {
                case (null) {
                    null;
                };
                case (?annotator) {
                    var user = state._Users.getUser(annotator.user);
                    switch (user) {
                        case (null) {
                            null;
                        };
                        case (?user) {
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
                                isAdmin = user.isAdmin;
                            };
                            // var userEssayDetails  = Essays(state).UpdateEssay(id, replace);
                            var userEssayDetails = Essays(state).GetEssay(id);
                            switch (userEssayDetails) {
                                case (null) { null };
                                case (?userEssayDetails) {
                                    do ? {
                                        var cost = userEssayDetails.essayCost;
                                        var annotatorPrincipal = GetAnnotator(id)!;
                                        var _annotation = state._Users.getUser(annotatorPrincipal)!;
                                        var _annotatorUpdate = {
                                            userName = _annotation.userName;
                                            role = _annotation.role;
                                            token_balance = _annotation.token_balance + cost;
                                            avatar = _annotation.avatar;
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
                                        var transfer = await state._Brew_DIP20.transfer(caller, annotatorPrincipal, cost);

                                        var annotated = AnnotationHashMap.get(id);
                                        switch (annotated) {
                                            case (null) {
                                                return null;
                                            };
                                            case (?annotated) {
                                                var update = {
                                                    id = annotated.id;
                                                    essayID = annotated.essayID;
                                                    user = annotated.user;
                                                    comments = annotated.comments;
                                                    quote = annotated.quote;
                                                    rated = true;
                                                };
                                                var updated = AnnotationHashMap.replace(id, update);
                                            };
                                        };

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

        public func postStable(_draftEntries : [(Nat, Types.DraftEntry)]) {
            DraftHashMap := HashMap.fromIter<Nat, Types.DraftEntry>(_draftEntries.vals(), 10, Nat.equal, Hash.hash);

        };

        public func toStable() : Types.DraftsLocalStableState {
            draftEntries := Iter.toArray(DraftHashMap.entries());
            {
                draftEntries;
            };
        };

        public func _restore(backup : Types.DraftsLocalStableState) : () {
            draftEntries := backup.draftEntries;
        };

        // Restore local state init
        _restore(state);

        private func _draftAnEssay(id : Nat, owner : Text, title : Text, text : Text, draftedAT : Int) : Types.DraftEntry {
            { id; owner; title; text; draftedAT };
        };

        private func createDraft(id : Nat, owner : Text, title : Text, text : Text) {
            DraftHashMap.put(id, _draftAnEssay(id, owner, title, text, Time.now()));
        };

        private func updateDraft(newTitle : Text, newText : Text, userDraft : Types.DraftEntry) : Types.DraftEntry {
            {
                id = userDraft.id;
                owner = userDraft.owner;
                title = newTitle;
                text = newText;
                draftedAT = Time.now();
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

        public func draftEssay(title : Text, text : Text, caller : Principal) : Nat {

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
        public func getDraft(id : Nat) : ?Types.DraftEntry {
            DraftHashMap.get(id);
        };

        // Edit draft is called after the getaadrsft function is called and the parameters are passsed.
        public func editDraft(id : Nat, newTitle : Text, newText : Text) : () {
            var draft = DraftHashMap.get(id);
            switch (draft) {
                case (null) {};
                case (?draft) {
                    var updatedDraft = updateDraft(newTitle, newText, draft);
                    var replaced = DraftHashMap.replace(id, updatedDraft);
                };
            };
            return ();
        };

        // Deletes a draft.
        public func deleteDraft(id : Nat, caller : Principal) : () {
            var user = state._Users.getUser(caller);
            var replacementArray : [Nat] = [];

            switch (user) {
                case (null) {};
                case (?user) {
                    for (val in user.myDrafts.vals()) {
                        if (val == id) {} else {
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

};

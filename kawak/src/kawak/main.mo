import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Cycles "mo:base/ExperimentalCycles";
import Error "mo:base/Error";
import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Int64 "mo:base/Int64";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

import Admins "Admins";
import AdminsTypes "Admins/types";
import Dip "Dip";
import DipTypes "Dip/types";
import Handlers "Handlers";
import HandlersTypes "Handlers/types";
import Marketplace "Marketplace";
import MarketplaceTypes "Marketplace/types";
import Types "Types";
import Users "Users";
import UsersTypes "Users/types";

shared (msg) actor class Kawak(
  caller : Principal
) {

  private stable var stableAdmins : [Principal] = [];
  private stable var stableEssays : [HandlersTypes.EssayEntry] = [];
  private stable var stableDraftsEntries : [(Nat, HandlersTypes.DraftEntry)] = [];
  private stable var stableEssayEntries : [(Nat, HandlersTypes.EssayEntry)] = [];
  private stable var stableUserEssayEntries : [(Principal, HandlersTypes.EssayEntry)] = [];
  private stable var stableProfileEntries : [(Principal, UsersTypes.UserEntry)] = [];
  private stable var stableEssayPK : Nat = 0;
  private stable var stableAnnotationEntries : [(Nat, HandlersTypes.AnnotationEntry)] = [];
  private stable var stableLedger : [DipTypes.TokenMetadata] = [];
  private stable var stableBalanceEntries : [(Principal, Nat)] = [];
  private stable var stableAllowanceEntries : [(Principal, [(Principal, Nat)])] = [];
  private stable var stableItems : [MarketplaceTypes.Listing] = [];
  private stable var stableMarketListingEntries : [(Principal, MarketplaceTypes.Listing)] = [];

  system func preupgrade() {
    // Preserve admins
    stableAdmins := _Admins.toStable();

    // Preserve Essays
    let { EssayEntries; UserEssayEntries; essayPK } = _Essays.toStable();
    stableEssayEntries := EssayEntries;
    stableUserEssayEntries := UserEssayEntries;
    stableEssayPK := essayPK;

    // Preserve Drafts
    let { draftEntries } = _Drafts.toStable();
    stableDraftsEntries := draftEntries;

    // Preserve Annotations
    let { AnnotationEntries } = _Annotations.toStable();
    stableAnnotationEntries := AnnotationEntries;

    // Preserve Dip_721
    let { ledger } = _Brew_DIP721.toStable();
    stableLedger := ledger;

    // Preserve Dip_20
    let { balanceEntries; allowanceEntries } = _Brew_DIP20.toStable();
    stableBalanceEntries := balanceEntries;
    stableAllowanceEntries := allowanceEntries;

    // Preserve Users
    let { ProfileEntries } = _Users.toStable();
    stableProfileEntries := ProfileEntries;

    // Preserve MarketPlace
    let { items; MarketListingEntries } = _Market.toStable();
    stableItems := items;
    stableMarketListingEntries := MarketListingEntries;

  };

  system func postupgrade() {
    // Admin postUpgrade
    stableAdmins := [];

    // Essays postUpgrade
    _Essays.postStable(stableEssayEntries, stableUserEssayEntries, stableEssayPK);
    stableEssayEntries := [];
    stableUserEssayEntries := [];
    stableEssayPK := 0;

    // Drafts postUpgrade
    _Drafts.postStable(stableDraftsEntries);
    stableDraftsEntries := [];

    // Annotation postUpgrade
    _Annotations.postStable(stableAnnotationEntries);
    stableAnnotationEntries := [];

    // Dip20 postUpgarde
    _Brew_DIP20.postStable(stableBalanceEntries, stableAllowanceEntries);
    stableBalanceEntries := [];
    stableAllowanceEntries := [];

    // Dip721 postUpgrade
    _Brew_DIP721.postStable(stableLedger);
    stableLedger := [];

    // Users postUpgrade
    _Users.postStable(stableProfileEntries);
    stableProfileEntries := [];

    // Market PpstUpgarde
    stableItems := [];
    stableMarketListingEntries := [];
  };

  public shared ({ caller }) func whoami() : async Principal {
    caller;
  };

  let _Users = Users.User({
    ProfileEntries = stableProfileEntries;
    // caller;
  });

  public shared ({ caller }) func createProfile(userName : Text, avatar : Text) : async Result.Result<Text, Text> {
    _Users.createprofile(userName, avatar, caller);
  };

  public shared ({ caller }) func logIn() : async Bool {
    _Users.logIn(caller);
  };

  public shared ({ caller }) func getUser() : async ?UsersTypes.UserEntry {
    _Users.getUser(caller);
  };

  public shared ({ caller }) func updateOnboarding(onBoarding : Bool) : async ?() {
    _Users.updateOnboarding(onBoarding, caller);
  };

  public shared ({ caller }) func updateUserProfile(userEntry : UsersTypes.UserEntry) : async ?UsersTypes.UserEntry {
    _Users._updateUserProfile(caller, userEntry);
  };

  public shared ({ caller }) func makeUserAdmin(accountId : Principal) : async () {
    _Users.makeUserAdmin(accountId);
  };

  let _Admins = Admins.Admins({
    admins = stableAdmins;
    _Users;
  });

  public shared ({ caller }) func addAdmin(principal : Principal) : async () {
    _Admins.addAdmin(caller, principal);
  };

  public shared ({ caller }) func getAdmins() : async [Principal] {
    _Admins.getAdmins();
  };

  let _Brew_DIP20 = Dip.Brew_DIP20({
    _Admins;
    _Users;
    caller;
    ledger = stableLedger;
    balanceEntries = stableBalanceEntries;
    allowanceEntries = stableAllowanceEntries;
  });

  public shared ({ caller }) func transferTokenTo(to : Principal, value : Nat) : async DipTypes.TxReceipt {
    await _Brew_DIP20.transfer(caller, to, value);
  };

  

  public shared ({caller}) func GetBalance() : async Nat{
    _Brew_DIP20.getBalanceOf(caller);
  };

  public shared ({ caller }) func removeAdmin(principal : Principal) : async () {
    _Admins.removeAdmin(caller, principal);
  };

  let _Essays = Handlers.Essays({
    caller;
    _Admins;
    _Users;
    _Brew_DIP20;
    EssayEntries = stableEssayEntries;
    UserEssayEntries = stableUserEssayEntries;
    essayPK = stableEssayPK;
    draftEntries = stableDraftsEntries;
    AnnotationEntries = stableAnnotationEntries;
  });

  public shared ({ caller }) func createEssay(title : Text, topic : [Text], essay_word_count : Nat, essayCost : Nat, text : Text, pub : Bool, description : Text) : async Result.Result<(Nat, Text), Text> {
    if (essay_word_count < 100) {
      throw Error.reject("$ Oooops! Minimum number of words should be 100. # ");
    };
    if (essayCost < _Users.getUserTokenBalance(caller) and (essayCost >= (essay_word_count / 100))) {
      _Essays.createEssay(title, topic, essay_word_count, essayCost, text, caller, description, pub);
    } else {
      throw Error.reject("$ Awwwww!! Something went wrong, please make sure have enough tokens or contact us for advice # ");
    };

  };

  public shared ({ caller }) func getAllEssays() : async [HandlersTypes.EssayEntry] {
    _Essays.GetAllEssays();
  };

  public shared ({ caller }) func GetPageEssay(page : Nat) : async [HandlersTypes.EssayEntry] {
    _Essays.GetPageEssay(page);
  };

  // public func GetAllEssays() : async [HandlersTypes.EssayEntry] {
  //   _Essays.GetAllEssays_();
  // };

  public shared ({ caller }) func updatePublicStatus(pub : Bool, id : Nat) {
    _Essays.UpdatePublicStatus(pub, id);
  };

  public shared ({ caller }) func getFilteredEssays(topics : [Text]) : async [HandlersTypes.EssayEntry] {
    _Essays.GetFilteredEssays(topics);
  };

  public func ClearReview(essayID : Nat) : (){
    _Essays.deleteReview(essayID);
  };

  public shared ({ caller }) func EssayAnnotate(id : Nat, comments : Text, quote : Text) : () {
    _Essays.EssayAnnotate(caller, id, comments, quote);
  };

  public shared ({ caller }) func getAnnotations(id : Nat) : async [HandlersTypes.AnnotationEntry] {
    _Essays.GetAnnotation(id);
  };

  public shared ({ caller }) func updateDescription(desc : Text, id : Nat) : async () {
    _Essays.UpdateDescription(desc, id);
  };

  public shared ({ caller }) func getUserEssays(userName : Text) : async ?[HandlersTypes.EssayEntry] {
    _Essays.GetUserEssays(userName);
  };

  public shared func floor(a: Nat, b : Nat) : async Nat {
    await _Essays.actualCost(a, b);
  };

  public func getessay(id : Nat) : async ?HandlersTypes.EssayEntry {
    _Essays.GetEssay(id);
  };

  public shared func deleteEssay(id : Nat) : async Result.Result<Text, Text> {
    _Essays.DeleteEssay(id, caller);
  };

  public shared ({ caller }) func AddRatingNow(essayID : Nat, reviewID : Nat, rating : Nat) : async ?() {
    await _Essays.Rate(essayID, reviewID, rating, caller);
  };

  public shared ({ caller }) func DeleteEssay(id : Nat) : async (){
    _Essays.deleteEssay(id, caller);
  };

  // @not necessary
  public func SetReviewStatus(essayID : Nat, status : Bool){
    _Essays.setReviewStatus(essayID, status);
  };
  
  public func UpdateReviewStatus(essayID : Nat, status : Bool){
    _Essays.updateReviewStatus(essayID, status);
  };

  public func GetReviewStatus(essayID : Nat) : async ?HandlersTypes.ReviewStatus{
    _Essays.getReviewStatus(essayID);
  };

  public func GetAllReviewStatus() : async [(Nat, HandlersTypes.ReviewStatus)] {
    _Essays.getAllReviewStatus();
  };

   public func Test(num : Nat, cost : Nat) : async Float {
    var num_ = Float.fromInt64(Int64.fromNat64(Nat64.fromNat(num)));
    var cost_ = Float.fromInt64(Int64.fromNat64(Nat64.fromNat(cost)));
    var answer = Float.nearest((num_/5) * cost_);
    return answer;
   };

  // public shared ({caller}) func createEssays(title : Text, topic : Text, essay_word_count : Nat, essayCost : Nat, text : Text) : async Nat {
  //   if (essay_word_count < 100){
  //     throw Error.reject(" $ Oooops! Minimum number of words should be 100. # ");
  //   };
  //   if (essayCost)
  // }

  let _Drafts = Handlers.Drafts({
    caller;
    _Admins;
    _Users;
    _Brew_DIP20;
    EssayEntries = stableEssayEntries;
    UserEssayEntries = stableUserEssayEntries;
    essayPK = stableEssayPK;
    draftEntries = stableDraftsEntries;
    AnnotationEntries = stableAnnotationEntries;
  });

  public shared ({ caller }) func draftEssay(title : Text, text : Text) : async Nat {
    _Drafts.draftEssay(title, text, caller);
  };

  public shared ({ caller }) func getMyDrafts(userName : Text) : async ?[HandlersTypes.DraftEntry] {
    _Drafts.getMyDrafts(userName);
  };

  public shared ({ caller }) func getDraft(id : Nat) : async ?HandlersTypes.DraftEntry {
    _Drafts.getDraft(id);
  };

  public shared ({ caller }) func editDraft(id : Nat, newTitle : Text, newText : Text) : () {
    _Drafts.editDraft(id, newTitle, newText);
  };

  public shared ({ caller }) func deleteDraft(id : Nat) : async () {
    _Drafts.deleteDraft(id, caller);
  };

  let _Annotations = Handlers.Annotations({
    caller;
    _Admins;
    _Users;
    _Brew_DIP20;
    EssayEntries = stableEssayEntries;
    UserEssayEntries = stableUserEssayEntries;
    essayPK = stableEssayPK;
    draftEntries = stableDraftsEntries;
    AnnotationEntries = stableAnnotationEntries;
  });

  public shared ({ caller }) func addAnnotation(id : Nat, comments : Text, quote : Text) : async () {
    _Annotations.AddAnnotation(id, caller, comments, quote);
  };

  public shared ({ caller }) func getAnnotator(id : Nat) : async ?Principal {
    _Annotations.GetAnnotator(id);
  };

  // public shared ({ caller }) func AddRating(id : Nat, rating : Nat, caller : Principal) : async ?() {
  //   var annotator = _Annotations.GetAnnotations(id);
  //   switch (annotator) {
  //     case (null) { null };
  //     case (?annotator) {
  //       var user = _Users.getUser(caller);
  //       switch (user) {
  //         case (null) { null };
  //         case (?user) {
  //           var updatedArray = Array.append(user.pastRatedFeedbacks, [rating]);
  //           var i = 0;
  //           var iterator = 0;
  //           for (j in updatedArray.vals()) {
  //             iterator := iterator + 1;
  //             i := i + j;
  //           };
  //           var annoatorUpdate = {
  //             userName = user.userName;
  //             role = user.role;
  //             token_balance = user.token_balance;
  //             avatar = user.avatar;
  //             userRating = Nat.div(i, iterator);
  //             myEssays = user.myEssays;
  //             myDrafts = user.myDrafts;
  //             createdAt = user.createdAt;
  //             reviewingEssay = user.reviewingEssay;
  //             pastRatedFeedbacks = user.pastRatedFeedbacks;
  //             onBoarding = user.onBoarding;
  //             isAdmin = user.isAdmin;
  //           };
  //           var userEssayDetails = _Essays.GetEssay(id);
  //           switch (userEssayDetails) {
  //             case (null) { null };
  //             case (?userEssayDetails) {
  //               do ? {
  //                 var cost = userEssayDetails.essayCost;
  //                 var annotatorPrincipal = _Annotations.GetAnnotator(id)!;
  //                 var _annotation = _Users.getUser(annotatorPrincipal)!;
  //                 var _annotatorUpdate = {
  //                   userName = _annotation.userName;
  //                   role = _annotation.role;
  //                   token_balance = _annotation.token_balance + cost;
  //                   avatar = _annotation.avatar;
  //                   userRating = _annotation.userRating;
  //                   myEssays = _annotation.myEssays;
  //                   myDrafts = _annotation.myDrafts;
  //                   createdAt = _annotation.createdAt;
  //                   reviewingEssay = _annotation.reviewingEssay;
  //                   pastRatedFeedbacks = _annotation.pastRatedFeedbacks;
  //                   onBoarding = _annotation.onBoarding;
  //                   isAdmin = _annotation.isAdmin;
  //                 };
  //                 var replaced = _Users._updateUserProfile(annotator.user, _annotatorUpdate);
  //                 var __replaced = _Users._updateUserProfile(annotatorPrincipal, _annotatorUpdate);
  //                 var transfer = _Brew_DIP20.transfer(caller, annotatorPrincipal, cost);

  //                 var annotated = _Annotations.GetAnnotations(id);
  //                 switch (annotated) {
  //                   case (null) {
  //                     return null;
  //                   };
  //                   case (?annotated) {
  //                     var update = {
  //                       id = annotated.id;
  //                       essayID = annotated.essayID;
  //                       user = annotated.user;
  //                       comments = annotated.comments;
  //                       quote = annotated.quote;
  //                       rated = true;
  //                     };
  //                     var updated = _Annotations.UpdateAnnoatation(update, id);
  //                   };
  //                 }

  //               };
  //             };
  //           };
  //         };
  //       };
  //     };
  //   };
  // };

  // public shared ({ caller }) func addRating(id : Nat, rating : Nat, caller : Principal) : async ?() {
  //   _Annotations.AddRating(id, rating, caller);
  // };

  public shared ({ caller }) func getAnnotation(id : Nat) : async ?HandlersTypes.AnnotationEntry {
    _Annotations.GetAnnotations(id);
  };

  public shared ({ caller }) func getAnnotation_EssayID(essayId : Nat) : async [HandlersTypes.AnnotationEntry] {
    _Annotations.GetAnnotation_EssayID(essayId);
  };

  let _Brew_DIP721 = Dip.Brew_DIP721({
    _Admins;
    _Users;
    caller;
    ledger = stableLedger;
    balanceEntries = stableBalanceEntries;
    allowanceEntries = stableAllowanceEntries;
  });

  public shared query ({ caller }) func totalSupplyofNFT() : async Nat {
    _Brew_DIP721.TotalSupplyofNFT();
  };

  public shared ({ caller }) func balanceOfNFTs() : async Nat {
    _Brew_DIP721.BalanceOfNFTs(caller);
  };

  public shared ({ caller }) func ownerOfNFTs(tokenId : Nat) : async Result.Result<?Principal, DipTypes.NftError> {
    _Brew_DIP721.OwnerOfNFT(tokenId);
  };

  public shared ({ caller }) func nftOwnerTokenMetadata() : async Result.Result<[DipTypes.TokenMetadata], DipTypes.NftError> {
    _Brew_DIP721.NftOwnerTokenMetadata(caller);
  };

  public shared ({ caller }) func mint(title : Text, content : Text) : async Nat {
    _Brew_DIP721.MintNFT(title, content, caller);
  };

  public shared ({ caller }) func transferNFTto(to : Principal, tokenId : Nat) : async Result.Result<Nat, DipTypes.NftError> {
    _Brew_DIP721.TransferNFTto(to, caller, tokenId);
  };

  let _Market = Marketplace.Market({ 
    _Admins;
    _Users;
    _Brew_DIP721;
    _Brew_DIP20;
    items = stableItems;
    MarketListingEntries = stableMarketListingEntries;
  });

  public shared ({ caller }) func TotalListedNFT() : async Nat {
    _Market.mp_totalListed();
  };

  public shared ({ caller }) func ViewSellerListedNFTs() : async Result.Result<[MarketplaceTypes.Listing], Text> {
    _Market.mp_viewSellerListedNFTs(caller);
  };

  public shared ({ caller }) func ViewListedNFTs(itemID : Nat) : async Result.Result<MarketplaceTypes.Listing, Text> {
    _Market.mp_viewListedNFT(itemID);
  };

  public shared ({ caller }) func GetListedNFTPrice(itemId : Nat) : async Result.Result<Nat64, Text> {
    _Market.mp_getListedNFTPrice(itemId);
  };

  public shared ({ caller }) func GetNFTSeller(itemId : Nat) : async Principal {
    _Market.mp_getNFTSeller(itemId);
  };

  public shared ({ caller }) func AmIlisted(tokenId : Nat) : async Bool {
    _Market.mp_amIlisted(tokenId);
  };

  public shared ({ caller }) func UnListItem(tokenId : Nat) : async Result.Result<Text, Text> {
    _Market.mp_unListItem(caller, tokenId);
  };
  public shared ({ caller }) func ViewMarket() : async [MarketplaceTypes.Listing] {
    _Market.mp_viewMarket();
  };

  public shared ({ caller }) func ListItem(tokenId : Nat, price : Nat64) : async Nat {
    _Market.mp_ListItem(caller, tokenId, price);
  };

  // public shared ({caller}) func ViewMarket() : async [MarketplaceTypes.Listing]{
  //   _Market.mp_viewMarket()
  // };

  public func proxy(url : Text) : async Types.CanisterHttpResponsePayload {

    let transform_context : Types.TransformContext = {
      function = transform;
      context = Blob.fromArray([]);
    };

    // Construct canister request
    let request : Types.CanisterHttpRequestArgs = {
      url = url;
      max_response_bytes = null;
      headers = [];
      body = null;
      method = #post;
      transform = ?transform_context;
    };
    Cycles.add(220_000_000_000);
    let ic : Types.IC = actor ("aaaaa-aa");
    let response : Types.CanisterHttpResponsePayload = await ic.http_request(request);
    response;
  };

  public query func transform(raw : Types.TransformArgs) : async Types.CanisterHttpResponsePayload {
    let transformed : Types.CanisterHttpResponsePayload = {
      status = raw.response.status;
      body = raw.response.body;
      headers = [
        {
          name = "Content-Security-Policy";
          value = "default-src 'self'";
        },
        { name = "Referrer-Policy"; value = "strict-origin" },
        { name = "Permissions-Policy"; value = "geolocation=(self)" },
        {
          name = "Strict-Transport-Security";
          value = "max-age=63072000";
        },
        { name = "X-Frame-Options"; value = "DENY" },
        { name = "X-Content-Type-Options"; value = "nosniff" },
      ];
    };
    transformed;
  };
};

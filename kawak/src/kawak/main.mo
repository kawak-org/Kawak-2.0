import Users "Users";
import UsersTypes "Users/types";
import Handlers "Handlers";
import HandlersTypes "Handlers/types";
import Admins "Admins";
import AdminsTypes "Admins/types";
import Dip "Dip";
import DipTypes "Dip/types";

import Error "mo:base/Error";
import Result "mo:base/Result";
import Principal "mo:base/Principal";

shared (msg) actor class Kawak(
  caller : Principal
) {

  private stable var stableAdmins : [Principal] = [];
  private stable var stableEssays : [HandlersTypes.EssayEntry] = [];
  private stable var stableDrafts : [HandlersTypes.DraftEntry] = [];

  system func preupgrade() {
    // Preserve admins
    stableAdmins := _Admins.toStable();
    
    // Preserve Essays
    stableEssays := _Essays.toStable();

    // Preserve Drafts
    stableDrafts := _Drafts.toStable();
  };

    

    let _Users = Users.User({

    });

    public shared ({caller}) func createProfile(userName : Text, avatar : Text) : async Result.Result<Text, Text> {
        _Users.createprofile(userName, avatar, caller);
    };

    public shared ({caller}) func logIn() : async Bool{
      _Users.logIn(caller);
    };

    public shared ({caller}) func getUser() : async ?UsersTypes.UserEntry{
      _Users.getUser(caller);
    };

    public shared ({caller}) func updateOnboarding(onBoarding : Bool) : async ?() {
      _Users.updateOnboarding(onBoarding, caller);
    };

    public shared ({caller}) func updateUserProfile(userEntry : UsersTypes.UserEntry) : async ?UsersTypes.UserEntry {
      _Users._updateUserProfile(caller, userEntry);
    };

    public shared ({caller}) func makeUserAdmin(accountId : Principal) : async () {
      _Users.makeUserAdmin(accountId);
    };


    let _Admins = Admins.Admins({
      admins = stableAdmins;
      _Users;
    });

    public shared ({caller}) func addAdmin(principal : Principal) : async () {
      _Admins.addAdmin(caller, principal);
    };

    public shared ({caller}) func getAdmins() : async [Principal] {
      _Admins.getAdmins();
    };

    // public shared ({caller}) func removeAdmin(principal : Principal) : async {
    //   _Admins.removeAdmin(caller, principal);
    // };

    let _Essays = Handlers.Essays({
      _Admins;
      _Users;
      essays = stableEssays;
      drafts = stableDrafts;
    });

    public shared ({caller}) func createEssay(title : Text, topic : Text, essay_word_count : Nat, essayCost : Nat, text : Text) : async Result.Result<(Nat, Text), Text> {
      _Essays.createEssay(title, topic, essay_word_count, essayCost, text, caller);
    };

    // public shared ({caller}) func createEssays(title : Text, topic : Text, essay_word_count : Nat, essayCost : Nat, text : Text) : async Nat {
    //   if (essay_word_count < 100){
    //     throw Error.reject(" $ Oooops! Minimum number of words should be 100. # ");
    //   };
    //   if (essayCost)
    // }

    let _Drafts = Handlers.Drafts({
      _Admins;
      _Users;
      drafts = stableDrafts;
      essays = stableEssays;
    });

    public shared ({caller}) func draftEssay(title : Text, text : Text) : async Nat {
      _Drafts.draftEssay(title, text, caller);
    };

    public shared ({caller}) func getMyDrafts(userName : Text) : async ?[HandlersTypes.DraftEntry] {
      _Drafts.getMyDrafts(userName);
    };

    public shared ({caller}) func editDraft(id : Nat, newTitle : Text, newText : Text) : () {
      _Drafts.editDraft(id, newTitle, newText);
    };

    public shared ({caller}) func deleteDraft(id : Nat) : async () {
        _Drafts.deleteDraft(id, caller);
    };  

    let _Brew = Dip.Brew_DIP721({
      _Admins;
      _Users;
      caller;
    });

    public shared query ({caller}) func totalSupplyofNFT() : async Nat{
      _Brew.TotalSupplyofNFT();
    };

    public shared ({caller}) func balanceOfNFTs() : async Nat {
      _Brew.BalanceOfNFTs(caller);
    };

    public shared ({caller}) func ownerOfNFTs(tokenId : Nat) : async Result.Result<?Principal, DipTypes.NftError> {
      _Brew.OwnerOfNFT(tokenId);
    };

    public shared ({caller}) func nftOwnerTokenMetadata() : async Result.Result<[DipTypes.TokenMetadata], DipTypes.NftError> {
      _Brew.NftOwnerTokenMetadata(caller);
    };

    public shared ({caller}) func mint(title : Text, content : Text) : async Nat {
      _Brew.MintNFT(title, content, caller);
    };

};
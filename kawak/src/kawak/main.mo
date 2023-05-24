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
  private stable var stableAnnotations : [HandlersTypes.AnnotationEntry] = [];

  system func preupgrade() {
    // Preserve admins
    stableAdmins := _Admins.toStable();

    // Preserve Essays
    stableEssays := _Essays.toStable();

    // Preserve Drafts
    stableDrafts := _Drafts.toStable();
  };

  public shared ({caller}) func whoami() : async Principal {
    caller;
  };

  let _Users = Users.User({

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
  });

  public shared ({caller}) func transferTokenTo(to : Principal, value : Nat) : async DipTypes.TxReceipt {
    _Brew_DIP20.transfer(caller, to, value);
  };

  // public shared ({caller}) func removeAdmin(principal : Principal) : async {
  //   _Admins.removeAdmin(caller, principal);
  // };

  let _Essays = Handlers.Essays({
    _Admins;
    _Users;
    _Brew_DIP20;
    essays = stableEssays;
    drafts = stableDrafts;
    annotations = stableAnnotations;
  });

  public shared ({ caller }) func createEssay(title : Text, topic : Text, essay_word_count : Nat, essayCost : Nat, text : Text) : async Result.Result<(Nat, Text), Text> {
    if (essay_word_count < 100) {
      throw Error.reject("$ Oooops! Minimum number of words should be 100. # ");
    };
    if (essayCost < _Users.getUserTokenBalance(caller) and (essayCost >= (essay_word_count / 100))){
      _Essays.createEssay(title, topic, essay_word_count, essayCost, text, caller);
    }
    else {
      throw Error.reject("$ Awwwww!! Something went wrong, please make sure have enough tokens or contact us for advice # ");
    };
    
  };

    public shared ({caller}) func getAllEssays() : async ([(Nat, HandlersTypes.EssayEntry)]) {
      _Essays.GetAllEssays();
    };

    public shared ({caller}) func getFilteredEssays(topics : [Text]) : async [HandlersTypes.EssayEntry] {
      _Essays.GetFilteredEssays(topics);
    };

    public shared ({caller}) func getUserEssays(userName : Text) : async ?[HandlersTypes.EssayEntry] {
      _Essays.GetUserEssays(userName);
    };

    public func getessay(id : Nat) : async ?HandlersTypes.EssayEntry {
      _Essays.GetEssay(id);
    };

    public shared func deleteEssay(id : Nat) : async Result.Result<Text, Text> {
      _Essays.DeleteEssay(id, caller);
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
    _Brew_DIP20;
    drafts = stableDrafts;
    essays = stableEssays;
    annotations = stableAnnotations;
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
    _Admins;
    _Users;
    _Brew_DIP20;
    essays = stableEssays;
    drafts = stableDrafts;
    annotations = stableAnnotations;
  });

  public shared ({caller}) func addAnnotation(id : Nat, comments : Text, quote : Text) : async () {
    _Annotations.AddAnnotation(id, caller, comments, quote);
  };

  let _Brew_DIP721 = Dip.Brew_DIP721({
    _Admins;
    _Users;
    caller;
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

  public shared ({caller}) func transferNFTto(to : Principal, tokenId : Nat) : async Result.Result<Nat, DipTypes.NftError> {
    _Brew_DIP721.TransferNFTto(to, caller, tokenId);
  };

 

  

  

    // public shared ({caller}) func listNFT(tokenId : Nat, meta : DipTypes.TokenMetadata) 


};
import  Int "mo:base/Int";
import Time "mo:base/Time";
import Users "../Users";
 
module {
    public type State = {
        admins : [Principal]; 
        _Users : Users.User;
    };


    
}
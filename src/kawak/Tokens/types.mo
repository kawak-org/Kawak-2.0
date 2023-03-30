import Users "../Users";
import Admins "../Admins"

module {
    public type State = {
        admins : Admins.Admins;
        _Users : Users.User;
    };

    
}
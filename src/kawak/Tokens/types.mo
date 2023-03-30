import Users "../Users";

module {
    public type State = {
        admins : [Principal];
        _Users : Users.User;
    }
}
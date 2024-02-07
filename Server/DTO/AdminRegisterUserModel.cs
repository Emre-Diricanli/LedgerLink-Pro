namespace LedgerLink_Pro_Backend.DTO
{
    public class AdminRegisterUserModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public int Role { get; set; } // 1 = User, 2 = Manager, 3 = Admin
    }
}

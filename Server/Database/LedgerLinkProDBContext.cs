using LedgerLink_Pro_Backend.Models.Users;
using LedgerLinkPro.Models.Auth;
using LedgerLinkPro.Models.Users;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace LedgerLinkPro.Database
{
    public class LedgerLinkProDBContext : IdentityDbContext
    {

        public LedgerLinkProDBContext(DbContextOptions<LedgerLinkProDBContext> options) : base(options)
        {
        }

        public LedgerLinkProDBContext()
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<NeedsCreateNewPassword> NeedsCreateNewPasswords { get; set; }
        public DbSet<PreviousUsedPasswords> PreviousUsedPasswords { get; set; }
        public DbSet<UserLoginHistory> UserLoginHistories { get; set; }
        public DbSet<PasswordExpirationInfo> PasswordExpirations { get; set; }
        public DbSet<UserToBeApproved> UsersToBeApproved { get; set; }




        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}

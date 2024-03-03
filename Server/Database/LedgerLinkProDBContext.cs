using LedgerLinkPro.Server.Models.Accounts;
using LedgerLinkPro.Models.Users;
using LedgerLinkProBackend.Models.Util;
using LedgerLinkPro.Models.Accounts;
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
        public DbSet<UserExpireAccess> UserExpireAccesses { get; set; }
        public DbSet<UserProfilePictureLocations> UserProfilePictureLocations { get; set; }
        public DbSet<ReportedErrors> ReportedErrors { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<DeactivatedAccounts> DeactivatedAccounts { get; set; }




        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}

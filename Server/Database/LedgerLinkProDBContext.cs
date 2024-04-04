using LedgerLinkPro.Models.Accounts;
using LedgerLinkPro.Models.Users;
using LedgerLinkPro.Models.Util;
using LedgerLinkPro.Models.Auth;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

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
        public DbSet<AccountTransaction> AccountTransactions { get; set; }
        public DbSet<AccountLog> AccountLogs { get; set; }
        public DbSet<RejectedAccountTransaction> RejectedAccountTransactions { get; set; }
        public DbSet<UnapprovedTransaction> UnapprovedTransactions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AccountLog>()
                .Property(b => b.AccountBeforeChanges)
                .HasColumnType("jsonb")
                .HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject<Account>(v));

            modelBuilder.Entity<AccountLog>()
                .Property(b => b.AccountAfterChanges)
                .HasColumnType("jsonb")
                .HasConversion(
                    v => JsonConvert.SerializeObject(v),
                    v => JsonConvert.DeserializeObject<Account>(v));


            base.OnModelCreating(modelBuilder);
        }
    }
}

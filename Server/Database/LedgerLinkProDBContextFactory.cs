using LedgerLinkPro.Database;
using Microsoft.EntityFrameworkCore;

namespace LedgerLinkPro.Database
{
    public class LedgerLinkProDBContextFactory : IDbContextFactory<LedgerLinkProDBContext>
    {
        private readonly DbContextOptions<LedgerLinkProDBContext> _options;

        public LedgerLinkProDBContextFactory(DbContextOptions<LedgerLinkProDBContext> options)
        {
            _options = options;
        }

        public LedgerLinkProDBContext CreateDbContext()
        {
            return new LedgerLinkProDBContext(_options);
        }
    }
}

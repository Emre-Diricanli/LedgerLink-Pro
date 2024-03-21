namespace LedgerLinkPro.Services;

using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading;
using System.Threading.Tasks;
using LedgerLinkPro.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

public class TimedHostedService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private Timer _timer;

    public TimedHostedService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _timer = new Timer(_ => Task.Run(() => DoWork(stoppingToken)), null, TimeSpan.Zero, TimeSpan.FromMinutes(30));

        return Task.CompletedTask;
    }


    private async Task DoWork(object state)
    {
        using (var scope = _scopeFactory.CreateScope())
        {
            var _contextFactory = scope.ServiceProvider.GetRequiredService<LedgerLinkProDBContextFactory>();
            var _context = _contextFactory.CreateDbContext();
            var _userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();

            var _emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();


            //get all users passwords that are within 3 days of expiring
            var userIds = await _context.Users.Select(p => p.id).ToListAsync();
            List<string> usersToReset = new List<string>();
            List<string> usersToLockout = new List<string>();

            foreach(var userId in userIds)
            {
                var passwordExpiration = _context.PasswordExpirations.Where(p => p.UserId == userId).OrderByDescending(p => p.PasswordExpiration).FirstOrDefault();

                if (passwordExpiration != null)
                {
                    if (passwordExpiration.PasswordExpiration < DateTime.Now.AddDays(3))
                    {
                        usersToReset.Add(userId);
                    }
                    else if (passwordExpiration.PasswordExpiration < DateTime.Now)
                    {
                        usersToLockout.Add(userId);
                    }
                }
            }

            //send email to user to change password
            var htmlContent = "<h1>Your password is about to expire</h1><p>Please change your password to avoid being locked out of your account</p>";
            foreach(var userId in usersToReset)
            {
                try
                {
                    var identUser = await _userManager.FindByIdAsync(userId);
                    var user = await _context.Users.Where(p => p.id == userId).FirstOrDefaultAsync();
                    await _emailService.SendEmailAsync(identUser.Email, "Password Expiration", htmlContent);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    continue;
                }
            }


            //lock account if password is not changed within 3 days
            foreach(var userId in usersToLockout)
            {
                try
                {
                    var identUser = await _userManager.FindByIdAsync(userId);
                    await _userManager.SetLockoutEnabledAsync(identUser, true);
                    await _userManager.SetLockoutEndDateAsync(identUser, DateTimeOffset.MaxValue);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    continue;
                }
            }
        }
    }

    public override async Task StopAsync(CancellationToken stoppingToken)
    {
        _timer?.Change(Timeout.Infinite, 0);
        await base.StopAsync(stoppingToken);
    }

    public override void Dispose()
    {
        _timer?.Dispose();
        base.Dispose();
    }
}


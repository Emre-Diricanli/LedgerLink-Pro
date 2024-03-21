using System.Net.Mail;
using System.Net;

namespace LedgerLinkPro.Services
{

    public class EmailService : IEmailService
    {
        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential("sport2848@gmail.com", "qosk axjx ztef xmoa"),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("sport2848@gmail.com"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };
            mailMessage.To.Add(to);

            await smtpClient.SendMailAsync(mailMessage);
        }
    }


    public interface IEmailService
    {
        Task SendEmailAsync(string to, string subject, string body);
    }

}

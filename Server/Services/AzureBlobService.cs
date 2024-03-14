using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using LedgerLinkPro.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LedgerLinkPro.Services
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class AzureBlobService: ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IEmailService _emailService;
        private readonly IDbContextFactory<LedgerLinkProDBContext> _contextFactory;
        private readonly IConfiguration _configuration; // IConfiguration dependency

        public AzureBlobService(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager, IDbContextFactory<LedgerLinkProDBContext> contextFactory, IEmailService emailService, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _contextFactory = contextFactory;
            _emailService = emailService;
            _configuration = configuration; // Initialize the IConfiguration field
            _configuration=configuration;
        }

        [HttpPost("upload-user-profile-picture")]
        [Authorize]
        public async Task<IActionResult> UploadProfilePicture(IFormFile file)
        {
            var connectionString = _configuration.GetValue<string>("AzureStorageConfig:ConnectionString");

            var blobServiceClient = new BlobServiceClient(connectionString);
            var blobContainerClient = blobServiceClient.GetBlobContainerClient("user-profile-pictures");
            var blobClient = blobContainerClient.GetBlobClient(file.FileName);

            await using (var stream = file.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, true);
            }

            return Ok(new { message = "Upload successful" });
        }

        // Using Azure.Storage.Blobs;
        [HttpGet("generateSasTokenForUpload")]
        public async Task<IActionResult> GenerateSasTokenForUpload([FromQuery]string blobName)
        {
            var connectionString = _configuration.GetValue<string>("AzureStorageConfig:ConnectionString");
            var blobServiceClient = new BlobServiceClient(connectionString);
            var blobContainerClient = blobServiceClient.GetBlobContainerClient("user-profile-pictures");
            var blobClient = blobContainerClient.GetBlobClient(blobName);

            var sasBuilder = new BlobSasBuilder
            {
                BlobContainerName = blobContainerClient.Name,
                BlobName = blobClient.Name,
                Resource = "b", // b for blob
                StartsOn = DateTimeOffset.UtcNow,
                ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(30), // Short expiration for security
            };

            sasBuilder.SetPermissions(BlobSasPermissions.Write | BlobSasPermissions.Create);

            var sasToken = blobClient.GenerateSasUri(sasBuilder).Query;

            return Ok(new { sasToken = sasToken });
        }

        [HttpDelete("delete-user-profile-picture/blob-name")]
        [Authorize]
        public async Task<IActionResult> DeleteProfilePictureByBlobName(string blobName)
        {
            var connectionString = _configuration.GetValue<string>("AzureStorageConfig:ConnectionString");
            var blobServiceClient = new BlobServiceClient(connectionString);
            var blobContainerClient = blobServiceClient.GetBlobContainerClient("user-profile-pictures");
            var blobClient = blobContainerClient.GetBlobClient(blobName);

            await blobClient.DeleteIfExistsAsync();

            return Ok(new { message = "Delete successful" });
        }

        [HttpDelete("delete-user-profile-picture/url")]
        [Authorize]
        public async Task<IActionResult> DeleteProfilePictureByUrl(string blobUrl)
        {
            if (string.IsNullOrWhiteSpace(blobUrl))
            {
                return BadRequest("Blob URL must not be empty.");
            }

            try
            {
                var uri = new Uri(blobUrl);
                var blobName = Uri.UnescapeDataString(uri.AbsolutePath.Substring(uri.AbsolutePath.LastIndexOf('/') + 1));

                var connectionString = _configuration.GetValue<string>("AzureStorageConfig:ConnectionString");
                var blobServiceClient = new BlobServiceClient(connectionString);
                var blobContainerClient = blobServiceClient.GetBlobContainerClient("user-profile-pictures");
                var blobClient = blobContainerClient.GetBlobClient(blobName);

                bool exists = await blobClient.ExistsAsync();
                if (!exists)
                {
                    return NotFound("Blob does not exist.");
                }

                await blobClient.DeleteIfExistsAsync();
                return Ok(new { message = "Delete successful" });
            }
            catch (Exception ex)
            {
                // Log the exception details to your logging framework
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}

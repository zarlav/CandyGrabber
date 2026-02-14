using System.ComponentModel.DataAnnotations;

namespace CandyGrabberApi.DTOs
{
    public class CreateGameDTO
    {
        [Required]
        public int HostId { get; set; }
        [Range(120, 150)]
        public int Duration { get; set; }
    }
}

using System;

namespace ProjectSm3.Dto.Response
{
    public class FeedbackResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
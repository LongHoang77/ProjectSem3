using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectSm3.Data;
using ProjectSm3.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjectSm3.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GalleryController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GalleryController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("GetallGalleryItems")]
        public async Task<ActionResult<IEnumerable<GalleryItem>>> GetGalleryItems()
        {
            return await _context.GalleryItems.ToListAsync();
        }

        [HttpPost]
        [Route("AddGalleryItem")]
               public async Task<ActionResult<GalleryItem>> AddGalleryItem(GalleryItem item)
        {
            _context.GalleryItems.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGalleryItems), new { id = item.Id }, item);
        }

        [HttpPut]
[Route("UpdateGalleryItem/{id}")]
public async Task<IActionResult> UpdateGalleryItem(int id, GalleryItem item)
{
    if (id != item.Id)
    {
        return BadRequest();
    }

    _context.Entry(item).State = EntityState.Modified;

    try
    {
        await _context.SaveChangesAsync();
    }
    catch (DbUpdateConcurrencyException)
    {
        if (!GalleryItemExists(id))
        {
            return NotFound();
        }
        else
        {
            throw;
        }
    }

    return NoContent();
}
private bool GalleryItemExists(int id)
{
    return _context.GalleryItems.Any(e => e.Id == id);
}

        [HttpDelete]
        [Route("DeleteGalleryItem/{id}")]
        public async Task<IActionResult> DeleteGalleryItem(int id)
        {
            var galleryItem = await _context.GalleryItems.FindAsync(id);
            if (galleryItem == null)
            {
                return NotFound();
            }

            _context.GalleryItems.Remove(galleryItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
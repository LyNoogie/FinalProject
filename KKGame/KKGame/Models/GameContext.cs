using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KKGame.Models
{
    public class GameContext : DbContext
    {
        public GameContext(DbContextOptions<GameContext> options)
            : base(options)
        {
        }

        public DbSet<HighScores> HighScores { get; set; }
        public DbSet<Words> Words { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<HighScores>()
            .HasKey(c => c.HighScoreID);
            modelBuilder.Entity<Words>()
            .HasKey(c => c.WordID);
            modelBuilder.Entity<HighScores>().ToTable("HighScores");
            modelBuilder.Entity<Words>().ToTable("Words");
        }
    }
}

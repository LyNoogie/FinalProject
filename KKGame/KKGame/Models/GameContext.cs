/**
 * Author:    Kaelin Hoang
 * Partner:   Khanhly Nguyen
 * Date:      12/4/2019
 * Course:    CS 4540, University of Utah, School of Computing
 * Copyright: CS 4540 and [Your Name(s)] - This work may not be copied for use in Academic Coursework.
 *
 * I, [your name], certify that I wrote this code from scratch and did not copy it in part or whole from
 * another source.  Any references used in the completion of the assignment are cited in my README file.
 *
 * File Contents
 *
 *    Database (context) class of the Game database to manage sets of highScores and Words
 */
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

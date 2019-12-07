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
 *    Initializes the database with words for the typing game to pull from
 */
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KKGame.Models
{
    public static class DbInitializer
    {
        public static void Initialize(GameContext context)
        {
            //context.Database.EnsureCreated();
            context.Database.Migrate();
            
            if (context.Words.Any())
            {
                return; // Already seeded
            }

            var words = new Words[]
            {
                new Words{Word="apple", IsUsed=false},
                new Words{Word="dinosaur", IsUsed=false},
                new Words{Word="run", IsUsed=false},
                new Words{Word="fire", IsUsed=false},
                new Words{Word="canyon", IsUsed=false},
                new Words{Word="extinction", IsUsed=false},
                new Words{Word="mass", IsUsed=false},
                new Words{Word="quirk", IsUsed=false},
                new Words{Word="pieces", IsUsed=false},
                new Words{Word="nine", IsUsed=false},
                new Words{Word="lamp", IsUsed=false},
                new Words{Word="congratulations", IsUsed=false},
                new Words{Word="pie", IsUsed=false},
                new Words{Word="cake", IsUsed=false}
            };
            foreach(Words w in words)
            {
                context.Words.Add(w);
            }
            context.SaveChanges();
        }
    }
}

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

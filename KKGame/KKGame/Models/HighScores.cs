using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KKGame.Models
{
    public class HighScores
    {
        public int HighScoreID { get; set; }
        public string Username { get; set; }
        public int Score { get; set; }
        public DateTime Date { get; set; }
    }
}

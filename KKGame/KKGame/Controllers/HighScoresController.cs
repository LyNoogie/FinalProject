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
 *    Controller to manage the High Scores table in the Games Database
 */
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using KKGame.Models;

namespace KKGame.Controllers
{
    public class HighScoresController : Controller
    {
        private readonly GameContext _context;

        public HighScoresController(GameContext context)
        {
            _context = context;
        }

        // GET: HighScores
        public async Task<IActionResult> Index()
        {
            return View(await _context.HighScores.ToListAsync());
        }

        // GET: HighScores/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var highScores = await _context.HighScores
                .FirstOrDefaultAsync(m => m.HighScoreID == id);
            if (highScores == null)
            {
                return NotFound();
            }

            return View(highScores);
        }

        // GET: HighScores/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: HighScores/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("HighScoreID,Username,Score,Date")] HighScores highScores)
        {
            if (ModelState.IsValid)
            {
                _context.Add(highScores);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(highScores);
        }

        // GET: HighScores/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var highScores = await _context.HighScores.FindAsync(id);
            if (highScores == null)
            {
                return NotFound();
            }
            return View(highScores);
        }

        // POST: HighScores/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("HighScoreID,Username,Score,Date")] HighScores highScores)
        {
            if (id != highScores.HighScoreID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(highScores);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!HighScoresExists(highScores.HighScoreID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(highScores);
        }

        // GET: HighScores/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var highScores = await _context.HighScores
                .FirstOrDefaultAsync(m => m.HighScoreID == id);
            if (highScores == null)
            {
                return NotFound();
            }

            return View(highScores);
        }

        // POST: HighScores/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var highScores = await _context.HighScores.FindAsync(id);
            _context.HighScores.Remove(highScores);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool HighScoresExists(int id)
        {
            return _context.HighScores.Any(e => e.HighScoreID == id);
        }

        /// <summary>
        /// Creates a dictionary of all high scores and return that back to the game controller
        /// </summary>
        /// <param name="game"></param>
        /// <returns></returns>
        [HttpGet]
        public Dictionary<string, int> GetHighScores(string game)
        {
            Dictionary<string, int> resultScores = new Dictionary<string, int>();
            List<HighScores> allScores = _context.HighScores.OrderByDescending(s => s.Score).ToList();
            int limit = 5;
            foreach (HighScores score in allScores)
            {
                if (limit >= 0)
                {
                    resultScores[score.Username] = score.Score;
                }

                limit--;
            }

            return resultScores;
        }

        /// <summary>
        /// Inserts username and score with the current date into the High Scores database
        /// </summary>
        /// <param name="username"></param>
        /// <param name="score"></param>
        [HttpPost]
        public void InsertScore(string username, string score)
        {
            HighScores newScore = new HighScores();
            newScore.Username = username;
            newScore.Score = int.Parse(score);
            newScore.Date = DateTime.Now;

            _context.Add(newScore);
            _context.SaveChanges();
        }
    }
}

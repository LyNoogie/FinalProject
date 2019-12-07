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
 *    Controller to manage the Words table in the Games Database
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
    public class WordsController : Controller
    {
        private readonly GameContext _context;

        public WordsController(GameContext context)
        {
            _context = context;
        }

        // GET: Words
        public async Task<IActionResult> Index()
        {
            return View(await _context.Words.ToListAsync());
        }

        // GET: Words/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var words = await _context.Words
                .FirstOrDefaultAsync(m => m.WordID == id);
            if (words == null)
            {
                return NotFound();
            }

            return View(words);
        }

        // GET: Words/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Words/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("WordID,Word,IsUsed")] Words words)
        {
            if (ModelState.IsValid)
            {
                _context.Add(words);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(words);
        }

        // GET: Words/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var words = await _context.Words.FindAsync(id);
            if (words == null)
            {
                return NotFound();
            }
            return View(words);
        }

        // POST: Words/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("WordID,Word,IsUsed")] Words words)
        {
            if (id != words.WordID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(words);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!WordsExists(words.WordID))
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
            return View(words);
        }

        // GET: Words/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var words = await _context.Words
                .FirstOrDefaultAsync(m => m.WordID == id);
            if (words == null)
            {
                return NotFound();
            }

            return View(words);
        }

        // POST: Words/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var words = await _context.Words.FindAsync(id);
            _context.Words.Remove(words);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool WordsExists(int id)
        {
            return _context.Words.Any(e => e.WordID == id);
        }

        /// <summary>
        /// Get Word returns a random word queried from the Words table in the database
        /// </summary>
        /// <param name="meteor"></param>
        /// <returns></returns>
        [HttpGet]
        public string GetWord(string meteor)
        {
            Random r = new Random();
            List<Words> wordList = _context.Words.ToList();
            List<int> wordIds = new List<int>();
            for (int i = 0; i < wordList.Count(); i++)
            {
                wordIds.Add(wordList[i].WordID);
            }
            int max = wordIds.Max();
            int min = wordIds.Min();

            int rInt = r.Next(min, max + 1);

            var word = _context.Words.Where(m => m.WordID == rInt).Select(m => m.Word);
            return word.First();
        }
    }
}

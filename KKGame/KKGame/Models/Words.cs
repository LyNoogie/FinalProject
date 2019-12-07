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
 *    Data model for the Words table in the Games database
 */
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace KKGame.Models
{
    public class Words
    {
        public int WordID { get; set; }
        public string Word { get; set; }
        public bool IsUsed { get; set; }
    }
}

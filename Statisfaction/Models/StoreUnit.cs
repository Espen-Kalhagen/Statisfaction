using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using Microsoft.EntityFrameworkCore;
using System;

namespace Models
{
    public class StoreUnit
    {

        //Needs empty constructor to be created automagically
        public StoreUnit()
        {
        }

        public int id { get; set; } //Primary key

        [Display(Name = "Store Unit Name")]
        [Required, DataType(DataType.Text)]
        public string UnitName { get; set; }

        [Required, DataType(DataType.Text)]
        [Display(Name = "Store Unit Placement")]
        public string Placement { get; set; }

        [DataType(DataType.Text)]
        public DateTime RegistationTime { get; set; }

        public bool Confirmed {get; set;}

        public int RegistationPin {get;set;}

        [Display(Name = "Unit Owner")]
        public ApplicationUser Owner { get; set; }

        public string OwnerID{get;set;}

        public string SurveyID { get; set;}
        public string SurveyName { get; set; }
    }

}
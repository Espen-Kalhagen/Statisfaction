using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using Microsoft.EntityFrameworkCore;
using System;

namespace Models
{
    public class StoreUnitViewModel
    {

        //Needs empty constructor to be created automagically
        public StoreUnitViewModel()
        {

        }
        public StoreUnitViewModel( StoreUnit unit)
        {
            id = unit.id;
            UnitName = unit.UnitName;
            Placement = unit.Placement;
            RegistationTime = unit.RegistationTime;
            Confirmed = unit.Confirmed;
            RegistationPin = unit.RegistationPin;
            OwnerUserName = unit.Owner.UserName;
            ChainName = unit.Owner.ChainName;
            LocationName = unit.Owner.LocationName;
            OwnerID = unit.Owner.Id;
            SurveyID = unit.SurveyID;

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

        public bool Confirmed { get; set; }

        public int RegistationPin { get; set; }

        [Display(Name = "Unit Owner UserName ")]
        public string OwnerUserName { get; set; }

        [Display(Name = "Owner Chain Name")]
        public string ChainName { get; set; }

        [Display(Name = "Owner Location Name")]
        public string LocationName { get; set; }

        [Display(Name = "Unit Owner ID")]
        public string OwnerID { get; set; }

        [Display(Name = "Survey currently running on unit")]
        public string SurveyID { get; set; }


    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using Microsoft.EntityFrameworkCore;

namespace Models
{
    public class response{

        //Needs empty constructor to be created automagically
        public response(){
        }

        public int id {get; set;} //Primary key

        [ Display(Name="Content")]
        public string Content {get;set;}


    }

}
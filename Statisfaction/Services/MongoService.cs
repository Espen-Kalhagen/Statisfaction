using System;
using MongoDB.Driver;
using Models;

namespace Services
{
    public class MongoService : IMongoService
    {
        // Probably smart to store the password somewhere else
        private string DB_NAME = "statisfaction";
        private string DB_USERNAME_API = "api_client";
        private string DB_PASSWORD_API = "ENstVpPKB7PkuuKuGZRf";

        public MongoService() : base()
        {
            // NO ARG CONSTRUCTOR!
        }

        /**
         * Returns a mongoClient that is connected to the statisfaction MongoDB instance
         */
        public IMongoDatabase GetMongo()
        {   
            MongoClient Client = new MongoClient("mongodb://" + DB_USERNAME_API + ":" + DB_PASSWORD_API + "@ds056549.mlab.com:56549/" + DB_NAME);
            return Client.GetDatabase(DB_NAME);
        }
    }
}
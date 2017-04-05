using System;
using MongoDB.Driver;

namespace Services
{
    public interface IMongoService
    {

        IMongoDatabase GetMongo();
    }
}
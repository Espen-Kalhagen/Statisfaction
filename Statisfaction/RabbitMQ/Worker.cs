using System;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Threading;
using Statisfaction.Data;
using Models;
using Microsoft.EntityFrameworkCore;

namespace RabbitMQTasks
{
    class Worker
    {
        //Must use this for db to not get disposed after request finishes
        DbContextOptions<ApplicationDbContext> db;
        public Worker(DbContextOptions<ApplicationDbContext> db)
        {
            this.db = db;
        }

        public void StartRead(){
            var factory = new ConnectionFactory() { HostName = "localhost" };
            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.QueueDeclare(queue: "testqueue",
                                     durable: true,
                                     exclusive: false,
                                     autoDelete: false,
                                     arguments: null);

                channel.BasicQos(prefetchSize: 0, prefetchCount: 1, global: false);

                Console.WriteLine(" [*] Waiting for messages.");

                var consumer = new EventingBasicConsumer(channel);
                consumer.Received += (model, ea) =>
                {
                    var body = ea.Body;
                    var message = Encoding.UTF8.GetString(body);
                    Console.WriteLine(" [x] Received {0}", message);
                    using (var context = new ApplicationDbContext(db))
                    {
                        context.Reponces.Add(new Responce() { Content = message });
                        context.SaveChanges();
                    }
                    //int dots = message.Split('.').Length - 1;
                    //Thread.Sleep(dots * 1000);

                    Console.WriteLine(" [x] Done");

                    channel.BasicAck(deliveryTag: ea.DeliveryTag, multiple: false);
                };
                channel.BasicConsume(queue: "testqueue",
                                     noAck: false,
                                     consumer: consumer);

                Console.WriteLine(" Press [enter] to exit.");
                Console.ReadLine();

            }
        }
    }
}
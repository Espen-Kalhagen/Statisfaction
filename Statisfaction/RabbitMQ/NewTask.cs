using System;
using RabbitMQ.Client;
using System.Text;

namespace RabbitMQTasks
{
    class NewTask
    {
        public NewTask()
        {
            string[] args = {"A","b","C","D"};
            var factory = new ConnectionFactory() { HostName = "rabbitmq.statisfaction.tech" };
            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.QueueDeclare(queue: "testqueue",
                                     durable: true,
                                     exclusive: false,
                                     autoDelete: false,
                                     arguments: null);

                var message = GetMessage(args);
                var body = Encoding.UTF8.GetBytes(message);

                var properties = channel.CreateBasicProperties();
                properties.Persistent = true;

                channel.BasicPublish(exchange: "",
                                     routingKey: "testqueue",
                                     basicProperties: properties,
                                     body: body);
                Console.WriteLine(" [x] Sent {0}", message);
            }

        }

        private static string GetMessage(string[] args)
        {
            return ((args.Length > 0) ? string.Join(" ", args) : "Hello World!");
        }
    }
}
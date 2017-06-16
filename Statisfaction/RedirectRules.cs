using System;
using System.Net;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Net.Http.Headers;

/**
    Class that handels https redirection rules as these are a litte complicated due to not encrypting rabbitMQ messages
 */
public class RedirectRules : Microsoft.AspNetCore.Rewrite.IRule
{
    public int StatusCode { get; set; } = (int)HttpStatusCode.OK;
    public bool ExcludeLocalhost { get; set; } = true;

    
    public void ApplyRule(RewriteContext context)
    {
        var request = context.HttpContext.Request;
        var host = request.Host;
        context.Result = RuleResult.ContinueRules;

        

        if(host.Value.ToString().StartsWith("localhost")){
            Console.WriteLine("[REDIRECT RULE] Development enviroment");
        }
        //check is store unit site on https
        else if(request.Path.ToString().Contains("store-unit") && request.Headers["X-Forwarded-Proto"]=="https" ){ //https on non https site, using header cheking since this is behind a load balancer!
            request.Scheme = "http";
            StatusCode = (int)HttpStatusCode.MovedPermanently;
            context.Result = RuleResult.EndResponse;
            Console.WriteLine("[REDIRECT RULE] store unit rule added");
        }

        else if(request.Path.ToString().Contains("store-unit")){}

        //Redirect if not https
        else if(request.Headers["X-Forwarded-Proto"]!="https" ){ //not Https, using header cheking since this is behind a load balancer!
            request.Scheme = "https";
            StatusCode = (int)HttpStatusCode.MovedPermanently;
            context.Result = RuleResult.EndResponse;
            Console.WriteLine("[REDIRECT RULE] site rule added " + request.Scheme);
        }


        string newPath = request.Scheme +"://"+ host.Value + request.PathBase + request.Path + request.QueryString;
        var response = context.HttpContext.Response;
        response.StatusCode = StatusCode;
        response.Headers[HeaderNames.Location] = newPath;
    }

}
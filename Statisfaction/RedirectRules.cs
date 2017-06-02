using System;
using System.Net;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.Net.Http.Headers;

public class RedirectRules : Microsoft.AspNetCore.Rewrite.IRule
{
    public int StatusCode { get; set; } = (int)HttpStatusCode.OK;
    public bool ExcludeLocalhost { get; set; } = true;

    
    public void ApplyRule(RewriteContext context)
    {
        var request = context.HttpContext.Request;
        var host = request.Host;

        Console.WriteLine("[REDIRECT RULE] Adding rules");

        if(request.Path.ToString().Contains("store-unit") && request.Scheme.Contains("https") ){ //https on non https site
            request.Scheme = "http";
            context.Result = RuleResult.ContinueRules;
            StatusCode = (int)HttpStatusCode.MovedPermanently;
            Console.WriteLine("[REDIRECT RULE] store unit rule added");
            return;
        }

        if(!request.Path.ToString().Contains("store-unit") && !request.Scheme.Contains("https") && !string.Equals(host.Host, "localhost", StringComparison.OrdinalIgnoreCase)){ //not Https
            request.Scheme = "https";
            context.Result = RuleResult.ContinueRules;
            StatusCode = (int)HttpStatusCode.MovedPermanently;
            Console.WriteLine("[REDIRECT RULE] site rule added");
            return;
        }

        if (ExcludeLocalhost && string.Equals(host.Host, "localhost", StringComparison.OrdinalIgnoreCase))
        {
            request.Scheme = "http";
            context.Result = RuleResult.ContinueRules;
            StatusCode = (int)HttpStatusCode.MovedPermanently;
            Console.WriteLine("[REDIRECT RULE] localhost rule added");
            return;
        }

        string newPath = request.Scheme + "://www." + host.Value + request.PathBase + request.Path + request.QueryString;
        
        var response = context.HttpContext.Response;
        response.StatusCode = StatusCode;
        response.Headers[HeaderNames.Location] = newPath;
        context.Result = RuleResult.EndResponse; // Do not continue processing the request        
    }

}
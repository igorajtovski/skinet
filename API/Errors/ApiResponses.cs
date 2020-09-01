using System;

namespace API.Errors
{
    public class ApiResponses
    {
        public ApiResponses(int statusCode, string message=null)
        {
            StatusCode = statusCode;
            Message = message ?? GetDefaultMessageForStatusCode(statusCode);
        }

      

        public int StatusCode { get; set; }
        public  string Message { get; set; }

          private string GetDefaultMessageForStatusCode(int statusCode)
        {
              return statusCode switch
            {
                400=>"A bad request you have made",
                401=>"Aithorized, you are not",
                404=>"Status found, ot was not",
                500=>"Erors are the path to the dark side. Errors lead to anger. Anger leads to hate. Hate leads to career change",
                _=>null

            };
        }
    }
}
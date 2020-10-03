using System.Linq;
using API.Errors;
using Core.Interfaces;
using Infrastructure.Data;
using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Extensions
{
    public static class ApplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // definirani servisi da bidat dostapni da moze da se injectiraat bilo kade da treba niz aplikacijata
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IOrderService, OrderService>();
            //services.AddScoped<IPaymentService, PaymentService>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IBasketRepository, BasketRepository>();
            services.AddScoped(typeof(IGenericRepository<>), (typeof(GenericRepository<>)));
              services.Configure<ApiBehaviorOptions> (options => {
                options.InvalidModelStateResponseFactory = actionContext => //actionContext is where we can get model state errors
                {
                    var errors = actionContext.ModelState
                    .Where(e=>e.Value.Errors.Count>0)
                    .SelectMany(x => x.Value.Errors)
                    .Select(x => x.ErrorMessage).ToArray();

                    var errorResponse = new ApiValidationErrorResponse
                    {
                        Errors = errors
                        
                    };
                    return new BadRequestObjectResult(errorResponse);
                };
            });
            return services;

        }
    }
}
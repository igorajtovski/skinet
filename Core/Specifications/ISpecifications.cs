using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Core.Specifications
{
    public interface ISpecifications<T>
    {
                    //takes function, functions takes T, and returns bool
         Expression <Func<T, bool>> Criteria {get; }
         List<Expression<Func<T, object>>> Includes {get;}
    }
}
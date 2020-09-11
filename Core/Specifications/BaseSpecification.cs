using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace Core.Specifications
{
    public class BaseSpecification<T> : ISpecifications<T>
    {
        public BaseSpecification()
        {
        }

        public BaseSpecification(Expression<Func<T, bool>> criteria)
        {
            Criteria = criteria;
          
        }

        public Expression<Func<T, bool>> Criteria {get;}

        public List<Expression<Func<T, object>>> Includes {get; } = new List<Expression<Func<T, object>>>();

        public Expression<Func<T, object>> OrderBy {get; private set;}

        public Expression<Func<T, object>> OrderByDescending {get; private set;}

        public int Take {get; private set;}

        public int Skip {get; private set;}

        public bool IsPagingEnabled {get; private set;}

        //protected znaci deka moze da se pristapi od klasata kade e definiran metodot i od sekoja klasa sto nasleduva od ovaa klasa
        //ovoj metod sluzi da se iskoristi include expression vo ramki na repozitorium
        protected void AddInclude(Expression<Func<T,object>> includeExpression)
        {
            Includes.Add(includeExpression);
        } 
        //Expression<Func<T,object>> generic expression
        protected void AddOrderBy(Expression<Func<T,object>> OrderByExpression)
        {
            OrderBy = OrderByExpression;
        }

         protected void AddOrderByDesceding (Expression<Func<T,object>> OrderByDescExpression)
        {
            OrderByDescending = OrderByDescExpression;
        }

        protected void ApplyPagging(int skip, int take)
        {
            Skip=skip;
            Take=take;
            IsPagingEnabled=true;
        }
    }
}
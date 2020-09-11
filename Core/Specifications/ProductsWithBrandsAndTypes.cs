using System;
using System.Linq.Expressions;
using Core.Entities;

namespace Core.Specifications
{
    public class ProductsWithBrandsAndTypes : BaseSpecification<Product>
    {
        public ProductsWithBrandsAndTypes(ProductSpecParams productParams)
            : base(x=>
                (string.IsNullOrEmpty(productParams.Search) || x.Name.ToLower().Contains
                (productParams.Search))&&
                (!productParams.BrandId.HasValue || x.ProductBrandId == productParams.BrandId)&&
                (!productParams.TypeId.HasValue || x.ProductTypeId==productParams.TypeId)
            )
        {
            AddInclude(x=>x.ProductType);
            AddInclude(x=>x.ProductBrand);
            AddOrderBy(x=>x.Name);
            ApplyPagging(productParams.PageSize * (productParams.PageIndex-1),
            productParams.PageSize );

              if(!string.IsNullOrEmpty(productParams.Sort))
            {
                switch (productParams.Sort)
                {
                    case "priceAsc":
                    AddOrderBy(p=>p.Price);
                    break;

                     case "priceDesc":
                    AddOrderByDesceding(p=>p.Price);
                    break;
                    default:
                        AddOrderBy(n=>n.Name);
                        break;
                }
            }
        }

        public ProductsWithBrandsAndTypes(int id) 
            : base(x=>x.Id==id)
        {
            AddInclude(x=>x.ProductType);
            AddInclude(x=>x.ProductBrand);

          
        }
    }
}
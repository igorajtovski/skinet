using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : BaseApiController
    {

        private readonly IGenericRepository<Product> _productRepo;
        private readonly IGenericRepository<ProductBrand> _productBrandRepo;
        private readonly IGenericRepository<ProductType> _productTypeRepo;
        private readonly IMapper _mapper;
        public ProductsController(IGenericRepository<Product> productRepo, IGenericRepository<ProductBrand> productBrandRepo,
        
        IGenericRepository<ProductType> productTypeRepo, IMapper mapper )
        {
            _mapper = mapper;
            _productTypeRepo = productTypeRepo;
            _productBrandRepo = productBrandRepo;
            _productRepo = productRepo;

        }
    [Cached(600)]
    [HttpGet]
    public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts(
      [FromQuery]  ProductSpecParams productParams)
    {
        var spec = new ProductsWithBrandsAndTypes(productParams);
        var countSpec = new ProductWithFiltersForCountSpecification(productParams);
        var totalItems = await _productRepo.CountAsync(countSpec);
        var products = await _productRepo.ListAsync(spec);
        var data = _mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductToReturnDto>>(products);
        return Ok(new Pagination<ProductToReturnDto>(productParams.PageIndex,
        productParams.PageSize, totalItems, data));
    }
    [Cached(600)]
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponses),StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
    {
        var spec = new ProductsWithBrandsAndTypes(id);

        var product = await _productRepo.GetEntityWithSpec(spec);
        if (product==null) return NotFound(new ApiResponses(404));
        return _mapper.Map<Product, ProductToReturnDto>(product);
    }
    [Cached(600)]
    [HttpGet("brands")]
    public async Task<ActionResult<List<ProductBrand>>> GetProductBrands()
    {
        var productBrand = await _productBrandRepo.ListAllAsync();
        return Ok(productBrand);
    }
    [Cached(600)]
    [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductTypes()
    {
        var productType = await _productTypeRepo.ListAllAsync();
        return Ok(productType);
    }


}
}
using System;
using System.Collections;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly StoreContext _context;
        private Hashtable _repositories;
        public UnitOfWork(StoreContext context)
        {
            _context = context;
        }

        public async Task<int> Complete()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            if(_repositories == null) _repositories = new Hashtable();  //check if there is created repositories

            var type = typeof(TEntity).Name; // Proverruva TEntity sto se prosleduva kako vlezen parametar Product na primer

            if(!_repositories.ContainsKey(type))//proveruva dali vo hashtabelata vekje ima takov tip na repository
            {
                var repositoryType = typeof(GenericRepository<>);//ako nema, kreira Generic repositryType 
                var repsitoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType//generira instanca od toj repozitory sto e kreiran pogore 
                (typeof(TEntity)), _context); // i se prakja instancata vo context-ot
                _repositories.Add(type ,repsitoryInstance); //go dodava repositoriumot vo hash tabela
            }

            return (IGenericRepository<TEntity>) _repositories[type];// go vrakja repositoriumot od hash tabelata 
        }
    }
}
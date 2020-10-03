using System.Runtime.Serialization;

namespace Core.Entities.OrderAgregate
{
    public enum OrderStatus
    {
        [EnumMember(Value = "Pending")]
        Pending,
        [EnumMember(Value = "Payment Recived")]
        PaymentRecived,
        [EnumMember(Value = "Payemnt Failed")]
        PaymentFailed
        
    }
}
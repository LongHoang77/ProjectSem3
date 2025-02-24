// using Microsoft.EntityFrameworkCore;
// using ProjectSm3.Data;
// using ProjectSm3.Entity;
// using ProjectSm3.Exception;
//
// namespace ProjectSm3.Service;
//
// public class StoreService(ApplicationDbContext context)
// {
//     public async Task<List<Store>> GetStores()
//     {
//         var stores = await context.Stores.ToListAsync();
//
//         if (stores.Any()) return stores;
//
//         var initialStores = new List<Store>
//         {
//             new() { Address = "A1", Name = "Store A1", Status = "Trống" },
//             new() { Address = "A2", Name = "Store A2", Status = "Trống" },
//             new() { Address = "B1", Name = "Store B1", Status = "Trống" },
//             new() { Address = "B2", Name = "Store B2", Status = "Trống" },
//             new() { Address = "B3", Name = "Store B3", Status = "Trống" },
//             new() { Address = "C1", Name = "Store C1", Status = "Trống" },
//             new() { Address = "C2", Name = "Store C2", Status = "Trống" }
//         };
//
//         await context.Stores.AddRangeAsync(initialStores);
//         await context.SaveChangesAsync();
//
//         return initialStores;
//     }
//     public async Task<string> AddStore(Dto.Request.StoreRequest storeRequest)
//     {
//         if (string.IsNullOrWhiteSpace(storeRequest.StoreName) || string.IsNullOrWhiteSpace(storeRequest.Address))
//         {
//             throw new CustomException("Tên cửa hàng và địa chỉ cửa hàng không được để trống.");
//         }
//
//         var addressChar = char.ToUpper(storeRequest.Address.Trim()[0]);
//         if (addressChar != 'A' && addressChar != 'B' && addressChar != 'C')
//         {
//             throw new CustomException("Địa chỉ cửa hàng phải bắt đầu bằng ký tự A, B hoặc C.");
//         }
//
//         var existingStoresCount = await context.Stores
//             .CountAsync(s => s.Address.StartsWith(addressChar.ToString()));
//
//         if (existingStoresCount > 3)
//         {
//             throw new CustomException($"Đã đạt giới hạn số lượng cửa hàng cho địa chỉ bắt đầu bằng '{addressChar}'.");
//         }
//
//         var newStoreCode = $"{addressChar}{existingStoresCount + 1}";
//
//         var newStore = new Store
//         {
//             Name = storeRequest.StoreName,
//             Address = newStoreCode
//         };
//
//         context.Stores.Add(newStore);
//         await context.SaveChangesAsync();
//
//         return $"Cửa hàng đã được thêm thành công với mã: {newStoreCode}";
//     }
//     public async Task<string> DeleteStore(int storeId)
//     {
//         var store = await context.Stores.FindAsync(storeId);
//     
//         if (store == null)
//         {
//             throw new CustomException($"Không tìm thấy cửa hàng với ID: {storeId}", 404);
//         }
//
//         context.Stores.Remove(store);
//         await context.SaveChangesAsync();
//
//         return $"Cửa hàng có ID {storeId} đã được xóa thành công.";
//     }
// }
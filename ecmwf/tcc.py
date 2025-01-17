import cfgrib
import matplotlib.pyplot as plt
import xarray as xr
import cartopy.crs as ccrs
import cartopy.feature as cfeature

# 读取 GRIB 文件（假设文件名为 'era5_total_cloud_cover.grib'）
file_path = 'tcc.grib'

# 使用 cfgrib 打开 GRIB 文件并加载数据
ds = xr.open_dataset(file_path, engine='cfgrib')

# 查看数据集的内容，了解哪些变量可用
print(ds)

# 提取 Total Cloud Cover（TCC）数据
tcc = ds['tcc']  # 'tcc' 是 Total Cloud Cover 的变量名，具体取决于 GRIB 文件

# 提取第一个时间点的数据（假设你想绘制第一个时间步的数据）
tcc_data = tcc.isel(time=1)  # 选择时间为 0 的数据，通常 ERA5 每小时都有数据

# 设置地图投影
fig, ax = plt.subplots(figsize=(10, 6), dpi=150, subplot_kw={'projection': ccrs.PlateCarree()})

# 绘制 Total Cloud Cover 数据
tcc_data.plot.pcolormesh(ax=ax, transform=ccrs.PlateCarree(), cmap='Blues', add_colorbar=True)

# 添加地图特征
# ax.coastlines()
# ax.add_feature(cfeature.BORDERS, linestyle=':')

# 设置标题
ax.set_title('ERA5 Total Cloud Cover (TCC)', fontsize=16)

plt.savefig('tcc.png', dpi=600, bbox_inches='tight')

# 显示图像
plt.show()

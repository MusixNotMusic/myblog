import cfgrib
import matplotlib.pyplot as plt
import cartopy.crs as ccrs

# 读取 GRIB2 文件
ds = cfgrib.open_datasets('msl.grib2')[0]

# 提取海平面气压数据
msl = ds['msl'] / 100  # 将单位从 Pa 转换为 hPa

# 创建绘图
plt.figure(figsize=(12, 8))
ax = plt.axes(projection=ccrs.PlateCarree())
# contour = msl.plot(ax=ax, transform=ccrs.PlateCarree(), cmap='coolwarm', cbar_kwargs={'label': 'Mean Sea Level Pressure (hPa)'})
contour = msl.plot(ax=ax, transform=ccrs.PlateCarree(), cmap='coolwarm', cbar_kwargs={})
# ax.coastlines()
# ax.gridlines(draw_labels=True)

# 设置标题
plt.title('Mean Sea Level Pressure')

# 显示图像
plt.show()
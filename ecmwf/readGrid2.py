import xarray as xr
import matplotlib.pyplot as plt

# 打开 GRIB2 文件
ds = xr.open_dataset('data.grib2', engine='cfgrib')

# 打印数据集信息
print(ds)

# 获取特定变量的数据
temperature = ds['t2m']
print(temperature.values)

plt.figure(figsize=(10, 6))
temperature.plot(cmap='coolwarm', cbar_kwargs={'label': 'Temperature (K)'})
plt.title('Temperature at 2m')
plt.xlabel('Longitude')
plt.ylabel('Latitude')

plt.savefig('temperature_plot.png', dpi=300, bbox_inches='tight')


plt.show()
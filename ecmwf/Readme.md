# Ecmwf 使用文档

1. [Ecmwf](https://www.ecmwf.int/)注册

2. [https://cds.climate.copernicus.eu/](https://cds.climate.copernicus.eu/) 注册


## 环境搭建
1. 安装python3
2. 安装pygrib, 解析grib、grid2、nc文件
```bash
conda install -c conda-forge pygrib
pip install xarray cfgrib
```
3. 安装ecmwf.opendata, 用于ecmwf opendata数据下载
```bash
pip install ecmwf.opendata 

```
4. 安装cdsapi, 用于era5数据下载
```bash
pip install cdsapi
```

5. 安装绘制功能
```bash
pip install pandas matplotlib cartopy
```

from ecmwf.opendata import Client

client = Client(source="ecmwf")

client.download(
    param="lcc",
    type="cf",
    step=24,
    target="data.grib2",
)
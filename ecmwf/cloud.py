from ecmwf.opendata import Client

client = Client(source="ecmwf")

# client.download(
#     param="lcc",
#     type="cf",
#     step=24,
#     target="data.grib2",
# )
client.retrieve(
    time=0,
    type="cf",
    step=24,
    levtype="sfc",  # Surface level
    param="msl",  # Total cloud cover
    target="msl.grib2",
)
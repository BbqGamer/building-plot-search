# Backend:

All steps in this section should be run from the `backend` directory. `cd backend`

## Downloading data

_Warning_: The data file called plots.gml has to be in a directory `data`

```
mkdir data && cd data
wget https://bip.geopoz.poznan.pl/download/119/8781/dzialkiewidencyjnestannadzien19102023.zip
7z x dzialkiewidencyjnestannadzien19102023.zip
mv EGiB.GML_209424_2023_10_19_wybrane.gml plots.gml

wget https://bip.geopoz.poznan.pl/download/119/8782/budynkiewidencyjnestannadzien19102023.zip
7z x budynkiewidencyjnestannadzien19102023.zip
mv EGiB.GML_209415_2023_10_19_wybrane.gml buildings.gml
```

## Usage

To build an image:
`docker build -t building-plot-search .`

To run the app on port 8080 run:
`docker run -d --name mycontainer -v ./data:/code/data -p 8080:80 building-plot-search`

To pull image from docker hub
`docker pull bbqdocker/building_plot_search:latest`

##### Or run locally

`python3 -m venv venv`
`source venv/bin/activate`
`pip3 install -r requirements.txt`
`uvicorn app.main:app --host 0.0.0.0 --port 2137 --reload`
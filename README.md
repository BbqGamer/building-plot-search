# building-plot-search

## Downloading data
*Warning*: The data file called plots.gml has to be in a directory `data`
```
mkdir data && cd data
wget https://bip.geopoz.poznan.pl/download/119/8782/budynkiewidencyjnestannadzien19102023.zip
7z x *.zip
mv *.zip plots.gml
```


## Usage
To build an image:
`docker build -t building-plot-search .`

To run the app on port 8080 run:
`docker run -d --name mycontainer -v ./data:/code/data -p 8080:80 building-plot-search`


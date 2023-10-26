# building-plot-search

## Usage
To build an image:
`docker build -t building-plot-search .`

To run the app on port 8080 run:
`docker run -d --name mycontainer -v ./data:/code/data -p 8080:80 building-plot-search`
*Warning*: The data file called plots.gml has to be in a directory `data`


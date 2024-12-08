# 🪦 Range tes morts - Bring out your dead 🪦

`🪦 Range tes morts` is a simple tool to help manage all the deads in a cemetery. Draw the cemetery map as a SVG, edit the SVG with Python scripts to make it usable, populate the database with Go CLI, and serve the data with a Go server. Visualize the data with a higly interactive Angular client offering you an interactive map of the cemetery with a lot of features.

![main](img/general.png)

## Table of contents

- [🪦 Range tes morts - Bring out your dead 🪦](#-range-tes-morts---bring-out-your-dead-)
  - [Table of contents](#table-of-contents)
  - [Technologies](#technologies)
  - [Installation](#installation)
    - [Docker](#docker)
    - [Manual installation](#manual-installation)
  - [Usage](#usage)
    - [Populate the database](#populate-the-database)
    - [Run the server](#run-the-server)
    - [Run the client](#run-the-client)
  - [License](#license)
  - [Changelog](#changelog)

## Installation

## Technologies

| Name    | Description                                                                      | Version |
| ------- | -------------------------------------------------------------------------------- | ------- |
| Python  | Python is used to generate and modify the SVG file representing the cemetery.    | 3.12    |
| Go      | Go is used as a CLI for the server, and serve the data to the client.            | 1.13    |
| Angular | Angular is used to visualize the cemetery data with a highly interactive client. | 19.0    |

The database is a simple SQLite database that is created and populated by the Go Server/CLI.

# The City Map

The City Map is the official adopted map of the city. It shows the location, dimension and grades of streets, parks, public places, and certain public easements. However, the City Map isn’t one comprehensive map; it’s a collection of many alteration maps for small areas of the City. This app brings all of the pieces of the City Map into one convenient place on the web.

![image](https://user-images.githubusercontent.com/409279/38562480-b1a12a7c-3ca8-11e8-91b1-2c4ee3286130.png)

## How we work

[NYC Planning Labs](https://planninglabs.nyc) takes on a single project at a time, working closely with our customers from concept to delivery in a matter of weeks.  We conduct regular maintenance between larger projects.  

Take a look at our [sprint planning board](https://waffle.io/NYCPlanning/labs-citymap) to get an idea of our current priorities for this project.

## How you can help

In the spirit of free software, everyone is encouraged to help improve this project.  Here are some ways you can contribute.

- Comment on or clarify [issues](https://github.com/NYCPlanning/labs-citymap/issues)
- Report [bugs](https://github.com/NYCPlanning/labs-citymap/issues?q=is%3Aopen+is%3Aissue+label%3Abug)
- Suggest new features
- Write or edit documentation
- Write code (no patch is too small)
  - Fix typos
  - Add comments
  - Clean up code
  - Add new features

**[Read more about contributing.](CONTRIBUTING.md)**

## Requirements

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (with NPM)
- [Ember CLI](https://ember-cli.com/)

## Local development

- Clone this repo `git clone git@github.com:NYCPlanning/labs-citymap.git`
- Navigate to the repo: `cd labs-citymap`
- Install Dependencies `yarn`
- Start the server `ember s`

## Architecture

City Map is an [Ember.js](https://www.emberjs.com/) single page application (SPA). The frontend handles routing, web mapping, layout, and user interactions, and communicates with various APIs for content and data.

Several dependencies are split up into their own repositories under /lib, including labs-layers, labs-ember-search, and cartobox-promises-utility. These are starting points for possible addons. 

### Models, Layers, and Mutability
In this mapping iteration, we use models to manage individual layer and layer-group state. A layer group is a collection of layers, with a single visibility state. If a layer group's visibility is toggled off, that state is delegated to its related layers. These models allow for developers to reference a layer model from anywhere and manipulate its state, including layers' paint, layout, and filter states. These three properties are part of the MapboxGL Style Specification. 

Here are some examples of how to correctly override state:

#### Toggle visibility
```javascript
import { copy } from '@ember/object/internals';
import { set } from '@ember/object';

// ...
  changeVisibility() {
    const visible = this.get('visible');
    const visibility = (visible ? 'visible' : 'none');
    const layout = copy(this.get('layout'));

    if (layout) {
      set(layout, 'visibility', visibility);
      this.set('layout', layout);
    }
  }
// ...
```    

#### Change visibility
```javascript
import { copy } from '@ember/object/internals';
import { set } from '@ember/object';

// ...
  changeVisibility() {
    const visible = this.get('visible');
    const visibility = (visible ? 'visible' : 'none');
    const layout = copy(this.get('layout'));

    if (layout) {
      set(layout, 'visibility', visibility);
      this.set('layout', layout);
    }
  }
// ...
```    

#### Change paint
Paint must be changed with a full replacement of the object.
```javascript
const record = $E.store.peekRecord('layer', 'citymap-amendments-fill')
record.set('paint', { 'fill-color':'pink' });
```

#### Change filtering
For now, we need to use a helper method for this because updates aren't being triggered correctly yet.

```javascript
layerModelInstance.setFilter(['all', ['>=', 'effective', 100]]);
```

#### Map Styling

To style the map in development, we use [Maputnik Dev Server](https://github.com/NYCPlanning/labs-maputnik-dev-server). Check the `README` of maputnik-dev-server for the commands necessary to style the current map.

#### Layer-Groups

{TODO: explain how Layer Groups work}

## Backend services

Carto is the primary backend resource, which provides a PostGIS database, Map Tiler, and JSON/GeoJSON data API. All of the data represented in the app starts out as a PostGIS table in Carto.

- **Carto Maps API** - Spatial data used in the map are served as vector tiles from the Carto Maps API. Vector tiles are defined by a SQL query, and may include several named internal layers. Vector Tiles are defined in config files in app/sources, and the frontend converts each of these into a call to the Maps API, which produces a vector tile template that can be added to Mapbox GL as a 'source'.
- **Carto SQL API** - The SQL API is used to retrieve record-specific data, such as tax lot details when a user navigates to a specific lot. It is also used to cross-reference a selected lot on-the-fly with various other layers to find intersections.
- **Search** - {TODO: description of this service}

## Testing and checks

- **ESLint** - We use ESLint with Airbnb's rules for JavaScript projects
  - Add an ESLint plugin to your text editor to highlight broken rules while you code
  - You can also run `eslint` at the command line with the `--fix` flag to automatically fix some errors.

- **Testing**
  - run `ember test --serve`
  - Before creating a Pull Request, make sure your branch is updated with the latest `develop` and passes all tests

## Deployment

The App is deployed to our VPS using Dokku, you need only do a `git push` of the master branch to the `dokku` remote.

- To create a new remote named `dokku`: `git remote add dokku dokku@{domain}:city-map`
- To Deploy: `git push dokku master`
- To deploy a branch other than master, alias it to master: `git push dokku {branchname}:master`

## Contact us

You can find us on Twitter at [@nycplanninglabs](https://twitter.com/nycplanninglabs), or comment on issues and we'll follow up as soon as we can. If you'd like to send an email, use [labs_dl@planning.nyc.gov](mailto:labs_dl@planning.nyc.gov)

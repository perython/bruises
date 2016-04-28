import './plugins';
import {history} from 'backbone';
import Application from './application/application';

import ModalService from './modal/service';
import SidebarService from './sidebar/service';
import HeaderService from './header/service';

import HomeRouter from './pages/home/router';
import TopArtistsRouter from './pages/top-artists/router';
import TopTracksRouter from './pages/top-tracks/router';
import SavedTracksRouter from './pages/saved-tracks/router';

let app;

app = new Application();

ModalService.setup({
  container: app.layout.overlay
});

SidebarService.setup({
  container: app.layout.sidebar
});

HeaderService.setup({
  container: app.layout.header
});

app.home = new HomeRouter({
  container: app.layout.content
});

app.topArtists = new TopArtistsRouter({
  container: app.layout.content
});

app.topTracks = new TopTracksRouter({
  container: app.layout.content
});

app.savedTracks = new SavedTracksRouter({
  container: app.layout.content
});

history.start({root: '/'});

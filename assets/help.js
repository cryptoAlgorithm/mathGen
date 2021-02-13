
const drawer = document.getElementById('drawer').MDCDrawer;
const topAppBar = document.getElementById('app-bar').MDCTopAppBar;
topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
    drawer.open = !drawer.open;
});
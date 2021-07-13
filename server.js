const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('server.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);
server.listen(3333, () => {
    console.log('JSON Server is running');
})

router.render = (req, res) => {
    for (i = 0; i < res.locals.data.length; ++i) {
        let episode = res.locals.data[i];
        episode['previousEpisode'] = " ";
        episode['nextEpisode'] = " ";
        if (i > 0) {
            episode['previousEpisode'] = '/episodes/' + res.locals.data[i - 1].id;
        }

        if (i < res.locals.data.length - 1) {
            episode['nextEpisode'] = '/episodes/' + res.locals.data[i + 1].id;
        }
    }

    res.json(
        res.locals.data
    );
}
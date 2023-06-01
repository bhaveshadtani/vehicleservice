exports.getHome = async (req, res, next) => {
    try {
        res.render('index', {
            path: '/index',
            pageTitle: 'Home'
        });
    }
    catch (error) {
        console.log(error)
    }
}
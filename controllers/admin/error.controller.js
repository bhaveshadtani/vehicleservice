exports.get404 = async (req, res, next) => {
    await res.status(404).render('admin/404')
}


module.exports = app => {
  app.post('/api/upload/:folder', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let file = req.files.file;
            let folder = './uploads/'+req.params.folder+'/';
            file.mv(folder + file.name);

            //send response
            res.send({
                url: '/'+req.params.folder+'/'+file.name
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
  });
};
  
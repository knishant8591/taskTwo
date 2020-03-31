'use strict';
let app = require('../../server/server')
module.exports = function (Categories) {

    Categories.deleteProductBasedOnCategory = function (categoryType,  cb) {
        let output = {};
        app.models.Categories.findById(categoryType, (err, categ) => {
            if(err){
                return cb(err)
            }
            output.categories = categ;
            app.models.Products.find({"where":{"categoryType": categoryType}}, (err, prod) => {
                if(err){
                    return cb(err)
                }
                output.products = prod;
                app.models.Categories.destroyById(categoryType, (err, res) => {
                    if (err) {
                        return cb(err)
                    }
                    else {
                        app.models.Products.destroyAll({ "categoryType": categoryType },  (err, resp) => {
                            if (err) {
                                return cb(err)
                            }
                            let finalResp = "Deleted following: "+ JSON.stringify(output)
                            return cb(null, finalResp)
                        })
                    }
                })
            })
        })
        
    }
    Categories.remoteMethod('deleteProductBasedOnCategory', {
        accepts: { arg: 'categoryType', type: 'string' },
        returns: { arg: 'response', type: 'object' }
    });
};

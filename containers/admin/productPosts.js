const { graphql } = require("graphql");
const schema = require("../../graphql/schema");
const { Product } = require("../../models");
const schedule = require("node-schedule");
const Schedule = require("../../helpers/schedule");

module.exports = {
  getGroups: async (req, res, next) => {
    let query = `
    query{getGroups (_filter:"{\\\"deleted\\\":false}"){
        _id
        groupName
      }}   
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        res.send({
          err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
        });
      } else {
        res.send({ err: null, data: result.data.getGroups });
      }
    });
  },

  getOptions: async (req, res, next) => {
    let query = `
    query{getOptions(_filter:"{\\\"deleted\\\":false}"){
        _id
        optionName
        optionDisplayName
        optionType
        optionDetail {
          optionDetailContent
          optionPriceDifference
        }
      }
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        res.send({
          err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
        });
      } else {
        res.send({ err: null, data: result.data.getOptions });
      }
    });
  },

  addOption: async (req, res, next) => {
    let optionDetailString = "[";
    req.body.optionDetail.forEach((p) => {
      optionDetailString += `{optionDetailContent:"${p.optionDetailContent}",optionPriceDifference:${p.optionPriceDifference}},`;
    });
    optionDetailString += "]";
    let query = `
    mutation{
      addOption(
        optionName:"${req.body.optionName}",
        optionDisplayName:"${req.body.optionDisplayName}"
        optionType:${req.body.optionType},
        optionDetail:${optionDetailString}
      )
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        console.log(result.errors);
        res.send({
          err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
        });
      } else {
        res.send({ err: null, data: result.data.addOption });
      }
    });
  },
  editOption: async (req, res, next) => {
    let optionDetailString = "[";
    req.body.optionDetail.forEach((p) => {
      optionDetailString += `{optionDetailContent:"${p.optionDetailContent}",optionPriceDifference:${p.optionPriceDifference}},`;
    });
    optionDetailString += "]";
    let query = `
    mutation{
      editOption(
        _id:"${req.body._id}",
        optionName:"${req.body.optionName}",
        optionDisplayName:"${req.body.optionDisplayName}"
        optionType:${req.body.optionType},
        optionDetail:${optionDetailString}
      )
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        console.log(result.errors);
        res.send({
          err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
        });
      } else {
        res.send({ err: null, data: result.data.editOption });
      }
    });
  },
  removeAndRestoreOption: async (req, res, next) => {
    let optionId = req.body.optionId;
    let products = await Product.find({
      options: optionId,
    });
    if (products.length > 0) {
      res.send({
        err: "Bu seçeneği ürünlede kullandığınız için silemezsiniz. Öncelikle ürünlerden kaldırınız!",
      });
    } else {
      let query = `
      mutation{removeAndRestoreOption(_id:"${optionId}")}
      `;
      graphql(schema, query).then((result) => {
        if (result.errors) {
          console.log(result.errors);
          res.send({
            err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
          });
        } else {
          res.send({ err: null, data: result.data.removeAndRestoreOption });
        }
      });
    }
  },
  addGroup: async (req, res, next) => {
    let query = `
    mutation{
      addGroup(groupName:"${req.body.groupName}",order:${req.body.order})
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        console.log(result.errors);
        res.send({
          err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
        });
      } else {
        res.send({ err: null, data: result.data.addGroup });
      }
    });
  },
  editGroup: async (req, res, next) => {
    console.log(req.body.order);
    let query = `
    mutation{
      editGroup(_id:"${req.body.id}",groupName:"${req.body.groupName}",order:${req.body.order})
    } 
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        console.log(result.errors);
        res.send({
          err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
        });
      } else {
        req.flash("success", "Grup başarıyla güncellendi.");
        res.send({ err: null });
      }
    });
  },
  removeAndRestoreGroup: async (req, res, next) => {
    let query = `
    mutation{
      removeAndRestoreGroup(_id:"${req.body.id}")
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        console.log(result.errors);
        res.send({
          err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
        });
      } else {
        req.flash("success", result.data.removeAndRestoreGroup);
        res.send({ err: null });
      }
    });
  },

  addProduct: async (req, res, next) => {
    let query = `
    mutation{
      addProduct(
        productName: "${req.body.productName}",
        productDescription:"${req.body.productDescription}"
        price: ${req.body.price}
        order: ${req.body.order}
        groupId: "${req.body.groupId}"
        options: ${JSON.stringify(req.body.options)}
        )
    }
    `;
    graphql(schema, query).then((result) => {
      console.log(result);
      if (result.errors) {
        console.log(result.errors);
        res.send({
          err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
        });
      } else {
        req.flash("success", result.data.addProduct);
        res.send({ err: null });
      }
    });
  },
  editProduct: async (req, res, next) => {
    let query = `
    mutation{
      editProduct(
        _id:"${req.body._id}",
        productName: "${req.body.productName}",
        productDescription:"${req.body.productDescription}"
        price: ${req.body.price}
        order: ${req.body.order}
        groupId: "${req.body.groupId}"
        options: ${JSON.stringify(req.body.options)}
        )
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        console.log(result.errors);
        res.send({
          err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
        });
      } else {
        req.flash("success", result.data.editProduct);
        res.send({ err: null });
      }
    });
  },

  removeProduct: async (req, res, next) => {
    let query = `
    mutation{
      removeProduct(_id:"${req.body.id}")
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        console.log(result.errors);
        res.send({
          err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
        });
      } else {
        req.flash("success", result.data.removeProduct);
        res.send({ err: null });
      }
    });
  },

  restoreProduct: async (req, res, next) => {
    let query = `
    mutation{
      restoreProduct(
        _id:"${req.body.id}",
        groupId:"${req.body.groupId}",
      )
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        console.log(result.errors);
        res.send({
          err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
        });
      } else {
        req.flash("success", result.data.restoreProduct);
        res.send({ err: null });
      }
    });
  },

  removeFullGroup: async (req, res, next) => {
    let query = `
    mutation{
      removeFullGroup(_id:"${req.body.id}")
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        console.log(result.errors);
        res.send({
          err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
        });
      } else {
        req.flash("success", result.data.removeFullGroup);
        res.send({ err: null });
      }
    });
  },
  removeFullProduct: async (req, res, next) => {
    let query = `
    mutation{
      removeFullProduct(_id:"${req.body.id}")
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        console.log(result.errors);
        res.send({
          err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
        });
      } else {
        req.flash("success", result.data.removeFullProduct);
        res.send({ err: null });
      }
    });
  },
  removeFullOption: async (req, res, next) => {
    let query = `
    mutation{
      removeFullOption(_id:"${req.body.id}")
    }
    `;
    graphql(schema, query).then((result) => {
      if (result.errors) {
        console.log(result.errors);
        res.send({
          err: "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!",
        });
      } else {
        req.flash("success", result.data.removeFullOption);
        res.send({ err: null });
      }
    });
  },

  openCloseProduct: async (req, res, next) => {
    if (req.body.open == true && schedule.scheduledJobs[req.params.id]) {
      schedule.scheduledJobs[req.params.id].cancel();
    }
    await Product.findByIdAndUpdate(req.params.id, { $set: { open: req.body.open } }, (err, doc) => {
      if (err) {
        console.log(err);
        req.flash("error", "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!");
        res.send(true);
      } else {
        req.flash("success", "Ürün güncellendi");
        res.send(true);
      }
    });
  },

  closeProductDaily: async (req, res, next) => {
    await Product.findByIdAndUpdate(req.params.id, { $set: { open: false } }, (err, doc) => {
      if (err) {
        console.log(err);
        req.flash("error", "Bir hata oluştu. Sayfayı yenileyin yine hata alırsanız, lütfen hatayı bildiriniz!");
        res.redirect("/admin/products");
      } else {
        Schedule.closeProductDaily(req.params.id);
        req.flash("success", "Ürün güncellendi");
        res.redirect("/admin/products");
      }
    });
  },
};
